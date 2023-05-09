package students

import (
	"github.com/madebyqwerty/database-service/api/users"
	"gorm.io/gorm"
)

type Student struct {
	gorm.Model
	UserID uint
	User   users.User `gorm:"foreignKey:UserID;not null" json:"user_id"`
}
