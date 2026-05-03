const themeButton = document.getElementById('themeButton');
const noteTitle = document.getElementById('noteTitle');
const noteText = document.getElementById('noteText');
const addNoteButton = document.getElementById('addNoteButton');
const notesList = document.getElementById('notesList');

const defaultNotes = [
    { title: 'План курсовой', text: 'Разделить работу на введение, теорию, практику и вывод.' },
];

function loadNotes() {
    const saved = localStorage.getItem('aetherixxNotes');

    if (saved) {
        return JSON.parse(saved);
    }

    localStorage.setItem('aetherixxNotes', JSON.stringify(defaultNotes));
    return defaultNotes;
}

let notes = loadNotes();

function saveNotes() {
    localStorage.setItem('aetherixxNotes', JSON.stringify(notes));
}

function renderNotes() {
    notesList.innerHTML = '';

    for (let i = 0; i < notes.length; i++) {
        const item = document.createElement('div');
        item.className = 'note-item';

        item.innerHTML = '<button class="delete-button item-delete">×</button><h3></h3><p></p>';
        item.querySelector('h3').textContent = notes[i].title;
        item.querySelector('p').textContent = notes[i].text;

        item.querySelector('.delete-button').addEventListener('click', function () {
            notes.splice(i, 1);
            saveNotes();
            renderNotes();
        });

        notesList.appendChild(item);
    }
}

addNoteButton.addEventListener('click', function () {
    const title = noteTitle.value.trim();
    const text = noteText.value.trim();

    if (title === '' || text === '') {
        alert('Заполните название и текст заметки.');
        return;
    }

    notes.unshift({
        title: title,
        text: text,
        createdAt: Date.now()
    });

    saveNotes();
    renderNotes();

    noteTitle.value = '';
    noteText.value = '';
});

if (localStorage.getItem('aetherixxTheme') === 'dark') {
    document.body.classList.add('dark');
}

themeButton.addEventListener('click', function () {
    document.body.classList.toggle('dark');
    localStorage.setItem('aetherixxTheme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

renderNotes();

const logoutButton = document.getElementById('logoutButton');

if (logoutButton !== null) {
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('aetherixxCurrentUser');
    });
}