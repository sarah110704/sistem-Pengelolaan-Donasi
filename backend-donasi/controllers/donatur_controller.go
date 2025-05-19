package controllers

import (
	"backend-donasi/config"
	"backend-donasi/models"
	"context"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var donaturCollection *mongo.Collection

func InitDonaturCollection() {
	donaturCollection = config.DB.Collection("donatur")
	log.Println("✅ donaturCollection siap digunakan")
}

func CreateDonatur(c *fiber.Ctx) error {
	var donatur models.Donatur
	if err := c.BodyParser(&donatur); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Gagal parsing body"})
	}

	if donatur.Nama == "" || donatur.Email == "" || donatur.NoHP == "" || donatur.Alamat == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Semua field wajib diisi"})
	}

	donatur.ID = primitive.NewObjectID()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := donaturCollection.InsertOne(ctx, donatur)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal menyimpan donatur"})
	}

	return c.Status(fiber.StatusCreated).JSON(donatur)
}

func GetAllDonatur(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := donaturCollection.Find(ctx, bson.M{})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal mengambil data"})
	}
	defer cursor.Close(ctx)

	var list []models.Donatur
	if err := cursor.All(ctx, &list); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal decode data"})
	}

	return c.JSON(list)
}

func GetDonaturByID(c *fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
	}

	var donatur models.Donatur
	err = donaturCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&donatur)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Donatur tidak ditemukan"})
	}

	return c.JSON(donatur)
}

func UpdateDonatur(c *fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
	}

	var update models.Donatur
	if err := c.BodyParser(&update); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Gagal parsing data"})
	}

	if update.Nama == "" || update.Email == "" || update.NoHP == "" || update.Alamat == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Semua field wajib diisi"})
	}

	updateData := bson.M{
		"nama":   update.Nama,
		"email":  update.Email,
		"no_hp":  update.NoHP,
		"alamat": update.Alamat,
	}

	result, err := donaturCollection.UpdateOne(context.Background(), bson.M{"_id": objID}, bson.M{"$set": updateData})
	if err != nil || result.MatchedCount == 0 {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal update atau ID tidak ditemukan"})
	}

	return c.JSON(fiber.Map{"message": "Donatur berhasil diupdate"})
}

func DeleteDonatur(c *fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
	}

	result, err := donaturCollection.DeleteOne(context.Background(), bson.M{"_id": objID})
	if err != nil || result.DeletedCount == 0 {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal hapus atau ID tidak ditemukan"})
	}

	return c.JSON(fiber.Map{"message": "Donatur berhasil dihapus"})
}
