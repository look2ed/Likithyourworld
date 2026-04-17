const STORAGE_KEY = "trpg-world-builder-v1";
const TAG_LABELS = {
  place: "สถานที่",
  person: "ตัวละคร",
  event: "เหตุการณ์",
  faction: "ฝ่าย/สังกัด",
  object: "วัตถุ",
  entry: "ข้อมูล"
};
const BUILTIN_TAGS = new Set(["place", "person", "event", "faction", "object"]);

const demoState = {
  entries: [
    {
      id: crypto.randomUUID(),
      name: "ท่าเรือสีเทา",
      tag: "place",
      summary: "ท่าเรือซึ่งถูกหมอกปกคลุมด้วยหมอกหนาตลอดทั้งปี เป็นจุดเริ่มต้นของการหายตัวไปอย่างลึกลับของชาวเมือง และผู้มาเยือน ใครบางคนกล่าวว่ามันเกี่ยวข้องกับ 'บางอย่าง' ที่ถูกปลุกขึ้นมาจากใต้ท้องทะเล",
      highlighted: true
    },
    {
      id: crypto.randomUUID(),
      name: "กัปตันมิคาเอล",
      tag: "person",
      summary: "กัปตันเรือผู้มากประสบการณ์ที่ทุกคนให้ความเคารพ เขาเป็นผู้เชี่ยวชาญน่านน้ำแถบนี้ เขาสัมผัสได้ว่ากระแสน้ำกำลังเปลี่ยนไป",
      gender: "ชาย",
      age: "42",
      species: "มนุษย์"
    },
    {
      id: crypto.randomUUID(),
      name: "คืนเทศกาลแห่งแสงจันทร์",
      tag: "event",
      summary: "เทศกาลประจำปีที่ชาวเมืองจะมารวมตัวกันที่ท่าเรือเพื่อเฉลิมฉลองและปล่อยโคมลอยขึ้นสู่ท้องฟ้า ในคืนนั้นเองที่เกิดเหตุการณ์หายตัวไปของผู้คนเป็นครั้งแรก และนั่นไม่ใช่ครั้งสุดท้าย...",
    }
  ],
  connections: [],
  timeline: [],
  relationshipLayout: {}
};

demoState.connections = [
  {
    id: crypto.randomUUID(),
    from: demoState.entries[1].id,
    label: "อาศัยอยู่ที่",
    to: demoState.entries[0].id
  },
  {
    id: crypto.randomUUID(),
    from: demoState.entries[2].id,
    label: "จัดขึ้นที่",
    to: demoState.entries[0].id
  }
];

const state = loadState();

const entryForm = document.getElementById("entry-form");
const timelineForm = document.getElementById("timeline-form");
const entryTagSelect = document.getElementById("entry-tag");
const entryHighlightedInput = document.getElementById("entry-highlighted");
const personFields = document.getElementById("person-fields");
const personGenderInput = document.getElementById("person-gender");
const personAgeInput = document.getElementById("person-age");
const personSpeciesInput = document.getElementById("person-species");
const eventFields = document.getElementById("event-fields");
const eventSessionInput = document.getElementById("event-session");
const eventDateInput = document.getElementById("event-date");
const eventYearInput = document.getElementById("event-year");
const entryFilterNote = document.getElementById("entry-filter-note");
const customTagLabel = document.getElementById("custom-tag-label");
const customTagInput = document.getElementById("custom-tag-input");
const entryConnectionsEditor = document.getElementById("entry-connections-editor");
const entryConnectionsEditorList = document.getElementById("entry-connections-editor-list");
const entryGrid = document.getElementById("entry-grid");
const relationshipBoard = document.getElementById("relationship-board");
const relationshipLines = document.getElementById("relationship-lines");
const relationshipNodes = document.getElementById("relationship-nodes");
const relationshipEmptyState = document.getElementById("relationship-empty-state");
const relationshipLineTooltip = document.getElementById("relationship-line-tooltip");
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
const openRelationshipPersonModalBtn = document.getElementById("open-relationship-person-modal-btn");
const openTimelineModalBtn = document.getElementById("open-timeline-modal-btn");
const entryModal = document.getElementById("entry-modal");
const entryModalBackdrop = document.getElementById("entry-modal-backdrop");
const closeEntryModalBtn = document.getElementById("close-entry-modal");
const cancelEntryModalBtn = document.getElementById("cancel-entry-modal");
const removeEntryModalBtn = document.getElementById("remove-entry-modal-btn");
const entryDetailModal = document.getElementById("entry-detail-modal");
const entryDetailBackdrop = document.getElementById("entry-detail-backdrop");
const entryDetailTag = document.getElementById("entry-detail-tag");
const entryDetailTitle = document.getElementById("entry-detail-title");
const entryDetailPerson = document.getElementById("entry-detail-person");
const entryDetailSummary = document.getElementById("entry-detail-summary");
const closeEntryDetailModalBtn = document.getElementById("close-entry-detail-modal");
const closeEntryDetailBtn = document.getElementById("close-entry-detail-btn");
const timelineModal = document.getElementById("timeline-modal");
const timelineModalBackdrop = document.getElementById("timeline-modal-backdrop");
const closeTimelineModalBtn = document.getElementById("close-timeline-modal");
const cancelTimelineModalBtn = document.getElementById("cancel-timeline-modal");
const connectionModal = document.getElementById("connection-modal");
const connectionModalBackdrop = document.getElementById("connection-modal-backdrop");
const connectionModalCopy = document.getElementById("connection-modal-copy");
const connectionModalForm = document.getElementById("connection-modal-form");
const connectionStyleGrid = document.querySelector(".connection-style-grid");
const modalConnectionLabel = document.getElementById("modal-connection-label");
const modalConnectionColor = document.getElementById("modal-connection-color");
const modalConnectionLineStyle = document.getElementById("modal-connection-line-style");
const connectionFromEntryBtn = document.getElementById("connection-from-entry");
const connectionToEntryBtn = document.getElementById("connection-to-entry");
const swapConnectionDirectionBtn = document.getElementById("swap-connection-direction");
const closeConnectionModalBtn = document.getElementById("close-connection-modal");
const cancelConnectionModalBtn = document.getElementById("cancel-connection-modal");
const removeConnectionModalBtn = document.getElementById("remove-connection-modal-btn");

const dragConnectionState = {
  from: "",
  to: ""
};

const dragPreviewState = {
  source: ""
};

const editorState = {
  entryId: "",
  timelineId: "",
  connectionId: ""
};

const filterState = {
  tag: "",
  relatedEntryId: ""
};

const relationshipDragState = {
  entryId: "",
  pointerId: -1,
  offsetX: 0,
  offsetY: 0,
  hoverTargetId: ""
};

const relationshipLineState = {
  hoveredConnectionId: "",
  tooltipX: 0,
  tooltipY: 0
};

const connectionModalState = {
  showStyleOptions: false
};

const entryModalState = {
  lockedTag: ""
};

const timelineDragState = {
  entryId: "",
  source: ""
};

const RELATIONSHIP_NODE_WIDTH = 180;
const RELATIONSHIP_NODE_HEIGHT = 64;
const RELATIONSHIP_BOARD_PADDING = 24;
const RELATIONSHIP_NODE_GAP = 28;

workspaceTabBoard.addEventListener("click", () => setWorkspaceTab("board"));
workspaceTabRelationship.addEventListener("click", () => setWorkspaceTab("relationship"));
workspaceTabTimeline.addEventListener("click", () => setWorkspaceTab("timeline"));
entryTagSelect.addEventListener("change", handleEntryTagChange);
document.querySelectorAll(".legend-filter-btn").forEach((button) => {
  button.addEventListener("click", () => setEntryFilter(button.dataset.filterTag || ""));
});

entryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const resolvedTag = getEntryFormTag();
  if (!resolvedTag) {
    customTagInput.focus();
    return;
  }
  const entryPayload = {
    name: document.getElementById("entry-name").value.trim(),
    tag: resolvedTag,
    summary: document.getElementById("entry-summary").value.trim(),
    highlighted: entryHighlightedInput.checked,
    gender: resolvedTag === "person" ? personGenderInput.value.trim() : "",
    age: resolvedTag === "person" ? personAgeInput.value.trim() : "",
    species: resolvedTag === "person" ? personSpeciesInput.value.trim() : "",
    session: resolvedTag === "event" ? normalizeNumericText(eventSessionInput.value) : "",
    date: resolvedTag === "event" ? normalizeNumericText(eventDateInput.value) : "",
    year: resolvedTag === "event" ? normalizeNumericText(eventYearInput.value) : ""
  };

  if (editorState.entryId) {
    const entry = state.entries.find((item) => item.id === editorState.entryId);
    if (entry) Object.assign(entry, entryPayload);
  } else {
    state.entries.push({
      id: crypto.randomUUID(),
      ...entryPayload
    });
  }

  closeModal(entryModal, entryForm);
  syncAndRender();
});

timelineForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const beatPayload = {
    title: document.getElementById("timeline-title").value.trim(),
    era: document.getElementById("timeline-era").value.trim(),
    entryId: timelineEntry.value,
    notes: document.getElementById("timeline-notes").value.trim()
  };

  if (editorState.timelineId) {
    const beat = state.timeline.find((item) => item.id === editorState.timelineId);
    if (beat) Object.assign(beat, beatPayload);
  } else {
    state.timeline.push({
      id: crypto.randomUUID(),
      ...beatPayload
    });
  }

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
    state.entries = Array.isArray(imported.entries)
      ? imported.entries.map((entry) => ({
          ...entry,
          highlighted: Boolean(entry.highlighted),
          gender: typeof entry.gender === "string" ? entry.gender : "",
          age: typeof entry.age === "string" ? entry.age : "",
          species: typeof entry.species === "string" ? entry.species : "",
          session: typeof entry.session === "string" ? entry.session : "",
          date: typeof entry.date === "string" ? entry.date : "",
          year: typeof entry.year === "string" ? entry.year : ""
        }))
      : [];
    state.connections = Array.isArray(imported.connections) ? imported.connections.map(normalizeConnection) : [];
    state.timeline = normalizeTimeline(imported.timeline);
    state.relationshipLayout = normalizeRelationshipLayout(imported.relationshipLayout);
    syncAndRender();
  } catch (error) {
    alert("ไม่สามารถอ่านไฟล์นี้เป็นข้อมูลของกระดานสร้างโลกได้");
  } finally {
    importInput.value = "";
  }
});

resetBtn.addEventListener("click", () => {
  if (!confirm("ต้องการล้างข้อมูลทั้งหมดและลบข้อมูลที่บันทึกไว้หรือไม่?")) return;
  state.entries = [];
  state.connections = [];
  state.timeline = [];
  state.relationshipLayout = {};
  syncAndRender();
});

openEntryModalBtn.addEventListener("click", () => {
  prepareEntryCreate();
  openModal(entryModal);
  document.getElementById("entry-name").focus();
});

openRelationshipPersonModalBtn.addEventListener("click", () => {
  prepareEntryCreate({ lockedTag: "person" });
  openModal(entryModal);
  document.getElementById("entry-name").focus();
});

openTimelineModalBtn.addEventListener("click", () => {
  prepareEntryCreate({ lockedTag: "event" });
  openModal(entryModal);
  document.getElementById("entry-name").focus();
});

connectionModalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!dragConnectionState.from || !dragConnectionState.to) return;
  const label = modalConnectionLabel.value.trim() || "เชื่อมโยงกับ";
  const stylePayload = getConnectionStylePayload();

  if (editorState.connectionId) {
    const connection = state.connections.find((item) => item.id === editorState.connectionId);
    if (connection) Object.assign(connection, { label, ...stylePayload });
  } else {
    createConnection(
      dragConnectionState.from,
      dragConnectionState.to,
      label,
      stylePayload
    );
  }

  closeConnectionModal();
  syncAndRender();
});

closeEntryModalBtn.addEventListener("click", () => closeModal(entryModal, entryForm));
cancelEntryModalBtn.addEventListener("click", () => closeModal(entryModal, entryForm));
removeEntryModalBtn.addEventListener("click", () => {
  if (!editorState.entryId) return;
  const entryId = editorState.entryId;
  closeModal(entryModal, entryForm);
  removeEntry(entryId);
});
entryModalBackdrop.addEventListener("click", () => closeModal(entryModal, entryForm));
closeEntryDetailModalBtn.addEventListener("click", closeEntryDetailModal);
closeEntryDetailBtn.addEventListener("click", closeEntryDetailModal);
entryDetailBackdrop.addEventListener("click", closeEntryDetailModal);
closeTimelineModalBtn.addEventListener("click", () => closeModal(timelineModal, timelineForm));
cancelTimelineModalBtn.addEventListener("click", () => closeModal(timelineModal, timelineForm));
timelineModalBackdrop.addEventListener("click", () => closeModal(timelineModal, timelineForm));
closeConnectionModalBtn.addEventListener("click", closeConnectionModal);
cancelConnectionModalBtn.addEventListener("click", closeConnectionModal);
removeConnectionModalBtn.addEventListener("click", () => {
  if (!editorState.connectionId) return;
  const connectionId = editorState.connectionId;
  closeConnectionModal();
  removeConnection(connectionId);
});
swapConnectionDirectionBtn.addEventListener("click", swapConnectionDirection);
connectionModalBackdrop.addEventListener("click", closeConnectionModal);
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!connectionModal.classList.contains("hidden")) closeConnectionModal();
  if (!entryDetailModal.classList.contains("hidden")) closeEntryDetailModal();
  if (!entryModal.classList.contains("hidden")) closeModal(entryModal, entryForm);
  if (!timelineModal.classList.contains("hidden")) closeModal(timelineModal, timelineForm);
});

function syncAndRender() {
  persistState();
  renderSelectOptions();
  renderEntries();
  renderRelationships();
  renderTimeline();
  renderEntryEditorConnections();
}

function renderSelectOptions() {
  const options = state.entries
    .filter((entry) => entry.tag === "event")
    .map((entry) => `<option value="${entry.id}">${escapeHtml(entry.name)} (${getTagLabel(entry.tag)})</option>`)
    .join("");
  timelineEntry.innerHTML = `<option value="">ไม่มี</option>${options}`;
}

