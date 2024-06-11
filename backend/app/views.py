from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from .models import Utilisateur, db

import re

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
@jwt_required()
def register():
    """
    Cette route permet à un utilisateur invité de s'inscrire en tant qu'utilisateur.
    """
    current_identity = get_jwt_identity()
    if current_identity != "guest":
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not re.match(r"[^@]+@[^@]+\.[^@]+", username):
        return jsonify({'message': 'Invalid email address'}), 400


    if Utilisateur.query.filter_by(mail=username).first():
        return jsonify({'message': 'User already exists'}), 409

    hashed_password = generate_password_hash(password)
    new_user = Utilisateur(mail=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created'}), 201


@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = Utilisateur.query.filter_by(mail=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=user.id_user)

    return jsonify({'access_token': access_token}), 200

@auth.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({'message': f'Welcome user {current_user}'}), 200
