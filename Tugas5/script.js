// State Data Proyek
let cart = [];

// DOM Elements
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItemsList = document.getElementById('cart-items-list');
const cartTotalPrice = document.getElementById('cart-total-price');
const btnCheckout = document.getElementById('btn-checkout');

const receiptModal = document.getElementById('receipt-modal');
const closeReceipt = document.getElementById('close-receipt');
const receiptInv = document.getElementById('receipt-inv');
const receiptDate = document.getElementById('receipt-date');
const receiptMethod = document.getElementById('receipt-method');
const receiptItems = document.getElementById('receipt-items');
const receiptTotal = document.getElementById('receipt-total');
const toast = document.getElementById('toast');

// Format Rupiah
function formatRupiah(angka) {
    return 'Rp ' + angka.toLocaleString('id-ID');
}

// Show Toast Notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => { toast.classList.add('hidden'); }, 2500);
}

// 1. Tambah ke Keranjang
document.querySelectorAll('.btn-add-cart').forEach(button => {
    button.addEventListener('click', function() {
        const name = this.getAttribute('data-name');
        const price = parseInt(this.getAttribute('data-price'));

        // Cek apakah item sudah ada di keranjang
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ name, price, qty: 1 });
        }

        updateCartUI();
        showToast(`🛒 ${name} dimasukkan ke keranjang!`);
    });
});

// 2. Update Tampilan Keranjang
function updateCartUI() {
    // Hitung total item & total harga
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalHarga = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    cartCount.textContent = totalItems;
    cartTotalPrice.textContent = formatRupiah(totalHarga);

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p class="empty-msg">Keranjang Anda masih kosong.</p>';
        btnCheckout.disabled = true;
    } else {
        btnCheckout.disabled = false;
        cartItemsList.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong>
                    <br><small style="color:#64748b">${formatRupiah(item.price)} x ${item.qty}</small>
                </div>
                <span>${formatRupiah(item.price * item.qty)}</span>
            </div>
        `).join('');
    }
}

// Open & Close Modal Keranjang
cartBtn.addEventListener('click', () => cartModal.classList.remove('hidden'));
closeCart.addEventListener('click', () => cartModal.classList.add('hidden'));

// 3. Proses Checkout & Bikin Resi Tiket Pembayaran
btnCheckout.addEventListener('click', function() {
    // Ambil opsi pembayaran terpilih
    const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
    const totalHarga = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    // Set Data ke Tiket Resi
    const randomInvoice = 'INV-' + Math.floor(Math.random() * 90000 + 10000);
    const today = new Array(new Date().toLocaleDateString('id-ID')).join('');
    
    receiptInv.textContent = randomInvoice;
    receiptDate.textContent = today;
    receiptMethod.textContent = selectedPayment;
    receiptTotal.textContent = formatRupiah(totalHarga);

    // List Item di Resi
    receiptItems.innerHTML = cart.map(item => `
        <div class="receipt-row">
            <span>${item.name} (x${item.qty})</span>
            <span>${formatRupiah(item.price * item.qty)}</span>
        </div>
    `).join('');

    // Tutup Modal Keranjang, Buka Struk Resi Pembayaran
    cartModal.classList.add('hidden');
    receiptModal.classList.remove('hidden');

    // Kosongkan keranjang kembali
    cart = [];
    updateCartUI();
});

// Close Resi
closeReceipt.addEventListener('click', () => receiptModal.classList.add('hidden'));