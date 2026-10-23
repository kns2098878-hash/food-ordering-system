def test_check_table_availability(client):
    res = client.get('/api/v1/reservations/availability?restaurant_id=1&date=2026-12-01&time=19:00:00&guests=2')
    assert res.status_code == 200
    data = res.get_json()
    assert data['available'] is True
    assert len(data['tables']) >= 1


def test_create_and_prevent_double_booking(client, customer_headers):
    # Book table 1 for slot
    res1 = client.post('/api/v1/reservations', json={
        'restaurant_id': 1,
        'date': '2026-12-01',
        'time': '19:00:00',
        'guests': 2,
        'table_id': 1
    }, headers=customer_headers)
    assert res1.status_code == 201

    # Attempt to book the same table 1 for the exact same slot -> Must reject!
    res2 = client.post('/api/v1/reservations', json={
        'restaurant_id': 1,
        'date': '2026-12-01',
        'time': '19:00:00',
        'guests': 2,
        'table_id': 1
    }, headers=customer_headers)
    assert res2.status_code == 400
    assert 'already booked' in res2.get_json()['message']


def test_cancel_reservation(client, customer_headers):
    res = client.post('/api/v1/reservations', json={
        'restaurant_id': 1,
        'date': '2026-12-05',
        'time': '20:00:00',
        'guests': 3,
        'table_id': 1
    }, headers=customer_headers)
    res_id = res.get_json()['reservation_id']

    cancel_res = client.post(f'/api/v1/reservations/{res_id}/cancel', headers=customer_headers)
    assert cancel_res.status_code == 200
    assert cancel_res.get_json()['reservation']['status'] == 'cancelled'
