//Всё таки первая страница должна быть авторизаций - после которой

//authPageRender - я так понимаю реализация на nodeJs - добавление элементов, рендер и т.д.
//DashBoardPageRender - если прошли регистрацию, то подтягиваем данные из firebase
//InfoPageRender - Если перешли по гиперссылке на DashBoard

export function createNuvAuth() {
  const nav = document.createElement("nav");
  nav.style.cssText = "display:flex;justify-content:space-around";
  [{ href: PREFIX + "", text: "auth" }].forEach(({ href, text }) => {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = text;
    nav.appendChild(link);
  });

  return nav;
}

export function createNuvDashboard() {
  const nav = document.createElement("nav");
  nav.style.cssText = "display:flex;justify-content:space-around";
  [
    { href: PREFIX + "dashBoard", text: "dashBoard" },
    { href: PREFIX + "about", text: "about" },
  ].forEach(({ href, text }) => {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = text;
    nav.appendChild(link);
  });

  return nav;
}

export function ensureBaseMarkup() {
  if (!document.body.querySelector("h1")) {
    const header = document.createElement("header");
    const title = document.createElement("h1");
    header.appendChild(title);
    document.body.prepend(header);
  }
}

function createFilesTable(files = []) {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Название файла", "Описание", "Тэг"].forEach((col) => {
    const th = document.createElement("th");
    th.textContent = col;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  if (!files.length) {
    const emptyRow = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4;
    td.textContent = "Нет файлов";
    emptyRow.appendChild(td);
    tbody.appendChild(emptyRow);
  } else {
    files.forEach(({ name, description, tag, path }, idx) => {
      const row = document.createElement("tr");
      const nameCell = document.createElement("td");
      nameCell.textContent = name || "";
      const descriptionCell = document.createElement("td");
      descriptionCell.textContent = description || "";
      const tagCell = document.createElement("td");
      tagCell.textContent = tag || "";
      const actionsCell = document.createElement("td");
      const downloadBtn = document.createElement("button");
      downloadBtn.type = "button";
      downloadBtn.textContent = "Скачать";
      downloadBtn.classList.add("download-btn");
      downloadBtn.dataset.index = idx.toString();
      downloadBtn.dataset.path = path || "";
      actionsCell.appendChild(downloadBtn);

      row.append(nameCell, descriptionCell, tagCell, actionsCell);
      tbody.appendChild(row);
    });
  }
  table.appendChild(tbody);
  return table;
}

export function authPageRender() {
  document.body.querySelector("h1").innerText = "Auth page";
  const existingNav = document.querySelector("nav");
  const nav = createNuvAuth();
  if (existingNav) {
    existingNav.replaceWith(nav);
  } else {
    document.body.append(nav);
  }

  const oldTable = document.querySelector("table");
  if (oldTable) oldTable.remove();
  const oldAddBtn = document.querySelector("#add-file-btn");
  if (oldAddBtn) oldAddBtn.remove();
  const oldLogout = document.querySelector("#logout-btn");
  if (oldLogout) oldLogout.remove();
  const oldAlert = document.querySelector(".alert");
  if (oldAlert) oldAlert.remove();

  document.body.append(document.createElement("input")); //Добавить внутреннюю надпись логин и пространство между элементами
  document.body.append(document.createElement("input")); //Добавить внутренню надпись пароль и пространство между элементами
  const loginBtn = document.createElement("button");
  loginBtn.id = "login-btn";
  loginBtn.innerText = "Login";
  const signUpBtn = document.createElement("button");
  signUpBtn.id = "signup-btn";
  signUpBtn.innerText = "Sign up";
  document.body.append(loginBtn, signUpBtn);
}

export function dashBoardPageRender(files = []) {
  document.body.querySelector("h1").innerText = "Dashboard page";
  const existingNav = document.querySelector("nav");
  const nav = createNuvDashboard();
  if (existingNav) {
    existingNav.replaceWith(nav);
  } else {
    document.body.prepend(nav);
  }

  document.querySelectorAll("input").forEach((el) => el.remove());
  const authButton = document.querySelector("button");
  if (authButton) authButton.remove();

  const oldTable = document.querySelector("table");
  if (oldTable) oldTable.remove();
  const oldAddBtn = document.querySelector("#add-file-btn");
  if (oldAddBtn) oldAddBtn.remove();
  const oldSignUp = document.querySelector("#signup-btn");
  if (oldSignUp) oldSignUp.remove();
  const oldLogout = document.querySelector("#logout-btn");
  if (oldLogout) oldLogout.remove();
  const oldAlert = document.querySelector(".alert");
  if (oldAlert) oldAlert.remove();
  const oldAbout = document.querySelector("#about-content");
  if (oldAbout) oldAbout.remove();

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.id = "add-file-btn";
  addBtn.textContent = "Добавить файл";
  const logoutBtn = document.createElement("button");
  logoutBtn.type = "button";
  logoutBtn.id = "logout-btn";
  logoutBtn.textContent = "Выйти";
  document.body.append(addBtn, logoutBtn);

  document.body.append(createFilesTable(files));
}

export function aboutPageRender() {
  document.body.querySelector("h1").innerText = "About page";
  const existingNav = document.querySelector("nav");
  const nav = createNuvDashboard();
  if (existingNav) {
    existingNav.replaceWith(nav);
  } else {
    document.body.prepend(nav);
  }

  document.querySelectorAll("input").forEach((el) => el.remove());
  const oldTable = document.querySelector("table");
  if (oldTable) oldTable.remove();
  const oldAddBtn = document.querySelector("#add-file-btn");
  if (oldAddBtn) oldAddBtn.remove();
  const oldSignUp = document.querySelector("#signup-btn");
  if (oldSignUp) oldSignUp.remove();
  const oldLoginBtn = document.querySelector("#login-btn");
  if (oldLoginBtn) oldLoginBtn.remove();
  const oldLogout = document.querySelector("#logout-btn");
  if (oldLogout) oldLogout.remove();
  const oldAlert = document.querySelector(".alert");
  if (oldAlert) oldAlert.remove();
  const oldAbout = document.querySelector("#about-content");
  if (oldAbout) oldAbout.remove();

  const aboutContent = document.createElement("div");
  aboutContent.id = "about-content";
  aboutContent.innerHTML = `
    <h2>О проекте DashBoard</h2>
    <p>Это веб-приложение для управления файлами с использованием Firebase.</p>
    <p>Основные возможности:</p>
    <ul>
      <li>Загрузка файлов в облако</li>
      <li>Добавление описаний и тегов к файлам</li>
      <li>Скачивание файлов</li>
      <li>Аутентификация пользователей</li>
    </ul>
  `;

  document.body.append(aboutContent);
}

export function showAlert(message, type = "error") {
  let alertBox = document.querySelector(".alert");
  if (!alertBox) {
    alertBox = document.createElement("div");
    alertBox.className = "alert";
    document.body.prepend(alertBox);
  }
  alertBox.textContent = message;
  alertBox.dataset.type = type;
}

//Нужно ли давать возможность разлогиниться?
//Добавить сообщения об ошибке
//Здесь лежит renderAuthPage({})
