const STORAGE_KEY = "trpg-world-builder-v1";

const demoState = {
  entries: [
    {
      id: crypto.randomUUID(),
      name: "Whispering Port",
      tag: "place",
      summary: "A trade city built around fog-shrouded piers and old sea bargains.",
      hook: "The harbor bells ring before each disappearance."
    },
    {
      id: crypto.randomUUID(),
      name: "Captain Mirel",
      tag: "person",
      summary: "A respected smuggler who knows every hidden inlet.",
      hook: "Claims the tides are changing because someone woke the deep court."
    },
    {
      id: crypto.randomUUID(),
      name: "Night of Split Lanterns",
      tag: "event",
      summary: "A festival turned massacre when false lights lured ships ashore.",
      hook: "Every faction blames someone different."
    }
  ],
  connections: [],
  timeline: []
};

demoState.connections = [
  {
    id: crypto.randomUUID(),
    from: demoState.entries[1].id,
    label: "protects",
    to: demoState.entries[0].id
  },
  {
    id: crypto.randomUUID(),
    from: demoState.entries[2].id,
    label: "scarred",
    to: demoState.entries[0].id
  }
];

demoState.timeline = [
  {
    id: crypto.randomUUID(),
    title: "The bells ring before dawn",
    era: "Session 1",
    entryId: demoState.entries[0].id,
    notes: "Signals the first mystery and introduces the city’s superstitions."
  },
  {
    id: crypto.randomUUID(),
    title: "Captain Mirel asks for help",
    era: "Session 2",
    entryId: demoState.entries[1].id,
    notes: "The party learns who profits from the disappearances."
  }
];

const state = loadState();

const entryForm = document.getElementById("entry-form");
const timelineForm = document.getElementById("timeline-form");
const entryGrid = document.getElementById("entry-grid");
const relationshipList = document.getElementById("relationship-list");
const timelineList = document.getElementById("timeline-list");
const workspaceTabBoard = document.getElementById("workspace-tab-board");
const workspaceTabRelationship = document.getElementById("workspace-tab-relationship");
const workspaceTabTimeline = document.getElementById("workspace-tab-timeline");
const workspacePanelBoard = document.getElementById("workspace-panel-board");
const workspacePanelRelationship = document.getElementById("workspace-panel-relationship");
const workspacePanelTimeline = document.getElementById("workspace-panel-timeline");
const timelineEntry = document.getElementById("timeline-entry");
const seedDemoBtn = document.getElementById("seed-demo-btn");
const exportBtn = document.getElementById("export-btn");
const importInput = document.getElementById("import-input");
const resetBtn = document.getElementById("reset-btn");
const openEntryModalBtn = document.getElementById("open-entry-modal-btn");
const openTimelineModalBtn = document.getElementById("open-timeline-modal-btn");
const entryModal = document.getElementById("entry-modal");
const entryModalBackdrop = document.getElementById("entry-modal-backdrop");
const closeEntryModalBtn = document.getElementById("close-entry-modal");
const cancelEntryModalBtn = document.getElementById("cancel-entry-modal");
const timelineModal = document.getElementById("timeline-modal");
const timelineModalBackdrop = document.getElementById("timeline-modal-backdrop");
const closeTimelineModalBtn = document.getElementById("close-timeline-modal");
const cancelTimelineModalBtn = document.getElementById("cancel-timeline-modal");
const connectionModal = document.getElementById("connection-modal");
const connectionModalBackdrop = document.getElementById("connection-modal-backdrop");
const connectionModalCopy = document.getElementById("connection-modal-copy");
const connectionModalForm = document.getElementById("connection-modal-form");
const modalConnectionLabel = document.getElementById("modal-connection-label");
const closeConnectionModalBtn = document.getElementById("close-connection-modal");
const cancelConnectionModalBtn = document.getElementById("cancel-connection-modal");

const dragConnectionState = {
  from: "",
  to: ""
};

workspaceTabBoard.addEventListener("click", () => setWorkspaceTab("board"));
workspaceTabRelationship.addEventListener("click", () => setWorkspaceTab("relationship"));
workspaceTabTimeline.addEventListener("click", () => setWorkspaceTab("timeline"));

entryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(entryForm);
  state.entries.push({
    id: crypto.randomUUID(),
    name: String(formData.get("entry-name") || document.getElementById("entry-name").value).trim(),
    tag: document.getElementById("entry-tag").value,
    summary: document.getElementById("entry-summary").value.trim(),
    hook: document.getElementById("entry-hook").value.trim()
  });
  entryForm.reset();
  document.getElementById("entry-tag").value = "place";
  closeModal(entryModal, entryForm);
  syncAndRender();
});

timelineForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.timeline.push({
    id: crypto.randomUUID(),
    title: document.getElementById("timeline-title").value.trim(),
    era: document.getElementById("timeline-era").value.trim(),
    entryId: timelineEntry.value,
    notes: document.getElementById("timeline-notes").value.trim()
  });
  timelineForm.reset();
  closeModal(timelineModal, timelineForm);
  syncAndRender();
});

seedDemoBtn.addEventListener("click", () => {
  Object.assign(state, structuredClone(demoState));
  syncAndRender();
});

exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "trpg-world-builder.json";
  link.click();
  URL.revokeObjectURL(url);
});

importInput.addEventListener("change", async () => {
  const file = importInput.files?.[0];
  if (!file) return;
  try {
    const imported = JSON.parse(await file.text());
    state.entries = Array.isArray(imported.entries) ? imported.entries : [];
    state.connections = Array.isArray(imported.connections) ? imported.connections : [];
    state.timeline = Array.isArray(imported.timeline) ? imported.timeline : [];
    syncAndRender();
  } catch (error) {
    alert("That file could not be read as world-builder data.");
  } finally {
    importInput.value = "";
  }
});

resetBtn.addEventListener("click", () => {
  if (!confirm("Reset the world builder and clear saved data?")) return;
  state.entries = [];
  state.connections = [];
  state.timeline = [];
  syncAndRender();
});

openEntryModalBtn.addEventListener("click", () => {
  openModal(entryModal);
  document.getElementById("entry-name").focus();
});

openTimelineModalBtn.addEventListener("click", () => {
  openModal(timelineModal);
  document.getElementById("timeline-title").focus();
});

connectionModalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!dragConnectionState.from || !dragConnectionState.to) return;
  createConnection(
    dragConnectionState.from,
    dragConnectionState.to,
    modalConnectionLabel.value.trim() || "connected to"
  );
  closeConnectionModal();
  syncAndRender();
});

closeEntryModalBtn.addEventListener("click", () => closeModal(entryModal, entryForm));
cancelEntryModalBtn.addEventListener("click", () => closeModal(entryModal, entryForm));
entryModalBackdrop.addEventListener("click", () => closeModal(entryModal, entryForm));
closeTimelineModalBtn.addEventListener("click", () => closeModal(timelineModal, timelineForm));
cancelTimelineModalBtn.addEventListener("click", () => closeModal(timelineModal, timelineForm));
timelineModalBackdrop.addEventListener("click", () => closeModal(timelineModal, timelineForm));
closeConnectionModalBtn.addEventListener("click", closeConnectionModal);
cancelConnectionModalBtn.addEventListener("click", closeConnectionModal);
connectionModalBackdrop.addEventListener("click", closeConnectionModal);
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!connectionModal.classList.contains("hidden")) closeConnectionModal();
  if (!entryModal.classList.contains("hidden")) closeModal(entryModal, entryForm);
  if (!timelineModal.classList.contains("hidden")) closeModal(timelineModal, timelineForm);
});

function syncAndRender() {
  persistState();
  renderSelectOptions();
  renderEntries();
  renderRelationships();
  renderTimeline();
}

function renderSelectOptions() {
  const options = state.entries.map((entry) => `<option value="${entry.id}">${escapeHtml(entry.name)} (${entry.tag})</option>`).join("");
  timelineEntry.innerHTML = `<option value="">None</option>${options}`;
}

