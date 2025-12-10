
const STORAGE_KEY = "controle_financas_v1";

let state = {
  salary: 0,
  expenses: []
};

// ===== Seletores =====
const salaryInput = document.getElementById("salary");
const showSalary = document.getElementById("showSalary");
const totalExpensesEl = document.getElementById("totalExpenses");
const balanceEl = document.getElementById("balance");

const dateInput = document.getElementById("date");
const nameInput = document.getElementById("name");
const valueInput = document.getElementById("value");
const expenseIdInput = document.getElementById("expenseId");

const expensesTableBody = document.querySelector("#expensesTable tbody");
const emptyNote = document.getElementById("empty");

// ===== Utilitários =====
function fmt(n) {
  return Number(n).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

// ===== Carregar do LocalStorage =====
function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) state = JSON.parse(raw);
  render();
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  render();
}

// ===== Renderização =====
function render() {
  showSalary.textContent = fmt(state.salary);

  // Render despesas
  expensesTableBody.innerHTML = "";

  if (state.expenses.length === 0) {
    emptyNote.style.display = "block";
  } else {
    emptyNote.style.display = "none";

    state.expenses.forEach(exp => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${exp.date}</td>
        <td>${exp.name}</td>
        <td>${fmt(exp.value)}</td>
        <td class="actions">
          <button onclick="editExpense('${exp.id}')">Editar</button>
          <button onclick="deleteExpense('${exp.id}')">Excluir</button>
        </td>
      `;
      expensesTableBody.appendChild(tr);
    });
  }

  // Total despesas
  const total = state.expenses.reduce((sum, e) => sum + Number(e.value), 0);
  totalExpensesEl.textContent = fmt(total);

  // Saldo final
  balanceEl.textContent = fmt(state.salary - total);
}

// ===== Salvar salário =====
document.getElementById("salaryForm").addEventListener("submit", e => {
  e.preventDefault();

  const value = Number(salaryInput.value);
  if (isNaN(value) || value < 0) {
    alert("Informe um salário válido.");
    return;
  }

  state.salary = value;
  save();

  salaryInput.value = "";
});

// ===== Salvar / Editar despesa =====
document.getElementById("expenseForm").addEventListener("submit", e => {
  e.preventDefault();

  const date = dateInput.value;
  const name = nameInput.value.trim();
  const value = Number(valueInput.value);
  const editingId = expenseIdInput.value;

  if (!date || !name || isNaN(value) || value <= 0) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  if (editingId) {
    // Editar
    const item = state.expenses.find(e => e.id === editingId);
    if (item) {
      item.date = date;
      item.name = name;
      item.value = value;
    }
  } else {
    // Criar
    const newExpense = {
      id: String(Date.now()),
      date,
      name,
      value
    };
    state.expenses.push(newExpense);
  }

  resetExpenseForm();
  save();
});

// ===== Funções auxiliares =====
function resetExpenseForm() {
  dateInput.value = "";
  nameInput.value = "";
  valueInput.value = "";
  expenseIdInput.value = "";
}

// ===== Editar despesa =====
function editExpense(id) {
  const item = state.expenses.find(e => e.id === id);
  if (!item) return;

  dateInput.value = item.date;
  nameInput.value = item.name;
  valueInput.value = item.value;
  expenseIdInput.value = item.id;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===== Excluir despesa =====
function deleteExpense(id) {
  if (!confirm("Excluir esta despesa?")) return;

  state.expenses = state.expenses.filter(e => e.id !== id);
  save();
}

// ===== Inicialização =====
load();
