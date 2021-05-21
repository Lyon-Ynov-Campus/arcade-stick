#Create a ubuntu base image with python 3 installed.
FROM python:3.9.4-slim

COPY requirements.txt /
RUN pip3 install -r /requirements.txt