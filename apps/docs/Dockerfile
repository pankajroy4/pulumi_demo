# Use Python slim image
FROM python:3.13-slim

# Set working directory
WORKDIR /usr/src/app

# Copy dependency file first (better Docker caching)
COPY docs/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy MkDocs config
COPY mkdocs.yml .

# Copy docs content
COPY docs/ ./docs/

# Expose MkDocs port
EXPOSE 8001

# Run MkDocs server
CMD ["mkdocs", "serve", "-a", "0.0.0.0:8001"]