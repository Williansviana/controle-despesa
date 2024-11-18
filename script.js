let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveToLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function addTransaction() {
    const description = document.getElementById("description").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const dueDate = document.getElementById("dueDate").value;
    const type = document.getElementById("type").value;

    if (!description || isNaN(amount) || !dueDate) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    const transaction = {
        description,
        amount,
        dueDate,
        type,
        paid: false,
    };

    transactions.push(transaction);
    saveToLocalStorage();
    updateUI();

    // Limpar os campos
    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("dueDate").value = "";
}

function removeTransaction(index) {
    if (confirm("Deseja realmente remover esta transação?")) {
        transactions.splice(index, 1);
        saveToLocalStorage();
        updateUI();
    }
}

function markAsPaid(index) {
    transactions[index].paid = true;
    saveToLocalStorage();
    updateUI();
}

function updateUI() {
    const transactionList = document.getElementById("transaction-list");
    transactionList.innerHTML = "";

    let income = 0;
    let expense = 0;

    transactions.forEach((transaction, index) => {
        const row = document.createElement("tr");
        row.className = transaction.paid ? "paid" : "";

        row.innerHTML = `
            <td>${transaction.description}</td>
            <td>R$ ${transaction.amount.toFixed(2)}</td>
            <td>${new Date(transaction.dueDate).toLocaleDateString()}</td>
            <td>${transaction.type}</td>
            <td>${transaction.paid ? "Pago" : "Pendente"}</td>
            <td>
                <button onclick="markAsPaid(${index})" ${transaction.paid ? "disabled" : ""}>Marcar como Pago</button>
                <button onclick="removeTransaction(${index})">Remover</button>
            </td>
        `;

        transactionList.appendChild(row);

        if (transaction.type === "entrada") {
            income += transaction.amount;
        } else if (transaction.type === "saida") {
            expense += transaction.amount;
        }
    });

    // Atualizar resumo
    const balance = income - expense;
    document.getElementById("income").textContent = `R$ ${income.toFixed(2)}`;
    document.getElementById("expense").textContent = `R$ ${expense.toFixed(2)}`;
    document.getElementById("balance").textContent = `R$ ${balance.toFixed(2)}`;
}

// Inicializar interface
document.getElementById("add-transaction-btn").addEventListener("click", addTransaction);
updateUI();