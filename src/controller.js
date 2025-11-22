//Потом подумать как сделать server side rendering с переходом по html страничкам

import {
  authPageRender,
  dashBoardPageRender,
  aboutPageRender,
  ensureBaseMarkup,
  showAlert,
} from "./view.js";
import { FirebaseModel } from "./model.js";
import "./style.css";

let filesState = [];
let currentUser = null;
let firebaseModelInstance = null;

async function handleFileSelect(firebaseModel, event) {
  const file = event.target.files && event.target.files[0];
  if (!file || !currentUser) return;

  const description = window.prompt("Описание файла:", "") || "";
  const tag = window.prompt("Тэг файла:", "") || "";

  const path = `files/${currentUser.uid}/${file.name}`;
  await firebaseModel.uploadFile(path, file, {
    customMetadata: { description, tag },
  });

  filesState = [...filesState, { name: file.name, description, tag, path }];

  renderDashboard(firebaseModel);
}

async function handleDownload(firebaseModel, path) {
  try {
    const url = await firebaseModel.getFileDownloadUrl(path);
    window.open(url, "_blank");
  } catch (error) {
    console.error("Download failed", error);
  }
}

function bindDashboardHandlers(firebaseModel) {
  const addBtn = document.querySelector("#add-file-btn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.addEventListener("change", (e) =>
        handleFileSelect(firebaseModel, e),
      );
      fileInput.click();
    });
  }

  document.querySelectorAll(".download-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const { path } = btn.dataset;
      if (path) {
        handleDownload(firebaseModel, path);
      }
    });
  });

  const logoutBtn = document.querySelector("#logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await firebaseModel.signOut();
      } catch (error) {
        console.error("Logout failed", error);
      }
    });
  }
}

function renderDashboard(firebaseModel) {
  dashBoardPageRender(filesState);
  bindDashboardHandlers(firebaseModel);
}
bindNavigationHandlers();

function renderAbout() {
  aboutPageRender();
  bindNavigationHandlers();
}

function bindNavigationHandlers() {
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");

      if (href === process.env.PREFIX + "/about" && currentUser) {
        renderAbout();
      } else if (href === process.env.PREFIX + "/dashBoard" && currentUser) {
        renderDashboard(firebaseModelInstance);
      } else if (href === process.env.PREFIX + "/" && !currentUser) {
        authPageRender();
        bindAuthHandlers(firebaseModelInstance);
      } else {
        alert("Fix me in routing handler");
      }
    });
  });
}

export function runApp(firebaseModel = new FirebaseModel()) {
  async function loadFiles(firebaseModel) {
    if (!currentUser) return;
    try {
      filesState = await firebaseModel.listFilesWithMetadata(
        `files/${currentUser.uid}`,
      );
    } catch (error) {
      console.error("Load files failed", error);
      filesState = [];
    }
  }

  function bindAuthHandlers(firebaseModel) {
    const loginButton = document.querySelector("#login-btn");
    const signUpButton = document.querySelector("#signup-btn");
    if (loginButton) {
      loginButton.addEventListener("click", async () => {
        const inputs = document.querySelectorAll("input");
        const email = inputs[0].value;
        const password = inputs[1].value;

        try {
          await firebaseModel.signIn(email, password);
          // дальнейший рендер произойдет в observeAuthState
        } catch (error) {
          console.error("Auth failed", error);
          if (error?.code === "auth/invalid-credential") {
            showAlert("Логин или пароль не верные");
          } else {
            showAlert("Не удалось войти");
          }
        }
      });
    }

    if (signUpButton) {
      signUpButton.addEventListener("click", async () => {
        const inputs = document.querySelectorAll("input");
        const email = inputs[0].value;
        const password = inputs[1].value;

        try {
          await firebaseModel.signUp(email, password);
          // после регистрации onAuthStateChanged получит user и переключит UI
        } catch (error) {
          console.error("Sign up failed", error);
          if (error?.code === "auth/email-already-in-use") {
            showAlert("Такой пользователь уже зарегистрирован");
          } else if (error?.code === "auth/invalid-credential") {
            showAlert("Логин или пароль не верные");
          } else {
            showAlert("Не удалось зарегистрироваться");
          }
        }
      });
    }
  }

  ensureBaseMarkup(); //Без этого будет работать?

  firebaseModelInstance = firebaseModel;
  const unsubscribe = firebaseModel.observeAuthState(async (user) => {
    currentUser = user;
    if (user) {
      renderDashboard(firebaseModel);
      await loadFiles(firebaseModel);
    } else {
      filesState = [];
      authPageRender();
      bindAuthHandlers(firebaseModel);
    }
  });

  return () => unsubscribe && unsubscribe();
}

runApp();
