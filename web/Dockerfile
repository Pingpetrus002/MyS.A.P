# Use a Node.js image to build the React app
FROM node:20 as build-stage
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# Use a Python image to run the Flask app
FROM tiangolo/uwsgi-nginx-flask:python3.11
WORKDIR /app
COPY ./requirements.txt /var/www/requirements.txt
RUN pip install -r /var/www/requirements.txt

COPY . .

# Copy the built React app to the static directory
COPY --from=build-stage /app/dist /app/static