# Import des modules nécessaires
import base64
from flask import Blueprint, request, jsonify, render_template, make_response
from flask_mail import Message, Mail
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from werkzeug.security import generate_password_hash, check_password_hash
from .models import Utilisateur, db, Document, Entreprise, Alert, Mission, Role, Contrat, Ecole, Planning

import locale
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
        'id': doc.id_doc,
        'nom': doc.nom,
        #'rapport': base64.b64encode(doc.rapport).decode('utf-8'),  # Convertir en base64 pour l'affichage
        'md5': doc.md5,
        'type': doc.type,
        'datecreation': doc.datecreation.isoformat() if doc.datecreation else None,
        'datesuppression': doc.datesuppression.isoformat() if doc.datesuppression else None,
        'id_user': Utilisateur.query.get(doc.id_user).nom + ' ' + Utilisateur.query.get(doc.id_user).prenom,
        'id_user_1': Utilisateur.query.get(doc.id_user_1).nom + ' ' + Utilisateur.query.get(doc.id_user_1).prenom,
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
    

# Fonction pour avoir les utilisateurs (avec un paramètre facultatif pour filtrer par rôle)
@auth.route('/get_users/<int:role>', methods=['GET'])
@jwt_required()
def get_users_by_role(role):
    current_user = get_jwt_identity()
    user = Utilisateur.query.get(current_user)

    # Cas Admin et RRE - Recupération de tous les utilisateurs
    if check_role(user, 1) or check_role(user, 2):
        result = Utilisateur.query.all()

        user_list = []

        for u in result:
            if check_role(u, role):
                user_dict = {
                'id': u.id_user,
                'nom': u.nom,
                'prenom': u.prenom,
                'mail': u.mail
                }
                user_list.append(user_dict)

        return jsonify({"users":user_list}), 200


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
    password = data.get('password', generate_random_password()) # Génération d'un mot de passe aléatoire si non fourni
    url_calendly = data.get('url_calendly', None)
    role = data.get('role')
    

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
    args = {
        'mail': username,
        'password': hashed_password,
        'nom': lastname,
        'prenom': firstname,
        'date_naissance': date_naissance,
        'id_role': role,
    }
    if url_calendly:
        args['url_calendly'] = url_calendly

    #new_user = Utilisateur(mail=username, password=hashed_password, nom=lastname, prenom=firstname, date_naissance=date_naissance, id_role=role)
    new_user = Utilisateur(**args)
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
    user = Utilisateur.query.get(current_user)

    # Vérification du rôle de l'utilisateur pour l'accès à la page
    return jsonify({'message': 'Protected page', 'role': user.id_role, 'access': ROLES_ACCESS[user.id_role]}), 200




@auth.route('/users/edit', methods=['POST'])
@jwt_required()
def user_edit():
    current_user = get_jwt_identity()
    user = Utilisateur.query.get(current_user)

    # Vérification du rôle de l'utilisateur pour l'accès à la liste des rôles
    if not check_role(user, 1) and not check_role(user, 2):
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    # Verification des champs du formulaire
    fields = ['id_user', 'id_role', 'statut']
    if check_fields(data, fields) != 0:
        return check_fields(data, fields)
    
    user = Utilisateur.query.get(data.get('id_user'))
    user.id_role = data.get('id_role')
    user.statut = data.get('statut')
    user.url_calendly = data.get('url_calendly', '')
    db.session.commit()

    return jsonify({'message': 'User updated'}), 200





@auth.route('/roles/list', methods=['GET'])
@jwt_required()
def get_roles_list():
    current_user = get_jwt_identity()
    user = Utilisateur.query.get(current_user)

    # Vérification du rôle de l'utilisateur pour l'accès à la liste des rôles
    if not check_role(user, 1) and not check_role(user, 2):
        return jsonify({'message': 'Unauthorized'}), 403

    # Récupération de la liste de tous les rôles
    roles = Role.query.all()
    roles_dict = [{
        'id_role': role.id_role,
        'nom': role.nom
    } for role in roles]

    return jsonify({'roles': roles_dict}), 200