function renderEntries() {
  if (!state.entries.length) {
    entryGrid.innerHTML = '<p class="empty-state">ยังไม่มีข้อมูล เริ่มต้นด้วยการเพิ่มรายการใหม่ลงบนกระดานของคุณ</p>';
    updateEntryFilterUi();
    return;
  }

  const template = document.getElementById("entry-card-template");
  entryGrid.innerHTML = "";

  const orderedEntries = [...state.entries].sort((left, right) => {
    if (left.highlighted !== right.highlighted) return Number(right.highlighted) - Number(left.highlighted);
    return left.name.localeCompare(right.name, "th");
  });

  const visibleEntries = orderedEntries.filter((entry) => matchesEntryFilter(entry));

  if (!visibleEntries.length) {
    entryGrid.innerHTML = `<p class="empty-state">${escapeHtml(getEmptyFilterMessage())}</p>`;
    updateEntryFilterUi();
    return;
  }

  visibleEntries.forEach((entry) => {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector(".entry-card");
    const related = state.connections.filter((connection) => connection.from === entry.id || connection.to === entry.id);
    card.dataset.tag = getTagStyleKey(entry.tag);
    card.dataset.entryId = entry.id;
    card.draggable = true;
    fragment.querySelector(".entry-tag").className = `entry-tag chip chip-${getTagStyleKey(entry.tag)}`;
    fragment.querySelector(".entry-tag").textContent = getTagLabel(entry.tag);
    fragment.querySelector(".entry-tag").addEventListener("click", () => setEntryFilter(entry.tag));
    fragment.querySelector(".related-filter-btn").classList.toggle("is-active", filterState.relatedEntryId === entry.id);
    fragment.querySelector(".related-filter-btn").addEventListener("click", () => setRelatedEntryFilter(entry.id));
    fragment.querySelector(".highlight-pill").classList.toggle("hidden", !entry.highlighted);
    fragment.querySelector(".entry-title").textContent = entry.name;
    renderEntrySummary(fragment.querySelector(".entry-summary"), entry);
    const metaItems = [];
    if (entry.tag === "person") {
      if (entry.gender) metaItems.push(`เพศ: ${entry.gender}`);
      if (entry.age) metaItems.push(`อายุ: ${entry.age}`);
      if (entry.species) metaItems.push(`เผ่าพันธุ์: ${entry.species}`);
    } else if (entry.tag === "event") {
      if (entry.session) metaItems.push(`Session: ${entry.session}`);
      if (entry.date) metaItems.push(`วันที่: ${entry.date}`);
      if (entry.year) metaItems.push(`ปี: ${entry.year}`);
    }
    metaItems.push(`${related.length} ความเชื่อมโยง`);
    fragment.querySelector(".entry-connection-count").textContent = metaItems.join(" • ");
    fragment.querySelector(".entry-connections").innerHTML = related.length
      ? related.map((connection) => {
          const from = getEntryName(connection.from);
          const to = getEntryName(connection.to);
          return `<span class="inline-link">${escapeHtml(from)} ${escapeHtml(connection.label)} ${escapeHtml(to)}</span>`;
        }).join("")
      : '<span class="inline-link">ยังไม่มีความเชื่อมโยง</span>';
    fragment.querySelector(".edit-entry-btn").addEventListener("click", () => openEntryEditor(entry.id));
    fragment.querySelector(".remove-entry-btn").addEventListener("click", () => removeEntry(entry.id));
    setupEntryDrag(card, entry.id);
    entryGrid.append(fragment);
  });

  updateEntryFilterUi();
}

function renderRelationships() {
  const personEntries = getRelationshipPeople();
  const personConnections = getPersonConnections();

  if (!personEntries.length) {
    relationshipBoard.classList.add("hidden");
    relationshipEmptyState.classList.remove("hidden");
    relationshipEmptyState.textContent = "ยังไม่มีตัวละครเพื่อแสดงบนกระดานความสัมพันธ์";
    return;
  }

  relationshipBoard.classList.remove("hidden");
  relationshipEmptyState.classList.add("hidden");

  ensureRelationshipLayout(personEntries);
  const boardHeight = updateRelationshipBoardSize(personEntries);
  relationshipNodes.innerHTML = "";

  personEntries.forEach((entry) => {
    const node = document.createElement("button");
    node.type = "button";
    node.className = "relationship-node";
    node.dataset.entryId = entry.id;
    node.textContent = entry.name;
    node.title = "ลากเพื่อจัดวางบนกระดานความสัมพันธ์";
    applyRelationshipNodePosition(node, state.relationshipLayout[entry.id]);
    node.addEventListener("pointerdown", startRelationshipNodeDrag);
    node.addEventListener("dblclick", () => openEntryEditor(entry.id));
    relationshipNodes.append(node);
  });

  relationshipNodes.style.height = `${boardHeight}px`;
  drawRelationshipLines(personConnections, boardHeight);
}

function renderTimeline() {
  const eventEntries = state.entries.filter((entry) => entry.tag === "event");

  if (!eventEntries.length) {
    timelineList.innerHTML = '<p class="empty-state">ยังไม่มี entry ประเภทเหตุการณ์ เพิ่มเหตุการณ์เพื่อเริ่มวางไทม์ไลน์</p>';
    return;
  }

  const validTimeline = state.timeline.filter((entryId) => eventEntries.some((entry) => entry.id === entryId));
  state.timeline = validTimeline;
  const placedEntryIds = new Set(validTimeline);
  const unusedEntries = eventEntries
    .filter((entry) => !placedEntryIds.has(entry.id))
    .sort((left, right) => left.name.localeCompare(right.name, "th"));
  const placedEntries = validTimeline
    .map((entryId) => state.entries.find((entry) => entry.id === entryId))
    .filter(Boolean);

  timelineList.innerHTML = "";
  const workspace = document.createElement("div");
  workspace.className = "timeline-workspace";

  const leftColumn = document.createElement("section");
  leftColumn.className = "timeline-column";
  leftColumn.innerHTML = `
    <div>
      <h3>ยังไม่ใช้งาน</h3>
      <p class="panel-note">ลากไปวางบนลำดับเหตุการณ์</p>
    </div>
  `;
  const leftPanel = document.createElement("div");
  leftPanel.className = "timeline-column-panel";
  leftPanel.append(createTimelinePoolDropzone());
  if (unusedEntries.length) {
    unusedEntries.forEach((entry) => leftPanel.append(createTimelineCard(entry, { source: "pool" })));
  } else {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "ทุกเหตุการณ์ถูกจัดวางแล้ว";
    leftPanel.append(emptyState);
  }
  leftColumn.append(leftPanel);

  const rightColumn = document.createElement("section");
  rightColumn.className = "timeline-column";
  rightColumn.innerHTML = `
    <div>
      <h3>ลำดับเหตุการณ์</h3>
      <p class="panel-note">ลากเพื่อจัดลำดับจากบนลงล่าง</p>
    </div>
  `;

  const warnings = getTimelineOrderWarnings(placedEntries);
  if (warnings.length) {
    const warningList = document.createElement("div");
    warningList.className = "timeline-warning-list";
    warnings.forEach((warning) => {
      const item = document.createElement("p");
      item.className = "timeline-warning";
      item.textContent = warning;
      warningList.append(item);
    });
    rightColumn.append(warningList);
  }

  const rightPanel = document.createElement("div");
  rightPanel.className = "timeline-column-panel timeline-branch";
  rightPanel.append(createTimelineDropzone(0));
  if (placedEntries.length) {
    placedEntries.forEach((entry, index) => {
      rightPanel.append(createTimelineCard(entry, { source: "timeline" }));
      rightPanel.append(createTimelineDropzone(index + 1));
    });
  } else {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "ยังไม่มีลำดับเหตุการณ์";
    rightPanel.append(emptyState);
  }
  rightColumn.append(rightPanel);

  workspace.append(leftColumn, rightColumn);
  timelineList.append(workspace);
}

function removeEntry(entryId) {
  const entry = state.entries.find((item) => item.id === entryId);
  if (!entry) return;
  if (!confirm(`ต้องการลบ "${entry.name}" และความเชื่อมโยงทั้งหมดของรายการนี้หรือไม่?`)) return;
  if (filterState.relatedEntryId === entryId) filterState.relatedEntryId = "";
  delete state.relationshipLayout[entryId];
  state.entries = state.entries.filter((item) => item.id !== entryId);
  state.connections = state.connections.filter((item) => item.from !== entryId && item.to !== entryId);
  state.timeline = state.timeline.filter((item) => item !== entryId && item?.entryId !== entryId);
  syncAndRender();
}

function removeConnection(connectionId) {
  const connection = state.connections.find((item) => item.id === connectionId);
  if (!connection) return;
  if (!confirm("ต้องการลบความสัมพันธ์นี้หรือไม่?")) return;
  state.connections = state.connections.filter((item) => item.id !== connectionId);
  syncAndRender();
}

