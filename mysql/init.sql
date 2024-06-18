-- web/init.sql

CREATE DATABASE IF NOT EXISTS flask_app;

USE flask_app;

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

CREATE TABLE IF NOT EXISTS role(
   id_role INT,
   nom VARCHAR(50),
   PRIMARY KEY(id_role)
);

CREATE TABLE IF NOT EXISTS entreprise(
   id_entreprise INTEGER NOT NULL AUTO_INCREMENT,
   raison_sociale VARCHAR(200),
   adresse VARCHAR(200),
   id_ecole INT,
   PRIMARY KEY(id_entreprise),
   FOREIGN KEY(id_ecole) REFERENCES ecole(id_ecole)
);

CREATE TABLE IF NOT EXISTS utilisateur(
   id_user INTEGER NOT NULL AUTO_INCREMENT,
   nom VARCHAR(50),
   prenom VARCHAR(50),
   mail VARCHAR(50),
   date_naissance DATE,
   statut BOOLEAN,
   classe VARCHAR(50),
   password VARCHAR(256),
   url_calendly VARCHAR(256),
   id_user_1 INT,
   id_user_2 INT,
   id_ecole INT,
   id_ecole_1 INT,
   id_ecole_2 INT,
   id_entreprise INT,
   id_entreprise_1 INT,
   id_role INT,
   id_user_3 INT,
   id_planning INT,
   PRIMARY KEY(id_user),
   FOREIGN KEY(id_user_1) REFERENCES utilisateur(id_user),
   FOREIGN KEY(id_user_2) REFERENCES utilisateur(id_user),
   FOREIGN KEY(id_ecole) REFERENCES ecole(id_ecole),
   FOREIGN KEY(id_ecole_1) REFERENCES ecole(id_ecole),
   FOREIGN KEY(id_ecole_2) REFERENCES ecole(id_ecole),
   FOREIGN KEY(id_entreprise) REFERENCES entreprise(id_entreprise),
   FOREIGN KEY(id_entreprise_1) REFERENCES entreprise(id_entreprise),
   FOREIGN KEY(id_role) REFERENCES role(id_role),
   FOREIGN KEY(id_user_3) REFERENCES utilisateur(id_user),
   FOREIGN KEY(id_planning) REFERENCES planning(id_planning)
);

CREATE TABLE IF NOT EXISTS mission(
   id_mission INTEGER NOT NULL AUTO_INCREMENT,
   libelle VARCHAR(50),
   description VARCHAR(50),
   datedebut DATE,
   datefin DATE,
   id_user INT,
   PRIMARY KEY(id_mission),
   FOREIGN KEY(id_user) REFERENCES utilisateur(id_user)
);

CREATE TABLE IF NOT EXISTS evaluation(
   id_evaluation INTEGER NOT NULL AUTO_INCREMENT,
   dateevaluation DATE,
   id_user INT,
   PRIMARY KEY(id_evaluation),
   FOREIGN KEY(id_user) REFERENCES utilisateur(id_user)
);

CREATE TABLE IF NOT EXISTS document_(
   id_doc INTEGER NOT NULL AUTO_INCREMENT,
   nom VARCHAR(50),
   rapport LONGBLOB,
   md5 VARCHAR(50),
   rapport BLOB,
   type VARCHAR(50),
   datecreation DATE,
   datesuppression DATE,
   id_user INT,
   id_user_1 INT,
   PRIMARY KEY(id_doc),
   FOREIGN KEY(id_user) REFERENCES utilisateur(id_user),
   FOREIGN KEY(id_user_1) REFERENCES utilisateur(id_user)
);

CREATE TABLE IF NOT EXISTS contrat(
   id_contrat INTEGER NOT NULL AUTO_INCREMENT,
   libelle VARCHAR(50),
   datecreation VARCHAR(50),
   datesuppression VARCHAR(50),
   id_user INT,
   PRIMARY KEY(id_contrat),
   FOREIGN KEY(id_user) REFERENCES utilisateur(id_user)
);

CREATE TABLE IF NOT EXISTS conflit(
   id_conflit INTEGER NOT NULL AUTO_INCREMENT,
   libelle VARCHAR(50),
   datecreation DATE,
   datesuppression DATE,
   id_user INT,
   PRIMARY KEY(id_conflit),
   FOREIGN KEY(id_user) REFERENCES utilisateur(id_user)
);

CREATE TABLE IF NOT EXISTS programme(
   id_programme INTEGER NOT NULL AUTO_INCREMENT,
   diplome VARCHAR(50),
   annee VARCHAR(50),
   id_user INT,
   PRIMARY KEY(id_programme),
   FOREIGN KEY(id_user) REFERENCES utilisateur(id_user)
);


