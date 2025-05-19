package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type Transaksi struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	DonaturID  primitive.ObjectID `bson:"donatur_id" json:"donatur_id"`
	KategoriID primitive.ObjectID `bson:"kategori_id" json:"kategori_id"` 
	Jumlah     int64              `bson:"jumlah" json:"jumlah"`
	Jenis      string             `bson:"jenis" json:"jenis"` // masuk / keluar
	Keterangan string             `bson:"keterangan" json:"keterangan"`
	Tanggal    time.Time          `bson:"tanggal" json:"tanggal"`
}
