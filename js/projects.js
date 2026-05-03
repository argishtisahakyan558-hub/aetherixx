const themeButton = document.getElementById('themeButton');
const projectInput = document.getElementById('projectInput');
const projectText = document.getElementById('projectText');
const projectProgress = document.getElementById('projectProgress');
const progressValue = document.getElementById('progressValue');
const addProjectButton = document.getElementById('addProjectButton');
const projectList = document.getElementById('projectList');

const defaultProjects = [
    { title: 'Курсовая работа', text: 'Сайт Aetherixx на HTML, CSS и JavaScript.', progress: 75 },
    { title: 'Конспекты по программированию', text: 'Собрать основные темы за семестр.', progress: 45 },
];

function loadProjects() {
    const saved = localStorage.getItem('aetherixxProjects');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('aetherixxProjects', JSON.stringify(defaultProjects));
    return defaultProjects;
}

let projects = loadProjects();

function saveProjects() {
    localStorage.setItem('aetherixxProjects', JSON.stringify(projects));
}

function getProgressStatus(progress) {
    if (progress === 100) return 'Готово';
    if (progress >= 70) return 'Почти готово';
    if (progress >= 35) return 'В процессе';
    return 'Старт';
}

function renderProjects() {
    projectList.innerHTML = '';

    for (let i = 0; i < projects.length; i++) {
        const item = document.createElement('div');
        item.className = 'project-item';

        item.innerHTML = `
            <button class="delete-button item-delete">×</button>
            <h3></h3>
            <p></p>
            <div class="project-meta">
                <span class="status-pill"></span>
                <b class="percent"></b>
            </div>
            <div class="progress"><span></span></div>
            <div class="progress-actions">
                <button class="progress-minus">−10%</button>
                <button class="progress-plus">+10%</button>
            </div>
        `;

        item.querySelector('h3').textContent = projects[i].title;
        item.querySelector('p').textContent = projects[i].text;
        item.querySelector('.status-pill').textContent = getProgressStatus(projects[i].progress);
        item.querySelector('.percent').textContent = projects[i].progress + '%';
        item.querySelector('.progress span').style.width = projects[i].progress + '%';

        item.querySelector('.delete-button').addEventListener('click', function () {
            projects.splice(i, 1);
            saveProjects();
            renderProjects();
        });

        item.querySelector('.progress-minus').addEventListener('click', function () {
            projects[i].progress = Math.max(0, projects[i].progress - 10);
            saveProjects();
            renderProjects();
        });

        item.querySelector('.progress-plus').addEventListener('click', function () {
            projects[i].progress = Math.min(100, projects[i].progress + 10);
            saveProjects();
            renderProjects();
        });

        projectList.appendChild(item);
    }
}

projectProgress.addEventListener('input', function () {
    progressValue.textContent = projectProgress.value + '%';
});

addProjectButton.addEventListener('click', function () {
    const title = projectInput.value.trim();
    const text = projectText.value.trim();

    if (title === '') {
        alert('Введите название проекта.');
        return;
    }

    projects.push({
        title: title,
        text: text || 'Новый проект без описания.',
        progress: Number(projectProgress.value),
        createdAt: Date.now()
    });

    saveProjects();
    renderProjects();

    projectInput.value = '';
    projectText.value = '';
    projectProgress.value = 10;
    progressValue.textContent = '10%';
});

projectInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') addProjectButton.click();
});

if (localStorage.getItem('aetherixxTheme') === 'dark') {
    document.body.classList.add('dark');
}

themeButton.addEventListener('click', function () {
    document.body.classList.toggle('dark');
    localStorage.setItem('aetherixxTheme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

renderProjects();

const logoutButton = document.getElementById('logoutButton');
if (logoutButton !== null) {
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('aetherixxCurrentUser');
    });
}