function removeTimelineBeat(beatId) {
  const beat = state.timeline.find((item) => item.id === beatId);
  if (!beat) return;
  if (!confirm(`ต้องการลบเหตุการณ์ "${beat.title}" ออกจากไทม์ไลน์หรือไม่?`)) return;
  state.timeline = state.timeline.filter((item) => item.id !== beatId);
  syncAndRender();
}

function setupEntryDrag(card, entryId) {
  const dropHint = card.querySelector(".entry-drop-hint");
  card.draggable = true;

  card.querySelectorAll("button").forEach((button) => {
    button.draggable = false;
    button.addEventListener("dragstart", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
  });

  card.addEventListener("dragstart", (event) => {
    card.classList.add("is-dragging");
    dragPreviewState.source = entryId;
    event.dataTransfer?.setData("text/plain", entryId);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("is-dragging");
    dragPreviewState.source = "";
    clearDropTargets();
  });

  card.addEventListener("dragenter", (event) => {
    const sourceId = event.dataTransfer?.getData("text/plain") || dragPreviewState.source;
    if (!sourceId || sourceId === entryId) return;
    card.classList.add("is-drop-target");
    if (dropHint) {
      dropHint.textContent = `เชื่อมโยง ${getEntryName(sourceId)} -> ${getEntryName(entryId)}`;
      dropHint.classList.remove("hidden");
    }
  });

  card.addEventListener("dragover", (event) => {
    const sourceId = event.dataTransfer?.getData("text/plain") || dragPreviewState.source;
    if (!sourceId || sourceId === entryId) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    card.classList.add("is-drop-target");
    if (dropHint) {
      dropHint.textContent = `เชื่อมโยง ${getEntryName(sourceId)} -> ${getEntryName(entryId)}`;
      dropHint.classList.remove("hidden");
    }
  });

  card.addEventListener("dragleave", () => {
    card.classList.remove("is-drop-target");
    if (dropHint) dropHint.classList.add("hidden");
  });

  card.addEventListener("drop", (event) => {
    event.preventDefault();
    const sourceId = event.dataTransfer?.getData("text/plain") || dragPreviewState.source;
    card.classList.remove("is-drop-target");
    if (dropHint) dropHint.classList.add("hidden");
    if (!sourceId || sourceId === entryId) return;
    openConnectionModal(sourceId, entryId);
  });
}

function clearDropTargets() {
  document.querySelectorAll(".entry-card.is-drop-target").forEach((card) => {
    card.classList.remove("is-drop-target");
  });
  document.querySelectorAll(".entry-drop-hint").forEach((hint) => {
    hint.classList.add("hidden");
  });
}

function openConnectionModal(fromId, toId, options = {}) {
  prepareConnectionCreate();
  connectionModalState.showStyleOptions = Boolean(options.showStyleOptions);
  syncConnectionStyleUi();
  dragConnectionState.from = fromId;
  dragConnectionState.to = toId;
  updateConnectionBuilder();
  openModal(connectionModal);
  modalConnectionLabel.focus();
}

function closeConnectionModal() {
  dragConnectionState.from = "";
  dragConnectionState.to = "";
  connectionModalState.showStyleOptions = false;
  closeModal(connectionModal, connectionModalForm);
  clearDropTargets();
}

function openEntryDetailModal(entryId) {
  const entry = state.entries.find((item) => item.id === entryId);
  if (!entry) return;
  entryDetailTag.textContent = getTagLabel(entry.tag);
  entryDetailTitle.textContent = entry.name;
  const personDetails = [];
  if (entry.tag === "person") {
    if (entry.gender) personDetails.push(`เพศ: ${entry.gender}`);
    if (entry.age) personDetails.push(`อายุ: ${entry.age}`);
    if (entry.species) personDetails.push(`เผ่าพันธุ์: ${entry.species}`);
  } else if (entry.tag === "event") {
    if (entry.session) personDetails.push(`Session: ${entry.session}`);
    if (entry.date) personDetails.push(`วันที่: ${entry.date}`);
    if (entry.year) personDetails.push(`ปี: ${entry.year}`);
  }
  entryDetailPerson.textContent = personDetails.join(" • ");
  entryDetailPerson.classList.toggle("hidden", !personDetails.length);
  entryDetailSummary.textContent = entry.summary || "ยังไม่มีรายละเอียด";
  openModal(entryDetailModal);
}

function closeEntryDetailModal() {
  closeModal(entryDetailModal);
}

function openModal(modal) {
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(modal, form = null) {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  if (form) form.reset();
  if (modal === entryModal) prepareEntryCreate();
  if (modal === timelineModal) prepareTimelineCreate();
  if (modal === connectionModal) prepareConnectionCreate();
}

function createConnection(from, to, label, stylePayload = getDefaultConnectionStyle()) {
  if (!from || !to || from === to) return false;
  state.connections.push({
    id: crypto.randomUUID(),
    from,
    label,
    ...stylePayload,
    to
  });
  return true;
}

function prepareEntryCreate(options = {}) {
  editorState.entryId = "";
  entryModalState.lockedTag = options.lockedTag || "";
  document.getElementById("entry-modal-title").textContent = "เพิ่มข้อมูลใหม่";
  document.querySelector('#entry-form button[type="submit"]').textContent = "เพิ่มข้อมูล";
  entryTagSelect.value = entryModalState.lockedTag || "place";
  entryTagSelect.disabled = Boolean(entryModalState.lockedTag);
  entryHighlightedInput.checked = false;
  personGenderInput.value = "";
  personAgeInput.value = "";
  personSpeciesInput.value = "";
  eventSessionInput.value = "";
  eventDateInput.value = "";
  eventYearInput.value = "";
  customTagInput.value = "";
  removeEntryModalBtn.classList.add("hidden");
  entryConnectionsEditor.classList.add("hidden");
  entryConnectionsEditorList.innerHTML = "";
  syncCustomTagField();
}

function prepareTimelineCreate() {
  editorState.timelineId = "";
  document.getElementById("timeline-modal-title").textContent = "เพิ่มเหตุการณ์ในไทม์ไลน์";
  document.querySelector('#timeline-form button[type="submit"]').textContent = "เพิ่มเหตุการณ์";
}

function prepareConnectionCreate() {
  editorState.connectionId = "";
  document.getElementById("connection-modal-title").textContent = "สร้างความเชื่อมโยง";
  document.querySelector('#connection-modal-form button[type="submit"]').textContent = "เชื่อมโยง";
  connectionFromEntryBtn.textContent = "";
  connectionToEntryBtn.textContent = "";
  connectionModalCopy.textContent = "";
  removeConnectionModalBtn.classList.add("hidden");
  connectionModalState.showStyleOptions = false;
  syncConnectionStyleUi();
  applyConnectionStyleFields(getDefaultConnectionStyle());
}

function openEntryEditor(entryId) {
  const entry = state.entries.find((item) => item.id === entryId);
  if (!entry) return;
  editorState.entryId = entryId;
  entryModalState.lockedTag = "";
  document.getElementById("entry-modal-title").textContent = "แก้ไขข้อมูล";
  document.querySelector('#entry-form button[type="submit"]').textContent = "บันทึกข้อมูล";
  document.getElementById("entry-name").value = entry.name;
  entryHighlightedInput.checked = Boolean(entry.highlighted);
  personGenderInput.value = entry.gender || "";
  personAgeInput.value = entry.age || "";
  personSpeciesInput.value = entry.species || "";
  eventSessionInput.value = entry.session || "";
  eventDateInput.value = entry.date || "";
  eventYearInput.value = entry.year || "";
  removeEntryModalBtn.classList.remove("hidden");
  if (isBuiltinTag(entry.tag)) {
    entryTagSelect.value = entry.tag;
    customTagInput.value = "";
  } else {
    entryTagSelect.value = "custom";
    customTagInput.value = entry.tag;
  }
  entryTagSelect.disabled = false;
  syncCustomTagField();
  document.getElementById("entry-summary").value = entry.summary || "";
  renderEntryEditorConnections();
  openModal(entryModal);
  document.getElementById("entry-name").focus();
}

function openTimelineEditor(beatId) {
  const beat = state.timeline.find((item) => item.id === beatId);
  if (!beat) return;
  editorState.timelineId = beatId;
  document.getElementById("timeline-modal-title").textContent = "แก้ไขเหตุการณ์ในไทม์ไลน์";
  document.querySelector('#timeline-form button[type="submit"]').textContent = "บันทึกเหตุการณ์";
  document.getElementById("timeline-title").value = beat.title;
  document.getElementById("timeline-era").value = beat.era || "";
  timelineEntry.value = beat.entryId || "";
  document.getElementById("timeline-notes").value = beat.notes || "";
  openModal(timelineModal);
  document.getElementById("timeline-title").focus();
}

function openConnectionEditor(connectionId, options = {}) {
  const connection = state.connections.find((item) => item.id === connectionId);
  if (!connection) return;
  editorState.connectionId = connectionId;
  removeConnectionModalBtn.classList.remove("hidden");
  connectionModalState.showStyleOptions = Boolean(options.showStyleOptions);
  syncConnectionStyleUi();
  dragConnectionState.from = connection.from;
  dragConnectionState.to = connection.to;
  document.getElementById("connection-modal-title").textContent = "แก้ไขความเชื่อมโยง";
  document.querySelector('#connection-modal-form button[type="submit"]').textContent = "บันทึกความเชื่อมโยง";
  updateConnectionBuilder();
  modalConnectionLabel.value = connection.label;
  applyConnectionStyleFields(connection);
  openModal(connectionModal);
  modalConnectionLabel.focus();
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
  if (isRelationship) {
    requestAnimationFrame(renderRelationships);
  }

  workspaceTabTimeline.classList.toggle("is-active", isTimeline);
  workspaceTabTimeline.setAttribute("aria-selected", String(isTimeline));
  workspacePanelTimeline.classList.toggle("hidden", !isTimeline);
  workspacePanelTimeline.classList.toggle("is-active", isTimeline);

  openEntryModalBtn.classList.toggle("hidden", !isBoard);
  openRelationshipPersonModalBtn.classList.toggle("hidden", !isRelationship);
  openTimelineModalBtn.classList.toggle("hidden", !isTimeline);
}

setWorkspaceTab("board");

function getEntryName(id) {
  return state.entries.find((entry) => entry.id === id)?.name || "ไม่ทราบชื่อ";
}

function getEntryTag(id) {
  const tag = state.entries.find((entry) => entry.id === id)?.tag || "entry";
  return getTagLabel(tag);
}

function getTagLabel(tag) {
  return TAG_LABELS[tag] || tag || TAG_LABELS.entry;
}

function getTagStyleKey(tag) {
  return isBuiltinTag(tag) ? tag : "custom";
}

function isBuiltinTag(tag) {
  return BUILTIN_TAGS.has(tag);
}

function handleEntryTagChange() {
  syncCustomTagField();
}

function syncCustomTagField() {
  const isCustom = entryTagSelect.value === "custom";
  const isPerson = entryTagSelect.value === "person";
  const isEvent = entryTagSelect.value === "event";
  personFields.classList.toggle("hidden", !isPerson);
  eventFields.classList.toggle("hidden", !isEvent);
  customTagLabel.classList.toggle("hidden", !isCustom);
  customTagInput.required = isCustom;
  if (!isCustom) customTagInput.value = "";
  if (!isPerson) {
    personGenderInput.value = "";
    personAgeInput.value = "";
    personSpeciesInput.value = "";
  }
  if (!isEvent) {
    eventSessionInput.value = "";
    eventDateInput.value = "";
    eventYearInput.value = "";
  }
}

function getEntryFormTag() {
  if (entryTagSelect.value !== "custom") return entryTagSelect.value;
  return customTagInput.value.trim();
}

function setEntryFilter(tag) {
  filterState.tag = filterState.tag === tag ? "" : tag;
  renderEntries();
}

function matchesEntryFilter(entry) {
  const matchesTag = !filterState.tag
    ? true
    : filterState.tag === "custom"
      ? !isBuiltinTag(entry.tag)
      : entry.tag === filterState.tag;

  const matchesRelated = !filterState.relatedEntryId
    ? true
    : entry.id === filterState.relatedEntryId || isEntryRelatedTo(entry.id, filterState.relatedEntryId);

  return matchesTag && matchesRelated;
}

function updateEntryFilterUi() {
  document.querySelectorAll(".legend-filter-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filterTag === filterState.tag);
  });

  if (!filterState.tag && !filterState.relatedEntryId) {
    entryFilterNote.textContent = "กด tag เพื่อกรอง entry ตามหมวดหมู่";
    return;
  }

  const notes = [];
  if (filterState.tag) notes.push(`หมวด ${getFilterLabel(filterState.tag)}`);
  if (filterState.relatedEntryId) notes.push(`รายการที่เกี่ยวข้องกับ ${getEntryName(filterState.relatedEntryId)}`);
  entryFilterNote.textContent = `กำลังแสดงเฉพาะ${notes.join(" และ ")} กดปุ่มเดิมซ้ำอีกครั้งเพื่อยกเลิก`;
}

function getFilterLabel(tag) {
  return tag === "custom" ? "อื่น ๆ" : getTagLabel(tag);
}

function setRelatedEntryFilter(entryId) {
  filterState.relatedEntryId = filterState.relatedEntryId === entryId ? "" : entryId;
  renderEntries();
}

function isEntryRelatedTo(entryId, selectedEntryId) {
  return state.connections.some((connection) => (
    (connection.from === selectedEntryId && connection.to === entryId) ||
    (connection.to === selectedEntryId && connection.from === entryId)
  ));
}

function getEmptyFilterMessage() {
  const notes = [];
  if (filterState.tag) notes.push(`หมวด ${getFilterLabel(filterState.tag)}`);
  if (filterState.relatedEntryId) notes.push(`รายการที่เกี่ยวข้องกับ ${getEntryName(filterState.relatedEntryId)}`);
  if (!notes.length) return "ไม่พบข้อมูล";
  return `ไม่มี entry สำหรับ${notes.join(" และ ")} กดปุ่มเดิมซ้ำอีกครั้งเพื่อยกเลิกการกรอง`;
}

function getEntrySummaryPreview(summary) {
  const content = String(summary || "").trim();
  if (!content) return "ยังไม่มีรายละเอียด";
  if (content.length <= 120) return content;
  return `${content.slice(0, 120).trim()} ดูเพิ่มเติม`;
}

function getRelationshipPeople() {
  return state.entries
    .filter((entry) => entry.tag === "person")
    .sort((left, right) => left.name.localeCompare(right.name, "th"));
}

function getPersonConnections() {
  return state.connections.filter((connection) => {
    const fromEntry = state.entries.find((entry) => entry.id === connection.from);
    const toEntry = state.entries.find((entry) => entry.id === connection.to);
    return fromEntry?.tag === "person" && toEntry?.tag === "person";
  });
}

function ensureRelationshipLayout(personEntries) {
  const existingIds = new Set(personEntries.map((entry) => entry.id));
  const boardWidth = Math.max(relationshipBoard.clientWidth || 0, 900);
  const maxX = Math.max(
    RELATIONSHIP_BOARD_PADDING,
    boardWidth - RELATIONSHIP_NODE_WIDTH - RELATIONSHIP_BOARD_PADDING
  );
  const columns = Math.max(
    1,
    Math.floor((boardWidth - (RELATIONSHIP_BOARD_PADDING * 2)) / (RELATIONSHIP_NODE_WIDTH + RELATIONSHIP_NODE_GAP))
  );

  personEntries.forEach((entry, index) => {
    if (isValidRelationshipPosition(state.relationshipLayout[entry.id])) {
      state.relationshipLayout[entry.id] = {
        x: clamp(state.relationshipLayout[entry.id].x, RELATIONSHIP_BOARD_PADDING, maxX),
        y: Math.max(RELATIONSHIP_BOARD_PADDING, state.relationshipLayout[entry.id].y)
      };
      return;
    }
    const column = index % columns;
    const row = Math.floor(index / columns);
    state.relationshipLayout[entry.id] = {
      x: RELATIONSHIP_BOARD_PADDING + (column * (RELATIONSHIP_NODE_WIDTH + RELATIONSHIP_NODE_GAP)),
      y: RELATIONSHIP_BOARD_PADDING + (row * (RELATIONSHIP_NODE_HEIGHT + RELATIONSHIP_NODE_GAP))
    };
  });

  Object.keys(state.relationshipLayout).forEach((entryId) => {
    if (!existingIds.has(entryId)) delete state.relationshipLayout[entryId];
  });
}

function isValidRelationshipPosition(position) {
  return Boolean(position)
    && Number.isFinite(position.x)
    && Number.isFinite(position.y)
    && position.x >= 0
    && position.y >= 0;
}

function applyRelationshipNodePosition(node, position) {
  node.style.left = `${position.x}px`;
  node.style.top = `${position.y}px`;
}

function updateRelationshipBoardSize(personEntries) {
  const boardHeight = Math.max(
    620,
    ...personEntries.map((entry) => {
      const position = state.relationshipLayout[entry.id];
      return (position?.y || 0) + RELATIONSHIP_NODE_HEIGHT + RELATIONSHIP_BOARD_PADDING;
    })
  );

  relationshipBoard.style.height = `${boardHeight}px`;
  return boardHeight;
}

function drawRelationshipLines(personConnections, boardHeight = relationshipBoard.clientHeight || 620) {
  const boardWidth = Math.max(relationshipBoard.clientWidth || 0, 900);
  relationshipLines.setAttribute("viewBox", `0 0 ${boardWidth} ${boardHeight}`);
  relationshipLines.setAttribute("width", String(boardWidth));
  relationshipLines.setAttribute("height", String(boardHeight));
  relationshipLines.innerHTML = "";

  personConnections.forEach((connection) => {
    const fromPosition = state.relationshipLayout[connection.from];
    const toPosition = state.relationshipLayout[connection.to];
    if (!isValidRelationshipPosition(fromPosition) || !isValidRelationshipPosition(toPosition)) return;

    ensureConnectionStyle(connection);
    const x1 = String(fromPosition.x + (RELATIONSHIP_NODE_WIDTH / 2));
    const y1 = String(fromPosition.y + (RELATIONSHIP_NODE_HEIGHT / 2));
    const x2 = String(toPosition.x + (RELATIONSHIP_NODE_WIDTH / 2));
    const y2 = String(toPosition.y + (RELATIONSHIP_NODE_HEIGHT / 2));

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("class", "relationship-line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.style.stroke = connection.color;
    line.dataset.connectionId = connection.id;
    applyConnectionLineStyle(line, connection);

    const hitbox = document.createElementNS("http://www.w3.org/2000/svg", "line");
    hitbox.setAttribute("class", "relationship-line-hitbox");
    hitbox.setAttribute("x1", x1);
    hitbox.setAttribute("y1", y1);
    hitbox.setAttribute("x2", x2);
    hitbox.setAttribute("y2", y2);
    hitbox.dataset.connectionId = connection.id;
    hitbox.addEventListener("mouseenter", (event) => handleRelationshipLineEnter(event, connection));
    hitbox.addEventListener("mousemove", handleRelationshipLineMove);
    hitbox.addEventListener("mouseleave", handleRelationshipLineLeave);
    hitbox.addEventListener("dblclick", () => openConnectionEditor(connection.id, { showStyleOptions: true }));

    const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = `${getEntryName(connection.from)} ${connection.label} ${getEntryName(connection.to)}`;
    line.append(title);
    relationshipLines.append(line);
    relationshipLines.append(hitbox);
  });
}

function startRelationshipNodeDrag(event) {
  if (event.button !== 0) return;

  const entryId = event.currentTarget.dataset.entryId;
  const position = state.relationshipLayout[entryId];
  if (!entryId || !isValidRelationshipPosition(position)) return;

  const boardRect = relationshipBoard.getBoundingClientRect();
  relationshipDragState.entryId = entryId;
  relationshipDragState.pointerId = event.pointerId;
  relationshipDragState.offsetX = event.clientX - boardRect.left + relationshipBoard.scrollLeft - position.x;
  relationshipDragState.offsetY = event.clientY - boardRect.top + relationshipBoard.scrollTop - position.y;

  event.currentTarget.classList.add("is-dragging");
  event.currentTarget.setPointerCapture(event.pointerId);
  event.currentTarget.addEventListener("pointermove", handleRelationshipNodeDrag);
  event.currentTarget.addEventListener("pointerup", stopRelationshipNodeDrag);
  event.currentTarget.addEventListener("pointercancel", stopRelationshipNodeDrag);
  event.preventDefault();
}

function handleRelationshipNodeDrag(event) {
  if (event.pointerId !== relationshipDragState.pointerId) return;
  const entryId = relationshipDragState.entryId;
  if (!entryId) return;

  const boardRect = relationshipBoard.getBoundingClientRect();
  const maxX = Math.max(
    RELATIONSHIP_BOARD_PADDING,
    relationshipBoard.clientWidth - RELATIONSHIP_NODE_WIDTH - RELATIONSHIP_BOARD_PADDING
  );
  const nextPosition = {
    x: clamp(
      event.clientX - boardRect.left + relationshipBoard.scrollLeft - relationshipDragState.offsetX,
      RELATIONSHIP_BOARD_PADDING,
      maxX
    ),
    y: Math.max(
      RELATIONSHIP_BOARD_PADDING,
      event.clientY - boardRect.top + relationshipBoard.scrollTop - relationshipDragState.offsetY
    )
  };

  state.relationshipLayout[entryId] = nextPosition;
  applyRelationshipNodePosition(event.currentTarget, nextPosition);
  const boardHeight = updateRelationshipBoardSize(getRelationshipPeople());
  relationshipNodes.style.height = `${boardHeight}px`;
  drawRelationshipLines(getPersonConnections(), boardHeight);
  updateRelationshipDropTarget(entryId, event.clientX, event.clientY);
}

function stopRelationshipNodeDrag(event) {
  if (event.pointerId !== relationshipDragState.pointerId) return;

  const sourceEntryId = relationshipDragState.entryId;
  const targetEntryId = relationshipDragState.hoverTargetId;

  event.currentTarget.classList.remove("is-dragging");
  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId);
  }
  event.currentTarget.removeEventListener("pointermove", handleRelationshipNodeDrag);
  event.currentTarget.removeEventListener("pointerup", stopRelationshipNodeDrag);
  event.currentTarget.removeEventListener("pointercancel", stopRelationshipNodeDrag);

  relationshipDragState.entryId = "";
  relationshipDragState.pointerId = -1;
  relationshipDragState.offsetX = 0;
  relationshipDragState.offsetY = 0;
  clearRelationshipDropTarget();

  if (sourceEntryId && targetEntryId && sourceEntryId !== targetEntryId && !hasConnectionBetweenEntries(sourceEntryId, targetEntryId)) {
    openConnectionModal(sourceEntryId, targetEntryId, { showStyleOptions: true });
    return;
  }

  persistState();
}

