document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const API_BASE_URL = 'http://localhost:3000/api';


    const loginBtn = loginForm.querySelector('button');
    loginBtn.addEventListener('mouseenter', (e) => {
        const pulse = document.createElement('div');
        pulse.className = 'pulse';
        pulse.style.left = `${e.offsetX}px`;
        pulse.style.top = `${e.offsetY}px`;
        loginBtn.appendChild(pulse);
        setTimeout(() => pulse.remove(), 1000);
    });


    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {

            loginBtn.disabled = true;
            loginBtn.innerHTML = '<span>Login...</span>';

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }


            localStorage.setItem('authToken', data.token);
            window.location.href = 'boxers.html';

        } catch (err) {

            errorMessage.textContent = err.message;
            errorMessage.classList.add('show');
            

            loginBtn.disabled = false;
            loginBtn.innerHTML = '<span>LOG IN</span>';


            loginForm.style.animation = 'shake 0.5s';
            setTimeout(() => loginForm.style.animation = '', 500);
            
            console.error('Login error:', err);
        }
    });


    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
});