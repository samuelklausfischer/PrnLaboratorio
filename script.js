const STORAGE_KEY = "prn-pulseops-data-v2";

const defaultData = {
  weeklyDoneBase: 20,
  priorities: [
    "Padronizar fluxo de demandas internas",
    "Fechar playbook de fechamento diário",
    "Reduzir gargalos de aprovação em 30%",
  ],
  nextSteps: [
    "Revisar bloqueios com setor administrativo",
    "Atualizar checklist de processo SOP-014",
    "Registrar aprendizados no hub de documentação",
  ],
  routine: [
    "08:30|Revisão de prioridades e SLAs críticos",
    "10:00|Bloco de execução focada (90 min)",
    "13:30|Atualização de status e desbloqueios",
    "16:30|Registro de aprendizados e melhorias",
    "17:30|Planejamento do próximo dia",
  ],
  taskModel: {
    title: "Padronizar fluxo de abertura de demanda",
    objective: "reduzir retrabalho e tempo de resposta.",
    impact: "Alto",
    priority: "Importante",
    status: "Em andamento",
    sector: "Administrativo + Operações",
    result: "SLA previsível e rastreável.",
  },
  roadmap: [
    { phase: "MVP", window: "4–6 semanas", desc: "Tarefas, dashboard, prioridades e status." },
    { phase: "Operacional", window: "6–8 semanas", desc: "Processos, checklists, documentação e visão semanal." },
    { phase: "Otimizada", window: "6 semanas", desc: "Indicadores avançados, gargalos e automações simples." },
    { phase: "IA", window: "contínuo", desc: "Copiloto operacional e insights inteligentes." },
  ],
  tasks: [
    { id: crypto.randomUUID(), title: "Criar painel de SLAs internos", priority: "important", status: "planned" },
    { id: crypto.randomUUID(), title: "Ajustar fluxo de aprovação atrasada", priority: "urgent", status: "planned" },
    { id: crypto.randomUUID(), title: "Revisar processo de fechamento diário", priority: "important", status: "progress" },
    { id: crypto.randomUUID(), title: "Definir responsável por documentação legado", priority: "blocked", status: "blocked" },
    { id: crypto.randomUUID(), title: "Estruturar visão semanal da operação", priority: "planned", status: "done" },
  ],
};

const phaseDescriptions = {
  1: "Resumo automático do dia, sugestões de próximos passos e classificação inicial de tarefas por contexto.",
  2: "Priorização inteligente com base em histórico, risco de atraso e peso estratégico das demandas.",
  3: "Assistente operacional conversacional para orientar execução, bloqueios e documentação em tempo real.",
  4: "Automação cognitiva: geração de playbooks e recomendações de melhoria contínua com IA.",
};

let data = loadData();
let draggedTaskId = null;
let currentFilter = "all";

