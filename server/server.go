package server

import (
	"fmt"
	"os"

	"github.com/madebyqwerty/database-service/database"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/etag"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/helmet/v2"
)

func setupMiddlewares(app *fiber.App) {
	app.Use(helmet.New())
	app.Use(recover.New())
	app.Use(cors.New())
	app.Use(compress.New(compress.Config{
		Level: compress.LevelBestSpeed, // 1
	}))
	app.Use(etag.New())
	app.Use(logger.New())
}

// Status func
// @Summary Get status
// @Description Returns OK message if ther server is running
// @Tags Public
// @Accept json
// @Produce json
// @Success 200 {string} ok "OK"
// @Router / [get]
func Create() *fiber.App {
	database.SetupDatabase()

	app := fiber.New(fiber.Config{})

	setupMiddlewares(app)

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	return app
}

func Listen(app *fiber.App) error {

	serverHost := os.Getenv("SERVER_HOST")
	serverPort := os.Getenv("SERVER_PORT")

	return app.Listen(fmt.Sprintf("%s:%s", serverHost, serverPort))
}
