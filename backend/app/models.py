from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Planning(db.Model):
    __tablename__ = 'planning'
    id_planning = db.Column(db.Integer, primary_key=True, autoincrement=True)
    diplome = db.Column(db.String(50))
    annee = db.Column(db.String(50))
    classe = db.Column(db.String(50))

class Ecole(db.Model):
    __tablename__ = 'ecole'
    id_ecole = db.Column(db.Integer, primary_key=True, autoincrement=True)
    raison_sociale = db.Column(db.String(200))
    adresse = db.Column(db.String(200))

class Role(db.Model):
    __tablename__ = 'role'
    id_role = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(50))

class Entreprise(db.Model):
    __tablename__ = 'entreprise'
    id_entreprise = db.Column(db.Integer, primary_key=True, autoincrement=True)
    raison_sociale = db.Column(db.String(200))
    adresse = db.Column(db.String(200))
    id_ecole = db.Column(db.Integer, db.ForeignKey('ecole.id_ecole'))

class Utilisateur(db.Model):
    __tablename__ = 'utilisateur'
    id_user = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nom = db.Column(db.String(50))
    prenom = db.Column(db.String(50))
    mail = db.Column(db.String(50))
    date_naissance = db.Column(db.Date)
    statut = db.Column(db.Boolean)
    classe = db.Column(db.String(50))
    password = db.Column(db.String(256))
    url_calendly = db.Column(db.String(256))
    id_user_1 = db.Column(db.Integer, db.ForeignKey('utilisateur.id_user'))
    id_user_2 = db.Column(db.Integer, db.ForeignKey('utilisateur.id_user'))
    id_ecole = db.Column(db.Integer, db.ForeignKey('ecole.id_ecole'))
    id_ecole_1 = db.Column(db.Integer, db.ForeignKey('ecole.id_ecole'))
    id_ecole_2 = db.Column(db.Integer, db.ForeignKey('ecole.id_ecole'))
    id_entreprise = db.Column(db.Integer, db.ForeignKey('entreprise.id_entreprise'))
    id_entreprise_1 = db.Column(db.Integer, db.ForeignKey('entreprise.id_entreprise'))
    id_role = db.Column(db.Integer, db.ForeignKey('role.id_role'))
    id_user_3 = db.Column(db.Integer, db.ForeignKey('utilisateur.id_user'))
    id_planning = db.Column(db.Integer, db.ForeignKey('planning.id_planning'))

class Mission(db.Model):
    __tablename__ = 'mission'
    id_mission = db.Column(db.Integer, primary_key=True, autoincrement=True)
    libelle = db.Column(db.String(50))
    description = db.Column(db.String(50))
    datedebut = db.Column(db.Date)
    datefin = db.Column(db.Date)
    id_user = db.Column(db.Integer, db.ForeignKey('utilisateur.id_user'))

class Evaluation(db.Model):
    __tablename__ = 'evaluation'
    id_evaluation = db.Column(db.Integer, primary_key=True, autoincrement=True)
    dateevaluation = db.Column(db.Date)
    id_user = db.Column(db.Integer, db.ForeignKey('utilisateur.id_user'))

class Document(db.Model):
    __tablename__ = 'document_'
    id_doc = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nom = db.Column(db.String(50))
    rapport = db.Column(db.LargeBinary)
    md5 = db.Column(db.String(50))
    type = db.Column(db.String(50))
    datecreation = db.Column(db.Date)
    datesuppression = db.Column(db.Date)
    id_user = db.Column(db.Integer, db.ForeignKey('utilisateur.id_user'))
    id_user_1 = db.Column(db.Integer, db.ForeignKey('utilisateur.id_user'))

class Contrat(db.Model):
    __tablename__ = 'contrat'
    id_contrat = db.Column(db.Integer, primary_key=True, autoincrement=True)
    libelle = db.Column(db.String(50))
    datecreation = db.Column(db.String(50))
    datesuppression = db.Column(db.String(50))
    id_user = db.Column(db.Integer, db.ForeignKey('utilisateur.id_user'))

class Conflit(db.Model):
    __tablename__ = 'conflit'
    id_conflit = db.Column(db.Integer, primary_key=True, autoincrement=True)
    libelle = db.Column(db.String(50))
    datecreation = db.Column(db.Date)
    datesuppression = db.Column(db.Date)
    id_user = db.Column(db.Integer, db.ForeignKey('utilisateur.id_user'))

class Programme(db.Model):
    __tablename__ = 'programme'
    id_programme = db.Column(db.Integer, primary_key=True, autoincrement=True)
    diplome = db.Column(db.String(50))
    annee = db.Column(db.String(50))
    id_user = db.Column(db.Integer, db.ForeignKey('utilisateur.id_user'))
