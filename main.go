package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	_ "github.com/joho/godotenv/autoload"
	"github.com/madebyqwerty/database-service/database"
	"github.com/madebyqwerty/database-service/routes"
	"github.com/madebyqwerty/database-service/utils"
)

// @title Database service API
// @version 1.0
// @description This is an API for the <codename> project

// @host localhost:5000
// @BasePath /api

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization

// @license.name MIT
// @license.url https://mit-license.org/
func main() {

	app := fiber.New()
	app.Use(
		cors.New(),
		logger.New(),
	)

	// Register all routes
	routes.PublicRoutes(app)
	routes.Swagger(app)

	database.Connect()

	// Start server
	utils.StartServerWithGracefulShutdown(app)

}