-- Insert data into planning
INSERT INTO planning (diplome, annee, classe) VALUES
('Informatique', '2024', 'A1'),
('Informatique', '2024', 'A2'),
('Business', '2024', 'B1');

-- Insert data into ecole
INSERT INTO ecole (raison_sociale, adresse) VALUES
('Ecole Polytechnique', '123 Rue de l\'École, Paris'),
('Université de Technologie', '456 Avenue de l\'Université, Lyon');

-- Insert data into role
INSERT INTO role (id_role, nom) VALUES
(1, 'Admin'),
(2, 'RRE'),
(3, 'Suiveur'),
(4, 'Etudiant'),
(5, 'Tuteur');

-- Insert data into entreprise
INSERT INTO entreprise (raison_sociale, adresse, id_ecole) VALUES
('Tech Corp', '789 Boulevard de l Entreprise, Marseille', 1),
('Innovatech', '321 Rue des Innovations, Toulouse', 2);

-- Insert data into utilisateur
INSERT INTO utilisateur (nom, prenom, mail, date_naissance, statut, password, url_calendly, id_user_1, id_user_2, id_ecole, id_ecole_1, id_ecole_2, id_entreprise, id_entreprise_1, id_role, id_user_3, id_planning) VALUES
('Dupont', 'Jean', 'a@a.com', '1990-01-01', true, 'scrypt:32768:8:1$rBOKy7d3L5U5bdnJ$2b2457b7a9d8d7b5efb0eff4b3b531868d777750dc91fefc96bbedaa478dc483c60cf519d73c8ede40235dde8068ef434daea760c99d1ebc0465db4bd9ab91b8', 'http://calendly.com/jean', NULL, NULL, 1, NULL, NULL, 1, NULL, 1, NULL, 1),
('Martin', 'Sophie', 'b@b.com', '1992-02-02', true, 'scrypt:32768:8:1$rBOKy7d3L5U5bdnJ$2b2457b7a9d8d7b5efb0eff4b3b531868d777750dc91fefc96bbedaa478dc483c60cf519d73c8ede40235dde8068ef434daea760c99d1ebc0465db4bd9ab91b8', 'http://calendly.com/sophie', 1, NULL, 2, NULL, NULL, 2, NULL, 2, NULL, 2),
('Leclerc', 'Paul', 'c@c.com', '1994-03-03', false, 'scrypt:32768:8:1$rBOKy7d3L5U5bdnJ$2b2457b7a9d8d7b5efb0eff4b3b531868d777750dc91fefc96bbedaa478dc483c60cf519d73c8ede40235dde8068ef434daea760c99d1ebc0465db4bd9ab91b8', 'http://calendly.com/paul', 1, 2, NULL, NULL, NULL, NULL, NULL, 3, NULL, 3);

-- Insert data into mission
INSERT INTO mission (libelle, description, datedebut, datefin, id_user) VALUES
('Développement Web', 'Création dun site web', '2024-01-01', '2024-06-01', 1),
('Analyse de données', 'Analyse des données clients', '2024-02-01', '2024-07-01', 2);

-- Insert data into evaluation
INSERT INTO evaluation (dateevaluation, id_user) VALUES
('2024-05-01', 1),
('2024-06-01', 2);

-- Insert data into document_
INSERT INTO document_ (nom, md5, rapport, type, datecreation, datesuppression, id_user, id_user_1) VALUES
('Rapport de stage', 'e99a18c428cb38d5f260853678922e03', NULL, 'pdf', '2024-04-01', NULL, 1, 2),
('Mémoire', 'ab56b4d92b40713acc5af89985d4b786', NULL, 'docx', '2024-05-01', NULL, 2, 1);

-- Insert data into contrat
INSERT INTO contrat (libelle, datecreation, datesuppression, id_user) VALUES
('Contrat de stage', '2024-01-01', NULL, 1),
('Contrat dalternance', '2024-02-01', NULL, 2);

-- Insert data into conflit
INSERT INTO conflit (libelle, datecreation, datesuppression, id_user) VALUES
('Problème de communication', '2024-03-01', NULL, 1),
('Désaccord sur le projet', '2024-04-01', NULL, 2);

-- Insert data into programme
INSERT INTO programme (diplome, annee, id_user) VALUES
('Master Informatique', '2024', 1),
('Licence Business', '2024', 2);


CREATE USER root@root IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON flask_app.* TO root@root;
FLUSH PRIVILEGES;