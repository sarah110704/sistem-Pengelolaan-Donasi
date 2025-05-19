package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Kategori struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Nama        string             `bson:"nama" json:"nama"`
	Deskripsi   string             `bson:"deskripsi" json:"deskripsi"`
}
