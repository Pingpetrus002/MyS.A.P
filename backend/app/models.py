from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Utilisateur(db.Model):
    __tablename__ = 'utilisateur'
    id_user = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nom = db.Column(db.String(50))
    prenom = db.Column(db.String(50))
    mail = db.Column(db.String(50))
    date_naissance = db.Column(db.Date)
    statut = db.Column(db.Boolean)
    password = db.Column(db.String(256))

class Suiveur(db.Model):
    __tablename__ = 'suiveur'
    id_user = db.Column(db.Integer, db.ForeignKey('utilisateur.id_user'), primary_key=True)

class Rre(db.Model):
    __tablename__ = 'rre'
    id_user = db.Column(db.Integer, db.ForeignKey('utilisateur.id_user'), primary_key=True)

class Cre(db.Model):
    __tablename__ = 'cre'
    id_user_1 = db.Column(db.Integer, db.ForeignKey('utilisateur.id_user'), primary_key=True)
    id_user = db.Column(db.Integer, db.ForeignKey('rre.id_user'), nullable=False)

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

class Contrat(db.Model):
    __tablename__ = 'contrat'
    id_contrat = db.Column(db.Integer, primary_key=True, autoincrement=True)
    libelle = db.Column(db.String(50))
    datecreation = db.Column(db.String(50))
    datesuppression = db.Column(db.String(50))
    id_user = db.Column(db.Integer, db.ForeignKey('cre.id_user_1'), nullable=False)

class Conflit(db.Model):
    __tablename__ = 'conflit'
    id_conflit = db.Column(db.Integer, primary_key=True, autoincrement=True)
    libelle = db.Column(db.String(50))
    datecreation = db.Column(db.Date)
    datesuppression = db.Column(db.Date)
    id_user = db.Column(db.Integer, db.ForeignKey('cre.id_user_1'), nullable=False)

class Rp(db.Model):
    __tablename__ = 'rp'
    id_user_3 = db.Column(db.Integer, db.ForeignKey('utilisateur.id_user'), primary_key=True)
    id_user = db.Column(db.Integer, db.ForeignKey('cre.id_user_1'), unique=True)
    id_user_1 = db.Column(db.Integer, db.ForeignKey('rre.id_user'), unique=True)
    id_user_2 = db.Column(db.Integer, db.ForeignKey('suiveur.id_user'), unique=True)
    id_ecole = db.Column(db.Integer, db.ForeignKey('ecole.id_ecole'))

class Entreprise(db.Model):
    __tablename__ = 'entreprise'
    id_entreprise = db.Column(db.Integer, primary_key=True, autoincrement=True)
    raison_sociale = db.Column(db.String(200))
    adresse = db.Column(db.String(200))
    id_ecole = db.Column(db.Integer, db.ForeignKey('ecole.id_ecole'), nullable=False)

class Programme(db.Model):
    __tablename__ = 'programme'
    id_programme = db.Column(db.Integer, primary_key=True, autoincrement=True)
    diplome = db.Column(db.String(50))
    annee = db.Column(db.String(50))
    id_user = db.Column(db.Integer, db.ForeignKey('rp.id_user_3'), nullable=False)

class TuteurEntreprise(db.Model):
    __tablename__ = 'tuteur_entreprise'
    id_user_2 = db.Column(db.Integer, db.ForeignKey('utilisateur.id_user'), primary_key=True)
    id_entreprise = db.Column(db.Integer, db.ForeignKey('entreprise.id_entreprise'), nullable=False)
    id_ecole = db.Column(db.Integer, db.ForeignKey('ecole.id_ecole'), nullable=False)
    id_user = db.Column(db.Integer, db.ForeignKey('suiveur.id_user'), nullable=False)
    id_user_1 = db.Column(db.Integer, db.ForeignKey('rp.id_user_3'), nullable=False)

class Alternant(db.Model):
    __tablename__ = 'alternant'
    id_user_1 = db.Column(db.Integer, db.ForeignKey('utilisateur.id_user'), primary_key=True)
    promotion = db.Column(db.String(50))
    id_planning = db.Column(db.Integer, db.ForeignKey('planning.id_planning'), nullable=False)
    id_user = db.Column(db.Integer, db.ForeignKey('tuteur_entreprise.id_user_2'), nullable=False)
    id_entreprise = db.Column(db.Integer, db.ForeignKey('entreprise.id_entreprise'))
    id_ecole = db.Column(db.Integer, db.ForeignKey('ecole.id_ecole'), nullable=False)

class Mission(db.Model):
    __tablename__ = 'mission'
    id_mission = db.Column(db.Integer, primary_key=True, autoincrement=True)
    libelle = db.Column(db.String(50))
    description = db.Column(db.String(50))
    datedebut = db.Column(db.Date)
    datefin = db.Column(db.Date)
    id_user = db.Column(db.Integer, db.ForeignKey('alternant.id_user_1'))

class Evaluation(db.Model):
    __tablename__ = 'evaluation'
    id_evaluation = db.Column(db.Integer, primary_key=True, autoincrement=True)
    dateevaluation = db.Column(db.Date)
    id_user = db.Column(db.Integer, db.ForeignKey('alternant.id_user_1'), nullable=False)

class Document(db.Model):
    __tablename__ = 'document'
    id_doc = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nom = db.Column(db.String(50))
    md5 = db.Column(db.String(50))
    type = db.Column(db.String(50))
    datecreation = db.Column(db.Date)
    datesuppression = db.Column(db.Date)
    id_user = db.Column(db.Integer, db.ForeignKey('suiveur.id_user'), nullable=False)
    id_user_1 = db.Column(db.Integer, db.ForeignKey('alternant.id_user_1'), nullable=False)
