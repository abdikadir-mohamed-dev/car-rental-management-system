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


bp = Blueprint(
    'payments',
    __name__,
    url_prefix='/api/payments'
)


# ============================================================
# NOTIFICATIONS
# ============================================================

def create_notification(user_id, title, message):

    notification = Notification(
        user_id=user_id,
        title=title,
        message=message
    )

    db.session.add(notification)


# ============================================================
# GET PAYMENTS
# ============================================================

@bp.route('/', methods=['GET'])
@token_required
def get_payments():

    status = request.args.get('status')
    booking = request.args.get('booking')

    page = int(
        request.args.get('page', 1)
    )

    limit = int(
        request.args.get('limit', 20)
    )

    offset = (page - 1) * limit

    current_user_id = int(
        get_jwt_identity()
    )

    current_user = User.query.get(
        current_user_id
    )

    query = Payment.query

    # --------------------------------------------------------
    # Filter by payment status
    # --------------------------------------------------------

    if status:

        query = query.filter_by(
            status=status
        )

    # --------------------------------------------------------
    # Filter by booking
    # --------------------------------------------------------

    if booking:

        query = query.filter_by(
            booking_id=int(booking)
        )

    # --------------------------------------------------------
    # Customers can only see their own payments
    # --------------------------------------------------------

    elif current_user.role == 'customer':

        query = query.filter_by(
            customer_id=current_user_id
        )

    # --------------------------------------------------------
    # Get payments
    # --------------------------------------------------------

    payments = (
        query
        .order_by(
            Payment.created_at.desc()
        )
        .limit(limit)
        .offset(offset)
        .all()
    )

    result = []

    for payment in payments:

        client = payment.to_dict()

        booking_record = Booking.query.get(
            payment.booking_id
        )

        if booking_record:

            client['booking'] = {

                'pickupDate': (
                    booking_record.pickup_date.isoformat()
                    if booking_record.pickup_date
                    else None
                ),

                'returnDate': (
                    booking_record.dropoff_date.isoformat()
                    if booking_record.dropoff_date
                    else None
                ),

                'pickupLocation':
                    booking_record.pickup_location,

                'dropoffLocation':
                    booking_record.dropoff_location,
            }

        result.append(client)

    return jsonify({
        'payments': result
    }), 200


# ============================================================
# GET SINGLE PAYMENT
# ============================================================

@bp.route(
    '/<int:payment_id>',
    methods=['GET']
)
@token_required
def get_payment(payment_id):

    payment = Payment.query.get_or_404(
        payment_id
    )

    current_user_id = int(
        get_jwt_identity()
    )

    current_user = User.query.get(
        current_user_id
    )

    # --------------------------------------------------------
    # Customers can only view their own payments
    # --------------------------------------------------------

    if (
        current_user.role == 'customer'
        and payment.customer_id != current_user_id
    ):

        return jsonify({
            'message': 'Access denied'
        }), 403

    return jsonify({
        'payment': payment.to_dict()
    }), 200


# ============================================================
# CREATE PAYMENT
# ============================================================

