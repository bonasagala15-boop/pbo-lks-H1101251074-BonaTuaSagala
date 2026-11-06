class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async request(method, path, body = null) {
        const options = {
            method,
            headers: { 'Accept': 'application/json' },
        };

        if (body !== null) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }

        let response;
        try {
            response = await fetch(this.baseUrl + path, options);
        } catch (err) {
            throw new Error('Tidak dapat terhubung ke server. Pastikan backend berjalan di localhost:8000.');
        }

        let json = null;
        try {
            json = await response.json();
        } catch (e) {
            // response bukan JSON
        }

        if (!response.ok || (json && json.success === false)) {
            throw new Error((json && json.message) || 'Terjadi kesalahan (HTTP ' + response.status + ')');
        }

        return json;
    }

    get(path)          { return this.request('GET', path); }
    post(path, body)   { return this.request('POST', path, body); }
    put(path, body)    { return this.request('PUT', path, body); }
    delete(path)       { return this.request('DELETE', path); }
}

const api = new ApiClient(BASE_URL);

// Service Buku
const BookService = {
    getAll: async ()         => (await api.get('/books')).data,
    getById: async (id)      => (await api.get('/books/' + id)).data,
    create: async (data)     => (await api.post('/books', data)).data,
    update: async (id, data) => (await api.put('/books/' + id, data)).data,
    remove: async (id)       => api.delete('/books/' + id),
};

// Service Kategori
const CategoryService = {
    getAll: async ()         => (await api.get('/categories')).data,
    getById: async (id)      => (await api.get('/categories/' + id)).data,
    create: async (data)     => (await api.post('/categories', data)).data,
    update: async (id, data) => (await api.put('/categories/' + id, data)).data,
    remove: async (id)       => api.delete('/categories/' + id),
};