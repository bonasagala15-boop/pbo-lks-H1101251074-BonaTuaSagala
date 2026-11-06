const CategoriesPage = {
    container: null,
    categories: [],

    async render(container) {
        this.container = container;
        container.innerHTML = '<p class="text-gray-500">Memuat data kategori...</p>';
        this.categories = await CategoryService.getAll();
        this.draw();
    },

    draw() {
        const rows = this.categories.length
            ? this.categories.map(c => `
                <tr class="border-t">
                    <td class="px-4 py-3">${escapeHtml(c.id)}</td>
                    <td class="px-4 py-3">${escapeHtml(c.nama)}</td>
                    <td class="px-4 py-3">${escapeHtml(c.deskripsi)}</td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <button data-action="edit" data-id="${escapeHtml(c.id)}"
                            class="px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-sm">Ubah</button>
                        <button data-action="delete" data-id="${escapeHtml(c.id)}"
                            class="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm">Hapus</button>
                    </td>
                </tr>`).join('')
            : '<tr><td colspan="4" class="px-4 py-6 text-center text-gray-500">Belum ada kategori.</td></tr>';

        this.container.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold">Daftar Kategori</h2>
                <button id="btn-add-category"
                    class="px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white">+ Tambah Kategori</button>
            </div>
            <div class="bg-white rounded-lg shadow overflow-x-auto">
                <table class="min-w-full text-left">
                    <thead class="bg-gray-50 text-gray-600 text-sm">
                        <tr>
                            <th class="px-4 py-3">ID</th>
                            <th class="px-4 py-3">Nama</th>
                            <th class="px-4 py-3">Deskripsi</th>
                            <th class="px-4 py-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;

        this.container.querySelector('#btn-add-category')
            .addEventListener('click', () => this.openForm());

        this.container.querySelectorAll('[data-action="edit"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const cat = this.categories.find(c => String(c.id) === btn.dataset.id);
                this.openForm(cat);
            });
        });

        this.container.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const cat = this.categories.find(c => String(c.id) === btn.dataset.id);
                this.remove(cat);
            });
        });
    },

    openForm(category = null) {
        const isEdit = category !== null;

        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        backdrop.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4">
                <h2 class="text-lg font-semibold mb-4">${isEdit ? 'Ubah Kategori' : 'Tambah Kategori'}</h2>
                <form id="category-form" class="space-y-3">
                    <div>
                        <label class="block text-sm mb-1">Nama</label>
                        <input name="nama" type="text" value="${isEdit ? escapeHtml(category.nama) : ''}"
                            class="w-full border rounded px-3 py-2">
                    </div>
                    <div>
                        <label class="block text-sm mb-1">Deskripsi</label>
                        <textarea name="deskripsi" rows="3"
                            class="w-full border rounded px-3 py-2">${isEdit ? escapeHtml(category.deskripsi) : ''}</textarea>
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

        backdrop.querySelector('#category-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const f = e.target;
            const data = {
                nama:      f.nama.value.trim(),
                deskripsi: f.deskripsi.value.trim(),
            };

            try {
                if (isEdit) {
                    await CategoryService.update(category.id, data);
                    showToast('Kategori berhasil diperbarui');
                } else {
                    await CategoryService.create(data);
                    showToast('Kategori berhasil ditambahkan');
                }
                close();
                await this.render(this.container);
            } catch (err) {
                showToast(err.message, 'error');
            }
        });
    },

    async remove(category) {
        if (!category) return;
        if (!confirm('Hapus kategori "' + category.nama + '"?')) return;

        try {
            await CategoryService.remove(category.id);
            showToast('Kategori berhasil dihapus');
            await this.render(this.container);
        } catch (err) {
            showToast(err.message, 'error');
        }
    },
};