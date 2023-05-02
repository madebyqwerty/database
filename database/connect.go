package database

import (
	"errors"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect() error {
	dsn := os.Getenv("DB_DSN")

	if dsn == "" {
		return errors.New("DB_DSN is not set")
	}

	_, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		return err
	}

	return nil
}
