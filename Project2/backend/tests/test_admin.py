def test_admin_dashboard_metrics(client, admin_headers):
    res = client.get('/api/v1/admin/dashboard', headers=admin_headers)
    assert res.status_code == 200
    data = res.get_json()
    assert 'summary' in data
    assert 'total_restaurants' in data['summary']


def test_customer_forbidden_from_admin_dashboard(client, customer_headers):
    res = client.get('/api/v1/admin/dashboard', headers=customer_headers)
    assert res.status_code == 403


def test_admin_order_status_update(client, admin_headers, customer_headers):
    # Customer creates an order
    order_res = client.post('/api/v1/orders', json={
        'restaurant_id': 1,
        'items': [{'id': 2, 'quantity': 1}],
        'address': 'Test Road 50',
        'phone': '9876543210'
    }, headers=customer_headers)
    order_id = order_res.get_json()['order_id']

    # Admin updates order status to 'preparing'
    status_res = client.patch(f'/api/v1/admin/orders/{order_id}/status', json={
        'status': 'preparing',
        'notes': 'Kitchen started prep'
    }, headers=admin_headers)
    assert status_res.status_code == 200
    assert status_res.get_json()['order']['status'] == 'preparing'