function updateRelationshipDropTarget(sourceEntryId, clientX, clientY) {
  const targetNode = getRelationshipDropTarget(sourceEntryId, clientX, clientY);
  const nextTargetId = targetNode?.dataset.entryId || "";
  if (relationshipDragState.hoverTargetId === nextTargetId) return;
  clearRelationshipDropTarget();
  relationshipDragState.hoverTargetId = nextTargetId;
  if (targetNode) targetNode.classList.add("is-drop-target");
}

function clearRelationshipDropTarget() {
  if (relationshipDragState.hoverTargetId) {
    relationshipNodes.querySelector(`[data-entry-id="${CSS.escape(relationshipDragState.hoverTargetId)}"]`)?.classList.remove("is-drop-target");
  }
  relationshipDragState.hoverTargetId = "";
}

function getRelationshipDropTarget(sourceEntryId, clientX, clientY) {
  const sourcePosition = state.relationshipLayout[sourceEntryId];
  if (!isValidRelationshipPosition(sourcePosition)) return null;

  const sourceBounds = {
    left: sourcePosition.x,
    top: sourcePosition.y,
    right: sourcePosition.x + RELATIONSHIP_NODE_WIDTH,
    bottom: sourcePosition.y + RELATIONSHIP_NODE_HEIGHT
  };

  let bestTarget = null;
  let bestOverlapArea = 0;

  relationshipNodes.querySelectorAll(".relationship-node").forEach((node) => {
    if (node.dataset.entryId === sourceEntryId) return;
    const targetPosition = state.relationshipLayout[node.dataset.entryId];
    if (!isValidRelationshipPosition(targetPosition)) return;

    const targetBounds = {
      left: targetPosition.x,
      top: targetPosition.y,
      right: targetPosition.x + RELATIONSHIP_NODE_WIDTH,
      bottom: targetPosition.y + RELATIONSHIP_NODE_HEIGHT
    };

    const overlapWidth = Math.min(sourceBounds.right, targetBounds.right) - Math.max(sourceBounds.left, targetBounds.left);
    const overlapHeight = Math.min(sourceBounds.bottom, targetBounds.bottom) - Math.max(sourceBounds.top, targetBounds.top);
    if (overlapWidth <= 0 || overlapHeight <= 0) return;

    const overlapArea = overlapWidth * overlapHeight;
    if (overlapArea > bestOverlapArea) {
      bestTarget = node;
      bestOverlapArea = overlapArea;
    }
  });

  if (bestTarget) return bestTarget;

  const element = document.elementFromPoint(clientX, clientY);
  const pointerTarget = element?.closest(".relationship-node");
  if (!pointerTarget) return null;
  if (!relationshipNodes.contains(pointerTarget)) return null;
  if (pointerTarget.dataset.entryId === sourceEntryId) return null;
  return pointerTarget;
}

