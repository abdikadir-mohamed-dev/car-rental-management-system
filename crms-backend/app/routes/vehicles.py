from flask import Blueprint, jsonify, request
from datetime import datetime, date
from app.models.vehicle import Vehicle

vehicles_bp = Blueprint('vehicles', __name__, url_prefix='/api/vehicles')


def _to_date(value):
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    if isinstance(value, str):
        try:
            return datetime.strptime(value, '%Y-%m-%d').date()
        except ValueError:
            return None
    return None


def compute_current_status(v, today=None):
    if today is None:
        today = date.today()
    if v.status == 'retired':
        return 'retired'
    if v.status == 'maintenance':
        return 'maintenance'
    for booking in v.bookings:
        if booking.status in ('confirmed', 'active'):
            start = _to_date(booking.pickup_date)
            end = _to_date(booking.return_date)
            if start and end and start <= today < end:
                return 'booked'
    return 'available'


def is_available_between(v, start, end):
    if v.status != 'available':
        return False
    for booking in v.bookings:
        if booking.status in ('confirmed', 'active'):
            b_start = _to_date(booking.pickup_date)
            b_end = _to_date(booking.return_date)
            if b_start and b_end and b_start < end and b_end > start:
                return False
    return True


def vehicle_to_dict(v):
    images = v.images or []
    return {
        'id': v.id,
        'make': v.make,
        'model': v.model,
        'year': v.year,
        'name': f"{v.make} {v.model}",
        'category': v.vehicle_type,
        'plate': v.registration_number,
        'daily_rate': v.daily_rental_rate,
        'seats': v.seating_capacity,
        'transmission': v.transmission,
        'fuel_type': v.fuel_type,
        'location': v.location,
        'image_url': images[0] if images else None,
        'description': v.description,
        'features': v.features or [],
        'status': v.status,
        'current_status': compute_current_status(v),
    }


@vehicles_bp.route('/', methods=['GET'])
def get_vehicles():
    q = request.args.get('q')
    category = request.args.get('category')
    location = request.args.get('location')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    start_str = request.args.get('start')
    end_str = request.args.get('end')
    sort = request.args.get('sort', 'price_asc')

    query = Vehicle.query.filter(Vehicle.status != 'retired')

    if category:
        query = query.filter_by(vehicle_type=category)

    if location:
        query = query.filter(Vehicle.location.ilike(f'%{location}%'))

    if min_price is not None:
        query = query.filter(Vehicle.daily_rental_rate >= min_price)
    if max_price is not None:
        query = query.filter(Vehicle.daily_rental_rate <= max_price)

    # Parse availability window
    start_date = None
    end_date = None
    if start_str and end_str:
        try:
            start_date = datetime.strptime(start_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_str, '%Y-%m-%d').date()
        except ValueError:
            pass

    apply_availability = bool(start_date and end_date and end_date > start_date)

    if apply_availability:
        candidates = query.all()
        vehicles = [v for v in candidates if is_available_between(v, start_date, end_date)]
    else:
        if sort == 'price_desc':
            query = query.order_by(Vehicle.daily_rental_rate.desc())
        elif sort == 'name_asc':
            query = query.order_by(Vehicle.make.asc(), Vehicle.model.asc())
        elif sort == 'year_desc':
            query = query.order_by(Vehicle.year.desc())
        else:  # price_asc default
            query = query.order_by(Vehicle.daily_rental_rate.asc())
        vehicles = query.all()

    # Post-filter by search query (case-insensitive across make/model/category)
    if q:
        q_lower = q.lower()
        vehicles = [
            v for v in vehicles
            if q_lower in v.make.lower()
            or q_lower in v.model.lower()
            or q_lower in (v.vehicle_type or '').lower()
        ]

    return jsonify({'vehicles': [vehicle_to_dict(v) for v in vehicles]})


@vehicles_bp.route('/<int:vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    if vehicle.status == 'retired':
        return jsonify({'error': 'Vehicle not found'}), 404

    result = vehicle_to_dict(vehicle)

    booked_ranges = []
    for booking in vehicle.bookings:
        if booking.status in ('confirmed', 'active'):
            booked_ranges.append({
                'start': booking.pickup_date.isoformat() if booking.pickup_date else None,
                'end': booking.return_date.isoformat() if booking.return_date else None,
                'status': booking.status,
            })
    result['booked_ranges'] = booked_ranges

    return jsonify({'vehicle': result})


@vehicles_bp.route('/locations', methods=['GET'])
def get_locations():
    rows = (
        Vehicle.query
        .filter(Vehicle.status != 'retired')
        .filter(Vehicle.location.isnot(None))
        .filter(Vehicle.location != '')
        .with_entities(Vehicle.location)
        .distinct()
        .all()
    )
    locations = sorted([row.location for row in rows if row.location])
    return jsonify({'locations': locations})
