# PBO LKS — Portofolio Praktikum

- Nama : Bona Tua Sagala
- NIM : H1101251074
- Kelas: A

## Deskripsi
REST API Perpustakaan yang dibangun dengan PHP modern (PSR-4 + Composer), prinsip SOLID, arsitektur MVC, dan MySQL, dengan frontend terpisah menggunakan Tailwind CSS.

## Fitur
- CRUD Buku (GET, POST, PUT, DELETE)
- CRUD Kategori
- Validasi input dan error handling (404, 405, 422)
- Frontend: Dashboard, Halaman Buku, Halaman Kategori
- Penerapan SOLID, Repository Pattern, Dependency Injection, dan Front Controller

## Cara Menjalankan

### Backend
```bash
cd rest-api-perpustakaan
composer install
copy .env.example .env
mysql -u root -p < database/schema.sql
php -S localhost:8000 -t public
```
Sesuaikan `DB_USERNAME` dan `DB_PASSWORD` di file `.env` dengan kredensial MySQL.

### Frontend
```bash
cd frontend-perpustakaan
php -S localhost:3000
```
Buka http://localhost:3000 di browser.

## Screenshot Final
- [Dashboard](screenshot-final/dashboard.png)
- [Halaman Buku](screenshot-final/halaman-buku.png)
- [Halaman Kategori](screenshot-final/halaman-kategori.png)

## Daftar Pertemuan
- [x] [Pertemuan 1 — Setup & Database](pertemuan-01/)
- [x] [Pertemuan 2 — Core OOP](pertemuan-02/)
- [x] [Pertemuan 3 — Framework & Routing](pertemuan-03/)
- [x] [Pertemuan 4 — Testing Backend](pertemuan-04/)
- [x] [Pertemuan 5 — CRUD Kategori](pertemuan-05/)
- [x] [Pertemuan 6 — Frontend](pertemuan-06/)
- [x] [Pertemuan 7 — Integrasi & Finalisasi](pertemuan-07/)