@bp.route('/', methods=['POST'])
@token_required
def create_payment():

    """
    Create a payment for a booking.

    ------------------------------------------------------------
    M-PESA
    ------------------------------------------------------------

    Creates a pending M-Pesa payment and sends
    an STK Push to the customer's phone.

    The payment becomes completed ONLY after
    Safaricom sends a successful callback.

    ------------------------------------------------------------
    CASH
    ------------------------------------------------------------

    Creates a pending cash payment.

    No M-Pesa request is sent.

    The cash payment remains pending until the
    customer physically pays the staff during
    vehicle checkout.

    Staff checkout will be responsible for
    changing the cash payment from:

        pending -> completed

    Admin only needs to see the payment status.
    """

    data = request.get_json() or {}

    booking_id = data.get(
        'bookingId'
    )

    amount = data.get(
        'amount'
    )

    phone_number = data.get(
        'phoneNumber'
    )

    method = str(
        data.get(
            'method',
            'mpesa'
        )
    ).lower().strip()

    # ========================================================
    # VALIDATE BOOKING ID
    # ========================================================

    if not booking_id:

        return jsonify({
            'message': 'bookingId is required'
        }), 400

    # ========================================================
    # FIND BOOKING
    # ========================================================

    booking = Booking.query.get(
        int(booking_id)
    )

    if not booking:

        return jsonify({
            'message': 'Booking not found'
        }), 404

    # ========================================================
    # CURRENT CUSTOMER
    # ========================================================

    current_user_id = int(
        get_jwt_identity()
    )

    # ========================================================
    # CUSTOMER OWNERSHIP CHECK
    # ========================================================

    if booking.user_id != current_user_id:

        return jsonify({
            'message': (
                'You can only pay for your own booking'
            )
        }), 403

    # ========================================================
    # VALIDATE PAYMENT METHOD
    # ========================================================

    if method not in [
        'mpesa',
        'cash'
    ]:

        return jsonify({
            'message': 'Invalid payment method'
        }), 400

    # ========================================================
    # CHECK FOR COMPLETED PAYMENT
    # ========================================================

    existing = Payment.query.filter_by(
        booking_id=booking.id,
        status='completed'
    ).first()

    if existing:

        return jsonify({
            'message': (
                'Payment already made for this booking'
            )
        }), 400

    # ========================================================
    # PAYMENT AMOUNT
    # ========================================================

    try:

        payment_amount = (
            float(amount)
            if amount
            else float(
                booking.total_amount
            )
        )

    except (
        TypeError,
        ValueError
    ):

        return jsonify({
            'message': 'Invalid payment amount'
        }), 400

    if payment_amount <= 0:

        return jsonify({
            'message': (
                'Payment amount must be greater than zero'
            )
        }), 400

    # ========================================================
    # CASH PAYMENT
    # ========================================================

    if method == 'cash':

        payment = Payment(

            booking_id=booking.id,

            customer_id=current_user_id,

            amount=int(
                payment_amount
            ),

            method='cash',

            status='pending',

            transaction_id=None,

            paid_at=None,

            date=datetime.now(
                timezone.utc
            ).date(),
        )

        db.session.add(
            payment
        )

        try:

            db.session.commit()

        except Exception as e:

            db.session.rollback()

            print(
                f'Cash payment creation failed '
                f'for booking {booking.id}: {e}'
            )

            return jsonify({
                'message': (
                    'Failed to record cash payment'
                )
            }), 500

        return jsonify({

            'message': (
                'Cash payment recorded as pending'
            ),

            'payment':
                payment.to_dict(),

        }), 201

    # ========================================================
    # M-PESA PAYMENT
    # ========================================================

    if not phone_number:

        return jsonify({
            'message': (
                'phoneNumber is required '
                'for M-Pesa payments'
            )
        }), 400

    try:

        payment = Payment(

            booking_id=booking.id,

            customer_id=current_user_id,

            amount=int(
                payment_amount
            ),

            method='mpesa',

            status='pending',

            transaction_id=None,

            paid_at=None,

            date=datetime.now(
                timezone.utc
            ).date(),
        )

        db.session.add(
            payment
        )

        db.session.flush()

        # ----------------------------------------------------
        # M-Pesa account reference
        # ----------------------------------------------------

        account_reference = (
            f'BOOKING-{booking.id}'
        )

        # ----------------------------------------------------
        # Send STK Push
        # ----------------------------------------------------

        stk_response = initiate_stk_push(

            phone_number=phone_number,

            amount=payment_amount,

            account_reference=
                account_reference,

            transaction_description=(
                f'Car rental booking '
                f'#{booking.id}'
            )
        )

        # ----------------------------------------------------
        # Safaricom response
        # ----------------------------------------------------

        checkout_request_id = (
            stk_response.get(
                'CheckoutRequestID'
            )
        )

        merchant_request_id = (
            stk_response.get(
                'MerchantRequestID'
            )
        )

        # ----------------------------------------------------
        # STK Push failed
        # ----------------------------------------------------

        if not checkout_request_id:

            db.session.rollback()

            return jsonify({

                'message': (
                    'M-Pesa STK Push '
                    'could not be initiated'
                ),

                'details':
                    stk_response

            }), 502

        # ----------------------------------------------------
        # Store CheckoutRequestID
        # ----------------------------------------------------

        payment.transaction_id = (
            checkout_request_id
        )

        db.session.commit()

        return jsonify({

            'message': (
                'Payment request sent '
                'to your phone'
            ),

            'payment':
                payment.to_dict(),

            'checkoutRequestId':
                checkout_request_id,

            'merchantRequestId':
                merchant_request_id,

            'customerMessage':
                stk_response.get(
                    'CustomerMessage'
                ),

        }), 201

    except Exception as e:

        db.session.rollback()

        print(
            f'M-Pesa payment initiation failed '
            f'for booking {booking.id}: {e}'
        )

        return jsonify({

            'message': (
                'Unable to initiate '
                'M-Pesa payment'
            ),

            'error': str(e)

        }), 500


