package api

import (
	"github.com/madebyqwerty/database-service/api/books"
	"github.com/madebyqwerty/database-service/api/swagger"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	v1 := app.Group("/api/v1")
	books.Routes(v1)
	swagger.Routes(app)
}
