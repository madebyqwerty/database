package users

import (
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string         `gorm:"size:255;not null" json:"name"`
	Password string         `gorm:"not null" json:"password"`
	Roles    pq.StringArray `gorm:"type:text" json:"roles"`
}
