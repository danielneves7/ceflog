// ================= CEF INTEGRATION =================

// Check if running inside CEF
const isCef = typeof Cef !== 'undefined';

// Register CEF event callbacks
if (isCef) {
    Cef.registerEventCallback('loginResponse', 'onLoginResponse');
    Cef.registerEventCallback('registerResponse', 'onRegisterResponse');
}

// CEF response handlers (global functions for CEF)
function onLoginResponse(data) {
    const response = JSON.parse(data);
    handleAuthResponse(response);
}

function onRegisterResponse(data) {
    const response = JSON.parse(data);
    handleAuthResponse(response);
}

function handleAuthResponse(response) {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = false;
    
    if (response.success) {
        showSuccess(response.message);
    } else {
        showError(response.message);
    }
}

// ================= FORM HANDLING =================

let isRegisterMode = false;

const formTitle = document.getElementById('formTitle');
const formSubtitle = document.getElementById('formSubtitle');
const submitBtn = document.getElementById('submitBtn');
const toggleText = document.getElementById('toggleText');
const toggleModeBtn = document.getElementById('toggleMode');
const forgotLink = document.getElementById('forgotLink');
const authForm = document.getElementById('authForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Toggle between login and register
if (toggleModeBtn) {
    toggleModeBtn.addEventListener('click', () => {
        isRegisterMode = !isRegisterMode;
        updateFormMode();
    });
}

function updateFormMode() {
    if (isRegisterMode) {
        formTitle.innerHTML = 'Crie sua <span class="title-highlight">Conta</span>';
        formSubtitle.textContent = 'Caso tenha uma conta você pode realizar o login.';
        submitBtn.textContent = 'Criar Conta';
        toggleText.textContent = 'Já tenho uma conta? ';
        toggleModeBtn.textContent = 'Fazer login';
        forgotLink.classList.add('hidden');
    } else {
        formTitle.innerHTML = 'Realize o <span class="title-highlight">Login</span>';
        formSubtitle.textContent = 'Caso não tenha uma conta você pode realizar o registro.';
        submitBtn.textContent = 'Entrar';
        toggleText.textContent = 'Não tenho uma conta? ';
        toggleModeBtn.textContent = 'Criar uma agora';
        forgotLink.classList.remove('hidden');
    }
    hideMessages();
}

// Form submission
if (authForm) {
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideMessages();
        
        const user = usernameInput.value.trim();
        const pass = passwordInput.value.trim();
        
        if (!user || !pass) {
            showError('Preencha todos os campos!');
            return;
        }
        
        submitBtn.disabled = true;
        
        const eventData = JSON.stringify({
            username: user,
            password: pass
        });
        
        if (isCef) {
            // Send to server via CEF
            if (isRegisterMode) {
                Cef.sendEvent('onRegister', eventData);
            } else {
                Cef.sendEvent('onLogin', eventData);
            }
        } else {
            // Demo mode (not in CEF)
            setTimeout(() => {
                showSuccess('Demo: Login seria enviado ao servidor via CEF.');
                submitBtn.disabled = false;
            }, 1000);
        }
    });
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    successMessage.classList.remove('show');
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.classList.add('show');
    errorMessage.classList.remove('show');
}

function hideMessages() {
    errorMessage.classList.remove('show');
    successMessage.classList.remove('show');
}

// ================= PASSWORD TOGGLE =================

const togglePassword = document.getElementById('togglePassword');
const eyeIcon = document.getElementById('eyeIcon');

if (togglePassword) {
    togglePassword.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        
        if (isPassword) {
            eyeIcon.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
            `;
        } else {
            eyeIcon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            `;
        }
    });
}

// ================= MUSIC PLAYER =================

const tracks = [
    document.getElementById('audio1'),
    document.getElementById('audio2')
];

let currentTrack = 0;
let isPlaying = false;

const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

// Set initial volume
tracks.forEach(track => {
    if (track) track.volume = 0.5;
});

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updatePlayIcon() {
    if (isPlaying) {
        playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    } else {
        playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
    }
}

function playTrack() {
    if (tracks[currentTrack]) {
        tracks[currentTrack].play().catch(() => {});
        isPlaying = true;
        updatePlayIcon();
    }
}

function pauseTrack() {
    if (tracks[currentTrack]) {
        tracks[currentTrack].pause();
        isPlaying = false;
        updatePlayIcon();
    }
}

function switchTrack(index) {
    if (tracks[currentTrack]) {
        tracks[currentTrack].pause();
        tracks[currentTrack].currentTime = 0;
    }
    currentTrack = index;
    if (isPlaying) {
        playTrack();
    }
}

if (playBtn) {
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        const newIndex = (currentTrack - 1 + tracks.length) % tracks.length;
        switchTrack(newIndex);
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        const newIndex = (currentTrack + 1) % tracks.length;
        switchTrack(newIndex);
    });
}

// Update progress bar
tracks.forEach(track => {
    if (!track) return;
    
    track.addEventListener('timeupdate', () => {
        if (track === tracks[currentTrack]) {
            const progress = (track.currentTime / track.duration) * 100 || 0;
            if (progressFill) progressFill.style.width = progress + '%';
            if (currentTimeEl) currentTimeEl.textContent = formatTime(track.currentTime);
            if (durationEl) durationEl.textContent = formatTime(track.duration);
        }
    });
    
    track.addEventListener('ended', () => {
        const newIndex = (currentTrack + 1) % tracks.length;
        switchTrack(newIndex);
        playTrack();
    });
    
    track.addEventListener('loadedmetadata', () => {
        if (track === tracks[currentTrack] && durationEl) {
            durationEl.textContent = formatTime(track.duration);
        }
    });
});

// Autoplay on load
setTimeout(() => {
    playTrack();
}, 500);