# ============================================================
# M-PESA CALLBACK
# ============================================================

@bp.route(
    '/mpesa/callback',
    methods=['POST']
)
def mpesa_callback():

    """
    Safaricom calls this endpoint after
    processing an M-Pesa STK Push.

    This endpoint is responsible for changing
    an M-Pesa payment from pending to completed
    when Safaricom confirms a successful payment.

    Cash payments NEVER come through this endpoint.
    """

    data = request.get_json(
        silent=True
    ) or {}

    try:

        stk_callback = (
            data
            .get('Body', {})
            .get('stkCallback', {})
        )

        # ====================================================
        # CALLBACK INFORMATION
        # ====================================================

        checkout_request_id = (
            stk_callback.get(
                'CheckoutRequestID'
            )
        )

        result_code = (
            stk_callback.get(
                'ResultCode'
            )
        )

        result_description = (
            stk_callback.get(
                'ResultDesc',
                ''
            )
        )

        # ====================================================
        # VALIDATE CHECKOUT REQUEST ID
        # ====================================================

        if not checkout_request_id:

            return jsonify({
                'message': (
                    'CheckoutRequestID missing'
                )
            }), 400

        # ====================================================
        # FIND PAYMENT
        # ====================================================

        payment = Payment.query.filter_by(
            transaction_id=
                checkout_request_id
        ).first()

        if not payment:

            return jsonify({
                'message': 'Payment not found'
            }), 404

        # ====================================================
        # SUCCESSFUL M-PESA PAYMENT
        # ====================================================

        if result_code == 0:

            callback_metadata = (
                stk_callback.get(
                    'CallbackMetadata',
                    {}
                )
            )

            items = (
                callback_metadata.get(
                    'Item',
                    []
                )
            )

            mpesa_receipt = None
            amount_paid = None
            phone = None
            transaction_date = None

            # ------------------------------------------------
            # Extract callback metadata
            # ------------------------------------------------

            for item in items:

                name = item.get(
                    'Name'
                )

                value = item.get(
                    'Value'
                )

                if name == 'MpesaReceiptNumber':

                    mpesa_receipt = value

                elif name == 'Amount':

                    amount_paid = value

                elif name == 'PhoneNumber':

                    phone = value

                elif name == 'TransactionDate':

                    transaction_date = value

            # =================================================
            # PAYMENT AMOUNT VALIDATION
            # =================================================

            if amount_paid is not None:

                if (
                    float(amount_paid)
                    != float(payment.amount)
                ):

                    payment.status = 'failed'

                    db.session.commit()

                    return jsonify({
                        'message':
                            'Payment amount mismatch'
                    }), 400

            # =================================================
            # COMPLETE PAYMENT
            # =================================================

            payment.status = 'completed'

            payment.mpesa_receipt_number = (

                str(mpesa_receipt)

                if mpesa_receipt

                else None
            )

            payment.paid_at = (
                datetime.now(
                    timezone.utc
                )
            )

            # =================================================
            # UPDATE BOOKING
            # =================================================

            booking = Booking.query.get(
                payment.booking_id
            )

            if booking:

                booking.status = 'confirmed'

                # ---------------------------------------------
                # Notify customer
                # ---------------------------------------------

                create_notification(

                    payment.customer_id,

                    'Payment Successful',

                    (
                        f'Payment of KES '
                        f'{payment.amount} '
                        f'was received for booking '
                        f'#{booking.id}.'
                    )
                )

                # ---------------------------------------------
                # Notify staff
                # ---------------------------------------------

                staff_users = User.query.filter_by(
                    role='staff',
                    is_active=True
                ).all()

                for staff in staff_users:

                    create_notification(

                        staff.id,

                        'New Payment',

                        (
                            f'Payment of KES '
                            f'{payment.amount} '
                            f'was received for booking '
                            f'#{booking.id}.'
                        )
                    )

        # ====================================================
        # FAILED M-PESA PAYMENT
        # ====================================================

        else:

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

        # ====================================================
        # SAVE CALLBACK RESULT
        # ====================================================

        db.session.commit()

        return jsonify({
            'message': 'Callback processed'
        }), 200

    except Exception as e:

        db.session.rollback()

        print(
            f'M-Pesa callback processing error: {e}'
        )

        # ----------------------------------------------------
        # Always acknowledge Safaricom callback
        # ----------------------------------------------------

        return jsonify({
            'message': 'Callback received'
        }), 200


