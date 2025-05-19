package routes

import (
	"github.com/gofiber/fiber/v2"
	"backend-donasi/controllers"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	// Donatur
	api.Post("/donatur", controllers.CreateDonatur)
	api.Get("/donatur", controllers.GetAllDonatur)
	api.Get("/donatur/:id", controllers.GetDonaturByID)
	api.Put("/donatur/:id", controllers.UpdateDonatur)
	api.Delete("/donatur/:id", controllers.DeleteDonatur)

	// Transaksi
	api.Post("/transaksi", controllers.CreateTransaksi)
	api.Get("/transaksi", controllers.GetAllTransaksi)
	api.Get("/transaksi/total", controllers.GetTotalSaldo)
	api.Get("/transaksi/jenis/:jenis", controllers.GetTransaksiByJenis)
	api.Put("/transaksi/:id", controllers.UpdateTransaksi)

	// Kategori
	api.Post("/kategori", controllers.CreateKategori)
	api.Get("/kategori", controllers.GetAllKategori)
	api.Get("/kategori/:id", controllers.GetKategoriByID)
	api.Put("/kategori/:id", controllers.UpdateKategori)
	api.Delete("/kategori/:id", controllers.DeleteKategori)
}
