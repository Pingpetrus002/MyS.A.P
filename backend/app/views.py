# Import des modules nécessaires
import base64
from flask import Blueprint, request, jsonify, render_template, make_response
from flask_mail import Message, Mail
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from werkzeug.security import generate_password_hash, check_password_hash
from .models import Utilisateur, db, Document, Entreprise

import re 
import random  
import string 
import datetime
import hashlib

# Création d'un blueprint pour les routes d'authentification
auth = Blueprint('auth', __name__)
mail = Mail()  # Initialisation de l'extension Flask-Mail pour l'envoi de mails

ROLES_ACCESS = {
    1: ['*'],  # Admin has access to all pages
    2: ['*'],  # RRE has access to specific pages
    3: ['dashboard', 'profil', 'rapports', 'etudiants'],  # Suiveur has access to profile and their reports
    4: ['profil', 'rdv'],  # Etudiant has access to profile and concerned reports
    5: ['profil', 'rdv'],  # Tuteur has access to profile, their students, and their students' reports
}


# Fonction pour générer un mot de passe aléatoire
def generate_random_password(length=6):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for i in range(length))

# Fonction pour envoyer un email de bienvenue à un nouvel utilisateur
def send_welcome_email(username, password):
    msg = Message('Bienvenue sur MySAP !', recipients=[username])
    msg.html = render_template('welcome_email.html', username=username, password=password)
    mail.send(msg)

def document_to_dict(doc):
    return {
        #'id_doc': doc.id_doc,
        'nom': doc.nom,
        #'rapport': base64.b64encode(doc.rapport).decode('utf-8'),  # Convertir en base64 pour l'affichage
        'md5': doc.md5,
        'type': doc.type,
        'datecreation': doc.datecreation.isoformat() if doc.datecreation else None,
        'datesuppression': doc.datesuppression.isoformat() if doc.datesuppression else None,
        'id_user': doc.id_user,
        'id_user_1': doc.id_user_1
    }

# Fonction verifiant les champs du formulaire
def check_fields(data, fields):
    if not request.is_json:
        return jsonify({'message': 'Missing JSON in request'}), 400
    for field in fields:
        if field not in data:
            print('Field Manquant ')
            return jsonify({'message': f'Missing {field} in JSON request'}), 400
    else:
        return 0
    

# Fonction pour vérifier le rôle d'un utilisateur
def check_role(user, role):
    return user.id_role == role

# Route pour l'inscription d'un nouvel utilisateur
@auth.route('/register', methods=['POST'])
@jwt_required()
def register():
    current_identity = get_jwt_identity()  # Récupération de l'identité actuelle depuis le token JWT
    data = request.get_json()

    # Verification des champs du formulaire
    fields = ['username', 'firstname', 'lastname', 'date_naissance', 'role']
    if check_fields(data, fields) != 0:
        return check_fields(data, fields)

    # Récupération dfes données du formulaire
    username = data.get('username')
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    date_naissance = data.get('date_naissance')
    role = data.get('role')
    
    password = generate_random_password()  # Génération d'un mot de passe aléatoire

    # Vérification du rôle de l'utilisateur actuel 
    if not check_role(Utilisateur.query.get(current_identity), 1) and not check_role(Utilisateur.query.get(current_identity), 2):
        return jsonify({'message': 'Unauthorized'}), 403

    # Validation de l'adresse email avec une expression régulière
    if not re.match(r"[^@]+@[^@]+\.[^@]+", username):
        return jsonify({'message': 'Invalid email address'}), 400

    # Vérification de l'unicité de l'adresse email
    if Utilisateur.query.filter_by(mail=username).first():
        return jsonify({'message': 'User already exists'}), 409

    # Hachage du mot de passe avant de le stocker dans la base de données
    hashed_password = generate_password_hash(password)
    new_user = Utilisateur(mail=username, password=hashed_password, nom=lastname, prenom=firstname, date_naissance=date_naissance, id_role=role)
    db.session.add(new_user)
    db.session.commit()

    # Envoi d'un email de bienvenue à l'utilisateur avec son mot de passe
    send_welcome_email(username, password)

    return jsonify({'message': 'User created'}), 201

# Route pour la connexion d'un utilisateur
@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Verification des champs du formulaire
    fields = ['username', 'password']
    if check_fields(data, fields) != 0:
        return check_fields(data, fields)
    
    username = data.get('username')
    password = data.get('password')

    # Récupération de l'utilisateur depuis la base de données
    user = Utilisateur.query.filter_by(mail=username).first()
    # Vérification de l'existence de l'utilisateur et de la correspondance du mot de passe
    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid credentials'}), 401

    # Création d'un token JWT pour l'utilisateur authentifié
    access_token = create_access_token(identity=user.id_user)
    response = jsonify({'message': 'Login successful'})
    # Configuration du cookie d'accès avec le token JWT
    set_access_cookies(response, access_token)
    
    return response, 200

