import pytest
from datetime import datetime, date, time
from decimal import Decimal
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.config import TestConfig
from app.models import db, User, Restaurant, MenuItem, MenuCategory, RestaurantTable, Coupon

@pytest.fixture(scope='function')
def app():
    app = create_app(TestConfig)

    with app.app_context():
        db.create_all()

        # Seed test admin & customer
        admin = User(name='Test Admin', email='admin@test.com', role='admin')
        admin.set_password('admin123')
        db.session.add(admin)

        customer = User(name='Test Customer', email='customer@test.com', role='customer', phone='+91 9999988888')
        customer.set_password('customer123')
        db.session.add(customer)

        # Seed test restaurant
        rest = Restaurant(
            name='Test Palace',
            slug='test-palace',
            cuisine_type='Multi-Cuisine',
            address='100 Test Road',
            city='Chennai',
            phone='+91 44 112233',
            rating=4.8,
            delivery_fee=Decimal('30.00'),
            is_active=True
        )
        db.session.add(rest)
        db.session.flush()

        cat = MenuCategory(restaurant_id=rest.id, name='Main Dishes', display_order=1)
        db.session.add(cat)
        db.session.flush()

        item1 = MenuItem(
            restaurant_id=rest.id,
            category_id=cat.id,
            name='Special Dum Biryani',
            price=Decimal('250.00'),
            discount_price=Decimal('200.00'),
            is_available=True
        )
        item2 = MenuItem(
            restaurant_id=rest.id,
            category_id=cat.id,
            name='Paneer Butter Masala',
            price=Decimal('150.00'),
            is_available=True
        )
        db.session.add_all([item1, item2])

        # Seed table
        tbl1 = RestaurantTable(
            restaurant_id=rest.id,
            table_number=1,
            table_name='Table 1',
            capacity=4,
            section='indoor',
            is_active=True
        )
        db.session.add(tbl1)

        # Seed coupon
        coupon = Coupon(
            code='TEST50',
            title='50% Test Promo',
            discount_type='percentage',
            discount_value=Decimal('50.00'),
            min_order_amount=Decimal('100.00'),
            max_discount_amount=Decimal('100.00'),
            valid_from=datetime(2020, 1, 1),
            valid_to=datetime(2030, 1, 1),
            usage_limit=100,
            is_active=True
        )
        db.session.add(coupon)

        db.session.commit()

        yield app

        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def customer_headers(client):
    res = client.post('/api/v1/auth/login', json={'email': 'customer@test.com', 'password': 'customer123'})
    token = res.get_json()['token']
    return {'Authorization': f'Bearer {token}'}


@pytest.fixture
def admin_headers(client):
    res = client.post('/api/v1/auth/login', json={'email': 'admin@test.com', 'password': 'admin123'})
    token = res.get_json()['token']
    return {'Authorization': f'Bearer {token}'}
