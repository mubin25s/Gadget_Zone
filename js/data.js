const DB_KEYS = {
    USERS: 'hr_gadget_users',
    CURRENT_USER: 'hr_gadget_current_user',
    CONTACT_INFO: 'hr_gadget_contact_info',
    CART: 'hr_gadget_cart'
};

// Firestore collections
const COLLECTIONS = {
    PRODUCTS: 'products',
    ORDERS: 'orders',
    USERS: 'users'
};

const DEFAULT_ADMIN = {
    id: 'admin_001',
    name: 'Super Admin',
    email: 'hrgadgetzone11@gmail.com',
    password: '@HR119360',
    role: 'admin',
    createdAt: new Date().toISOString()
};

const DEFAULT_CONTACT_INFO = {
    email: 'hrgadgetzone11@gmail.com',
    phone: '017xxxxxxxx',
    address: 'Dhaka, Bangladesh',
    shopName: 'HR Gadget Zone'
};

// Initialize Data if empty
function initializeData() {
    let users = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');

    // Check if USERS is empty OR if we need to ensure Admin exists
    if (users.length === 0) {
        console.log('Initializing Users...');
        users = [DEFAULT_ADMIN];
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    } else {
        // Only add admin if one doesn't exist at all
        const adminExists = users.some(u => u.role === 'admin');

        if (!adminExists) {
            console.log('Restoring missing Admin...');
            users.push(DEFAULT_ADMIN);
            localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
        }
    }

    if (!localStorage.getItem(DB_KEYS.CONTACT_INFO)) {
        console.log('Initializing Contact Info...');
        localStorage.setItem(DB_KEYS.CONTACT_INFO, JSON.stringify(DEFAULT_CONTACT_INFO));
    }
}

// Data Access Helpers - Firebase Version
const db = {
    // Products - Firebase Firestore
    getProducts: async () => {
        try {
            if (!window.firebaseDB) {
                console.error('❌ Firebase not initialized. Please check firebase-config.js');
                return [];
            }
            const snapshot = await window.firebaseDB.collection(COLLECTIONS.PRODUCTS).get();
            const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log(`✅ Loaded ${products.length} products from Firebase`);
            return products;
        } catch (error) {
            console.error('❌ Error fetching products:', error);
            console.error('Make sure Firebase Firestore is enabled and has products collection');
            return [];
        }
    },

    addProduct: async (product) => {
        try {
            const docRef = await window.firebaseDB.collection(COLLECTIONS.PRODUCTS).add({
                ...product,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Product added with ID:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    },

    deleteProduct: async (productId) => {
        try {
            await window.firebaseDB.collection(COLLECTIONS.PRODUCTS).doc(productId).delete();
            console.log('Product deleted:', productId);
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },

    // Orders - Firebase Firestore
    getOrders: async () => {
        try {
            const snapshot = await window.firebaseDB.collection(COLLECTIONS.ORDERS).orderBy('date', 'desc').get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    },

    addOrder: async (order) => {
        try {
            const docRef = await window.firebaseDB.collection(COLLECTIONS.ORDERS).add({
                ...order,
                date: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Order added with ID:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error adding order:', error);
            throw error;
        }
    },

    updateOrderStatus: async (orderId, status) => {
        try {
            await window.firebaseDB.collection(COLLECTIONS.ORDERS).doc(orderId).update({ status });
            console.log('Order status updated:', orderId, status);
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    },

    // Users - LocalStorage (for simplicity, can migrate to Firebase Auth later)
    getUsers: () => JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]'),
    saveUsers: (users) => localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users)),

    // Current User - Session Storage
    getCurrentUser: () => JSON.parse(sessionStorage.getItem(DB_KEYS.CURRENT_USER)),
    saveCurrentUser: (user) => sessionStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user)),
    logout: () => sessionStorage.removeItem(DB_KEYS.CURRENT_USER),

    // Contact Info - LocalStorage
    getContactInfo: () => JSON.parse(localStorage.getItem(DB_KEYS.CONTACT_INFO) || JSON.stringify(DEFAULT_CONTACT_INFO)),
    saveContactInfo: (info) => localStorage.setItem(DB_KEYS.CONTACT_INFO, JSON.stringify(info)),

    // Cart - LocalStorage (cart is device-specific)
    getCart: () => JSON.parse(localStorage.getItem(DB_KEYS.CART) || '[]'),
    saveCart: (cart) => localStorage.setItem(DB_KEYS.CART, JSON.stringify(cart)),
    clearCart: () => localStorage.removeItem(DB_KEYS.CART)
};

// Auto-run init
initializeData();