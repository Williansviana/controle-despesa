// Função para formatar valores monetários no padrão brasileiro
function formatCurrency(value) {
    return value
        .toFixed(2)
        .replace('.', ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Função para formatar datas no formato brasileiro (dd/mm/aaaa)
function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

// Variáveis para armazenar dados
let transactions = []; // Lista de transações
let totalIncome = 0;
let totalExpense = 0;

// Atualiza o resumo financeiro (Entradas, Saídas, Saldo)
function updateSummary() {
    const balance = totalIncome - totalExpense;

    document.getElementById('income').textContent = `R$ ${formatCurrency(totalIncome)}`;
    document.getElementById('expense').textContent = `R$ ${formatCurrency(totalExpense)}`;
    document.getElementById('balance').textContent = `R$ ${formatCurrency(balance)}`;
}

// Filtra transações com base no mês selecionado
function filterByMonth() {
    const selectedMonth = document.getElementById('month').value;

    // Limpa a tabela antes de atualizar
    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = '';

    // Filtra e exibe as transações do mês selecionado
    const filteredTransactions = transactions.filter((transaction) => {
        const transactionMonth = new Date(transaction.date).toLocaleString('pt-BR', { month: 'long' });
        return transactionMonth.toLowerCase() === selectedMonth.toLowerCase();
    });

    // Recalcula os totais
    totalIncome = 0;
    totalExpense = 0;

    filteredTransactions.forEach((transaction) => {
        addTransactionToTable(transaction);
        if (transaction.type === 'entrada') {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });

    updateSummary();
}

// Adiciona uma nova transação
function addTransaction() {
    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const dueDate = document.getElementById('dueDate').value;
    const type = document.getElementById('type').value;

    // Valida os campos do formulário
    if (!description || isNaN(amount) || amount <= 0 || !dueDate) {
        alert('Por favor, preencha todos os campos corretamente!');
        return;
    }

    // Cria o objeto da transação
    const transaction = {
        description,
        amount,
        date: dueDate,
        type,
        status: 'Aberto',
    };

    // Adiciona a transação à lista
    transactions.push(transaction);

    // Atualiza os totais globais
    if (type === 'entrada') {
        totalIncome += amount;
    } else {
        totalExpense += amount;
    }

    // Verifica se a transação pertence ao mês atualmente selecionado
    const selectedMonth = document.getElementById('month').value;
    const transactionMonth = new Date(transaction.date).toLocaleString('pt-BR', { month: 'long' });

    if (transactionMonth.toLowerCase() === selectedMonth.toLowerCase()) {
        addTransactionToTable(transaction);
    }

    updateSummary();

    // Limpa os campos do formulário
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('dueDate').value = '';
}

// Adiciona uma transação na tabela
function addTransactionToTable(transaction) {
    const transactionList = document.getElementById('transaction-list');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${transaction.description}</td>
        <td>R$ ${formatCurrency(transaction.amount)}</td>
        <td>${formatDate(transaction.date)}</td>
        <td>${transaction.type}</td>
        <td class="status">${transaction.status}</td>
        <td>
            <button class="paid-btn">Pago</button>
            <button class="delete-btn">Excluir</button>
        </td>
    `;

    transactionList.appendChild(newRow);
}

// Marca a transação como "Paga" ou "Aberto"
function markAsPaid(event) {
    if (event.target.classList.contains('paid-btn')) {
        const row = event.target.closest('tr');
        const statusCell = row.querySelector('.status');

        if (statusCell.textContent === 'Aberto') {
            statusCell.textContent = 'Pago';
            statusCell.style.color = 'green';
        } else {
            statusCell.textContent = 'Aberto';
            statusCell.style.color = '';
        }
    }
}

// Exclui uma transação
function deleteTransaction(event) {
    if (event.target.classList.contains('delete-btn')) {
        const row = event.target.closest('tr');
        const description = row.cells[0].textContent;
        const value = parseFloat(
            row.cells[1].textContent.replace(/[^\d,-]/g, '').replace('.', '').replace(',', '.')
        );
        const type = row.cells[3].textContent;

        // Remove a transação da lista global
        transactions = transactions.filter((transaction) => transaction.description !== description);

        // Atualiza os totais globais
        if (type === 'entrada') {
            totalIncome -= value;
        } else {
            totalExpense -= value;
        }

        row.remove();
        updateSummary();
    }
}

// Eventos
document.getElementById('add-transaction-btn').addEventListener('click', addTransaction);
document.getElementById('month').addEventListener('change', filterByMonth);
document.getElementById('transaction-list').addEventListener('click', function (event) {
    markAsPaid(event);
    deleteTransaction(event);
});

// Atualiza o resumo inicial
updateSummary();