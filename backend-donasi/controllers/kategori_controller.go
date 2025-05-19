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

var kategoriCollection *mongo.Collection

func InitKategoriCollection() {
	kategoriCollection = config.DB.Collection("kategori")
}

func CreateKategori(c *fiber.Ctx) error {
	var kategori models.Kategori
	if err := c.BodyParser(&kategori); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Gagal parsing body"})
	}

	if kategori.Nama == "" || kategori.Deskripsi == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Field nama dan deskripsi wajib diisi"})
	}

	kategori.ID = primitive.NewObjectID()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := kategoriCollection.InsertOne(ctx, kategori)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal menyimpan kategori"})
	}

	return c.Status(fiber.StatusCreated).JSON(kategori)
}

func GetAllKategori(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := kategoriCollection.Find(ctx, bson.M{})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal mengambil data"})
	}
	defer cursor.Close(ctx)

	var list []models.Kategori
	if err := cursor.All(ctx, &list); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal decode data"})
	}

	return c.JSON(list)
}

func GetKategoriByID(c *fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
	}

	var kategori models.Kategori
	err = kategoriCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&kategori)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Kategori tidak ditemukan"})
	}

	return c.JSON(kategori)
}

func UpdateKategori(c *fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
	}

	var update models.Kategori
	if err := c.BodyParser(&update); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Gagal parsing data"})
	}

	if update.Nama == "" || update.Deskripsi == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Nama dan deskripsi tidak boleh kosong"})
	}

	updateData := bson.M{
		"nama":      update.Nama,
		"deskripsi": update.Deskripsi,
	}

	result, err := kategoriCollection.UpdateOne(
		context.Background(),
		bson.M{"_id": objID},
		bson.M{"$set": updateData},
	)
	if err != nil || result.MatchedCount == 0 {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal update atau ID tidak ditemukan"})
	}

	return c.JSON(fiber.Map{"message": "Kategori berhasil diupdate"})
}

func DeleteKategori(c *fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
	}

	result, err := kategoriCollection.DeleteOne(context.Background(), bson.M{"_id": objID})
	if err != nil || result.DeletedCount == 0 {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal hapus atau ID tidak ditemukan"})
	}

	return c.JSON(fiber.Map{"message": "Kategori berhasil dihapus"})
}
