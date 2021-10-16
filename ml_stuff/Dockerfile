FROM python:3.8-slim

COPY ./app /app

COPY ./app/requirements.txt /app/requirements.txt

RUN apt update -y && apt install gcc -y && pip install fastapi && pip install uvicorn && pip install -r /app/requirements.txt

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

