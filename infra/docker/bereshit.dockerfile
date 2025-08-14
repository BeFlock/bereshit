FROM golang:1.23-bullseye AS base

# Install essential tools including bash
RUN apt-get update && apt-get install -y \
    bash \
    curl \
    wget \
    vim \
    git \
    procps \
    htop \
    pkg-config \
    libgtk-3-dev \
    libwebkit2gtk-4.0-dev \
    libgirepository1.0-dev \
    libcairo2-dev \
    libpango1.0-dev \
    libatk1.0-dev \
    libgdk-pixbuf2.0-dev \
    libglib2.0-dev \
    gcc \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js and Yarn/NPM
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get install -y nodejs build-essential

# Install Wails CLI
RUN go install github.com/wailsapp/wails/v2/cmd/wails@latest

WORKDIR /app

COPY . .

# Install frontend dependencies
RUN cd src/frontend && npm install

# Enable CGO for Wails compilation
ENV CGO_ENABLED=1

# Expose ports
EXPOSE 34115 5173

# Default command - can be overridden
CMD ["bash"]
