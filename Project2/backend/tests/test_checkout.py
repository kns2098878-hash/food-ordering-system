from app.models import db, MenuItem, Order, OrderItem

def test_calculate_order_totals(client):
    # Special Dum Biryani has discount_price=200.00
    # Quantity 2 = 400.00
    # Tax 5% = 20.00
    # Delivery fee = 30.00
    # Coupon TEST50: 50% up to max 100.00 discount -> 100.00
    # Total = 400 + 20 + 30 - 100 = 350.00
    res = client.post('/api/v1/orders/calculate', json={
        'restaurant_id': 1,
        'items': [{'id': 1, 'quantity': 2}],
        'coupon_code': 'TEST50'
    })
    assert res.status_code == 200
    data = res.get_json()
    assert data['subtotal'] == 400.00
    assert data['tax_amount'] == 20.00
    assert data['delivery_fee'] == 30.00
    assert data['discount_amount'] == 100.00
    assert data['total_amount'] == 350.00


def test_atomic_checkout_order_placement(client, customer_headers):
    res = client.post('/api/v1/orders', json={
        'restaurant_id': 1,
        'items': [{'id': 1, 'quantity': 2}],
        'address': 'Flat 202, Royal Enclave, Chennai',
        'phone': '+91 9876543210',
        'coupon_code': 'TEST50',
        'payment_method': 'demo_card'
    }, headers=customer_headers)

    assert res.status_code == 201
    data = res.get_json()
    assert 'order_id' in data
    assert 'order_number' in data

    order_id = data['order_id']
    detail = client.get(f'/api/v1/orders/{order_id}/detail', headers=customer_headers)
    assert detail.status_code == 200
    order_data = detail.get_json()
    assert len(order_data['items']) == 1
    assert order_data['items'][0]['item_name'] == 'Special Dum Biryani'
    assert order_data['items'][0]['unit_price'] == 200.00


def test_snapshot_preservation(client, customer_headers):
    # Place order when item price is 200
    res = client.post('/api/v1/orders', json={
        'restaurant_id': 1,
        'items': [{'id': 1, 'quantity': 1}],
        'address': 'Test Road 10',
        'phone': '9876543210'
    }, headers=customer_headers)
    order_id = res.get_json()['order_id']

    # Now simulate a restaurant owner raising the menu item price in DB
    item = MenuItem.query.get(1)
    item.price = 500.00
    item.discount_price = None
    db.session.commit()

    # Verify historical order item still preserves old unit_price of 200.00
    detail = client.get(f'/api/v1/orders/{order_id}/detail', headers=customer_headers)
    order_data = detail.get_json()
    assert order_data['items'][0]['unit_price'] == 200.00