# Route pour la déconnexion d'un utilisateur
@auth.route('/logout', methods=['GET'])
@jwt_required()
def logout():
    response = jsonify({'message': 'Logout successful'})
    # Suppression du cookie JWT de l'utilisateur
    unset_jwt_cookies(response)
    return response, 200

# Route protégée qui verifie via un dictonnaire si l'utilisateur est authentifié avec la page
@auth.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    page = request.args.get('page')  # Assumes the requested page is sent as a query parameter
    
    if not page:
        return jsonify({'message': 'Page not specified'}), 400

    user_role = Utilisateur.query.get(current_user).id_role
    print(user_role)
    if user_role not in ROLES_ACCESS:
        return jsonify({'message': 'Role not recognized'}), 403

    if '*' in ROLES_ACCESS[user_role] or page in ROLES_ACCESS[user_role]:
        return jsonify({'message': f'Welcome {current_user}, you have access to {page}'}), 200
    else:
        return jsonify({'message': 'Access forbidden: you do not have permission to access this page'}), 403

# Route pour récupérer le profil de l'utilisateur actuellement authentifié
@auth.route('/get_profil', methods=['GET'])
@jwt_required()
def get_profil():
    current_user = get_jwt_identity()
    user = Utilisateur.query.get(current_user)
    return jsonify({'user': {
        'id_user': user.id_user,
        'nom': user.nom,
        'prenom': user.prenom,
        'mail': user.mail,
        'date_naissance': user.date_naissance,
        'statut': user.statut,
        'id_user_1': user.id_user_1,
        'id_user_2': user.id_user_2,
        'id_ecole': user.id_ecole,
        'id_ecole_1': user.id_ecole_1,
        'id_ecole_2': user.id_ecole_2,
        'id_entreprise': user.id_entreprise,
        'id_entreprise_1': user.id_entreprise_1,
        'id_role': user.id_role,
        'id_user_3': user.id_user_3,
        'id_planning': user.id_planning
    }}), 200


@auth.route('/update_etudiant', methods=['POST'])
@jwt_required()
def update_profil():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    user = Utilisateur.query.get(data.get('id'))

    if not user:
        return jsonify({'message': 'Utilisateur non trouvé'}), 404

    # Filtrer les données pour ne prendre en compte que les champs modifiables
    allowed_fields = ['nom', 'prenom', 'classe', 'statut', 'entreprise']
    # Si statut = Alternance en cours alors status = 1 sinon 0
    if 'statut' in data:
        if data['statut'] == "Alternance en cours":
            data['statut'] = 1
        else:
            data['statut'] = 0
    for field in allowed_fields:
        if field in data:
            setattr(user, field, data[field])

    db.session.commit()
    
    return jsonify({'message': 'Profil mis à jour avec succès'}), 200

#Route pour set un rapport
@auth.route('/set_rapport', methods=['POST'])
@jwt_required()
def set_rapport():
    current_user = get_jwt_identity()
    data: dict = request.get_json()

    fields = ['id_user', 'id_suiveur', 'rapport']
    if check_fields(data, fields) != 0:
        return check_fields(data, fields)
    
    id_user = data.get('id_user')
    id_suiveur = data.get('id_suiveur')
    rapport = data.get('rapport')
    date = datetime.datetime.now()
    
    #Recup de hash MD5 du rapport
    # Décodage du rapport encodé en base64
    rapport = base64.b64decode(rapport)

    # Calcul de la somme de contrôle MD5
    MD5 = hashlib.md5(rapport).hexdigest()


    #Verification des roles
    user = Utilisateur.query.get(current_user)

    if not check_role(user, 1) and not check_role(user, 2) and not check_role(user, 3):
        return jsonify({'message': 'Unauthorized'}), 403
    
    #Ajout du rapport

    new_rapport = Document(id_user=id_user, id_user_1=id_suiveur, rapport=rapport, datecreation=date, md5=MD5)
    db.session.add(new_rapport)

    db.session.commit()

    return jsonify({'message': 'Rapport set'}), 200

