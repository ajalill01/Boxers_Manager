document.addEventListener('DOMContentLoaded', () => {
    const boxerList = document.getElementById('boxer-list');
    const addBoxerBtn = document.getElementById('add-boxer-btn');
    const addBoxerModal = document.getElementById('add-boxer-modal');
    const closeModal = document.querySelector('.close-modal');
    const addBoxerForm = document.getElementById('add-boxer-form');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    const logoutBtn = document.getElementById('logout-btn');

    let currentPage = 1;
    let totalPages = 1;

    // Check authentication
    if (!localStorage.getItem('authToken')) {
        window.location.href = 'index.html';
    }

    // Load initial boxer data
    loadBoxers();

    // Modal handling
    addBoxerBtn.addEventListener('click', () => {
        addBoxerModal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => {
        addBoxerModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === addBoxerModal) {
            addBoxerModal.style.display = 'none';
        }
    });

    // Form submission
    addBoxerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('firstName', document.getElementById('first-name').value);
        formData.append('lastName', document.getElementById('last-name').value);
        formData.append('age', document.getElementById('age').value);
        formData.append('height', document.getElementById('height').value);
        formData.append('weight', document.getElementById('weight').value);
        formData.append('phoneNumber', document.getElementById('phone').value);
        formData.append('photo', document.getElementById('boxer-photo').files[0]);

        try {
            const response = await fetch('https://boxers-manager.onrender.com/api/coach/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: formData
            });


            addBoxerModal.style.display = 'none';
            addBoxerForm.reset();
            loadBoxers();
        } catch (error) {
            console.log('Failed to add boxer: ' + error.message);
        }
    });

    // Pagination
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadBoxers();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadBoxers();
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'index.html';
    });

    // Load boxers function
    async function loadBoxers() {
        try {
            boxerList.innerHTML = '<div class="loading">Loading...</div>';
            
            const response = await fetch(`https://boxers-manager.onrender.com/api/coach/getAll?page=${currentPage}&limit=10`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) throw new Error(await response.text());

            const data = await response.json();
            totalPages = data.pages;
            updatePagination();

            boxerList.innerHTML = '';
            data.data.forEach(boxer => {
                const boxerCard = document.createElement('div');
                boxerCard.className = 'boxer-card';
// Update your boxer card generation to:
boxerCard.innerHTML = `
    <img src="${boxer.picture?.url || 'default-avatar.jpg'}" 
         class="boxer-photo" 
         alt="${boxer.firstName}">
    <span class="boxer-name">${boxer.firstName} ${boxer.lastName}</span>
    <span class="boxer-age">${boxer.age}</span>
    <span class="boxer-weight">${boxer.weight}kg</span>
    <div class="actions">
        <button class="action-btn view-btn" data-id="${boxer._id}">View</button>
        <button class="action-btn edit-btn" data-id="${boxer._id}">Edit</button>
        <button class="action-btn delete-btn" data-id="${boxer._id}">Delete</button>
    </div>
`;
                boxerList.appendChild(boxerCard);
            });

            // Add event listeners to action buttons
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    window.location.href = `boxer.html?id=${e.target.dataset.id}`;
                });
            });

            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    window.location.href = `edit-boxer.html?id=${e.target.dataset.id}`;
                });
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => deleteBoxer(e.target.dataset.id));
            });

        } catch (error) {
            boxerList.innerHTML = `<div class="error">Error loading boxers: ${error.message}</div>`;
        }
    }

    // Delete boxer function
    async function deleteBoxer(id) {
        if (!confirm('Are you sure you want to delete this boxer?')) return;
        
        try {
            const response = await fetch(`https://boxers-manager.onrender.com/api/coach/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });



            loadBoxers();
        } catch (error) {
            console.log('Failed to delete boxer: ' + error.message);
        }
    }

    // Update pagination UI
    function updatePagination() {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }
});

// Add this to your existing JS
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && e.target !== menuToggle) {
        sidebar.classList.remove('active');
    }
});

