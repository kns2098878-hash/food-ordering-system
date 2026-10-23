def test_register_success(client):
    res = client.post('/api/v1/auth/register', json={
        'name': 'New Eater',
        'email': 'neweater@test.com',
        'password': 'password123',
        'phone': '+91 9123456789'
    })
    assert res.status_code == 201
    data = res.get_json()
    assert 'token' in data
    assert data['user']['email'] == 'neweater@test.com'


def test_register_duplicate_email(client):
    res = client.post('/api/v1/auth/register', json={
        'name': 'Duplicate User',
        'email': 'customer@test.com',
        'password': 'password123'
    })
    assert res.status_code == 409
    assert 'already registered' in res.get_json()['message']


def test_register_short_password(client):
    res = client.post('/api/v1/auth/register', json={
        'name': 'Short Pass',
        'email': 'short@test.com',
        'password': '123'
    })
    assert res.status_code == 400


def test_login_success(client):
    res = client.post('/api/v1/auth/login', json={
        'email': 'customer@test.com',
        'password': 'customer123'
    })
    assert res.status_code == 200
    data = res.get_json()
    assert 'token' in data
    assert data['user']['name'] == 'Test Customer'


def test_login_invalid_credentials(client):
    res = client.post('/api/v1/auth/login', json={
        'email': 'customer@test.com',
        'password': 'wrongpassword'
    })
    assert res.status_code == 401


def test_get_current_user_profile(client, customer_headers):
    res = client.get('/api/v1/auth/me', headers=customer_headers)
    assert res.status_code == 200
    assert res.get_json()['user']['email'] == 'customer@test.com'
