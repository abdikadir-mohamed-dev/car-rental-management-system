from flask import Blueprint, jsonify, request
from datetime import datetime, timezone
from app.models.payment import Payment
from app.models.booking import Booking
from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.notification import Notification
from app import db
from app.utils.auth import token_required, role_required
from flask_jwt_extended import get_jwt_identity
from app.services.mpesa import initiate_stk_push

bp = Blueprint('payments', __name__, url_prefix='/api/payments')


def create_notification(user_id, title, message):
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message
    )
    db.session.add(notification)


@bp.route('/', methods=['GET'])
@token_required
def get_payments():
    status = request.args.get('status')
    booking = request.args.get('booking')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    offset = (page - 1) * limit

    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)

    query = Payment.query

    if status:
        query = query.filter_by(status=status)

    if booking:
        query = query.filter_by(booking_id=int(booking))
    elif current_user.role == 'customer':
        query = query.filter_by(customer_id=current_user_id)

    payments = (
        query
        .order_by(Payment.created_at.desc())
        .limit(limit)
        .offset(offset)
        .all()
    )

    result = []

    for p in payments:
        client = p.to_dict()

        b = Booking.query.get(p.booking_id)

        if b:
            client['booking'] = {
                'pickupDate': (
                    b.pickup_date.isoformat()
                    if b.pickup_date else None
                ),
                'returnDate': (
                    b.dropoff_date.isoformat()
                    if b.dropoff_date else None
                ),
                'pickupLocation': b.pickup_location,
                'dropoffLocation': b.dropoff_location,
            }

        result.append(client)

    return jsonify({'payments': result}), 200


@bp.route('/<int:payment_id>', methods=['GET'])
@token_required
def get_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)

    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)

    if (
        current_user.role == 'customer'
        and payment.customer_id != current_user_id
    ):
        return jsonify({'message': 'Access denied'}), 403

    return jsonify({
        'payment': payment.to_dict()
    }), 200


@bp.route('/', methods=['POST'])
@token_required
def create_payment():
    """
    Create a pending payment and initiate an M-Pesa STK Push.

    IMPORTANT:
    This endpoint does NOT mark the payment as completed.
    The M-Pesa callback will do that after Safaricom confirms
    the transaction.
    """

    data = request.get_json() or {}

    booking_id = data.get('bookingId')
    amount = data.get('amount')
    phone_number = data.get('phoneNumber')

    if not booking_id:
        return jsonify({
            'message': 'bookingId is required'
        }), 400

    if not phone_number:
        return jsonify({
            'message': 'phoneNumber is required'
        }), 400

    booking = Booking.query.get(int(booking_id))

    if not booking:
        return jsonify({
            'message': 'Booking not found'
        }), 404

    current_user_id = int(get_jwt_identity())

    # Make sure the customer owns the booking
    if booking.user_id != current_user_id:
        return jsonify({
            'message': 'You can only pay for your own booking'
        }), 403

    # Do not allow another completed payment
    existing = Payment.query.filter_by(
        booking_id=booking.id,
        status='completed'
    ).first()

    if existing:
        return jsonify({
            'message': 'Payment already made for this booking'
        }), 400

    payment_amount = float(amount) if amount else float(
        booking.total_amount
    )

    if payment_amount <= 0:
        return jsonify({
            'message': 'Payment amount must be greater than zero'
        }), 400

    try:
        # Create payment FIRST as pending.
        payment = Payment(
            booking_id=booking.id,
            customer_id=current_user_id,
            amount=int(payment_amount),
            method='mpesa',
            status='pending',
            transaction_id=None,
            paid_at=None,
            date=datetime.now(timezone.utc).date(),
        )

        db.session.add(payment)
        db.session.flush()

        # Use the payment ID as the account reference.
        account_reference = f'BOOKING-{booking.id}'

        stk_response = initiate_stk_push(
            phone_number=phone_number,
            amount=payment_amount,
            account_reference=account_reference,
            transaction_description=f'Car rental booking #{booking.id}'
        )

        # Safaricom returns CheckoutRequestID.
        checkout_request_id = stk_response.get(
            'CheckoutRequestID'
        )

        merchant_request_id = stk_response.get(
            'MerchantRequestID'
        )

        if not checkout_request_id:
            db.session.rollback()

            return jsonify({
                'message': 'M-Pesa STK Push could not be initiated',
                'details': stk_response
            }), 502

        # Store the CheckoutRequestID so the callback
        # can identify this payment.
        payment.transaction_id = checkout_request_id

        db.session.commit()

        return jsonify({
            'message': 'Payment request sent to your phone',
            'payment': payment.to_dict(),
            'checkoutRequestId': checkout_request_id,
            'merchantRequestId': merchant_request_id,
            'customerMessage': stk_response.get(
                'CustomerMessage'
            ),
        }), 201

    except Exception as e:
        db.session.rollback()

        return jsonify({
            'message': 'Unable to initiate M-Pesa payment',
            'error': str(e)
        }), 500


