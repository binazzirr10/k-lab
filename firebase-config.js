// ========== НАСТРОЙКИ FIREBASE ==========
const firebaseConfig = {
    apiKey: "AIzaSyCh3-Zt51KVS5d_nZNjNfZMsSyAyCC1xxA",
    authDomain: "k-lab-18075.firebaseapp.com",
    projectId: "k-lab-18075",
    storageBucket: "k-lab-18075.firebasestorage.app",
    messagingSenderId: "1044910537486",
    appId: "1:1044910537486:web:539f48b621f1094b85755f"
};

// Инициализация Firebase (совместимый режим)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

console.log('✅ Firebase подключен!');