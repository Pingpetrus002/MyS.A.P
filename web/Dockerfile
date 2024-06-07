# Use the tiangolo/uwsgi-nginx-flask image with Python 3.11
FROM tiangolo/uwsgi-nginx-flask:python3.11

# Install curl to download Node.js setup script
RUN apt-get update && apt-get install -y curl

# Install Node.js 18.x and npm from NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Set the working directory to /app
WORKDIR /app

# Copy the requirements.txt file into the container
COPY ./requirements.txt /app/requirements.txt

# Install Python dependencies
RUN pip install -r requirements.txt

# Copy the entire project into the container
COPY . /app

# Remove existing node_modules and package-lock.json if they exist
RUN rm -rf node_modules package-lock.json

# Install Node.js dependencies for Vite.js
RUN npm install

# Build the Vite.js project
RUN npm run build

# Expose the necessary port
EXPOSE 80

# Run the Flask application using uWSGI
CMD ["uwsgi", "--ini", "/app/uwsgi.ini"]