function renderEntries() {
  if (!state.entries.length) {
    entryGrid.innerHTML = '<p class="empty-state">No entries yet. Add a place, person, event, faction, or object to begin mapping your world.</p>';
    return;
  }

  const template = document.getElementById("entry-card-template");
  entryGrid.innerHTML = "";

  state.entries.forEach((entry) => {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector(".entry-card");
    const related = state.connections.filter((connection) => connection.from === entry.id || connection.to === entry.id);
    card.dataset.tag = entry.tag;
    card.dataset.entryId = entry.id;
    card.draggable = true;
    fragment.querySelector(".entry-tag").className = `entry-tag chip chip-${entry.tag}`;
    fragment.querySelector(".entry-tag").textContent = titleCase(entry.tag);
    fragment.querySelector(".entry-title").textContent = entry.name;
    fragment.querySelector(".entry-summary").textContent = entry.summary || "No summary yet.";
    fragment.querySelector(".entry-hook").textContent = entry.hook || "No story hook yet.";
    fragment.querySelector(".entry-connection-count").textContent = `${related.length} connection${related.length === 1 ? "" : "s"}`;
    fragment.querySelector(".entry-connections").innerHTML = related.length
      ? related.map((connection) => {
          const from = getEntryName(connection.from);
          const to = getEntryName(connection.to);
          return `<span class="inline-link">${escapeHtml(from)} ${escapeHtml(connection.label)} ${escapeHtml(to)}</span>`;
        }).join("")
      : '<span class="inline-link">No links yet</span>';
    fragment.querySelector(".remove-entry-btn").addEventListener("click", () => removeEntry(entry.id));
    setupEntryDrag(card, entry.id);
    entryGrid.append(fragment);
  });
}

function renderRelationships() {
  const peopleLinks = state.connections.filter((connection) => {
    const from = state.entries.find((entry) => entry.id === connection.from);
    const to = state.entries.find((entry) => entry.id === connection.to);
    return from?.tag === "person" || to?.tag === "person";
  });

  if (!peopleLinks.length) {
    relationshipList.innerHTML = '<p class="empty-state">No character relationships yet. Add a connection involving a person and it will show here.</p>';
    return;
  }

  const template = document.getElementById("relationship-item-template");
  relationshipList.innerHTML = "";

  peopleLinks.forEach((connection) => {
    const fragment = template.content.cloneNode(true);
    fragment.querySelector(".relationship-title").textContent = `${getEntryName(connection.from)} ${connection.label} ${getEntryName(connection.to)}`;
    fragment.querySelector(".relationship-meta").textContent = `From ${getEntryTag(connection.from)} to ${getEntryTag(connection.to)}`;
    fragment.querySelector(".remove-connection-btn").addEventListener("click", () => removeConnection(connection.id));
    relationshipList.append(fragment);
  });
}

function renderTimeline() {
  if (!state.timeline.length) {
    timelineList.innerHTML = '<p class="empty-state">No timeline beats yet. Add one to start plotting the campaign flow.</p>';
    return;
  }

  const template = document.getElementById("timeline-item-template");
  timelineList.innerHTML = "";

  state.timeline.forEach((beat) => {
    const fragment = template.content.cloneNode(true);
    fragment.querySelector(".timeline-era").textContent = beat.era || "Undated";
    fragment.querySelector(".timeline-title").textContent = beat.title;
    fragment.querySelector(".timeline-linked").textContent = beat.entryId ? `Linked to ${getEntryName(beat.entryId)}` : "No linked entry";
    fragment.querySelector(".timeline-notes").textContent = beat.notes || "No notes yet.";
    fragment.querySelector(".remove-timeline-btn").addEventListener("click", () => removeTimelineBeat(beat.id));
    timelineList.append(fragment);
  });
}

function removeEntry(entryId) {
  const entry = state.entries.find((item) => item.id === entryId);
  if (!entry) return;
  if (!confirm(`Remove "${entry.name}" and all of its connections?`)) return;
  state.entries = state.entries.filter((item) => item.id !== entryId);
  state.connections = state.connections.filter((item) => item.from !== entryId && item.to !== entryId);
  state.timeline = state.timeline.filter((item) => item.entryId !== entryId);
  syncAndRender();
}

function removeConnection(connectionId) {
  const connection = state.connections.find((item) => item.id === connectionId);
  if (!connection) return;
  if (!confirm("Remove this connection?")) return;
  state.connections = state.connections.filter((item) => item.id !== connectionId);
  syncAndRender();
}

