// medsos.js

/**
 * Data tautan media sosial
 * GANTI URL di SINI dengan tautan medsos HanzzOffc yang sebenarnya.
 */
const socialLinks = [
    { name: 'WhatsApp', iconClass: 'fa-brands fa-whatsapp', url: 'https://wa.me/6283176187861' },
    { name: 'Telegram', iconClass: 'fa-brands fa-telegram', url: 'https://t.me/hanzzdevs' },
    { name: 'Instagram', iconClass: 'fa-brands fa-instagram', url: 'https://instagram.com/16hanzz' },
    { name: 'YouTube', iconClass: 'fa-brands fa-youtube', url: 'https://youtube.com/devhanzz' }
];

/**
 * Fungsi untuk membuat dan menempatkan ikon media sosial.
 */
function displaySocialMediaLinks() {
    // Kita ambil elemen <main> karena kita ingin ikon muncul setelah footer
    const mainElement = document.querySelector('main');
    const footerElement = document.getElementById('main-footer');

    if (!mainElement || !footerElement) {
        console.error("Elemen 'main' atau 'main-footer' tidak ditemukan.");
        return;
    }

    // 1. Buat kontainer untuk ikon
    const socialContainer = document.createElement('div');
    // Class ini digunakan untuk styling CSS
    socialContainer.className = 'social-links'; 

    // 2. Iterasi data sosial media dan buat tautannya
    socialLinks.forEach(item => {
        const anchor = document.createElement('a');
        anchor.href = item.url;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.title = item.name;

        // Buat elemen ikon Font Awesome
        const icon = document.createElement('i');
        icon.className = item.iconClass;

        anchor.appendChild(icon);
        socialContainer.appendChild(anchor);
    });

    // 3. Masukkan kontainer ikon setelah elemen footer utama
    // Kita masukkan socialContainer ke dalam main, setelah footer
    footerElement.after(socialContainer);
    
    console.log("Ikon media sosial berhasil ditambahkan oleh medsos.js.");
}

// Jalankan fungsi setelah semua elemen HTML dimuat
document.addEventListener('DOMContentLoaded', displaySocialMediaLinks);
