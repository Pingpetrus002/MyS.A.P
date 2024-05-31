-- web/init.sql

CREATE DATABASE IF NOT EXISTS flask_app;

USE flask_app;

CREATE TABLE IF NOT EXISTS alternant(
   Id INT,
   Nom VARCHAR(50),
   Prenom VARCHAR(50),
   mail VARCHAR(50),
   promotion VARCHAR(50),
   PRIMARY KEY(Id)
);

CREATE TABLE IF NOT EXISTS suiveur(
   Id INT,
   Nom VARCHAR(50),
   Prenom VARCHAR(50),
   date_naissance DATE,
   statut VARCHAR(50),
   mail VARCHAR(50),
   PRIMARY KEY(Id)
);

CREATE TABLE IF NOT EXISTS planning(
   id INT,
   PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS mission(
   id INT,
   PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS evaluation(
   id INT,
   PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS document(
   id INT,
   nom VARCHAR(50),
   md5 VARCHAR(50),
   type VARCHAR(50),
   PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS entreprise(
   id INT,
   raison_sociale VARCHAR(200),
   adresse VARCHAR(200),
   PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS ecole(
   id INT,
   raison_sociale VARCHAR(200),
   adresse VARCHAR(200),
   PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS rp(
   Id INT,
   Nom VARCHAR(50),
   Prenom VARCHAR(50),
   date_naissance DATE,
   mail VARCHAR(50),
   statut VARCHAR(50),
   PRIMARY KEY(Id)
);

CREATE TABLE IF NOT EXISTS rre(
   Id INT,
   Nom VARCHAR(50),
   Prenom VARCHAR(50),
   date_naissance DATE,
   mail VARCHAR(50),
   PRIMARY KEY(Id)
);

CREATE TABLE IF NOT EXISTS programme(
   id INT,
   PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS contrat(
   id INT,
   PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS conflit(
   id INT,
   PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS cre(
   Id INT,
   Nom VARCHAR(50),
   Prenom VARCHAR(50),
   date_naissance DATE,
   mail VARCHAR(50),
   Id_1 INT,
   Id_2 INT,
   Id_3 INT,
   Id_4 INT,
   id_5 INT,
   PRIMARY KEY(Id),
    UNIQUE(Id_1),
   UNIQUE(Id_2),
   UNIQUE(Id_3),
   UNIQUE(Id_4),
     FOREIGN KEY(Id_1) REFERENCES rre(Id),
   FOREIGN KEY(Id_2) REFERENCES rre(Id),
   FOREIGN KEY(Id_3) REFERENCES rp(Id),
   FOREIGN KEY(Id_4) REFERENCES suiveur(Id),
   FOREIGN KEY(id_5) REFERENCES ecole(id)
);

CREATE TABLE IF NOT EXISTS tuteur_entreprise(
   Id INT,
   Nom VARCHAR(50),
   Prenom VARCHAR(50),
   date_naissance DATE,
   mail VARCHAR(50),
   entreprise VARCHAR(50),
   Id_1 INT NOT NULL,
   id_2 INT NOT NULL,
   PRIMARY KEY(Id),
   UNIQUE(Id_1),
   FOREIGN KEY(Id_1) REFERENCES alternant(Id),
   FOREIGN KEY(id_2) REFERENCES entreprise(id)
);

CREATE TABLE IF NOT EXISTS collabore(
   id INT,
   id_1 INT,
   PRIMARY KEY(id, id_1),
   FOREIGN KEY(id) REFERENCES entreprise(id),
   FOREIGN KEY(id_1) REFERENCES ecole(id)
);

CREATE TABLE IF NOT EXISTS affecte(
   Id INT,
   id_1 INT,
   id_2 INT,
   id_3 INT,
   PRIMARY KEY(Id, id_1, id_2, id_3),
   FOREIGN KEY(Id) REFERENCES alternant(Id),
   FOREIGN KEY(id_1) REFERENCES planning(id),
   FOREIGN KEY(id_2) REFERENCES mission(id),
   FOREIGN KEY(id_3) REFERENCES evaluation(id)
);

CREATE TABLE IF NOT EXISTS accede(
   Id INT,
   id_1 INT,
   PRIMARY KEY(Id, id_1),
   FOREIGN KEY(Id) REFERENCES alternant(Id),
   FOREIGN KEY(id_1) REFERENCES document(id)
);

CREATE TABLE IF NOT EXISTS Communique(
   Id INT,
   Id_1 INT,
   Id_2 INT,
   PRIMARY KEY(Id, Id_1, Id_2),
   FOREIGN KEY(Id) REFERENCES suiveur(Id),
   FOREIGN KEY(Id_1) REFERENCES tuteur_entreprise(Id),
   FOREIGN KEY(Id_2) REFERENCES rp(Id)
);

CREATE TABLE IF NOT EXISTS redige(
   Id INT,
   id_1 INT,
   PRIMARY KEY(Id, id_1),
   FOREIGN KEY(Id) REFERENCES suiveur(Id),
   FOREIGN KEY(id_1) REFERENCES document(id)
);

CREATE TABLE IF NOT EXISTS evalue(
   Id INT,
   Id_1 INT,
   PRIMARY KEY(Id, Id_1),
   FOREIGN KEY(Id) REFERENCES alternant(Id),
   FOREIGN KEY(Id_1) REFERENCES tuteur_entreprise(Id)
);

CREATE TABLE IF NOT EXISTS informe(
   Id INT,
   id_1 INT,
   PRIMARY KEY(Id, id_1),
   FOREIGN KEY(Id) REFERENCES tuteur_entreprise(Id),
   FOREIGN KEY(id_1) REFERENCES ecole(id)
);

CREATE TABLE IF NOT EXISTS supervice(
   Id INT,
   id_1 INT,
   PRIMARY KEY(Id, id_1),
   FOREIGN KEY(Id) REFERENCES rp(Id),
   FOREIGN KEY(id_1) REFERENCES programme(id)
);

CREATE TABLE IF NOT EXISTS gere(
   id INT,
   Id_1 INT,
   PRIMARY KEY(id, Id_1),
   FOREIGN KEY(id) REFERENCES contrat(id),
   FOREIGN KEY(Id_1) REFERENCES cre(Id)
);

CREATE TABLE IF NOT EXISTS resoud(
   id INT,
   Id_1 INT,
   PRIMARY KEY(id, Id_1),
   FOREIGN KEY(id) REFERENCES conflit(id),
   FOREIGN KEY(Id_1) REFERENCES cre(Id)
);

CREATE USER root@root IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON flask_app.* TO root@root;
FLUSH PRIVILEGES;