function removeTimelineBeat(beatId) {
  const beat = state.timeline.find((item) => item.id === beatId);
  if (!beat) return;
  if (!confirm(`Remove timeline beat "${beat.title}"?`)) return;
  state.timeline = state.timeline.filter((item) => item.id !== beatId);
  syncAndRender();
}

function setupEntryDrag(card, entryId) {
  card.addEventListener("dragstart", (event) => {
    card.classList.add("is-dragging");
    event.dataTransfer?.setData("text/plain", entryId);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("is-dragging");
    clearDropTargets();
  });

  card.addEventListener("dragover", (event) => {
    const sourceId = event.dataTransfer?.getData("text/plain");
    if (!sourceId || sourceId === entryId) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    card.classList.add("is-drop-target");
  });

  card.addEventListener("dragleave", () => {
    card.classList.remove("is-drop-target");
  });

  card.addEventListener("drop", (event) => {
    event.preventDefault();
    const sourceId = event.dataTransfer?.getData("text/plain");
    card.classList.remove("is-drop-target");
    if (!sourceId || sourceId === entryId) return;
    openConnectionModal(sourceId, entryId);
  });
}

function clearDropTargets() {
  document.querySelectorAll(".entry-card.is-drop-target").forEach((card) => {
    card.classList.remove("is-drop-target");
  });
}

function openConnectionModal(fromId, toId) {
  dragConnectionState.from = fromId;
  dragConnectionState.to = toId;
  connectionModalCopy.textContent = `Connect "${getEntryName(fromId)}" to "${getEntryName(toId)}"?`;
  modalConnectionLabel.value = "";
  connectionModal.classList.remove("hidden");
  connectionModal.setAttribute("aria-hidden", "false");
  modalConnectionLabel.focus();
}

function closeConnectionModal() {
  dragConnectionState.from = "";
  dragConnectionState.to = "";
  closeModal(connectionModal, connectionModalForm);
  clearDropTargets();
}

function openModal(modal) {
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(modal, form = null) {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  if (form) form.reset();
}

function createConnection(from, to, label) {
  if (!from || !to || from === to) return false;
  state.connections.push({
    id: crypto.randomUUID(),
    from,
    label,
    to
  });
  return true;
}

function setWorkspaceTab(tab) {
  const isBoard = tab === "board";
  const isRelationship = tab === "relationship";
  const isTimeline = tab === "timeline";

  workspaceTabBoard.classList.toggle("is-active", isBoard);
  workspaceTabBoard.setAttribute("aria-selected", String(isBoard));
  workspacePanelBoard.classList.toggle("hidden", !isBoard);
  workspacePanelBoard.classList.toggle("is-active", isBoard);

  workspaceTabRelationship.classList.toggle("is-active", isRelationship);
  workspaceTabRelationship.setAttribute("aria-selected", String(isRelationship));
  workspacePanelRelationship.classList.toggle("hidden", !isRelationship);
  workspacePanelRelationship.classList.toggle("is-active", isRelationship);

  workspaceTabTimeline.classList.toggle("is-active", isTimeline);
  workspaceTabTimeline.setAttribute("aria-selected", String(isTimeline));
  workspacePanelTimeline.classList.toggle("hidden", !isTimeline);
  workspacePanelTimeline.classList.toggle("is-active", isTimeline);

  openEntryModalBtn.classList.toggle("hidden", !isBoard);
  openTimelineModalBtn.classList.toggle("hidden", !isTimeline);
}

setWorkspaceTab("board");

function getEntryName(id) {
  return state.entries.find((entry) => entry.id === id)?.name || "Unknown";
}

function getEntryTag(id) {
  const tag = state.entries.find((entry) => entry.id === id)?.tag || "entry";
  return titleCase(tag);
}

function titleCase(value) {
  return String(value || "").replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (parsed && typeof parsed === "object") {
      return {
        entries: Array.isArray(parsed.entries) ? parsed.entries : [],
        connections: Array.isArray(parsed.connections) ? parsed.connections : [],
        timeline: Array.isArray(parsed.timeline) ? parsed.timeline : []
      };
    }
  } catch (error) {
    console.warn("Unable to load saved world builder data.", error);
  }
  return { entries: [], connections: [], timeline: [] };
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

syncAndRender();
