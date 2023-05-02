package routes

import (
	"github.com/gofiber/fiber/v2"
	swagger "github.com/gofiber/swagger"
	_ "github.com/madebyqwerty/database-service/docs"
)

func Swagger(app *fiber.App) {
	app.Get("swagger/*", swagger.HandlerDefault)
}
