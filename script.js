const editToggleBtn = document.getElementById("editToggleBtn");
const saveBtn = document.getElementById("saveBtn");
const photoUpload = document.getElementById("photoUpload");
const profileImage = document.getElementById("profileImage");
const photoPlaceholder = document.getElementById("photoPlaceholder");
const addProjectBtn = document.getElementById("addProjectBtn");
const addAchievementBtn = document.getElementById("addAchievementBtn");
const body = document.body;

let editMode = false;

/* ------------------------------
   TOGGLE EDIT MODE
-------------------------------- */
editToggleBtn.addEventListener("click", () => {
  editMode = !editMode;
  body.classList.toggle("edit-mode", editMode);

  const editables = document.querySelectorAll(".editable");
  editables.forEach(el => {
    el.setAttribute("contenteditable", editMode ? "true" : "false");
  });

  editToggleBtn.textContent = editMode ? "Exit Edit Mode" : "Edit Mode";
});

/* ------------------------------
   SAVE PAGE CONTENT
-------------------------------- */
saveBtn.addEventListener("click", () => {
  saveEditableContent();
  saveProjects();
  saveAchievements();
  alert("Your portfolio changes have been saved.");
});

function saveEditableContent() {
  const editables = document.querySelectorAll("[data-key]");
  editables.forEach(el => {
    localStorage.setItem(el.dataset.key, el.innerHTML);
  });
}

function loadEditableContent() {
  const editables = document.querySelectorAll("[data-key]");
  editables.forEach(el => {
    const saved = localStorage.getItem(el.dataset.key);
    if (saved !== null) {
      el.innerHTML = saved;
    }
  });
}

/* ------------------------------
   PROJECTS
-------------------------------- */
function saveProjects() {
  const projectCards = document.querySelectorAll("#projectsGrid .project-card");
  const projects = [];

  projectCards.forEach(card => {
    const title = card.querySelector("h3").innerHTML;
    const desc = card.querySelector("p").innerHTML;
    projects.push({ title, desc });
  });

  localStorage.setItem("portfolioProjects", JSON.stringify(projects));
}

function loadProjects() {
  const savedProjects = localStorage.getItem("portfolioProjects");
  if (!savedProjects) return;

  const projects = JSON.parse(savedProjects);
  const grid = document.getElementById("projectsGrid");
  grid.innerHTML = "";

  projects.forEach(project => {
    const card = createProjectCard(project.title, project.desc);
    grid.appendChild(card);
  });
}

function createProjectCard(title = "New Project Title", desc = "Write your project description here.") {
  const article = document.createElement("article");
  article.className = "project-card";

  const h3 = document.createElement("h3");
  h3.className = "editable";
  h3.innerHTML = title;

  const p = document.createElement("p");
  p.className = "editable";
  p.innerHTML = desc;

  article.appendChild(h3);
  article.appendChild(p);

  if (editMode) {
    h3.setAttribute("contenteditable", "true");
    p.setAttribute("contenteditable", "true");
  }

  return article;
}

addProjectBtn.addEventListener("click", () => {
  const grid = document.getElementById("projectsGrid");
  const card = createProjectCard();
  grid.appendChild(card);
});

/* ------------------------------
   ACHIEVEMENTS
-------------------------------- */
function saveAchievements() {
  const achievementItems = document.querySelectorAll("#achievementList .timeline-item");
  const achievements = [];

  achievementItems.forEach(item => {
    achievements.push(item.innerHTML);
  });

  localStorage.setItem("portfolioAchievements", JSON.stringify(achievements));
}

function loadAchievements() {
  const savedAchievements = localStorage.getItem("portfolioAchievements");
  if (!savedAchievements) return;

  const achievements = JSON.parse(savedAchievements);
  const list = document.getElementById("achievementList");
  list.innerHTML = "";

  achievements.forEach(text => {
    const item = createAchievementItem(text);
    list.appendChild(item);
  });
}

function createAchievementItem(text = "Write your new achievement here.") {
  const div = document.createElement("div");
  div.className = "timeline-item editable";
  div.innerHTML = text;

  if (editMode) {
    div.setAttribute("contenteditable", "true");
  }

  return div;
}

addAchievementBtn.addEventListener("click", () => {
  const list = document.getElementById("achievementList");
  const item = createAchievementItem();
  list.appendChild(item);
});

/* ------------------------------
   PHOTO UPLOAD
-------------------------------- */
photoUpload.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageData = e.target.result;
    profileImage.src = imageData;
    profileImage.classList.remove("hidden");
    photoPlaceholder.classList.add("hidden");
    localStorage.setItem("portfolioProfileImage", imageData);
  };
  reader.readAsDataURL(file);
});

function loadProfileImage() {
  const savedImage = localStorage.getItem("portfolioProfileImage");
  if (savedImage) {
    profileImage.src = savedImage;
    profileImage.classList.remove("hidden");
    photoPlaceholder.classList.add("hidden");
  }
}

/* ------------------------------
   INITIAL LOAD
-------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  loadEditableContent();
  loadProjects();
  loadAchievements();
  loadProfileImage();

  const editables = document.querySelectorAll(".editable");
  editables.forEach(el => el.setAttribute("contenteditable", "false"));
});