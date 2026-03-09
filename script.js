const phaseDescriptions = {
  1: "Resumo automático do dia, sugestões de próximos passos e classificação inicial de tarefas por contexto.",
  2: "Priorização inteligente com base em histórico, risco de atraso e peso estratégico das demandas.",
  3: "Assistente operacional conversacional para orientar execução, bloqueios e documentação em tempo real.",
  4: "Automação cognitiva: geração de playbooks e recomendações de melhoria contínua com IA.",
};

const phaseButtons = document.querySelectorAll(".chip");
const phaseDescription = document.getElementById("phaseDescription");

phaseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    phaseButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    phaseDescription.textContent = phaseDescriptions[button.dataset.phase];
  });
});

const filterButtons = document.querySelectorAll(".pill");
const tasks = document.querySelectorAll(".task");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;

    tasks.forEach((task) => {
      task.style.display =
        filter === "all" || task.dataset.priority === filter ? "block" : "none";
    });
  });
});

const dropzones = document.querySelectorAll(".dropzone");
let draggedTask = null;

document.querySelectorAll(".task").forEach((task) => {
  task.addEventListener("dragstart", () => {
    draggedTask = task;
    task.style.opacity = "0.45";
  });

  task.addEventListener("dragend", () => {
    task.style.opacity = "1";
  });
});

dropzones.forEach((zone) => {
  zone.addEventListener("dragover", (e) => e.preventDefault());
  zone.addEventListener("drop", () => {
    if (draggedTask) zone.appendChild(draggedTask);
    recalculateKPIs();
  });
});

function recalculateKPIs() {
  const totalTasks = document.querySelectorAll(".task").length;
  const blocked = document.querySelector('[data-status="blocked"] .dropzone').children.length;
  const done = document.querySelector('[data-status="done"] .dropzone').children.length;
  const critical = document.querySelectorAll('.task[data-priority="urgent"]').length;

  document.getElementById("kpiTasks").textContent = String(totalTasks);
  document.getElementById("kpiBlocked").textContent = String(blocked);
  document.getElementById("kpiDone").textContent = String(20 + done);
  document.getElementById("kpiCritical").textContent = String(critical);
}

document.getElementById("newTaskBtn").addEventListener("click", () => {
  const name = prompt("Nome da nova tarefa:");
  if (!name) return;

  const template = document.getElementById("taskTemplate");
  const clone = template.content.firstElementChild.cloneNode(true);
  clone.textContent = name;

  clone.addEventListener("dragstart", () => {
    draggedTask = clone;
    clone.style.opacity = "0.45";
  });

  clone.addEventListener("dragend", () => {
    clone.style.opacity = "1";
  });

  document.querySelector('[data-status="planned"] .dropzone').appendChild(clone);
  recalculateKPIs();
});

document.getElementById("focusModeBtn").addEventListener("click", () => {
  document.body.classList.toggle("focus-mode");
});
