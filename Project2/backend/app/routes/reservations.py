from flask import Blueprint, request, jsonify
from datetime import datetime
from ..models import db, Reservation, RestaurantTable, Restaurant, ReservationStatusHistory
from ..services.reservation_service import check_table_availability, create_reservation_atomic
from ..utils.security import get_current_user_from_request

reservations_bp = Blueprint('reservations', __name__)

@reservations_bp.route('/availability', methods=['GET'])
def get_availability():
    restaurant_id = request.args.get('restaurant_id')
    res_date = request.args.get('date') or request.args.get('reservation_date')
    res_time = request.args.get('time') or request.args.get('reservation_time')
    guests = request.args.get('guests') or request.args.get('party_size', 2)

    if not restaurant_id or not res_date or not res_time:
        return jsonify({'message': 'restaurant_id, date, and time parameters are required.'}), 400

    try:
        available_tables = check_table_availability(
            restaurant_id=int(restaurant_id),
            res_date=res_date,
            res_time=res_time,
            guests=int(guests)
        )
        return jsonify({
            'available': len(available_tables) > 0,
            'tables': available_tables,
            'total_available': len(available_tables)
        }), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 400


@reservations_bp.route('', methods=['POST'])
@reservations_bp.route('/', methods=['POST'])
def create_reservation():
    data = request.get_json() or {}
    user = get_current_user_from_request()

    user_id = data.get('user_id')
    if user:
        user_id = user.id
    elif not user_id:
        return jsonify({'message': 'Please login to make a reservation.'}), 401

    restaurant_id = data.get('restaurant_id')
    res_date = data.get('reservation_date') or data.get('date')
    res_time = data.get('reservation_time') or data.get('time')
    guests = data.get('guests') or data.get('party_size') or data.get('number_of_guests')
    table_id = data.get('table_id') or data.get('table_number')
    special_requests = data.get('special_requests', '')

    if not restaurant_id:
        return jsonify({'message': 'Restaurant ID is required.'}), 400
    if not res_date:
        return jsonify({'message': 'Reservation date is required.'}), 400
    if not res_time:
        return jsonify({'message': 'Reservation time is required.'}), 400
    if not guests or int(guests) <= 0:
        return jsonify({'message': 'Valid number of guests is required.'}), 400

    try:
        reservation = create_reservation_atomic(
            user_id=int(user_id),
            restaurant_id=int(restaurant_id),
            res_date=res_date,
            res_time=res_time,
            guests=int(guests),
            table_id=int(table_id) if table_id else None,
            special_requests=special_requests
        )
        return jsonify({
            'message': 'Table reserved successfully!',
            'reservation_id': reservation.id,
            'reservation_code': reservation.reservation_code,
            'reservation': reservation.to_dict()
        }), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': f'Booking failed: {str(e)}'}), 500


@reservations_bp.route('', methods=['GET'])
@reservations_bp.route('/', methods=['GET'])
@reservations_bp.route('/<int:user_id>', methods=['GET'])
def list_user_reservations(user_id=None):
    user = get_current_user_from_request()

    if user and user.role == 'admin' and user_id is None:
        reservations = Reservation.query.order_by(Reservation.reservation_date.desc(), Reservation.reservation_time.desc()).all()
    else:
        target_uid = user.id if user else user_id
        if not target_uid:
            return jsonify({'message': 'Please login to view reservations.'}), 401
        reservations = Reservation.query.filter_by(user_id=target_uid).order_by(
            Reservation.reservation_date.desc(), Reservation.reservation_time.desc()
        ).all()

    return jsonify([r.to_dict() for r in reservations]), 200


@reservations_bp.route('/<int:reservation_id>/detail', methods=['GET'])
def get_reservation_detail(reservation_id):
    res = Reservation.query.get(reservation_id)
    if not res:
        return jsonify({'message': 'Reservation not found.'}), 404

    user = get_current_user_from_request()
    if user and user.role != 'admin' and res.user_id != user.id:
        return jsonify({'message': 'Unauthorized to view this reservation.'}), 403

    return jsonify(res.to_dict()), 200


@reservations_bp.route('/<int:reservation_id>/cancel', methods=['POST'])
def cancel_reservation(reservation_id):
    res = Reservation.query.get(reservation_id)
    if not res:
        return jsonify({'message': 'Reservation not found.'}), 404

    user = get_current_user_from_request()
    if user and user.role != 'admin' and res.user_id != user.id:
        return jsonify({'message': 'Unauthorized to cancel this reservation.'}), 403

    if res.status not in ('pending', 'confirmed'):
        return jsonify({'message': f"Cannot cancel reservation in '{res.status}' status."}), 400

    old_status = res.status
    res.status = 'cancelled'

    history = ReservationStatusHistory(
        reservation_id=res.id,
        previous_status=old_status,
        new_status='cancelled',
        changed_by_user_id=user.id if user else res.user_id,
        notes='Cancelled by guest'
    )
    db.session.add(history)
    db.session.commit()

    return jsonify({'message': 'Reservation cancelled successfully.', 'reservation': res.to_dict()}), 200