#Route pour get les infos des rapports
@auth.route('/get_rapport_info', methods=['GET'])
@jwt_required()
def get_rapport_info():
    current_user = get_jwt_identity()
    data = request.get_json()
    user = Utilisateur.query.get(current_user)

    
    # Cas Admin et RRE - Recupération de tous les rapports
    if check_role(user, 1) or check_role(user, 2):
        #Recupération des rapports
        rapports = Document.query.all()
        rapports_dict = [document_to_dict(rapport) for rapport in rapports]


        return jsonify({'rapports': rapports_dict}), 200

    # Cas Suiveur - Recupération des rapports de ses étudiants
    elif check_role(user, 3):
        #Recupération des rapports
        rapports = Document.query.filter_by(id_user_1=current_user).all()
        rapports_dict = [document_to_dict(rapport) for rapport in rapports]

        return jsonify({'rapports': rapports_dict}), 200
    
    # Cas Etudiant - Recupération des rapports de l'étudiant
    elif check_role(user, 4):
        #Recupération des rapports
        rapports = Document.query.filter_by(id_user=current_user).all()
        rapports_dict = [document_to_dict(rapport) for rapport in rapports]        
        return jsonify({'rapports': rapports_dict}), 200


#Route pour get les infos des etudiant
@auth.route('/get_students', methods=['GET'])
@jwt_required()
def get_students():
    current_user = get_jwt_identity()
    user = Utilisateur.query.get(current_user)

    # Cas Admin et RRE - Recupération de tous les étudiants
    if check_role(user, 1) or check_role(user, 2):
        #Recupération des étudiants
        students = Utilisateur.query.filter_by(id_role=4).all()
        students_dict = [{
            'id': student.id_user,
            'nom': student.nom,
            'prenom': student.prenom,
            'statut': "Pas d'alternance" if student.statut == 0 else "Alternance en cours",
            'classe': student.classe,
            # Nom de l'entreprise si l'étudiant est en alternance
            'entreprise': "Aucune entreprise" if student.statut == 0 else Entreprise.query.get(student.id_entreprise).raison_sociale,
        } for student in students]

        return jsonify({'students': students_dict}), 200

    # Cas Suiveur - Recupération de ses étudiants
    elif check_role(user, 3):
        #Recupération des étudiants
        students = Utilisateur.query.filter_by(id_user_1=current_user).all()
        students_dict = [{
            'id': student.id_user,
            'nom': student.nom,
            'prenom': student.prenom,
            'statut': "Pas d'alternance" if student.statut == 0 else "Alternance en cours",
            'classe': student.classe,
            'entreprise': student.id_entreprise,
        } for student in students]
    
        return jsonify({'students': students_dict}), 200
    
    # Cas Etudiant - Recupération de ses informations
    elif check_role(user, 4):
        return jsonify({'Unauthorized': 'Unauthorized'}), 403



# Route pour download un rapport
@auth.route('/get_rapport/<string:md5>', methods=['GET'])
@jwt_required()
def get_rapport(md5):
    current_user = get_jwt_identity()
    data = request.get_json()
    user = Utilisateur.query.get(current_user)

    print(md5)
    rapport = Document.query.filter_by(md5=md5).first()

    if not rapport:
        return jsonify({'message': 'Report not found'}), 404
    
    rapport = rapport.rapport
    rapport = base64.b64decode(rapport)

    # Vérifiez les droits d'accès selon le rôle de l'utilisateur
    if check_role(user, 1) or check_role(user, 2):  # Admin ou RRE
        pass
    elif check_role(user, 3) and rapport.id_user_1 == current_user:  # Suiveur
        pass
    elif check_role(user, 4) and rapport.id_user == current_user:  # Étudiant
        pass
    else:
        return jsonify({'message': 'Unauthorized'}), 403

    response = make_response(rapport)
    response.headers['Content-Type'] = 'application/json'
    response.headers['Accept'] = 'application/pdf'
    response.headers['Content-Disposition'] = f'attachment; filename=report_{md5}.pdf'

    return response


# Route pour get l'url Calendly
@auth.route('/get_calendly', methods=['GET'])
@jwt_required()
def get_calendly():
    current_user = get_jwt_identity()
    user = Utilisateur.query.get(current_user)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Vérification du rôle de l'utilisateur RRE ou Suiveur
    if check_role(user, 1) or check_role(user, 2) or check_role(user, 3):
        # Récupération de l'URL Calendly de l'utilisateur
        url_calendly = user.url_calendly
        return jsonify({'url_calendly': url_calendly}), 200
    
    if check_role(user, 4):
        # Récupération de l'URL Calendly de son suiveur
        suiveur = Utilisateur.query.get(user.id_user_1)
        url_calendly = suiveur.url_calendly
        return jsonify({'url_calendly': url_calendly}), 200