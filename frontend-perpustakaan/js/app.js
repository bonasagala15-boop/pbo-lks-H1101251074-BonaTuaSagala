// Daftar halaman. null = halaman belum dibuat (Kategori dibuat di Langkah 19)
const routes = {
    '/':           typeof DashboardPage  !== 'undefined' ? DashboardPage  : null,
    '/books':      typeof BooksPage      !== 'undefined' ? BooksPage      : null,
    '/categories': typeof CategoriesPage !== 'undefined' ? CategoriesPage : null,
};

async function navigate() {
    const app = document.getElementById('app');
    const path = (window.location.hash || '#/').replace(/^#/, '') || '/';

    // Tandai menu yang aktif
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.route === path);
    });

    const page = routes[path];

    if (page === undefined) {
        app.innerHTML = '<p class="text-red-600">Halaman tidak ditemukan.</p>';
        return;
    }
    if (page === null) {
        app.innerHTML = '<p class="text-gray-500">Halaman ini belum tersedia.</p>';
        return;
    }

    try {
        await page.render(app);
    } catch (err) {
        app.innerHTML = '<p class="text-red-600">Gagal memuat halaman: ' + escapeHtml(err.message) + '</p>';
        showToast(err.message, 'error');
    }
}

window.addEventListener('hashchange', navigate);
navigate();