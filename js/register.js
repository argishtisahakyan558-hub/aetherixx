const registerForm = document.getElementById('registerForm');
const errorMessage = document.getElementById('errorMessage');

function getLocalUsers() {
    const savedUsers = localStorage.getItem('aetherixxUsers');

    if (savedUsers === null) {
        return [];
    }

    try {
        return JSON.parse(savedUsers);
    } catch (error) {
        return [];
    }
}

function saveLocalUsers(users) {
    localStorage.setItem('aetherixxUsers', JSON.stringify(users));
}

registerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const login = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const goal = document.getElementById('goal').value;

    errorMessage.textContent = '';

    if (name === '' || login === '' || password === '' || goal === '') {
        errorMessage.textContent = 'Пожалуйста, заполните все поля.';
        return;
    }

    const users = getLocalUsers();
    const loginLower = login.toLowerCase();
    
    for (let i = 0; i < users.length; i++) {
        const savedLogin = String(users[i].login || users[i].email || '').toLowerCase();

        if (savedLogin === loginLower) {
            errorMessage.textContent = 'Пользователь с таким логином уже существует.';
            return;
        }
    }

    const newUser = {
        id: Date.now(),
        name: name,
        login: login,
        email: login,
        password: password,
        goal: goal
    };

    users.push(newUser);
    saveLocalUsers(users);

    localStorage.setItem('aetherixxCurrentUser', JSON.stringify(newUser));
    localStorage.setItem('aetherixxUserName', newUser.name);
    localStorage.setItem('aetherixxGoal', newUser.goal);

    window.location.href = 'workspace.html';
});
