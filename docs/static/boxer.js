document.addEventListener('DOMContentLoaded', () => {
    // Get boxer ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const boxerId = urlParams.get('id');
    
    // DOM Elements
    const boxerPhoto = document.getElementById('boxer-photo');
    const boxerName = document.getElementById('boxer-name');
    const boxerAgeWeight = document.getElementById('boxer-age-weight');
    const boxerHeight = document.getElementById('boxer-height');
    const boxerPhone = document.getElementById('boxer-phone');
    const boxerJoined = document.getElementById('boxer-joined');
    const editBtn = document.getElementById('edit-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const backBtn = document.getElementById('back-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    // Check authentication
    if (!localStorage.getItem('authToken')) {
        window.location.href = 'index.html';
    }

    // Load boxer data
    async function loadBoxer() {
        try {
            const response = await fetch(`http://localhost:3000/api/coach/getOne/${boxerId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) throw new Error('Failed to load boxer');

            const boxer = await response.json();
            
            // Update DOM
            boxerPhoto.src = boxer.picture.url;
            boxerName.textContent = `${boxer.firstName} ${boxer.lastName}`;
            boxerAgeWeight.textContent = `${boxer.age} years, ${boxer.weight} kg`;
            boxerHeight.textContent = `${boxer.height} cm`;
            boxerPhone.textContent = boxer.phoneNumber;
            
            const joinedDate = new Date(boxer.createdAt).toLocaleDateString();
            boxerJoined.textContent = joinedDate;

        } catch (error) {
            console.error('Error loading boxer:', error);
            alert('Failed to load boxer details');
        }
    }

    // Event Listeners
    editBtn.addEventListener('click', () => {
        window.location.href = `edit-boxer.html?id=${boxerId}`;
    });

    deleteBtn.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to delete this boxer?')) return;
        
        try {
            const response = await fetch(`http://localhost:3000/api/coach/delete/${boxerId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete boxer');

            window.location.href = '../boxers.html';
        } catch (error) {
            console.error('Error deleting boxer:', error);
            alert('Failed to delete boxer');
        }
    });

    backBtn.addEventListener('click', () => {
        window.location.href = 'boxers.html';
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'index.html';
    });

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Initial load
    loadBoxer();
});