from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from .models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    CORS(app, resources={r"/auth/*": {"origins": ["*"], "supports_credentials": True}})
    db.init_app(app)
    JWTManager(app)
    Mail(app)

    from .views import auth as auth_blueprint
    app.register_blueprint(auth_blueprint, url_prefix='/auth')

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', ssl_context=('/app/app/keys/selfsigned.crt', '/app/app/keys/selfsigned.key'))
