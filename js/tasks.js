const themeButton = document.getElementById('themeButton');
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');

const defaultTasks = [
    { text: 'Подготовить конспект', done: false },
    { text: 'Сделать макет проекта', done: false },
    { text: 'Проверить дедлайны', done: false }
];

function loadTasks() {
    const saved = localStorage.getItem('aetherixxTasks');

    if (saved) {
        return JSON.parse(saved);
    }

    localStorage.setItem('aetherixxTasks', JSON.stringify(defaultTasks));
    return defaultTasks;
}

let tasks = loadTasks();

function saveTasks() {
    localStorage.setItem('aetherixxTasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';

    for (let i = 0; i < tasks.length; i++) {
        const li = document.createElement('li');

        if (tasks[i].done) {
            li.classList.add('done');
        }

        li.innerHTML = '<span></span><div class="item-actions"><button class="done-button">✓</button><button class="delete-button">×</button></div>';
        li.querySelector('span').textContent = tasks[i].text;

        li.querySelector('.done-button').addEventListener('click', function () {
            tasks[i].done = !tasks[i].done;
            saveTasks();
            renderTasks();
        });

        li.querySelector('.delete-button').addEventListener('click', function () {
            tasks.splice(i, 1);
            saveTasks();
            renderTasks();
        });

        taskList.appendChild(li);
    }

    taskCount.textContent = tasks.length;
}

addTaskButton.addEventListener('click', function () {
    const text = taskInput.value.trim();

    if (text === '') {
        alert('Введите текст задачи.');
        return;
    }

    tasks.push({
        text: text,
        done: false,
        createdAt: Date.now()
    });

    saveTasks();
    renderTasks();
    taskInput.value = '';
});

taskInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        addTaskButton.click();
    }
});

if (localStorage.getItem('aetherixxTheme') === 'dark') {
    document.body.classList.add('dark');
}

themeButton.addEventListener('click', function () {
    document.body.classList.toggle('dark');
    localStorage.setItem('aetherixxTheme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

renderTasks();

const logoutButton = document.getElementById('logoutButton');

if (logoutButton !== null) {
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('aetherixxCurrentUser');
    });
}