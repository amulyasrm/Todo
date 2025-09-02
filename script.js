document.addEventListener('DOMContentLoaded', () => {
  const MAX_USERS = 50;
  const MAX_TASKS = 100;

  let users = JSON.parse(sessionStorage.getItem('users')) || [];
  let currentUser = null;

  // --- SIGN UP ---
  const signupBtn = document.getElementById('signup-btn');
  if (signupBtn) {
    signupBtn.addEventListener('click', () => {
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
      const authMsg = document.getElementById('auth-msg');

      if (!username || !password) return;

      if (users.some(u => u.username === username)) {
        authMsg.textContent = 'Username already exists!';
        return;
      }

      if (users.length >= MAX_USERS) {
        authMsg.textContent = 'User limit reached!';
        return;
      }

      users.push({ username, password, tasks: [] });
      sessionStorage.setItem('users', JSON.stringify(users));
      authMsg.textContent = 'Sign up successful! Redirecting to login...';
      setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    });
  }

  // --- LOG IN ---
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
      const authMsg = document.getElementById('auth-msg');

      users = JSON.parse(sessionStorage.getItem('users')) || [];
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        currentUser = user;
        sessionStorage.setItem('currentUser', username);
        window.location.href = 'todo.html';
      } else {
        authMsg.textContent = 'Invalid username or password!';
      }
    });
  }

  // --- TODO PAGE ---
  const welcomeMsg = document.getElementById('welcome-msg');
  const taskInput = document.getElementById('task-input');
  const addBtn = document.getElementById('add-btn');
  const taskList = document.getElementById('task-list');
  const logoutBtn = document.getElementById('logout-btn');

  if (taskList) {
    const username = sessionStorage.getItem('currentUser');
    if (!username) {
      window.location.href = 'login.html';
      return;
    } else {
      users = JSON.parse(sessionStorage.getItem('users')) || [];
      currentUser = users.find(u => u.username === username);
      if (!currentUser) window.location.href = 'login.html';
      welcomeMsg.textContent = `Welcome, ${currentUser.username}`;
      renderTasks();
    }

    function renderTasks() {
      taskList.innerHTML = '';
      currentUser.tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${task} <button onclick="deleteTask(${index})">Delete</button>`;
        taskList.appendChild(li);
      });
    }

    window.deleteTask = function(index) {
      currentUser.tasks.splice(index, 1);
      saveUsers();
      renderTasks();
    }

    function saveUsers() {
      const idx = users.findIndex(u => u.username === currentUser.username);
      if (idx !== -1) users[idx] = currentUser;
      sessionStorage.setItem('users', JSON.stringify(users));
    }

    addBtn.addEventListener('click', () => {
      const taskText = taskInput.value.trim();
      if (taskText && currentUser.tasks.length < MAX_TASKS) {
        currentUser.tasks.push(taskText);
        saveUsers();
        taskInput.value = '';
        renderTasks();
      }
    });

    logoutBtn.addEventListener('click', () => {
      saveUsers();
      sessionStorage.removeItem('currentUser');
      window.location.href = 'login.html';
    });
  }
});
