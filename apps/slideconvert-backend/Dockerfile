FROM python:3.12-slim

# Install uv.
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy the application into the container.
COPY ./apps/slideconvert-backend/ /app

# Install the application dependencies.
WORKDIR /app
RUN uv sync --frozen --no-cache

ENV REDIS_URL=${REDIS_URL}

# Run the application.
CMD ["/bin/sh", "-c", "/app/.venv/bin/fastapi run app/main.py --port 80 --host 0.0.0.0 & /app/.venv/bin/rq worker --url $REDIS_URL"]