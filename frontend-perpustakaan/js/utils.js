// Mencegah XSS: ubah karakter khusus HTML menjadi teks biasa
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Notifikasi toast di kanan atas. type: 'success' | 'error'
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const color = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    const toast = document.createElement('div');
    toast.className = 'toast ' + color + ' text-white px-4 py-3 rounded shadow-lg';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}