package main

import (
	"log"

	"github.com/madebyqwerty/database-service/api"
	"github.com/madebyqwerty/database-service/api/books"
	"github.com/madebyqwerty/database-service/api/students"
	"github.com/madebyqwerty/database-service/api/users"
	"github.com/madebyqwerty/database-service/database"
	"github.com/madebyqwerty/database-service/server"

	"github.com/joho/godotenv"
)

// @title Shift API
// @version 1.0
// @description This is an API for the Shift project

// @host localhost:5000
// @BasePath /api

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization

// @license.name MIT
// @license.url https://mit-license.org/
func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Server initialization
	app := server.Create()

	// Migrations
	database.DB.AutoMigrate(&books.Book{})
	database.DB.AutoMigrate(&users.User{})
	database.DB.AutoMigrate(&students.Student{})

	// Api routes
	api.Setup(app)

	if err := server.Listen(app); err != nil {
		log.Panic(err)
	}
}
