const STORAGE_KEY = "classified_files_db";
const ADMIN_KEY = "classified_admin_session";
const ADMIN_USER = "bilal";
const ADMIN_PASS = "saadiboy";

const seedFiles = [
  {
    id: crypto.randomUUID(),
    title: "Casefile: Riverside Contact Chain",
    description: "Cross-referenced communications tied to 2019 operations.",
    tags: "riverside, communications, field report",
    classification: "public",
    status: "approved",
    fileName: "riverside_contact_chain.pdf",
    name: "Diane Mercer",
    email: "diane.mercer@samplemail.org",
    phone: "+1-312-555-0120",
    notes: "Primary coordinator. Activity normalized after Q2.",
    createdAt: new Date().toISOString()
  }
];

function getFiles() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedFiles));
    return seedFiles;
  }
  return JSON.parse(raw);
}

function saveFiles(files) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
}

function isAdmin() {
  return localStorage.getItem(ADMIN_KEY) === "true";
}

function setAdminSession(enabled) {
  localStorage.setItem(ADMIN_KEY, enabled ? "true" : "false");
}

function createFileFromForm(form, forceApproved = false) {
  const data = new FormData(form);
  return {
    id: crypto.randomUUID(),
    title: data.get("title"),
    description: data.get("description"),
    tags: data.get("tags"),
    classification: data.get("classification"),
    status: forceApproved ? "approved" : "pending",
    fileName: data.get("upload")?.name || "no-file",
    name: data.get("name"),
    email: data.get("email"),
    phone: data.get("phone"),
    notes: data.get("notes"),
    createdAt: new Date().toISOString()
  };
}

function formatDate(iso) {
  return new Date(iso).toLocaleString();
}

function badge(type, value) {
  return `<span class="badge ${type}-${value}">${value}</span>`;
}

function renderNav() {
  const links = document.querySelectorAll(".nav-links a");
  const path = location.pathname.split("/").pop() || "index.html";
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path) link.classList.add("active");
  });
}

function requireAdmin() {
  if (!isAdmin()) {
    location.href = "admin-login.html";
  }
}

function logoutIfPresent() {
  const btn = document.getElementById("logout-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    setAdminSession(false);
    location.href = "admin-login.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderNav();
  logoutIfPresent();
});
