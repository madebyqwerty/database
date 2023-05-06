.PHONY: clean test security build run

APP_NAME = database-service
BUILD_DIR = $(pwd)/build
MIGRATIONS_FOLDER = $(PWD)/db/migrations
DATABASE_URL = postgres://postgres:password@localhost/postgres?sslmode=disable

args = `arg="$(filter-out $@,$(MAKECMDGOALS))" && echo $${arg:-${1}}`

clean:
	rm -rf ./build

security:
	gosec -quiet ./...

test: security
	go test -v -timeout 30s -coverprofile=cover.out -cover ./...
	go tool cover -func=cover.out

build: clean
	CGO_ENABLED=0 go build -ldflags="-w -s" -o $(BUILD_DIR)/$(APP_NAME) main.go

run: swag build
	$(BUILD_DIR)/$(APP_NAME)

dev: swag
	gow run .

swag:
	swag init

migrate:
	npx prisma migrate dev

migrate.prod:
	npx prisma migrate deploy

postgres:
	docker compose up db