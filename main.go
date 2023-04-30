package main

import (
	"github.com/gofiber/fiber/v2"
	_ "github.com/joho/godotenv/autoload"
)

func main() {

	app := fiber.New()

	app.Get("/:name?", func(c *fiber.Ctx) error {
		if name := c.Params("name"); name != "" {
			return c.SendString("Hello, " + name + " 👋!")
		}

		return c.SendString("Hello, World 👋!")
	})

	app.Listen(":3000")

}
