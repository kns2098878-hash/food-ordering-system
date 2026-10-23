import random
from datetime import datetime, date, time
from ..models import db, Reservation, RestaurantTable, Restaurant, RestaurantHours, ReservationStatusHistory

def _parse_date(d):
    if isinstance(d, str):
        return date.fromisoformat(d.strip())
    return d

def _parse_time(t):
    if isinstance(t, str):
        clean_t = t.strip()
        if len(clean_t) == 5: # "19:00"
            clean_t += ":00"
        return time.fromisoformat(clean_t)
    return t

def check_table_availability(restaurant_id, res_date, res_time, guests=2):
    """
    Returns available tables for given restaurant and slot.
    """
    d_obj = _parse_date(res_date)
    t_obj = _parse_time(res_time)

    # Find all active tables with enough capacity
    tables = RestaurantTable.query.filter_by(
        restaurant_id=restaurant_id,
        is_active=True
    ).filter(RestaurantTable.capacity >= int(guests)).order_by(RestaurantTable.capacity.asc()).all()

    # Find already booked table IDs for that slot
    booked_reservations = Reservation.query.filter_by(
        restaurant_id=restaurant_id,
        reservation_date=d_obj,
        reservation_time=t_obj
    ).filter(Reservation.status.in_(['confirmed', 'pending'])).all()

    booked_table_ids = {r.table_id for r in booked_reservations if r.table_id is not None}

    available_tables = []
    for tbl in tables:
        if tbl.id not in booked_table_ids:
            available_tables.append(tbl.to_dict())

    return available_tables


def create_reservation_atomic(user_id, restaurant_id, res_date, res_time, guests, table_id=None, special_requests=''):
    """
    Transaction-safe reservation booking with conflict prevention.
    """
    restaurant = db.session.get(Restaurant, restaurant_id)
    if not restaurant or not restaurant.is_active:
        raise ValueError("Restaurant not found or inactive.")

    d_obj = _parse_date(res_date)
    t_obj = _parse_time(res_time)

    # Validate table selection
    if table_id:
        table = RestaurantTable.query.filter_by(id=table_id, restaurant_id=restaurant_id, is_active=True).first()
        if not table:
            raise ValueError("Selected table does not exist or is inactive.")
        if table.capacity < int(guests):
            raise ValueError(f"Table capacity ({table.capacity}) is too small for {guests} guests.")

        # Concurrency conflict check
        existing = Reservation.query.filter_by(
            restaurant_id=restaurant_id,
            table_id=table.id,
            reservation_date=d_obj,
            reservation_time=t_obj
        ).filter(Reservation.status.in_(['confirmed', 'pending'])).first()

        if existing:
            raise ValueError("Sorry, this table is already booked for the selected date and time.")
    else:
        # Auto-assign first available table that fits party size
        avail = check_table_availability(restaurant_id, d_obj, t_obj, guests=guests)
        if not avail:
            raise ValueError("No available tables for this time slot and party size.")
        table_id = avail[0]['id']

    code = f"RES-{datetime.utcnow().strftime('%Y%m%d')}-{random.randint(100, 999)}"

    try:
        reservation = Reservation(
            reservation_code=code,
            user_id=user_id,
            restaurant_id=restaurant_id,
            table_id=table_id,
            reservation_date=d_obj,
            reservation_time=t_obj,
            party_size=int(guests),
            status='confirmed',
            special_requests=special_requests,
            created_at=datetime.utcnow()
        )
        db.session.add(reservation)
        db.session.flush()

        log = ReservationStatusHistory(
            reservation_id=reservation.id,
            previous_status=None,
            new_status='confirmed',
            changed_by_user_id=user_id,
            notes='Reservation confirmed through online booking system'
        )
        db.session.add(log)
        db.session.commit()
        return reservation
    except Exception as e:
        db.session.rollback()
        raise e
