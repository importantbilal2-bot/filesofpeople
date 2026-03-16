const STORAGE_KEY = "classified_files_db";
const ADMIN_KEY = "classified_admin_session";
const ADMIN_USER = "bilal";
const ADMIN_PASS = "saadiboy";

const allowedClassifications = ["public", "confidential", "restricted"];
const allowedStatuses = ["pending", "approved"];

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

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeFile(record) {
  return {
    id: String(record.id || crypto.randomUUID()).replace(/[^a-zA-Z0-9-]/g, ""),
    title: String(record.title || "Untitled").trim(),
    description: String(record.description || "").trim(),
    tags: String(record.tags || "").trim(),
    classification: allowedClassifications.includes(record.classification) ? record.classification : "public",
    status: allowedStatuses.includes(record.status) ? record.status : "pending",
    fileName: String(record.fileName || "no-file").trim(),
    name: String(record.name || "Unknown").trim(),
    email: String(record.email || "").trim(),
    phone: String(record.phone || "").trim(),
    notes: String(record.notes || "").trim(),
    createdAt: record.createdAt || new Date().toISOString()
  };
}

function getFiles() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedFiles));
    return seedFiles;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Invalid shape");
    return parsed.map(normalizeFile);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedFiles));
    return seedFiles;
  }
}

function saveFiles(files) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files.map(normalizeFile)));
}

function isAdmin() {
  return localStorage.getItem(ADMIN_KEY) === "true";
}

function setAdminSession(enabled) {
  localStorage.setItem(ADMIN_KEY, enabled ? "true" : "false");
}

function createFileFromForm(form, forceApproved = false) {
  const data = new FormData(form);
  return normalizeFile({
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
  });
}

function formatDate(iso) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleString();
}

function badge(type, value) {
  return `<span class="badge ${type}-${esc(value)}">${esc(value)}</span>`;
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