@auth.route('/users/list', methods=['GET'])
@jwt_required()
def get_users_list():
    current_user = get_jwt_identity()
    user = Utilisateur.query.get(current_user)

    # Vérification du rôle de l'utilisateur pour l'accès à la liste des utilisateurs
    if not check_role(user, 1) and not check_role(user, 2):
        return jsonify({'message': 'Unauthorized'}), 403

    # Récupération de la liste de tous les utilisateurs
    users = Utilisateur.query.all()
    users_dict = [{
        'id_user': user.id_user,
        'nom': user.nom,
        'prenom': user.prenom,
        'mail': user.mail,
        'date_naissance': user.date_naissance,
        'statut': user.statut,
        'classe': user.classe,
        'id_user_1': user.id_user_1,
        'id_user_2': user.id_user_2,
        'id_ecole': user.id_ecole,
        'id_ecole_1': user.id_ecole_1,
        'id_ecole_2': user.id_ecole_2,
        'id_entreprise': user.id_entreprise,
        'id_entreprise_1': user.id_entreprise_1,
        'id_role': user.id_role,
        'id_user_3': user.id_user_3,
        'id_planning': user.id_planning,
        'url_calendly': user.url_calendly
    } for user in users]

    return jsonify({'users': users_dict}), 200
    





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
        'classe': user.classe,
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

    fields = ['id_user', 'sujet', 'rapport', 'type']
    if check_fields(data, fields) != 0:
        return check_fields(data, fields)
    
    id_suiveur = Utilisateur.query.get(current_user).id_user

    id_user = data.get('id_user')
    sujet = data.get('sujet')
    rapport = data.get('rapport')
    typeOfDoc = data.get('type')
    date = datetime.datetime.now()
    
    #Recup de hash MD5 du rapport

    # Calcul de la somme de contrôle MD5
    data_to_hash = f"{id_user}{id_suiveur}{date}".encode('utf-8')
    MD5 = hashlib.md5(data_to_hash).hexdigest()


    #Verification des roles
    user = Utilisateur.query.get(current_user)

    if not check_role(user, 1) and not check_role(user, 2) and not check_role(user, 3):
        if(typeOfDoc != 'rapport' and check_role(user, 4) or check_role(user, 5)):
            pass
        else:
            return jsonify({'message': 'Unauthorized'}), 403
    

    #Ajout du rapport

    new_rapport = Document(nom=sujet, id_user=id_user, id_user_1=id_suiveur, rapport=rapport.encode('utf-8'), datecreation=date, md5=MD5, type=typeOfDoc)
    db.session.add(new_rapport)

    db.session.commit()

    return jsonify({'message': 'Rapport set'}), 200

# Route pour récupérer les infos des rapports
@auth.route('/get_rapport_info', methods=['GET'])
@jwt_required()
def get_rapport_info():
    current_user = get_jwt_identity()
    user = Utilisateur.query.get(current_user)

    # Récupération de tous les rapports de type 'rapport' pour les administrateurs et RRE
    if check_role(user, 1) or check_role(user, 2):
        rapports = Document.query.filter_by(type='rapport').all()
        autre = Document.query.filter_by(id_user=current_user, type='autre').all()
        rapports_dict = [document_to_dict(rapport) for rapport in rapports]
        autre_dict = [document_to_dict(rapport) for rapport in autre]
        rapports_dict.extend(autre_dict)
        return jsonify({'rapports': rapports_dict}), 200

    # Récupération des rapports de type 'autre' de l'utilisateur actuel, quel que soit le rôle
    elif check_role(user, 3) or check_role(user, 4):
        if request.args.get('type') == 'autre':
            rapports = Document.query.filter_by(id_user=current_user, type='autre').all()
        else:
            rapports = Document.query.filter_by(id_user_1=current_user, type='rapport').all()  # Récupération de tous les rapports de type 'rapport'
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
            'contrat': "Pas de contrat" if student.statut == 0 else (
                Contrat.query.get(student.id_user).libelle if Contrat.query.get(student.id_user) else "Pas de contrat"
            ),            # Nom de l'entreprise si l'étudiant est en alternance
            'entreprise': "Aucune entreprise" if student.statut == 0 else (
                entreprise.raison_sociale if (entreprise := Entreprise.query.get(student.id_entreprise)) else "Aucune entreprise"
            ),        } for student in students]

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


