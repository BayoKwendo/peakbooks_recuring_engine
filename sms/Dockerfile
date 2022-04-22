FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./

COPY config.yml ./config.yml

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

ENTRYPOINT ["python3"]

    
CMD ["-u", "main_app.py", "main_app"]