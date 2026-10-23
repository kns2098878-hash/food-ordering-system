from .auth import auth_bp
from .restaurants import restaurants_bp
from .cart import cart_bp
from .orders import orders_bp
from .reservations import reservations_bp
from .reviews import reviews_bp
from .coupons import coupons_bp
from .addresses import addresses_bp
from .admin import admin_bp
from .wallet import wallet_bp

def register_routes(app):
    """
    Register all modular routes under both /api/v1 (standard REST)
    and /api (backward compatibility with earlier frontend).
    """
    blueprints = [
        (auth_bp, '/auth'),
        (restaurants_bp, '/restaurants'),
        (cart_bp, '/cart'),
        (orders_bp, '/orders'),
        (reservations_bp, '/reservations'),
        (reviews_bp, ''),
        (coupons_bp, '/coupons'),
        (addresses_bp, '/addresses'),
        (admin_bp, '/admin'),
        (wallet_bp, ''),
    ]

    for bp, prefix in blueprints:
        # Register under /api/v1
        app.register_blueprint(bp, url_prefix=f'/api/v1{prefix}')
        # Register under /api for seamless backward compatibility
        app.register_blueprint(bp, url_prefix=f'/api{prefix}', name=f"{bp.name}_legacy")