# Route pour récupérer les rapports
@auth.route('/get_rapport/<string:md5>', methods=['GET'])
@jwt_required()
def get_rapport(md5):
    current_user = get_jwt_identity()
    user = Utilisateur.query.get(current_user)

    rapport = Document.query.filter_by(md5=md5).first()

    if not rapport:
        return jsonify({'message': 'Report not found'}), 404

    rapport_data = base64.b64decode(rapport.rapport)

    # Vérifiez les droits d'accès selon le rôle de l'utilisateur
    if check_role(user, 1) or check_role(user, 2):  # Admin ou RRE
        pass
    elif check_role(user, 3) and rapport.id_user_1 == current_user:  # Suiveur
        pass
    elif check_role(user, 4) and rapport.id_user == current_user:  # Étudiant
        pass
    else:
        return jsonify({'message': 'Unauthorized'}), 403

    response = make_response(rapport_data)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = f'attachment; filename=report{md5}.pdf'

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
    

# Route pour créer une alerte
@auth.route('/create_alert', methods=['POST'])
@jwt_required()
def create_alert():
    data = request.get_json()    
    current_user = get_jwt_identity()

    type = data.get('type')
    commentaire = data.get('commentaire')
    id_user_cible = data.get('id_user_cible')

    # Création d'une alerte pour l'utilisateur spécifié
    new_alert = Alert(type=type, commentaires=commentaire, id_user_cible=id_user_cible, id_user_source=current_user, id_entreprise=Utilisateur.query.get(id_user_cible).id_entreprise, etat=1)
    db.session.add(new_alert)
    db.session.commit()

    return jsonify({'message': 'Alert created'}), 200


# Route pour récupérer toutes les alertes
@auth.route('/get_alerts', methods=['GET'])
@jwt_required()
def get_alerts():
    alerts = Alert.query.filter_by(etat=1).all()  # Filtrer les alertes par leur état actif (1)

    alerts_dict = [
        {
            'id': alert.id_alerte,
            'raison_social': Entreprise.query.get(alert.id_entreprise).raison_sociale if alert.id_entreprise else None,
            'type': alert.type,
            'commentaires': alert.commentaires,
            'id_user_cible': alert.id_user_cible,
            'user_source': Utilisateur.query.get(alert.id_user_source).prenom + ' ' + Utilisateur.query.get(alert.id_user_source).nom,
            'date': alert.date.strftime('%-d %B %Y')  # Formater la date pour l'affichage
        }
        for alert in alerts
    ]

    return jsonify(alerts_dict), 200

# Route pour désactiver une alerte
@auth.route('/disable_alert/<int:id_alert>', methods=['GET'])
@jwt_required()
def disable_alert(id_alert):
    alert = Alert.query.get(id_alert)

    if not check_role(Utilisateur.query.get(get_jwt_identity()), 1) and not check_role(Utilisateur.query.get(get_jwt_identity()), 2):
        return jsonify({'message': 'Unauthorized'}), 403

    if not alert:
        return jsonify({'message': 'Alert not found'}), 404

    alert.etat = 0
    db.session.commit()

    return jsonify({'message': 'Alert disabled'}), 200


# Route pour ajouter une mission
@auth.route('/add_mission', methods=['POST'])
@jwt_required()
def add_mission():
    data = request.get_json()
    current_user = get_jwt_identity()

    # Vérification des champs du formulaire
    fields = ['libelle', 'description', 'datedebut', 'datefin']
    if check_fields(data, fields) != 0:
        return check_fields(data, fields)

    libellé = data.get('libelle')
    description = data.get('description')
    date_debut = data.get('datedebut')
    date_fin = data.get('datefin')

    # Création d'une mission pour l'utilisateur spécifié
    new_mission = Mission(libelle=libellé, description=description, datedebut=date_debut, datefin=date_fin, id_user=current_user)
    db.session.add(new_mission)
    db.session.commit()

    return jsonify({'message': 'Mission added'}), 200