# ============================================================
# REFUND PAYMENT
# ============================================================

@bp.route(
    '/<int:payment_id>/refund',
    methods=['POST']
)
@role_required('admin')
def refund_payment(payment_id):

    payment = Payment.query.get_or_404(
        payment_id
    )

    if payment.status != 'completed':

        return jsonify({
            'message': (
                'Only completed payments '
                'can be refunded'
            )
        }), 400

    payment.status = 'refunded'

    db.session.commit()

    return jsonify({

        'message':
            'Payment refunded successfully',

        'payment':
            payment.to_dict()

    }), 200


# ============================================================
# GET RECEIPT
# ============================================================

@bp.route(
    '/<int:payment_id>/receipt',
    methods=['GET']
)
@token_required
def get_receipt(payment_id):

    payment = Payment.query.get_or_404(
        payment_id
    )

    current_user_id = int(
        get_jwt_identity()
    )

    current_user = User.query.get(
        current_user_id
    )

    # ========================================================
    # CUSTOMER ACCESS CHECK
    # ========================================================

    if (
        current_user.role == 'customer'
        and payment.customer_id != current_user_id
    ):

        return jsonify({
            'message': 'Access denied'
        }), 403

    # ========================================================
    # ONLY COMPLETED PAYMENTS HAVE RECEIPTS
    # ========================================================

    if payment.status != 'completed':

        return jsonify({
            'message': (
                'Receipt is only available '
                'for completed payments'
            )
        }), 400

    # ========================================================
    # BOOKING
    # ========================================================

    booking = Booking.query.get(
        payment.booking_id
    )

    # ========================================================
    # CUSTOMER
    # ========================================================

    customer = (

        User.query.get(
            payment.customer_id
        )

        if payment.customer_id

        else None
    )

    # ========================================================
    # VEHICLE
    # ========================================================

    vehicle = (

        Vehicle.query.get(
            booking.vehicle_id
        )

        if booking

        else None
    )

    # ========================================================
    # RECEIPT
    # ========================================================

    receipt = {

        'receiptNumber':
            f'RCP-{payment.id:06d}',

        'transactionId':
            payment.transaction_id,

        'mpesaReceiptNumber':
            payment.mpesa_receipt_number,

        'date': (

            payment.paid_at.isoformat()

            if payment.paid_at

            else datetime.now(
                timezone.utc
            ).isoformat()
        ),

        'status':
            payment.status,

        'method':
            payment.method,

        'amount':
            payment.amount,

        # ----------------------------------------------------
        # CUSTOMER
        # ----------------------------------------------------

        'customer': {

            'name':
                customer.name
                if customer
                else 'N/A',

            'email':
                customer.email
                if customer
                else 'N/A',

            'phone':
                customer.phone
                if customer
                else 'N/A',
        },

        # ----------------------------------------------------
        # BOOKING
        # ----------------------------------------------------

        'booking': {

            'id':
                booking.id
                if booking
                else None,

            'pickupDate': (

                booking.pickup_date.isoformat()

                if booking
                and booking.pickup_date

                else None
            ),

            'returnDate': (

                booking.dropoff_date.isoformat()

                if booking
                and booking.dropoff_date

                else None
            ),

            'pickupLocation': (

                booking.pickup_location

                if booking

                else None
            ),

            'vehicle': (

                f'{vehicle.make} '
                f'{vehicle.model}'

                if vehicle

                else 'N/A'
            ),
        },

        # ----------------------------------------------------
        # BUSINESS
        # ----------------------------------------------------

        'business': {

            'name':
                'DriveGo Car Rental',

            'address':
                '123 Main Street, Nairobi, Kenya',

            'phone':
                '+254 700 123 456',

            'email':
                'info@drivego.com',
        },
    }

    return jsonify(
        receipt
    ), 200