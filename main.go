package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
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
		log.Fatalf("Error loading migrations %v", err)
	}

	// Run migrations
	if err := m.Up(); err != nil {
		if err == migrate.ErrNoChange {
			log.Print("All migrations applied")
		} else {
			log.Fatalf("Error migrating up %v", err)
		}
	}

	// Setup fiber

	app := fiber.New()

	app.Get("/:name?", func(c *fiber.Ctx) error {
		if name := c.Params("name"); name != "" {
			return c.SendString("Hello, " + name + " 👋!")
		}

		return c.SendString("Hello, World 👋!")
	})

	app.Listen(":3000")

}
