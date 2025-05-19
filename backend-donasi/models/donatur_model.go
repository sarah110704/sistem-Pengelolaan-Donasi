package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Donatur struct {
	ID     primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Nama   string             `bson:"nama" json:"nama"`
	Email  string             `bson:"email" json:"email"`
	NoHP   string             `bson:"no_hp" json:"no_hp"`
	Alamat string             `bson:"alamat" json:"alamat"`
}