function hasConnectionBetweenEntries(firstEntryId, secondEntryId) {
  return state.connections.some((connection) => (
    (connection.from === firstEntryId && connection.to === secondEntryId) ||
    (connection.from === secondEntryId && connection.to === firstEntryId)
  ));
}

function handleRelationshipLineEnter(event, connection) {
  relationshipLineState.hoveredConnectionId = connection.id;
  relationshipLineState.tooltipX = event.clientX;
  relationshipLineState.tooltipY = event.clientY;
  relationshipLines.querySelector(`.relationship-line[data-connection-id="${CSS.escape(connection.id)}"]`)?.classList.add("is-hovered");
  relationshipLineTooltip.textContent = `${connection.label} · double click เพื่อแก้ไข`;
  relationshipLineTooltip.classList.remove("hidden");
  updateRelationshipTooltipPosition(event.clientX, event.clientY);
}

function handleRelationshipLineMove(event) {
  relationshipLineState.tooltipX = event.clientX;
  relationshipLineState.tooltipY = event.clientY;
  updateRelationshipTooltipPosition(event.clientX, event.clientY);
}

function handleRelationshipLineLeave(event) {
  const connectionId = event.currentTarget.dataset.connectionId;
  if (connectionId) {
    relationshipLines.querySelector(`.relationship-line[data-connection-id="${CSS.escape(connectionId)}"]`)?.classList.remove("is-hovered");
  }
  relationshipLineState.hoveredConnectionId = "";
  relationshipLineTooltip.classList.add("hidden");
}

