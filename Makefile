.PHONY: frontend backend install

NODE := $(shell command -v node 2> /dev/null)
NPM := $(shell command -v npm 2> /dev/null)
GO := $(shell command -v go 2> /dev/null)

frontend:
	@echo "Starting frontend..."
	cd frontend && npm start

backend:
	@echo "Starting backend..."
	cd backend && go run main.go

start: frontend backend

install:
	@if [ ! "$(GO)" ]; then \
		echo "Go is not installed. Please install Go to continue."; \
		exit 1; \
	else \
		echo "Installing backend dependencies..."; \
		go get ./... # or 'go mod download' if using modules; \
	fi

	@if [ ! "$(NODE)" ]; then \
		echo "Node.js is not installed. Please install Node.js to continue."; \
	fi

	@if [ ! "$(NPM)" ]; then \
		echo "npm is not installed. Please install npm to continue."; \
	else \
		echo "Installing frontend dependencies..."; \
		cd frontend && npm install; \
	fi

	@if [ -z "$(POLYGON_API_KEY)" ]; then \
		echo "POLYGON_API_KEY environment variable is not set. Please set it before continuing."; \
	else \
		echo "POLYGON_API_KEY is set!"; \
		# Proceed with commands that require the API key \
	fi
