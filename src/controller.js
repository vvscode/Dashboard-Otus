//Потом подумать как сделать server side rendering с переходом по html страничкам

import {
  authPageRender,
  dashBoardPageRender,
  ensureBaseMarkup,
} from "./view.js";
import { FirebaseModel } from "./model.js";

let filesState = [];
let currentUser = null;

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
}

function renderDashboard(firebaseModel) {
  dashBoardPageRender(filesState);
  bindDashboardHandlers(firebaseModel);
}

function bindAuthHandlers(firebaseModel) {
  const loginButton = document.querySelector("button");
  if (!loginButton) return;

  loginButton.addEventListener("click", async () => {
    const inputs = document.querySelectorAll("input");
    const email = inputs[0].value;
    const password = inputs[1].value;

    try {
      await firebaseModel.signIn(email, password);
      // дальнейший рендер произойдет в observeAuthState
    } catch (error) {
      console.error("Auth failed", error);
    }
  });
}

export function runApp(firebaseModel = new FirebaseModel()) {
  ensureBaseMarkup(); //Без этого будет работать?

  const unsubscribe = firebaseModel.observeAuthState((user) => {
    currentUser = user;
    if (user) {
      renderDashboard(firebaseModel);
    } else {
      filesState = [];
      authPageRender();
      bindAuthHandlers(firebaseModel);
    }
  });

  return () => unsubscribe && unsubscribe();
}

runApp();
