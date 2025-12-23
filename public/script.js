const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const statusMsg = document.getElementById('statusMsg');

// Función para obtener tareas del backend
async function fetchTasks() {
    try {
        const response = await fetch('/api/todos');
        const tasks = await response.json();
        renderTasks(tasks);
        statusMsg.style.display = tasks.length ? 'none' : 'block';
        statusMsg.textContent = tasks.length ? '' : 'No hay tareas pendientes.';
    } catch (error) {
        statusMsg.textContent = 'Error al conectar con el servidor.';
    }
}

// Renderizar lista en HTML
function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${escapeHtml(task.title)}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Borrar</button>
        `;
        taskList.appendChild(li);
    });
}

// Agregar tarea
addBtn.addEventListener('click', async () => {
    const title = taskInput.value.trim();
    if (!title) return;

    await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    });

    taskInput.value = '';
    fetchTasks();
});

// Borrar tarea (Global para acceder desde HTML onclick)
window.deleteTask = async (id) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    fetchTasks();
};

// Utilidad para prevenir XSS básico
function escapeHtml(text) {
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Inicializar
fetchTasks();
