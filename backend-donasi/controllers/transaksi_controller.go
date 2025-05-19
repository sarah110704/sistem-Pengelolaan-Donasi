package controllers

import (
	"backend-donasi/config"
	"backend-donasi/models"
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var transaksiCollection *mongo.Collection

func InitTransaksiCollection() {
	transaksiCollection = config.DB.Collection("transaksi")
}

// 🔹 POST /api/transaksi
func CreateTransaksi(c *fiber.Ctx) error {
	var transaksi models.Transaksi
	if err := c.BodyParser(&transaksi); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Gagal parsing body"})
	}

	if transaksi.DonaturID.IsZero() {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "donatur_id tidak boleh kosong"})
	}
	if transaksi.KategoriID.IsZero() {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "kategori_id tidak boleh kosong"})
	}
	if transaksi.Jumlah <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Jumlah harus lebih dari 0"})
	}
	if transaksi.Jenis != "masuk" && transaksi.Jenis != "keluar" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Jenis harus 'masuk' atau 'keluar'"})
	}

	transaksi.ID = primitive.NewObjectID()
	transaksi.Tanggal = time.Now()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := transaksiCollection.InsertOne(ctx, transaksi)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal menyimpan transaksi"})
	}

	return c.Status(fiber.StatusCreated).JSON(transaksi)
}

// 🔹 GET /api/transaksi
func GetAllTransaksi(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := transaksiCollection.Find(ctx, bson.M{})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal mengambil data transaksi"})
	}
	defer cursor.Close(ctx)

	var transaksis []models.Transaksi
	if err := cursor.All(ctx, &transaksis); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal decode transaksi"})
	}

	return c.JSON(transaksis)
}

// 🔹 GET /api/transaksi/total
func GetTotalSaldo(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := transaksiCollection.Find(ctx, bson.M{})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal ambil data transaksi"})
	}
	defer cursor.Close(ctx)

	var masuk, keluar int64 = 0, 0

	for cursor.Next(ctx) {
		var trx models.Transaksi
		if err := cursor.Decode(&trx); err != nil {
			continue
		}
		if trx.Jenis == "masuk" {
			masuk += trx.Jumlah
		} else if trx.Jenis == "keluar" {
			keluar += trx.Jumlah
		}
	}

	return c.JSON(fiber.Map{
		"total_masuk":  masuk,
		"total_keluar": keluar,
		"saldo":        masuk - keluar,
	})
}

// 🔹 GET /api/transaksi/jenis/:jenis
func GetTransaksiByJenis(c *fiber.Ctx) error {
	jenis := c.Params("jenis")
	if jenis != "masuk" && jenis != "keluar" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Jenis harus 'masuk' atau 'keluar'"})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := transaksiCollection.Find(ctx, bson.M{"jenis": jenis})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal ambil data transaksi"})
	}
	defer cursor.Close(ctx)

	var filtered []models.Transaksi
	if err := cursor.All(ctx, &filtered); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal decode data"})
	}

	return c.JSON(filtered)
}

// 🔹 PUT /api/transaksi/:id
func UpdateTransaksi(c *fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
	}

	var update models.Transaksi
	if err := c.BodyParser(&update); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Gagal parsing data"})
	}

	if update.DonaturID.IsZero() {
		return c.Status(400).JSON(fiber.Map{"error": "donatur_id tidak boleh kosong"})
	}
	if update.KategoriID.IsZero() {
		return c.Status(400).JSON(fiber.Map{"error": "kategori_id tidak boleh kosong"})
	}
	if update.Jumlah <= 0 {
		return c.Status(400).JSON(fiber.Map{"error": "Jumlah harus lebih dari 0"})
	}
	if update.Jenis != "masuk" && update.Jenis != "keluar" {
		return c.Status(400).JSON(fiber.Map{"error": "Jenis harus 'masuk' atau 'keluar'"})
	}

	updateData := bson.M{
		"donatur_id":  update.DonaturID,
		"kategori_id": update.KategoriID,
		"jumlah":      update.Jumlah,
		"jenis":       update.Jenis,
		"keterangan":  update.Keterangan,
	}

	result, err := transaksiCollection.UpdateOne(
		context.Background(),
		bson.M{"_id": objID},
		bson.M{"$set": updateData},
	)
	if err != nil || result.MatchedCount == 0 {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal update atau ID tidak ditemukan"})
	}

	return c.JSON(fiber.Map{"message": "Transaksi berhasil diupdate"})
}