function updateRelationshipTooltipPosition(clientX, clientY) {
  const boardRect = relationshipBoard.getBoundingClientRect();
  relationshipLineTooltip.style.left = `${clientX - boardRect.left + relationshipBoard.scrollLeft}px`;
  relationshipLineTooltip.style.top = `${clientY - boardRect.top + relationshipBoard.scrollTop}px`;
}

function syncConnectionStyleUi() {
  connectionStyleGrid?.classList.toggle("hidden", !connectionModalState.showStyleOptions);
}

function getDefaultConnectionStyle() {
  return {
    color: "#265960",
    lineStyle: "solid"
  };
}

function ensureConnectionStyle(connection) {
  const defaults = getDefaultConnectionStyle();
  connection.color = isValidConnectionColor(connection.color) ? connection.color : defaults.color;
  connection.lineStyle = ["solid", "dashed", "dotted"].includes(connection.lineStyle) ? connection.lineStyle : defaults.lineStyle;
}

function isValidConnectionColor(value) {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
}

function getConnectionStylePayload() {
  return {
    color: modalConnectionColor.value || "#265960",
    lineStyle: modalConnectionLineStyle.value || "solid"
  };
}

function applyConnectionStyleFields(connection) {
  const normalized = normalizeConnection(connection);
  modalConnectionColor.value = normalized.color;
  modalConnectionLineStyle.value = normalized.lineStyle;
}

function applyConnectionLineStyle(line, connection) {
  if (connection.lineStyle === "dashed") {
    line.setAttribute("stroke-dasharray", "10 8");
  } else if (connection.lineStyle === "dotted") {
    line.setAttribute("stroke-dasharray", "3 8");
  }
}

function normalizeRelationshipLayout(layout) {
  if (!layout || typeof layout !== "object") return {};
  return Object.fromEntries(
    Object.entries(layout)
      .filter(([, position]) => isValidRelationshipPosition(position))
      .map(([entryId, position]) => [entryId, { x: Number(position.x), y: Number(position.y) }])
  );
}

function normalizeConnection(connection) {
  const normalized = { ...connection };
  ensureConnectionStyle(normalized);
  return normalized;
}

function normalizeTimeline(timeline) {
  if (!Array.isArray(timeline)) return [];
  return timeline
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && typeof item.entryId === "string") return item.entryId;
      return "";
    })
    .filter(Boolean);
}

