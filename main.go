package main

import (
	"log"
	"os"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	database_uri := os.Getenv("DB_SERVER_URI")

	// Setup migrations
	m, err := migrate.New(
		"file://db/migrations",
		database_uri)

	if err != nil {
		log.Fatal(err)
	}

	// Run migrations
	if err := m.Up(); err != nil {
		log.Fatal(err)
	}

}