# Route pour récupérer toutes les missions
@auth.route('/get_missions', methods=['GET'])
@jwt_required()
def get_missions():
    # Recherche de toutes les missions

    # Check des roles
    if check_role(Utilisateur.query.get(get_jwt_identity()), 1) or check_role(Utilisateur.query.get(get_jwt_identity()), 2):
        missions = Mission.query.all()

    elif check_role(Utilisateur.query.get(get_jwt_identity()), 3):
        missions = Utilisateur.query.get(id_user_1=get_jwt_identity()).missions.all()

    elif check_role(Utilisateur.query.get(get_jwt_identity()), 4):
        missions = Mission.query.filter_by(id_user=get_jwt_identity()).all()



    missions_dict = [
        {
            'id_mission': mission.id_mission,
            'libelle': mission.libelle,
            'description': mission.description,
            'datedebut': mission.datedebut,
            'datefin': mission.datefin,
            'id_user': Utilisateur.query.get(mission.id_user).prenom + ' ' + Utilisateur.query.get(mission.id_user).nom
        } for mission in missions
    ]

    return jsonify({'missions': missions_dict}), 200


# Route pour ajouter un étudiant
@auth.route('/ajout_etudiants', methods=['POST'])
@jwt_required()
def ajoutEtudiants():
    data = request.get_json()

    if not data:
        return jsonify({'message': 'No data provided'}), 400

    fields = ['nom', 'prenom', 'email', 'date_naissance', 'classe', 'suiveur', 'tuteur', 'ecole', 'entreprise']
    if check_fields(data, fields) != 0:
        return check_fields(data, fields)

    # Validate the étudiant data
    ajout = ajoutEtudiantsFonction(data)

    return ajout



# Route pour ajouter des étudiants automatiquement à partir d'un fichier CSV
@auth.route('/ajout_etudiants_fichier', methods=['POST'])
@jwt_required()
def ajoutEtudiantsCsv():
    data = request.get_json().get('data')

    if not data:
        return jsonify({'message': 'No data provided'}), 400

    erreurs = False
    for data_intividuel in data:
        if data_intividuel != "":
            ajout = ajoutEtudiantsFonction(data_intividuel, options='csv')
            if ajout != 200:
                erreurs = True

    if erreurs:
        return jsonify({'message': 'Étudiants ajoutés avec quelques erreurs'}), 500
    return jsonify({'message': 'Étudiants ajoutés avec succès'}), 200


