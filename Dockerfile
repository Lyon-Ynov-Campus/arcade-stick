#Create a ubuntu base image with python 3 installed.
FROM python:3.9.4-slim

COPY requirements.txt /
RUN pip3 install -r /requirements.txt

COPY . /app
WORKDIR /app

#Run the command
CMD ["gunicorn", "--worker-class", "eventlet", "-w", "1", "app:app", "-b", "0.0.0.0:8000"]