function normalizeNumericText(value) {
  return String(value || "").replace(/\D+/g, "").trim();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function renderEntrySummary(element, entry) {
  const content = String(entry.summary || "").trim();
  if (!content) {
    element.textContent = "ยังไม่มีรายละเอียด";
    return;
  }

  if (content.length <= 120) {
    element.textContent = content;
    return;
  }

  const preview = content.slice(0, 120).trim();
  element.textContent = preview;
  const moreBtn = document.createElement("button");
  moreBtn.type = "button";
  moreBtn.className = "summary-more-btn";
  moreBtn.textContent = "ดูเพิ่มเติม";
  moreBtn.addEventListener("click", () => openEntryDetailModal(entry.id));
  element.append(" ");
  element.append(moreBtn);
}

function createTimelineCard(entry, options = {}) {
  const card = document.createElement("article");
  card.className = "timeline-card";
  card.draggable = true;
  card.dataset.entryId = entry.id;
  card.dataset.source = options.source || "pool";

  const meta = [];
  if (entry.session) meta.push(`Session ${entry.session}`);
  if (entry.date) meta.push(`วันที่ ${entry.date}`);
  if (entry.year) meta.push(`ปี ${entry.year}`);

  card.innerHTML = `
    <div class="timeline-card-head">
      <div class="timeline-card-body">
        <p class="timeline-era">${escapeHtml(meta.join(" • ") || "ยังไม่ระบุช่วงเวลา")}</p>
        <h3 class="timeline-card-title">${escapeHtml(entry.name)}</h3>
        <p class="timeline-card-summary">${escapeHtml(entry.summary || "ยังไม่มีบันทึก")}</p>
      </div>
      <div class="timeline-card-actions">
        <button type="button" class="icon-btn edit-timeline-btn" aria-label="แก้ไขเหตุการณ์">✎</button>
        ${options.source === "timeline" ? '<button type="button" class="icon-btn unplace-timeline-btn" aria-label="เอาออกจากไทม์ไลน์">↶</button>' : ""}
      </div>
    </div>
  `;

  card.addEventListener("dragstart", (event) => {
    timelineDragState.entryId = entry.id;
    timelineDragState.source = options.source || "pool";
    card.classList.add("is-dragging");
    event.dataTransfer?.setData("text/plain", entry.id);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
  });
  card.addEventListener("dragend", () => {
    timelineDragState.entryId = "";
    timelineDragState.source = "";
    card.classList.remove("is-dragging");
    clearTimelineDropTargets();
  });

  card.querySelector(".edit-timeline-btn")?.addEventListener("click", () => openEntryEditor(entry.id));
  card.querySelector(".unplace-timeline-btn")?.addEventListener("click", () => unplaceTimelineEntry(entry.id));
  return card;
}

function createTimelineDropzone(index) {
  const dropzone = document.createElement("div");
  dropzone.className = "timeline-dropzone";
  dropzone.dataset.insertIndex = String(index);
  dropzone.textContent = "วางเหตุการณ์ตรงนี้";
  setupTimelineDropzone(dropzone);
  return dropzone;
}

function createTimelinePoolDropzone() {
  const dropzone = document.createElement("div");
  dropzone.className = "timeline-dropzone";
  dropzone.dataset.pool = "true";
  dropzone.textContent = "ลากกลับมาที่นี่เพื่อนำออกจากไทม์ไลน์";
  setupTimelineDropzone(dropzone);
  return dropzone;
}

function setupTimelineDropzone(dropzone) {
  dropzone.addEventListener("dragenter", (event) => {
    if (!timelineDragState.entryId) return;
    event.preventDefault();
    dropzone.classList.add("is-drop-target");
  });
  dropzone.addEventListener("dragover", (event) => {
    if (!timelineDragState.entryId) return;
    event.preventDefault();
    dropzone.classList.add("is-drop-target");
  });
  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("is-drop-target");
  });
  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.classList.remove("is-drop-target");
    const entryId = event.dataTransfer?.getData("text/plain") || timelineDragState.entryId;
    if (!entryId) return;
    if (dropzone.dataset.pool === "true") {
      unplaceTimelineEntry(entryId);
      return;
    }
    placeTimelineEntry(entryId, Number.parseInt(dropzone.dataset.insertIndex || "0", 10));
  });
}

function clearTimelineDropTargets() {
  timelineList.querySelectorAll(".timeline-dropzone.is-drop-target").forEach((node) => {
    node.classList.remove("is-drop-target");
  });
}

function placeTimelineEntry(entryId, insertIndex) {
  const entry = state.entries.find((item) => item.id === entryId && item.tag === "event");
  if (!entry) return;
  const nextTimeline = state.timeline.filter((id) => id !== entryId);
  const clampedIndex = clamp(insertIndex, 0, nextTimeline.length);
  nextTimeline.splice(clampedIndex, 0, entryId);
  state.timeline = nextTimeline;
  syncAndRender();
}

function unplaceTimelineEntry(entryId) {
  state.timeline = state.timeline.filter((id) => id !== entryId);
  syncAndRender();
}

function getTimelineOrderWarnings(entries) {
  const warnings = [];
  const fields = [
    { key: "session", label: "Session" },
    { key: "date", label: "วันที่" },
    { key: "year", label: "ปี" }
  ];

  for (let index = 1; index < entries.length; index += 1) {
    const previous = entries[index - 1];
    const current = entries[index];
    fields.forEach((field) => {
      const previousValue = Number.parseInt(previous[field.key] || "", 10);
      const currentValue = Number.parseInt(current[field.key] || "", 10);
      if (!Number.isFinite(previousValue) || !Number.isFinite(currentValue)) return;
      if (previousValue <= currentValue) return;
      warnings.push(`${field.label} เรียงย้อนลำดับ: "${previous.name}" (${previousValue}) มาก่อน "${current.name}" (${currentValue})`);
    });
  }

  return warnings;
}

function updateConnectionBuilder() {
  connectionFromEntryBtn.textContent = getEntryName(dragConnectionState.from);
  connectionToEntryBtn.textContent = getEntryName(dragConnectionState.to);
  connectionModalCopy.textContent = `กำหนดความเชื่อมโยงในรูปแบบ "${getEntryName(dragConnectionState.from)} -> ความเชื่อมโยง -> ${getEntryName(dragConnectionState.to)}"`;
}

function swapConnectionDirection() {
  if (!dragConnectionState.from || !dragConnectionState.to) return;
  [dragConnectionState.from, dragConnectionState.to] = [dragConnectionState.to, dragConnectionState.from];
  updateConnectionBuilder();
}

function renderEntryEditorConnections() {
  if (!editorState.entryId) {
    entryConnectionsEditor.classList.add("hidden");
    entryConnectionsEditorList.innerHTML = "";
    return;
  }

  const relatedConnections = state.connections.filter((connection) => (
    connection.from === editorState.entryId || connection.to === editorState.entryId
  ));

  entryConnectionsEditor.classList.remove("hidden");

  if (!relatedConnections.length) {
    entryConnectionsEditorList.innerHTML = '<p class="empty-state">ยังไม่มีความเชื่อมโยงสำหรับ entry นี้</p>';
    return;
  }

  const template = document.getElementById("relationship-item-template");
  entryConnectionsEditorList.innerHTML = "";

  relatedConnections.forEach((connection) => {
    const fragment = template.content.cloneNode(true);
    fragment.querySelector(".relationship-title").textContent = `${getEntryName(connection.from)} ${connection.label} ${getEntryName(connection.to)}`;
    fragment.querySelector(".relationship-meta").textContent = `จาก ${getEntryTag(connection.from)} ไปยัง ${getEntryTag(connection.to)}`;
    fragment.querySelector(".edit-connection-btn").addEventListener("click", () => {
      closeModal(entryModal, entryForm);
      openConnectionEditor(connection.id);
    });
    fragment.querySelector(".remove-connection-btn").addEventListener("click", () => removeConnection(connection.id));
    entryConnectionsEditorList.append(fragment);
  });
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (parsed && typeof parsed === "object") {
      return {
        entries: Array.isArray(parsed.entries)
          ? parsed.entries.map((entry) => ({
              ...entry,
              highlighted: Boolean(entry.highlighted),
              gender: typeof entry.gender === "string" ? entry.gender : "",
              age: typeof entry.age === "string" ? entry.age : "",
              species: typeof entry.species === "string" ? entry.species : "",
              session: typeof entry.session === "string" ? entry.session : "",
              date: typeof entry.date === "string" ? entry.date : "",
              year: typeof entry.year === "string" ? entry.year : ""
            }))
          : [],
        connections: Array.isArray(parsed.connections) ? parsed.connections.map(normalizeConnection) : [],
        timeline: normalizeTimeline(parsed.timeline),
        relationshipLayout: normalizeRelationshipLayout(parsed.relationshipLayout)
      };
    }
  } catch (error) {
    console.warn("ไม่สามารถโหลดข้อมูลกระดานสร้างโลกที่บันทึกไว้ได้", error);
  }
  return { entries: [], connections: [], timeline: [], relationshipLayout: {} };
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
window.addEventListener("resize", () => {
  if (!workspacePanelRelationship.classList.contains("hidden")) {
    renderRelationships();
  }
});
