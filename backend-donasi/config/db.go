package config

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Database

func ConnectDB() {
	// Ambil connection string dari .env
	uri := os.Getenv("MONGOSTRING")
	if uri == "" {
		log.Fatal("❌ MONGOSTRING tidak ditemukan di .env")
	}

	// Buat client MongoDB
	client, err := mongo.NewClient(options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal("❌ Gagal buat client MongoDB:", err)
	}

	// Connect dengan timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Fatal("❌ Gagal connect ke MongoDB:", err)
	}

	// Simpan koneksi ke variabel global
	DB = client.Database("donasi_db")
	fmt.Println("✅ Terhubung ke MongoDB (donasi_db)")
}
