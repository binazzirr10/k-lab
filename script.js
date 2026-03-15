// ========== РАБОЧАЯ ВЕРСИЯ С FIREBASE v9 ==========

console.log('✅ Скрипт загружен!');

// ========== ПЕРЕКЛЮЧЕНИЕ ЯЗЫКОВ ==========
window.switchLanguage = function(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === lang) {
            btn.classList.add('active');
        }
    });
    
    if (lang === 'ru') {
        document.getElementById('heroMain').textContent = 'Твой личный AI-учитель';
        document.getElementById('heroKorean').textContent = 'корейского языка';
        document.getElementById('heroSub').textContent = 'Говори. Анализируй. Улучшай. 🇰🇷';
        document.getElementById('btnText').textContent = '🎯 Начать учиться';
        document.getElementById('hintText').textContent = 'Первый урок бесплатно ✨ 7 дней доступа';
        document.getElementById('modalChoiceTitle').textContent = '👋 Добро пожаловать!';
        document.getElementById('modalLoginBtn').textContent = '🔐 Войти';
        document.getElementById('modalRegisterBtn').textContent = '✨ Регистрация';
        document.getElementById('modalHintText').innerHTML = 'После регистрации ты получишь <strong>7 дней бесплатного доступа</strong>';
    }
    
    if (lang === 'en') {
        document.getElementById('heroMain').textContent = 'Your personal AI teacher';
        document.getElementById('heroKorean').textContent = 'of Korean language';
        document.getElementById('heroSub').textContent = 'Speak. Analyze. Improve. 🇰🇷';
        document.getElementById('btnText').textContent = '🎯 Start Learning';
        document.getElementById('hintText').textContent = 'First lesson free ✨ 7 days access';
        document.getElementById('modalChoiceTitle').textContent = '👋 Welcome!';
        document.getElementById('modalLoginBtn').textContent = '🔐 Log In';
        document.getElementById('modalRegisterBtn').textContent = '✨ Register';
        document.getElementById('modalHintText').innerHTML = 'After registration you get <strong>7 days free access</strong>';
    }
    
    if (lang === 'kr') {
        document.getElementById('heroMain').textContent = '당신의 AI 선생님';
        document.getElementById('heroKorean').textContent = '한국어';
        document.getElementById('heroSub').textContent = '말하기. 분석. 향상. 🇰🇷';
        document.getElementById('btnText').textContent = '🎯 시작하기';
        document.getElementById('hintText').textContent = '첫 수업 무료 ✨ 7일 이용권';
        document.getElementById('modalChoiceTitle').textContent = '👋 환영합니다!';
        document.getElementById('modalLoginBtn').textContent = '🔐 로그인';
        document.getElementById('modalRegisterBtn').textContent = '✨ 회원가입';
        document.getElementById('modalHintText').innerHTML = '가입 후 <strong>7일 무료 이용</strong>이 가능합니다';
    }
};

// ========== КНОПКА "НАЧАТЬ УЧИТЬСЯ" ==========
window.handleStartClick = function() {
    openModal('choiceModal');
};

// ========== УПРАВЛЕНИЕ МОДАЛЬНЫМИ ОКНАМИ ==========
window.openModal = function(modalId) {
    document.getElementById(modalId).style.display = 'flex';
};

window.closeModal = function(modalId) {
    document.getElementById(modalId).style.display = 'none';
};

window.openLoginModal = function() {
    closeModal('choiceModal');
    openModal('loginModal');
};

window.openRegisterModal = function() {
    closeModal('choiceModal');
    openModal('registerModal');
};

window.switchToLogin = function(e) {
    if (e) e.preventDefault();
    closeModal('registerModal');
    openModal('loginModal');
};

window.switchToRegister = function(e) {
    if (e) e.preventDefault();
    closeModal('loginModal');
    openModal('registerModal');
};

// ========== РЕГИСТРАЦИЯ ==========
window.handleRegister = async function() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    if (!name || !email || !password) {
        alert('❌ Заполни все поля!');
        return;
    }
    
    if (password.length < 6) {
        alert('❌ Пароль должен быть минимум 6 символов');
        return;
    }
    
    try {
        // Регистрация в Firebase
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Сохраняем данные в Firestore
        await firebase.firestore().collection('users').doc(user.uid).set({
            name: name,
            email: email,
            role: email === 'binazzirr@mail.ru' ? 'admin' : 'user',
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            subscription: {
                status: 'trial',
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            stats: {
                streak: 0,
                totalXp: 0,
                lessonsCompleted: 0
            }
        });
        
        alert('✅ Регистрация успешна!');
        closeModal('registerModal');
        
        // Перенаправление
        if (email === 'binazzirr@mail.ru') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }
        
    } catch (error) {
        alert('❌ Ошибка: ' + error.message);
    }
};

// ========== ВХОД ==========
window.handleLogin = async function() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('❌ Заполни все поля!');
        return;
    }
    
    try {
        console.log('1️⃣ Пытаемся войти с email:', email);
        
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        console.log('2️⃣ Успешный вход! UID:', user.uid);
        
        closeModal('loginModal');
        
        console.log('3️⃣ Вызываем checkUserStatus...');
        const result = await window.checkUserStatus(user.uid);
        
        console.log('4️⃣ Результат checkUserStatus:', result);
        
        if (result && result.success) {
            console.log('5️⃣ Перенаправляем на:', result.redirectTo);
            window.location.href = result.redirectTo;
        } else {
            console.error('❌ Ошибка в checkUserStatus:', result?.error);
            alert('Ошибка при проверке статуса');
        }
        
    } catch (error) {
        console.error('❌ Ошибка входа:', error);
        alert('❌ Ошибка: ' + error.message);
    }
};

// ========== ЗАКРЫТИЕ ПО КЛИКУ ВНЕ МОДАЛКИ ==========
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

// ========== ЗАПУСК ПРИ ЗАГРУЗКЕ ==========
document.addEventListener('DOMContentLoaded', function() {
    switchLanguage('ru');
});