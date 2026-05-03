const helloTitle = document.getElementById('helloTitle');
const notesCount = document.getElementById('notesCount');
const taskCount = document.getElementById('taskCount');
const projectsCount = document.getElementById('projectsCount');
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const themeButton = document.getElementById('themeButton');
const quickNotes = document.getElementById('quickNotes');
const logoutButton = document.getElementById('logoutButton');

const defaultNotes = [
    { title: 'План курсовой', text: 'Разделить работу на введение, теорию, практику и вывод.' },
    { title: 'Идея интерфейса', text: 'Сделать минимальный дизайн в стиле Notion.' }
];

const defaultTasks = [
    { text: 'Подготовить конспект', done: false },
    { text: 'Сделать макет проекта', done: false },
    { text: 'Проверить дедлайны', done: false }
];

const defaultProjects = [
    { title: 'Курсовая работа', text: 'Сайт Aetherixx на HTML, CSS и JavaScript.', progress: 75 },
    { title: 'Конспекты по программированию', text: 'Собрать основные темы за семестр.', progress: 45 },
    { title: 'Личный планер', text: 'Сделать список целей и привычек.', progress: 30 },
    { title: 'Учебный дизайн', text: 'Подобрать цвета и шрифты для проекта.', progress: 20 }
];

function loadData(key, startData) {
    const saved = localStorage.getItem(key);

    if (saved !== null) {
        try {
            return JSON.parse(saved);
        } catch (error) {
            return startData;
        }
    }

    localStorage.setItem(key, JSON.stringify(startData));
    return startData;
}

let notes = loadData('aetherixxNotes', defaultNotes);
let tasks = loadData('aetherixxTasks', defaultTasks);
let projects = loadData('aetherixxProjects', defaultProjects);

function saveTasks() {
    localStorage.setItem('aetherixxTasks', JSON.stringify(tasks));
}

function updateCounts() {
    notesCount.textContent = notes.length;
    taskCount.textContent = tasks.length;
    projectsCount.textContent = projects.length;
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

    updateCounts();
}

let userName = localStorage.getItem('aetherixxUserName') || 'Пользователь';
const currentUserText = localStorage.getItem('aetherixxCurrentUser');

if (currentUserText !== null) {
    try {
        const currentUser = JSON.parse(currentUserText);
        userName = currentUser.name || userName;
    } catch (error) {
        userName = localStorage.getItem('aetherixxUserName') || 'Пользователь';
    }
}

helloTitle.textContent = 'Привет, ' + userName + '!';

addTaskButton.addEventListener('click', function () {
    const text = taskInput.value.trim();

    if (text === '') {
        alert('Введите текст задачи.');
        return;
    }

    tasks.push({ text: text, done: false, createdAt: Date.now() });
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

quickNotes.value = localStorage.getItem('aetherixxQuickNotes') || '';
quickNotes.addEventListener('input', function () {
    localStorage.setItem('aetherixxQuickNotes', quickNotes.value);
});

if (logoutButton !== null) {
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('aetherixxCurrentUser');
    });
}

renderTasks();

const activityWeek = document.getElementById('activityWeek');

function renderActivity() {
    if (activityWeek === null) {
        return;
    }

    const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    activityWeek.innerHTML = '';

    for (let offset = 6; offset >= 0; offset--) {
        const day = new Date(today);
        day.setDate(today.getDate() - offset);

        const dayStart = day.getTime();
        const dayEnd = dayStart + 24 * 60 * 60 * 1000;

        let tasksCount = 0;
        let notesCount = 0;
        let projectsCount = 0;

        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].createdAt >= dayStart && tasks[i].createdAt < dayEnd) {
                tasksCount++;
            }
        }
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].createdAt >= dayStart && notes[i].createdAt < dayEnd) {
                notesCount++;
            }
        }
        for (let i = 0; i < projects.length; i++) {
            if (projects[i].createdAt >= dayStart && projects[i].createdAt < dayEnd) {
                projectsCount++;
            }
        }

        const totalCount = tasksCount + notesCount + projectsCount;

        const cell = document.createElement('div');
        cell.className = 'activity-day';

        if (offset === 0) {
            cell.classList.add('today');
        }

        if (totalCount === 0) {
            cell.classList.add('level-0');
        } else if (totalCount <= 2) {
            cell.classList.add('level-1');
        } else if (totalCount <= 5) {
            cell.classList.add('level-2');
        } else {
            cell.classList.add('level-3');
        }

        cell.title = day.getDate() + ' ' + dayNames[day.getDay()] +
                     ' — задач: ' + tasksCount +
                     ', заметок: ' + notesCount +
                     ', проектов: ' + projectsCount;

        cell.innerHTML =
            '<div class="activity-weekday">' + dayNames[day.getDay()] + '</div>' +
            '<div class="activity-circle">' + day.getDate() + '</div>';

        activityWeek.appendChild(cell);
    }
}

renderActivity();
