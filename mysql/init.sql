-- web/init.sql

CREATE DATABASE IF NOT EXISTS flask_app;

USE flask_app;

CREATE TABLE IF NOT EXISTS suiveur(
   Id_suiveur INTEGER NOT NULL AUTO_INCREMENT,
   Nom VARCHAR(50),
   prenom VARCHAR(50),
   date_naissance DATE,
   statut VARCHAR(50),
   mail VARCHAR(50),
   PRIMARY KEY(Id_suiveur)
);

CREATE TABLE IF NOT EXISTS planning(
   id_planning INTEGER NOT NULL AUTO_INCREMENT,
   diplome VARCHAR(50),
   annee VARCHAR(50),
   classe VARCHAR(50),
   PRIMARY KEY(id_planning)
);

CREATE TABLE IF NOT EXISTS ecole(
   id_ecole INTEGER NOT NULL AUTO_INCREMENT,
   raison_sociale VARCHAR(200),
   adresse VARCHAR(200),
   PRIMARY KEY(id_ecole)
);

CREATE TABLE IF NOT EXISTS rp(
   Id_rp INTEGER NOT NULL AUTO_INCREMENT,
   Nom VARCHAR(50),
   prenom VARCHAR(50),
   date_naissance DATE,
   mail VARCHAR(50),
   statut VARCHAR(50),
   PRIMARY KEY(Id_rp)
);

CREATE TABLE IF NOT EXISTS rre(
   Id_rre INTEGER NOT NULL AUTO_INCREMENT,
   Nom VARCHAR(50),
   prenom VARCHAR(50),
   date_naissance DATE,
   mail VARCHAR(50),
   PRIMARY KEY(Id_rre)
);

CREATE TABLE IF NOT EXISTS programme(
   id_programme INTEGER NOT NULL AUTO_INCREMENT,
   diplome VARCHAR(50),
   annee VARCHAR(50),
   Id_rp INT NOT NULL,
   PRIMARY KEY(id_programme),
   FOREIGN KEY(Id_rp) REFERENCES rp(Id_rp)
);

CREATE TABLE IF NOT EXISTS cre(
   Id_cre INTEGER NOT NULL AUTO_INCREMENT,
   Nom VARCHAR(50),
   prenom VARCHAR(50),
   date_naissance DATE,
   mail VARCHAR(50),
   Id_rre INT NOT NULL,
   Id_rre_1 INT,
   Id_rp INT,
   Id_suiveur INT,
   id_ecole INT,
   PRIMARY KEY(Id_cre),
   UNIQUE(Id_rre_1),
   UNIQUE(Id_rp),
   UNIQUE(Id_suiveur),
   FOREIGN KEY(Id_rre) REFERENCES rre(Id_rre),
   FOREIGN KEY(Id_rre_1) REFERENCES rre(Id_rre),
   FOREIGN KEY(Id_rp) REFERENCES rp(Id_rp),
   FOREIGN KEY(Id_suiveur) REFERENCES suiveur(Id_suiveur),
   FOREIGN KEY(id_ecole) REFERENCES ecole(id_ecole)
);

CREATE TABLE IF NOT EXISTS entreprise(
   id_entreprise INTEGER NOT NULL AUTO_INCREMENT,
   raison_sociale VARCHAR(200),
   adresse VARCHAR(200),
   id_ecole INT NOT NULL,
   PRIMARY KEY(id_entreprise),
   FOREIGN KEY(id_ecole) REFERENCES ecole(id_ecole)
);

CREATE TABLE IF NOT EXISTS contrat(
   id_contrat INTEGER NOT NULL AUTO_INCREMENT,
   libelle VARCHAR(50),
   datecreation VARCHAR(50),
   datesuppression VARCHAR(50),
   Id_cre INT NOT NULL,
   PRIMARY KEY(id_contrat),
   FOREIGN KEY(Id_cre) REFERENCES cre(Id_cre)
);

CREATE TABLE IF NOT EXISTS conflit(
   id_conflit INTEGER NOT NULL AUTO_INCREMENT,
   libelle VARCHAR(50),
   datecreation DATE,
   datesuppression DATE,
   Id_cre INT NOT NULL,
   PRIMARY KEY(id_conflit),
   FOREIGN KEY(Id_cre) REFERENCES cre(Id_cre)
);

CREATE TABLE IF NOT EXISTS tuteur_entreprise(
   Id_tuteur INTEGER NOT NULL AUTO_INCREMENT,
   Nom VARCHAR(50),
   prenom VARCHAR(50),
   date_naissance DATE,
   mail VARCHAR(50),
   entreprise VARCHAR(50),
   id_entreprise INT NOT NULL,
   id_ecole INT NOT NULL,
   Id_suiveur INT NOT NULL,
   Id_rp INT NOT NULL,
   PRIMARY KEY(Id_tuteur),
   FOREIGN KEY(id_entreprise) REFERENCES entreprise(id_entreprise),
   FOREIGN KEY(id_ecole) REFERENCES ecole(id_ecole),
   FOREIGN KEY(Id_suiveur) REFERENCES suiveur(Id_suiveur),
   FOREIGN KEY(Id_rp) REFERENCES rp(Id_rp)
);

CREATE TABLE IF NOT EXISTS alternant(
   Id_alternant INTEGER NOT NULL AUTO_INCREMENT,
   Nom VARCHAR(50),
   prenom VARCHAR(50),
   date_naissance DATE,
   mail VARCHAR(50),
   promotion VARCHAR(50),
   id_planning INT NOT NULL,
   Id_tuteur INT NOT NULL,
   id_entreprise INT,
   PRIMARY KEY(Id_alternant),
   FOREIGN KEY(id_planning) REFERENCES planning(id_planning),
   FOREIGN KEY(Id_tuteur) REFERENCES tuteur_entreprise(Id_tuteur),
   FOREIGN KEY(id_entreprise) REFERENCES entreprise(id_entreprise)
);

CREATE TABLE IF NOT EXISTS mission(
   id_mission INTEGER NOT NULL AUTO_INCREMENT,
   libelle VARCHAR(50),
   description VARCHAR(50),
   datedebut DATE,
   datefin DATE,
   Id_alternant INT,
   PRIMARY KEY(id_mission),
   FOREIGN KEY(Id_alternant) REFERENCES alternant(Id_alternant)
);

CREATE TABLE IF NOT EXISTS evaluation(
   id_evaluation INTEGER NOT NULL AUTO_INCREMENT,
   dateevaluation DATE,
   Id_alternant INT NOT NULL,
   PRIMARY KEY(id_evaluation),
   FOREIGN KEY(Id_alternant) REFERENCES alternant(Id_alternant)
);

CREATE TABLE IF NOT EXISTS document(
   id_document INTEGER NOT NULL AUTO_INCREMENT,
   nom VARCHAR(50),
   md5 VARCHAR(50),
   type VARCHAR(50),
   datecreation DATE,
   datesuppression DATE,
   Id_suiveur INT NOT NULL,
   Id_alternant INT NOT NULL,
   PRIMARY KEY(id_document),
   FOREIGN KEY(Id_suiveur) REFERENCES suiveur(Id_suiveur),
   FOREIGN KEY(Id_alternant) REFERENCES alternant(Id_alternant)
);


CREATE USER root@root IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON flask_app.* TO root@root;
FLUSH PRIVILEGES;