@bp.route('/mpesa/callback', methods=['POST'])
def mpesa_callback():
    """
    Safaricom calls this endpoint after processing
    an M-Pesa STK Push.

    This is the ONLY place where a payment should
    become completed.
    """

    data = request.get_json(silent=True) or {}

    try:
        stk_callback = (
            data
            .get('Body', {})
            .get('stkCallback', {})
        )

        checkout_request_id = stk_callback.get(
            'CheckoutRequestID'
        )

        result_code = stk_callback.get('ResultCode')

        result_description = stk_callback.get(
            'ResultDesc',
            ''
        )

        if not checkout_request_id:
            return jsonify({
                'message': 'CheckoutRequestID missing'
            }), 400

        payment = Payment.query.filter_by(
            transaction_id=checkout_request_id
        ).first()

        if not payment:
            return jsonify({
                'message': 'Payment not found'
            }), 404

        # ResultCode 0 means successful transaction.
        if result_code == 0:

            callback_metadata = (
                stk_callback.get(
                    'CallbackMetadata',
                    {}
                )
            )

            items = callback_metadata.get(
                'Item',
                []
            )

            mpesa_receipt = None
            amount_paid = None
            phone = None
            transaction_date = None

            for item in items:
                name = item.get('Name')
                value = item.get('Value')

                if name == 'MpesaReceiptNumber':
                    mpesa_receipt = value

                elif name == 'Amount':
                    amount_paid = value

                elif name == 'PhoneNumber':
                    phone = value

                elif name == 'TransactionDate':
                    transaction_date = value

            # Make sure the amount paid matches
            # the payment amount we expected.
            if amount_paid is not None:
                if float(amount_paid) != float(payment.amount):
                    payment.status = 'failed'

                    db.session.commit()

                    return jsonify({
                        'message': 'Payment amount mismatch'
                    }), 400

            payment.status = 'completed'
            payment.mpesa_receipt_number = (
                str(mpesa_receipt)
                if mpesa_receipt
                else None
            )
            payment.paid_at = datetime.now(timezone.utc)

            booking = Booking.query.get(
                payment.booking_id
            )

            if booking:
                booking.status = 'confirmed'

                create_notification(
                    payment.customer_id,
                    'Payment Successful',
                    (
                        f'Payment of KES {payment.amount} '
                        f'was received for booking '
                        f'#{booking.id}.'
                    )
                )

                staff_users = User.query.filter_by(
                    role='staff',
                    is_active=True
                ).all()

                for staff in staff_users:
                    create_notification(
                        staff.id,
                        'New Payment',
                        (
                            f'Payment of KES {payment.amount} '
                            f'was received for booking '
                            f'#{booking.id}.'
                        )
                    )

        else:
            # Payment failed/cancelled/timeout.
            payment.status = 'failed'

            create_notification(
                payment.customer_id,
                'Payment Failed',
                (
                    f'M-Pesa payment for booking '
                    f'#{payment.booking_id} failed: '
                    f'{result_description}'
                )
            )

        db.session.commit()

        return jsonify({
            'message': 'Callback processed'
        }), 200

    except Exception:
        db.session.rollback()

        # Safaricom should receive a successful HTTP response
        # once we've handled the callback safely.
        return jsonify({
            'message': 'Callback received'
        }), 200


@bp.route('/<int:payment_id>/refund', methods=['POST'])
@role_required('admin')
def refund_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)

    if payment.status != 'completed':
        return jsonify({
            'message': 'Only completed payments can be refunded'
        }), 400

    payment.status = 'refunded'

    db.session.commit()

    return jsonify({
        'message': 'Payment refunded successfully',
        'payment': payment.to_dict()
    }), 200


@bp.route('/<int:payment_id>/receipt', methods=['GET'])
@token_required
def get_receipt(payment_id):
    payment = Payment.query.get_or_404(payment_id)

    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)

    if (
        current_user.role == 'customer'
        and payment.customer_id != current_user_id
    ):
        return jsonify({
            'message': 'Access denied'
        }), 403

    if payment.status != 'completed':
        return jsonify({
            'message': 'Receipt is only available for completed payments'
        }), 400

    booking = Booking.query.get(
        payment.booking_id
    )

    customer = (
        User.query.get(payment.customer_id)
        if payment.customer_id
        else None
    )

    vehicle = (
        Vehicle.query.get(booking.vehicle_id)
        if booking
        else None
    )

    receipt = {
        'receiptNumber': f'RCP-{payment.id:06d}',
        'transactionId': payment.transaction_id,
        'mpesaReceiptNumber': payment.mpesa_receipt_number,
        'date': (
            payment.paid_at.isoformat()
            if payment.paid_at
            else datetime.now(timezone.utc).isoformat()
        ),
        'status': payment.status,
        'method': payment.method,
        'amount': payment.amount,

        'customer': {
            'name': customer.name if customer else 'N/A',
            'email': customer.email if customer else 'N/A',
            'phone': customer.phone if customer else 'N/A',
        },

        'booking': {
            'id': booking.id if booking else None,
            'pickupDate': (
                booking.pickup_date.isoformat()
                if booking and booking.pickup_date
                else None
            ),
            'returnDate': (
                booking.dropoff_date.isoformat()
                if booking and booking.dropoff_date
                else None
            ),
            'pickupLocation': (
                booking.pickup_location
                if booking
                else None
            ),
            'vehicle': (
                f'{vehicle.make} {vehicle.model}'
                if vehicle
                else 'N/A'
            ),
        },

        'business': {
            'name': 'DriveGo Car Rental',
            'address': '123 Main Street, Nairobi, Kenya',
            'phone': '+254 700 123 456',
            'email': 'info@drivego.com',
        },
    }

    return jsonify(receipt), 200