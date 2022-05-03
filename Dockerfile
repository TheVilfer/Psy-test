FROM python:3.7
ADD . /app
WORKDIR /app
EXPOSE 80
RUN pip install -r requirements.txt
CMD ["gunicorn", "--bind", ":80","app:app"]