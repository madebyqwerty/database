package swagger

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
	_ "github.com/madebyqwerty/database-service/docs"
)

func Routes(route *fiber.App) {
	route.Get("/docs/*", swagger.HandlerDefault)
}
