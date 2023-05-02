package handler

import "github.com/gofiber/fiber/v2"

// Hello func Hello route
// @Summary Hello route
// @Description Returns a hello message. Can be used to check if the service is online.
// @Tags Public
// @Accept json
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router /hello [get]
func Hello(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"msg":    "Hello i'm ok",
		"status": "success",
		"data":   nil,
	})
}
