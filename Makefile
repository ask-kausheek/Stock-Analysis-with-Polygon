.PHONY: frontend backend

frontend:
    @echo "Starting frontend..."
    cd frontend && npm start

backend:
    @echo "Starting backend..."
    cd backend && go run main.go

start: frontend backend
