// Elementos do DOM
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const dueDateInput = document.getElementById("dueDate");
const typeInput = document.getElementById("type");
const transactionList = document.getElementById("transaction-list");
const incomeSpan = document.getElementById("income");
const expenseSpan = document.getElementById("expense");
const balanceSpan = document.getElementById("balance");
const monthSelector = document.getElementById("month");

// Lista de transações por mês
let transactionsByMonth = JSON.parse(localStorage.getItem("transactionsByMonth")) || {};
let currentMonth = monthSelector.value;

// Salvar dados no LocalStorage
function saveTransactions() {
    localStorage.setItem("transactionsByMonth", JSON.stringify(transactionsByMonth));
}

// Atualizar resumo mensal
function updateSummary() {
    const transactions = transactionsByMonth[currentMonth] || [];
    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {
        if (transaction.type === "entrada") {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }
    });

    const balance = income - expense;

    incomeSpan.textContent = `R$ ${income.toFixed(2)}`;
    expenseSpan.textContent = `R$ ${expense.toFixed(2)}`;
    balanceSpan.textContent = `R$ ${balance.toFixed(2)}`;
}

// Atualizar tabela de transações
function updateTable() {
    const transactions = transactionsByMonth[currentMonth] || [];
    transactionList.innerHTML = "";

    transactions.forEach((transaction, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${transaction.description}</td>
            <td>R$ ${transaction.amount.toFixed(2)}</td>
            <td>${transaction.dueDate}</td>
            <td>${transaction.type}</td>
            <td>${transaction.status ? "Paga" : "Pendente"}</td>
            <td>
                <button class="pay-btn" onclick="markAsPaid(${index})">Pagar</button>
                <button class="delete-btn" onclick="deleteTransaction(${index})">Excluir</button>
            </td>
        `;

        transactionList.appendChild(row);
    });

    updateSummary();
}

// Adicionar transação
document.getElementById("add-transaction-btn").addEventListener("click", () => {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const dueDate = dueDateInput.value;
    const type = typeInput.value;

    if (!description || isNaN(amount) || amount <= 0 || !dueDate) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    const newTransaction = {
        description,
        amount,
        dueDate,
        type,
        status: false
    };

    if (!transactionsByMonth[currentMonth]) {
        transactionsByMonth[currentMonth] = [];
    }

    transactionsByMonth[currentMonth].push(newTransaction);
    saveTransactions();
    updateTable();

    // Limpar campos
    descriptionInput.value = "";
    amountInput.value = "";
    dueDateInput.value = "";
    typeInput.value = "entrada";
});

// Marcar como paga
function markAsPaid(index) {
    transactionsByMonth[currentMonth][index].status = true;
    saveTransactions();
    updateTable();
}

// Excluir transação
function deleteTransaction(index) {
    transactionsByMonth[currentMonth].splice(index, 1);
    saveTransactions();
    updateTable();
}

// Alterar mês
monthSelector.addEventListener("change", () => {
    currentMonth = monthSelector.value;
    updateTable();
});

// Inicializar tabela e resumo
document.addEventListener("DOMContentLoaded", () => {
    updateTable();
});