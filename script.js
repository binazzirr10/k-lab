console.log('K-Lab loaded');

const copy = {
  ru: { main:'Корейский, который\nостаётся', korean:'с тобой.', sub:'Не просто уроки. Твой личный ритм языка: фразы, голос и бережный AI‑наставник, который помнит, где ты остановилась.', start:'НАЧАТЬ ПЕРВЫЙ УРОК →', hint:'오늘부터 같이 해요 · Начнём сегодня' },
  en: { main:'Korean that\nstays', korean:'with you.', sub:'More than lessons: your own language rhythm, voice practice, and an AI mentor that remembers where you left off.', start:'START YOUR FIRST LESSON →', hint:'오늘부터 같이 해요 · Let’s begin today' },
  kr: { main:'당신과 함께\n남는', korean:'한국어.', sub:'단순한 수업이 아닙니다. 당신의 리듬에 맞춰 기억하고 함께 연습하는 AI 튜터입니다.', start:'첫 수업 시작하기 →', hint:'오늘부터 같이 해요 · 오늘 시작해요' }
};

window.switchLanguage = function(lang) {
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.toggle('active', btn.textContent.toLowerCase() === lang));
  const text = copy[lang];
  const main = document.getElementById('heroMain');
  const korean = document.getElementById('heroKorean');
  const sub = document.getElementById('heroSub');
  const button = document.getElementById('btnText');
  const hint = document.getElementById('hintText');
  if (!main || !text) return;
  main.innerHTML = text.main.replace('\n', '<br>');
  korean.textContent = text.korean; sub.textContent = text.sub; button.textContent = text.start; hint.textContent = text.hint;
};

window.handleStartClick = () => { window.location.href = 'register.html'; };
window.openLoginModal = () => { window.location.href = 'login.html'; };
window.openRegisterModal = () => { window.location.href = 'register.html'; };
window.closeModal = modalId => { const modal = document.getElementById(modalId); if (modal) modal.style.display = 'none'; };
window.openModal = modalId => { const modal = document.getElementById(modalId); if (modal) modal.style.display = 'flex'; };
window.switchToLogin = event => { if (event) event.preventDefault(); window.location.href = 'login.html'; };
window.switchToRegister = event => { if (event) event.preventDefault(); window.location.href = 'register.html'; };

window.handleRegister = async function() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  if (!name || !email || !password) return alert('Заполни все поля.');
  if (password.length < 6) return alert('Пароль должен содержать минимум 6 символов.');
  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    await firebase.firestore().collection('users').doc(user.uid).set({
      name, email, role:'user', createdAt:new Date().toISOString(), lastActive:new Date().toISOString(),
      subscription:{ status:'trial', startDate:new Date().toISOString(), endDate:new Date(Date.now() + 7*24*60*60*1000).toISOString() },
      stats:{ streak:0, totalXp:0, lessonsCompleted:0 }
    });
    window.location.href = 'dashboard.html';
  } catch (error) { alert(error.code === 'auth/email-already-in-use' ? 'Этот email уже зарегистрирован.' : error.message); }
};

window.handleLogin = async function() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!email || !password) return alert('Введи email и пароль.');
  try {
    const user = (await firebase.auth().signInWithEmailAndPassword(email, password)).user;
    const result = await window.checkUserStatus(user.uid);
    if (result && result.success) window.location.href = result.redirectTo;
    else alert('Не удалось проверить статус аккаунта.');
  } catch (error) { alert('Неверный email или пароль.'); }
};

document.addEventListener('DOMContentLoaded', () => { if (document.getElementById('heroMain')) switchLanguage('ru'); });