function loadData() {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (!cached) return structuredClone(defaultData);
  try {
    const parsed = JSON.parse(cached);
    return { ...structuredClone(defaultData), ...parsed };
  } catch {
    return structuredClone(defaultData);
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function makeTaskNode(task) {
  const node = document.createElement("div");
  node.className = "task";
  node.draggable = true;
  node.dataset.priority = task.priority;
  node.dataset.id = task.id;
  node.textContent = task.title;
  node.addEventListener("dragstart", () => {
    draggedTaskId = task.id;
    node.style.opacity = "0.45";
  });
  node.addEventListener("dragend", () => {
    node.style.opacity = "1";
  });
  return node;
}

function renderLists() {
  const prioritiesEl = document.getElementById("weeklyPriorities");
  const stepsEl = document.getElementById("nextSteps");
  prioritiesEl.innerHTML = data.priorities.map((item) => `<li>${item}</li>`).join("");
  stepsEl.innerHTML = data.nextSteps.map((item) => `<li>${item}</li>`).join("");

  const timeline = document.getElementById("routineTimeline");
  timeline.innerHTML = data.routine
    .map((entry) => {
      const [time, text] = entry.split("|");
      return `<div><span>${time}</span>${text}</div>`;
    })
    .join("");

  const taskModel = data.taskModel;
  document.getElementById("taskTemplateTitle").textContent = taskModel.title;
  document.getElementById("taskTemplateMeta").innerHTML = `
    <p><strong>Objetivo:</strong> ${taskModel.objective}</p>
    <p><strong>Impacto:</strong> ${taskModel.impact}</p>
    <p><strong>Prioridade:</strong> ${taskModel.priority}</p>
    <p><strong>Status:</strong> ${taskModel.status}</p>
    <p><strong>Setor:</strong> ${taskModel.sector}</p>
    <p><strong>Resultado esperado:</strong> ${taskModel.result}</p>
  `;

  const roadmap = document.getElementById("roadmapCards");
  roadmap.innerHTML = data.roadmap
    .map(
      (card) =>
        `<div><strong>${card.phase}</strong><span>${card.window}</span><p>${card.desc}</p></div>`,
    )
    .join("");
}

function renderTasks() {
  document.querySelectorAll(".dropzone").forEach((zone) => (zone.innerHTML = ""));
  data.tasks.forEach((task) => {
    const zone = document.querySelector(`[data-status="${task.status}"] .dropzone`);
    if (zone) zone.appendChild(makeTaskNode(task));
  });
  applyFilter(currentFilter);
}

function recalculateKPIs() {
  const totalTasks = data.tasks.length;
  const blocked = data.tasks.filter((task) => task.status === "blocked").length;
  const done = data.tasks.filter((task) => task.status === "done").length;
  const critical = data.tasks.filter((task) => task.priority === "urgent").length;

  document.getElementById("kpiTasks").textContent = String(totalTasks);
  document.getElementById("kpiBlocked").textContent = String(blocked);
  document.getElementById("kpiDone").textContent = String(data.weeklyDoneBase + done);
  document.getElementById("kpiCritical").textContent = String(critical);
}

function validateDataSet(dataset) {
  const errors = [];
  if (Number(dataset.weeklyDoneBase) < 0) errors.push("weeklyDoneBase não pode ser negativo.");
  if (!dataset.priorities.length) errors.push("Inclua pelo menos 1 prioridade da semana.");
  if (!dataset.nextSteps.length) errors.push("Inclua pelo menos 1 próximo passo.");
  if (!dataset.tasks.length) errors.push("Inclua pelo menos 1 tarefa.");

  const invalidPriority = dataset.tasks.find(
    (task) => !["planned", "important", "urgent", "blocked"].includes(task.priority),
  );
  if (invalidPriority) errors.push(`Prioridade inválida na tarefa: ${invalidPriority.title}`);

  const invalidStatus = dataset.tasks.find(
    (task) => !["planned", "progress", "blocked", "done"].includes(task.status),
  );
  if (invalidStatus) errors.push(`Status inválido na tarefa: ${invalidStatus.title}`);

  return errors;
}

function syncStudioInputs() {
  document.getElementById("weeklyBaseInput").value = String(data.weeklyDoneBase);
  document.getElementById("prioritiesInput").value = data.priorities.join("\n");
  document.getElementById("stepsInput").value = data.nextSteps.join("\n");
}

function applyFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll(".task").forEach((task) => {
    task.style.display = filter === "all" || task.dataset.priority === filter ? "block" : "none";
  });
}

function wireEvents() {
  document.querySelectorAll(".chip").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      document.getElementById("phaseDescription").textContent = phaseDescriptions[button.dataset.phase];
    });
  });

  document.querySelectorAll(".pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pill").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter(btn.dataset.filter);
    });
  });

  document.querySelectorAll(".dropzone").forEach((zone) => {
    zone.addEventListener("dragover", (e) => e.preventDefault());
    zone.addEventListener("drop", () => {
      if (!draggedTaskId) return;
      const targetStatus = zone.parentElement.dataset.status;
      const task = data.tasks.find((item) => item.id === draggedTaskId);
      if (task) task.status = targetStatus;
      saveData();
      renderTasks();
      recalculateKPIs();
    });
  });

  document.getElementById("newTaskBtn").addEventListener("click", () => {
    const name = prompt("Nome da nova tarefa:");
    if (!name) return;
    data.tasks.push({
      id: crypto.randomUUID(),
      title: name,
      priority: "planned",
      status: "planned",
    });
    saveData();
    renderTasks();
    recalculateKPIs();
  });

  document.getElementById("focusModeBtn").addEventListener("click", () => {
    document.body.classList.toggle("focus-mode");
  });

  document.getElementById("openStudioBtn").addEventListener("click", () => {
    document.getElementById("studio").classList.add("open");
    syncStudioInputs();
  });
  document.getElementById("closeStudioBtn").addEventListener("click", () => {
    document.getElementById("studio").classList.remove("open");
  });

  document.getElementById("createStructuredTaskBtn").addEventListener("click", () => {
    const title = document.getElementById("newTaskTitle").value.trim();
    const priority = document.getElementById("newTaskPriority").value;
    const status = document.getElementById("newTaskStatus").value;
    if (!title) return;

    data.tasks.push({ id: crypto.randomUUID(), title, priority, status });
    document.getElementById("newTaskTitle").value = "";
    saveData();
    renderTasks();
    recalculateKPIs();
  });

  document.getElementById("validateDataBtn").addEventListener("click", () => {
    const draft = {
      ...data,
      weeklyDoneBase: Number(document.getElementById("weeklyBaseInput").value),
      priorities: document
        .getElementById("prioritiesInput")
        .value.split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      nextSteps: document
        .getElementById("stepsInput")
        .value.split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    };
    const issues = validateDataSet(draft);
    document.getElementById("validationOutput").textContent =
      issues.length === 0 ? "✅ Dados válidos para salvar." : `⚠️ Ajustes necessários:\n- ${issues.join("\n- ")}`;
  });

  document.getElementById("saveDataBtn").addEventListener("click", () => {
    const draft = {
      ...data,
      weeklyDoneBase: Number(document.getElementById("weeklyBaseInput").value),
      priorities: document
        .getElementById("prioritiesInput")
        .value.split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      nextSteps: document
        .getElementById("stepsInput")
        .value.split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    const issues = validateDataSet(draft);
    if (issues.length > 0) {
      document.getElementById("validationOutput").textContent = `⚠️ Não foi possível salvar:\n- ${issues.join("\n- ")}`;
      return;
    }

    data = draft;
    saveData();
    renderLists();
    renderTasks();
    recalculateKPIs();
    document.getElementById("validationOutput").textContent = "✅ Alterações salvas com sucesso.";
  });

  document.getElementById("resetDataBtn").addEventListener("click", () => {
    data = structuredClone(defaultData);
    saveData();
    syncStudioInputs();
    renderLists();
    renderTasks();
    recalculateKPIs();
    document.getElementById("validationOutput").textContent = "✅ Dados restaurados para o padrão.";
  });
}

function init() {
  document.getElementById("phaseDescription").textContent = phaseDescriptions[1];
  renderLists();
  renderTasks();
  recalculateKPIs();
  wireEvents();
}

init();
