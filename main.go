package main

import (
	"github.com/madebyqwerty/database-service/api"
	"github.com/madebyqwerty/database-service/api/books"
	"github.com/madebyqwerty/database-service/database"
	"github.com/madebyqwerty/database-service/server"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Server initialization
	app := server.Create()

	// Migrations
	database.DB.AutoMigrate(&books.Book{})

	// Api routes
	api.Setup(app)

	if err := server.Listen(app); err != nil {
		log.Panic(err)
	}
}
