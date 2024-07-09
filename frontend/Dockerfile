# Use a Node.js image to build the React app
FROM node:20
WORKDIR /app
COPY . .

# Install apt-get
#RUN wget https://security.ubuntu.com/ubuntu/pool/main/a/apt/apt_2.9.6_amd64.deb
#RUN dpkg -i apt_2.9.6_amd64.deb


RUN apt-get update && apt-get install -y \
    ca-certificates \
    nginx

COPY ./nginx.conf /etc/nginx/nginx.conf


# create nginx user
RUN adduser --system --no-create-home --shell /bin/false --group --disabled-login nginx

# add nginx user to www-data group
RUN usermod -a -G www-data nginx


RUN npm init -y
RUN npm install

RUN npm run build

# set nginx user as the owner of the /app/templates directory
RUN chown -R nginx:nginx /app/templates/

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]

#CMD ["npm", "run", "dev"]