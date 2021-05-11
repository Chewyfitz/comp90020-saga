FROM python:3
WORKDIR /code
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# RUN pip install ptvsd


ENV FLASK_APP=run.py
ENV FLASK_ENV=development

COPY run.py .
# CMD python -m ptvsd --host 0.0.0.0 --port 5678 --wait --multiprocess -m flask run --host=0.0.0.0
CMD flask run --host=0.0.0.0
