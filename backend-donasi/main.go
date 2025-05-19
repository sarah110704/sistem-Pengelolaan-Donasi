package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"

	"backend-donasi/config"
	"backend-donasi/controllers"
	"backend-donasi/routes"
)

func main() {
	// ✅ Load file .env (jika ada)
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  File .env tidak ditemukan, menggunakan konfigurasi default")
	}

	// ✅ Inisialisasi Fiber
	app := fiber.New()

	// ✅ Middleware CORS
	config.SetupCORS(app)

	// ✅ Koneksi ke MongoDB
	config.ConnectDB()

	// ✅ Inisialisasi koleksi Mongo
	controllers.InitDonaturCollection()
	controllers.InitTransaksiCollection()
	controllers.InitKategoriCollection()

	// ✅ Routing API
	routes.SetupRoutes(app)

	// ✅ Endpoint root
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Server donasi berjalan! ✅",
		})
	})

	// ✅ Menentukan port dari env atau default 3000
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	log.Printf("🚀 Server berjalan di http://localhost:%s", port)
	log.Fatal(app.Listen(":" + port))
}
