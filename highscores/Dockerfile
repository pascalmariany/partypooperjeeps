FROM python:3.12-slim
WORKDIR /app
COPY server.py import_supabase.py ./
RUN useradd -r -u 1000 app && mkdir /data && chown app /data
USER app
ENV DB_PATH=/data/highscores.db PORT=8000 PYTHONUNBUFFERED=1
EXPOSE 8000
CMD ["python", "server.py"]
