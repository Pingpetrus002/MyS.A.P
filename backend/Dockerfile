FROM tiangolo/uwsgi-nginx-flask:python3.11
COPY ./requirements.txt /var/www/requirements.txt
RUN pip install -r /var/www/requirements.txt
RUN apt-get update && apt-get install -y ca-certificates
COPY . /app
