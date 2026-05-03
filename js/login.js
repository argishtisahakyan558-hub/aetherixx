const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

const DEMO_USER = {
    name: 'Администратор',
    login: 'admin',
    email: 'admin',
    password: 'admin',
    goal: 'Демонстрация'
};

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

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const login = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    errorMessage.textContent = '';

    if (login === '' || password === '') {
        errorMessage.textContent = 'Пожалуйста, заполните логин и пароль.';
        return;
    }

    let foundUser = null;
    const loginLower = login.toLowerCase();

    if ((loginLower === DEMO_USER.login || loginLower === DEMO_USER.email) && password === DEMO_USER.password) {
        foundUser = DEMO_USER;
    }

    const users = getLocalUsers();

    for (let i = 0; i < users.length; i++) {
        const savedLogin = String(users[i].login || users[i].email || '').toLowerCase();

        if (savedLogin === loginLower && users[i].password === password) {
            foundUser = users[i];
            break;
        }
    }

    if (foundUser === null) {
        errorMessage.textContent = 'Неправильный логин или пароль.';
        return;
    }

    localStorage.setItem('aetherixxCurrentUser', JSON.stringify(foundUser));
    localStorage.setItem('aetherixxUserName', foundUser.name);
    localStorage.setItem('aetherixxGoal', foundUser.goal);

    window.location.href = 'workspace.html';
});
