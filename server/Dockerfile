
FROM python:3.13-slim


WORKDIR /src


COPY ./requirements.txt /src/requirements.txt


RUN pip install --no-cache-dir --upgrade -r /src/requirements.txt


COPY ./app /src/app


CMD ["fastapi", "run", "app/main.py", "--port", "8000"]