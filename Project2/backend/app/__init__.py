import os
from flask import Flask, jsonify
from flask_cors import CORS
from .config import Config
from .models.base import db
from .routes import register_routes

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize CORS with configured origins and headers
    CORS(
        app,
        resources={r"/api/*": {"origins": app.config.get('CORS_ORIGINS', '*')}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization", "X-User-Id"]
    )

    # Initialize SQLAlchemy database ORM
    db.init_app(app)

    # Register modular blueprints
    register_routes(app)

    # Health and root endpoints
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            'name': 'Foodie API',
            'version': '1.0.0',
            'status': 'online',
            'message': 'Foodie Advanced Food Ordering & Restaurant Reservation System API'
        }), 200

    @app.route('/health', methods=['GET'])
    def health():
        return jsonify({'status': 'healthy', 'db': 'connected'}), 200

    # Centralized Error Handlers
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad Request', 'message': str(error)}), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({'error': 'Unauthorized', 'message': 'Authentication is required.'}), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({'error': 'Forbidden', 'message': 'You do not have permission to access this resource.'}), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not Found', 'message': 'Requested resource was not found on this server.'}), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({'error': 'Internal Server Error', 'message': 'An unexpected server error occurred.'}), 500

    return app
