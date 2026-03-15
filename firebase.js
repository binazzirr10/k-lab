// ========== ИНИЦИАЛИЗАЦИЯ FIREBASE ==========
const firebaseConfig = {
    apiKey: "AIzaSyCh3-Zt51KVS5d_nZNjNfZMsSyAyCC1xxA",
    authDomain: "k-lab-18075.firebaseapp.com",
    projectId: "k-lab-18075",
    storageBucket: "k-lab-18075.firebasestorage.app",
    messagingSenderId: "1044910537486",
    appId: "1:1044910537486:web:539f48b621f1094b85755f"
};

// ⚠️ САМОЕ ГЛАВНОЕ - инициализация!
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

console.log('✅ Firebase успешно инициализирован!');

// ========== ПРОВЕРКА СТАТУСА ==========
window.checkUserStatus = async function(uid) {
    try {
        console.log('🔍 Проверяем статус для UID:', uid);
        
        if (!uid) {
            console.log('❌ UID отсутствует');
            return { success: false, error: "UID не указан" };
        }
        
        const userDoc = await db.collection("users").doc(uid).get();
        
        if (!userDoc.exists) {
            console.log('❌ Документ пользователя не найден');
            return { success: true, redirectTo: "payment.html" };
        }
        
        const userData = userDoc.data();
        console.log('👤 Данные пользователя:', userData);
        
        // Проверка роли
        if (userData.role === "admin") {
            console.log('👉 Админ → admin.html');
            return { success: true, redirectTo: "admin.html" };
        }
        
        // Проверка подписки
        if (!userData.subscription) {
            console.log('👉 Нет subscription → payment.html');
            return { success: true, redirectTo: "payment.html" };
        }
        
        const status = userData.subscription.status;
        console.log('📊 Статус подписки:', status);
        
        if (status === "active" || status === "trial") {
            console.log('👉 Есть подписка → dashboard.html');
            return { success: true, redirectTo: "dashboard.html" };
        } else {
            console.log('👉 Подписка неактивна → payment.html');
            return { success: true, redirectTo: "payment.html" };
        }
        
    } catch (error) {
        console.error('❌ Ошибка в checkUserStatus:', error);
        return { success: false, error: error.message };
    }
};

// ========== РЕГИСТРАЦИЯ ==========
window.register = async function(email, password, name) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        const role = email === "binazzirr@mail.ru" ? "admin" : "user";
        
        const userData = {
            name: name,
            email: email,
            role: role,
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            subscription: {
                status: "trial",
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            stats: {
                streak: 0,
                totalXp: 0,
                lessonsCompleted: 0
            }
        };
        
        await db.collection("users").doc(user.uid).set(userData);
        
        return { 
            success: true, 
            user: {
                uid: user.uid,
                email: user.email,
                name: name,
                role: role,
                subscription: userData.subscription
            }
        };
    } catch (error) {
        let errorMessage = "Ошибка регистрации";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "Этот email уже зарегистрирован";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "Пароль должен быть минимум 6 символов";
        }
        return { success: false, error: errorMessage };
    }
};

// ========== ВХОД ==========
window.login = async function(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        const userDoc = await db.collection("users").doc(user.uid).get();
        const userData = userDoc.data();
        
        await db.collection("users").doc(user.uid).update({
            lastActive: new Date().toISOString()
        });
        
        return { 
            success: true, 
            user: {
                uid: user.uid,
                email: user.email,
                name: userData.name,
                role: userData.role,
                subscription: userData.subscription
            }
        };
    } catch (error) {
        let errorMessage = "Ошибка входа";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            errorMessage = "Неверный email или пароль";
        }
        return { success: false, error: errorMessage };
    }
};

// ========== ВЫХОД ==========
window.logout = async function() {
    await auth.signOut();
    localStorage.removeItem('user');
    window.location.href = 'index.html';
};