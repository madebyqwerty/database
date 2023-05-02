package utils

import (
	"log"
	"os"
	"os/signal"

	"github.com/gofiber/fiber/v2"
)

func StartServerWithGracefulShutdown(a *fiber.App) {
	idleConnsClose := make(chan struct{})

	go func() {
		sigint := make(chan os.Signal, 1)
		signal.Notify(sigint, os.Interrupt)
		<-sigint

		if err := a.Shutdown(); err != nil {
			log.Printf("Server shtutting down %v", err)
		}

		close(idleConnsClose)
	}()

	if err := a.Listen(os.Getenv("SERVER_URL")); err != nil {
		log.Printf("Could not start server: %v", err)
	}

	<-idleConnsClose
}

func StartServer(a *fiber.App) {
	if err := a.Listen(os.Getenv("SERVER_URL")); err != nil {
		log.Printf("Could not start server: %v", err)
	}
}
