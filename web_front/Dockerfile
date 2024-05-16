# Utilisez une image de base avec Python
FROM python:3.11-slim

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez les fichiers de l'application dans le conteneur
COPY . .

# Installez les dépendances de l'application
RUN pip install --no-cache-dir -r requirements.txt

# Définissez la commande à exécuter lorsque le conteneur démarre
CMD ["python", "app.py"]
