const BooksPage = {
    container: null,
    books: [],

    async render(container) {
        this.container = container;
        container.innerHTML = '<p class="text-gray-500">Memuat data buku...</p>';
        this.books = await BookService.getAll();
        this.draw();
    },

    draw() {
        const rows = this.books.length
            ? this.books.map(b => `
                <tr class="border-t">
                    <td class="px-4 py-3">${escapeHtml(b.id)}</td>
                    <td class="px-4 py-3">${escapeHtml(b.judul)}</td>
                    <td class="px-4 py-3">${escapeHtml(b.penulis)}</td>
                    <td class="px-4 py-3">${escapeHtml(b.tahun)}</td>
                    <td class="px-4 py-3">${escapeHtml(b.stok)}</td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <button data-action="edit" data-id="${escapeHtml(b.id)}"
                            class="px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-sm">Ubah</button>
                        <button data-action="delete" data-id="${escapeHtml(b.id)}"
                            class="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm">Hapus</button>
                    </td>
                </tr>`).join('')
            : '<tr><td colspan="6" class="px-4 py-6 text-center text-gray-500">Belum ada buku.</td></tr>';

        this.container.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold">Daftar Buku</h2>
                <button id="btn-add-book"
                    class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">+ Tambah Buku</button>
            </div>
            <div class="bg-white rounded-lg shadow overflow-x-auto">
                <table class="min-w-full text-left">
                    <thead class="bg-gray-50 text-gray-600 text-sm">
                        <tr>
                            <th class="px-4 py-3">ID</th>
                            <th class="px-4 py-3">Judul</th>
                            <th class="px-4 py-3">Penulis</th>
                            <th class="px-4 py-3">Tahun</th>
                            <th class="px-4 py-3">Stok</th>
                            <th class="px-4 py-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;

        this.container.querySelector('#btn-add-book')
            .addEventListener('click', () => this.openForm());

        this.container.querySelectorAll('[data-action="edit"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const book = this.books.find(b => String(b.id) === btn.dataset.id);
                this.openForm(book);
            });
        });

        this.container.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const book = this.books.find(b => String(b.id) === btn.dataset.id);
                this.remove(book);
            });
        });
    },

    openForm(book = null) {
        const isEdit = book !== null;

        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        backdrop.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4">
                <h2 class="text-lg font-semibold mb-4">${isEdit ? 'Ubah Buku' : 'Tambah Buku'}</h2>
                <form id="book-form" class="space-y-3">
                    <div>
                        <label class="block text-sm mb-1">Judul</label>
                        <input name="judul" type="text" value="${isEdit ? escapeHtml(book.judul) : ''}"
                            class="w-full border rounded px-3 py-2">
                    </div>
                    <div>
                        <label class="block text-sm mb-1">Penulis</label>
                        <input name="penulis" type="text" value="${isEdit ? escapeHtml(book.penulis) : ''}"
                            class="w-full border rounded px-3 py-2">
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-sm mb-1">Tahun</label>
                            <input name="tahun" type="number" value="${isEdit ? escapeHtml(book.tahun) : ''}"
                                class="w-full border rounded px-3 py-2">
                        </div>
                        <div>
                            <label class="block text-sm mb-1">Stok</label>
                            <input name="stok" type="number" value="${isEdit ? escapeHtml(book.stok) : ''}"
                                class="w-full border rounded px-3 py-2">
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 pt-2">
                        <button type="button" id="btn-cancel"
                            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Batal</button>
                        <button type="submit"
                            class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">Simpan</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(backdrop);

        const close = () => backdrop.remove();
        backdrop.querySelector('#btn-cancel').addEventListener('click', close);
        backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

        backdrop.querySelector('#book-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const f = e.target;
            const data = {
                judul:   f.judul.value.trim(),
                penulis: f.penulis.value.trim(),
                tahun:   parseInt(f.tahun.value, 10) || 0,
                stok:    parseInt(f.stok.value, 10) || 0,
            };

            try {
                if (isEdit) {
                    await BookService.update(book.id, data);
                    showToast('Buku berhasil diperbarui');
                } else {
                    await BookService.create(data);
                    showToast('Buku berhasil ditambahkan');
                }
                close();
                await this.render(this.container);
            } catch (err) {
                showToast(err.message, 'error');
            }
        });
    },

    async remove(book) {
        if (!book) return;
        if (!confirm('Hapus buku "' + book.judul + '"?')) return;

        try {
            await BookService.remove(book.id);
            showToast('Buku berhasil dihapus');
            await this.render(this.container);
        } catch (err) {
            showToast(err.message, 'error');
        }
    },
};