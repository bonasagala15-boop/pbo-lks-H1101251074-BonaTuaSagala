const DashboardPage = {
    async render(container) {
        container.innerHTML = '<p class="text-gray-500">Memuat dashboard...</p>';

        const [books, categories] = await Promise.all([
            BookService.getAll(),
            CategoryService.getAll(),
        ]);

        // 5 buku terbaru (ID terbesar)
        const latest = [...books].sort((a, b) => b.id - a.id).slice(0, 5);

        const items = latest.length
            ? latest.map(b => `
                <li class="py-3 flex justify-between items-center">
                    <div>
                        <p class="font-medium">${escapeHtml(b.judul)}</p>
                        <p class="text-sm text-gray-500">${escapeHtml(b.penulis)} · ${escapeHtml(b.tahun)}</p>
                    </div>
                    <span class="text-sm text-gray-600">Stok: ${escapeHtml(b.stok)}</span>
                </li>`).join('')
            : '<li class="py-3 text-gray-500">Belum ada buku.</li>';

        container.innerHTML = `
            <h2 class="text-xl font-semibold mb-4">Dashboard</h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div class="bg-blue-600 text-white rounded-lg shadow p-6">
                    <p class="text-sm opacity-90">Total Buku</p>
                    <p class="text-4xl font-bold mt-1">${books.length}</p>
                </div>
                <div class="bg-orange-500 text-white rounded-lg shadow p-6">
                    <p class="text-sm opacity-90">Kategori</p>
                    <p class="text-4xl font-bold mt-1">${categories.length}</p>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="font-semibold mb-2">Buku Terbaru</h3>
                <ul class="divide-y">${items}</ul>
            </div>
        `;
    },
};