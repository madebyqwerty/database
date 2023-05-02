package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/madebyqwerty/database-service/handler"
)

func PublicRoutes(app *fiber.App) {
	group := app.Group("/api/v1")

	group.Get("/hello", handler.Hello)
}