def ajoutEtudiantsFonction(data, options=None):
    if options is None:
        etudiant_nom = data.get('nom')
        etudiant_prenom = data.get('prenom')
        etudiant_email = data.get('email')
        etudiant_date_naissance = data.get('date_naissance')
        etudiant_statut = 1 if data.get('statut') == 1 else 0
        etudiant_classe = data.get('classe')
        etudiant_suiveur = data.get('suiveur')
        etudiant_tuteur = data.get('tuteur')
        etudiant_ecole = data.get('ecole')
        etudiant_entreprise = data.get('entreprise')
    else:
        etudiant_nom = data.get('Nom')
        etudiant_prenom = data.get('Prenom')
        etudiant_email = data.get('Email')
        etudiant_date_naissance = data.get('Date de naissance')
        etudiant_statut = 1 if data.get('Statut') == "Alternant" else 0
        etudiant_classe = data.get('Classe')
        etudiant_suiveur = data.get('Suiveur')
        etudiant_tuteur = data.get('Tuteur')
        etudiant_ecole = data.get('École')
        etudiant_entreprise = data.get('Entreprise')

    if not etudiant_nom or not etudiant_prenom or not etudiant_email or not etudiant_date_naissance or not etudiant_classe:
        return jsonify({'message': 'Données essentielles de l\'étudiant manquant'}), 400

    password = generate_random_password()  # Génération d'un mot de passe aléatoire

    # Validation de l'adresse email avec une expression régulière
    if not re.match(r"[^@]+@[^@]+\.[^@]+", etudiant_email):
        return jsonify({'message': 'Mail non valide'}), 400

    # Vérification de l'unicité de l'adresse email
    if Utilisateur.query.filter_by(mail=etudiant_email).first():
        return jsonify({'message': 'Mail déjà utilisé'}), 409

    # Hachage du mot de passe avant de le stocker dans la base de données
    hashed_password = generate_password_hash(password)

    # Regarde si une variable est vide, si oui, la remplace par None
    if etudiant_suiveur == "":
        etudiant_suiveur = None
    if type(etudiant_suiveur) == str and len(etudiant_suiveur) > 1:
        suiveur_nom, suiveur_prenom = etudiant_suiveur.split(' ')
        etudiant_suiveur = Utilisateur.query.filter_by(nom=suiveur_nom, prenom=suiveur_prenom).first().id_user

    if etudiant_tuteur == "":
        etudiant_tuteur = None
    if type(etudiant_tuteur) == str and len(etudiant_tuteur) > 1:
        tuteur_nom, tuteur_prenom = etudiant_tuteur.split(' ')
        etudiant_tuteur = Utilisateur.query.filter_by(nom=tuteur_nom, prenom=tuteur_prenom).first().id_user

    if etudiant_ecole == "":
        etudiant_ecole = None
    if type(etudiant_ecole) == str and len(etudiant_ecole) > 1:
        #etudiant_ecole = None
        etudiant_ecole = Ecole.query.filter_by(raison_sociale=etudiant_ecole).first().id_ecole

    if etudiant_entreprise == "":
        etudiant_entreprise = None
    if type(etudiant_entreprise) == str and len(etudiant_entreprise) > 1:
        #etudiant_entreprise = None
        etudiant_entreprise = Entreprise.query.filter_by(raison_sociale=etudiant_entreprise).first().id_entreprise

    # Create a new etudiant object
    new_etudiant = Utilisateur(
        nom=etudiant_nom,
        prenom=etudiant_prenom,
        mail=etudiant_email,
        password=hashed_password,
        date_naissance=etudiant_date_naissance,
        statut=etudiant_statut,
        classe=etudiant_classe,
        id_role=4,
        id_user_1=etudiant_suiveur,
        id_user_2=etudiant_tuteur,
        id_ecole=etudiant_ecole,
        id_entreprise=etudiant_entreprise,
        url_calendly=None,
        id_user_3=None,
        id_planning=None
    )

    # Add the new etudiant to the database
    db.session.add(new_etudiant)
    db.session.commit()

    send_welcome_email(etudiant_email, password)

    return jsonify({'message': 'Étudiant added successfully'}), 200


# Route pour récupérer les informations suivant le nom donné
@auth.route('/get_info/<string:nom>', methods=['GET'])
@jwt_required()
def get_info(nom):
    current_user = get_jwt_identity()
    user = Utilisateur.query.get(current_user)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Cas Admin et RRE - Recupération de tous les infos suivant le nom donné
    if check_role(user, 1) or check_role(user, 2):
        if nom == "entreprise":
            result = Entreprise.query.all()

            entreprise_list = []

            for e in result:
                entreprise_dict = {
                'id': e.id_entreprise,
                'nom': e.raison_sociale,
                'adresse': e.adresse,
                'id_ecole': e.id_ecole
                }
                entreprise_list.append(entreprise_dict)

            return jsonify({"entreprises":entreprise_list}), 200

        elif nom == "ecole":
            result = Ecole.query.all()

            ecole_list = []

            for e in result:
                ecole_dict = {
                'id': e.id_ecole,
                'nom': e.raison_sociale,
                'adresse': e.adresse,
                }
                ecole_list.append(ecole_dict)

            return jsonify({"ecoles":ecole_list}), 200
        elif nom == "planning":
            result = Planning.query.all()

            planning_list = []

            for p in result:
                planning_dict = {
                'id': p.id_planning,
                'diplome': p.diplome,
                'annee': p.annee,
                'classe': p.classe,
                }
                planning_list.append(planning_dict)

            print(planning_list)
            return jsonify({"plannings":planning_list}), 200
        else:
            return jsonify({'message': 'Nom invalide'}), 400