// Função para formatar valores monetários no padrão brasileiro
function formatCurrency(value) {
    return value
        .toFixed(2) // Garante 2 casas decimais
        .replace('.', ',') // Substitui o ponto decimal por vírgula
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona pontos como separadores de milhar
}

// Função para formatar datas no formato brasileiro (dd/mm/aaaa)
function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

// Variáveis para armazenar total de entradas, saídas e a lista de transações
let totalIncome = 0;
let totalExpense = 0;

// Atualiza o resumo financeiro (Entradas, Saídas, Saldo)
function updateSummary() {
    const balance = totalIncome - totalExpense;

    document.getElementById('income').textContent = `R$ ${formatCurrency(totalIncome)}`;
    document.getElementById('expense').textContent = `R$ ${formatCurrency(totalExpense)}`;
    document.getElementById('balance').textContent = `R$ ${formatCurrency(balance)}`;
}

// Adiciona uma nova transação
function addTransaction() {
    // Obter valores do formulário
    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const dueDate = document.getElementById('dueDate').value;
    const type = document.getElementById('type').value;

    // Valida os campos do formulário
    if (!description || isNaN(amount) || amount <= 0 || !dueDate) {
        alert('Por favor, preencha todos os campos corretamente!');
        return;
    }

    // Atualiza o total de entradas ou saídas
    if (type === 'entrada') {
        totalIncome += amount;
    } else {
        totalExpense += amount;
    }

    // Adicionar a transação na tabela
    const transactionList = document.getElementById('transaction-list');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${description}</td>
        <td>R$ ${formatCurrency(amount)}</td>
        <td>${formatDate(dueDate)}</td>
        <td>${type}</td>
        <td class="status">Aberto</td>
        <td>
            <button class="paid-btn">Pago</button>
            <button class="delete-btn">Excluir</button>
        </td>
    `;

    transactionList.appendChild(newRow);

    // Atualiza o resumo financeiro
    updateSummary();

    // Limpa os campos do formulário
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('dueDate').value = '';
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
        const value = parseFloat(
            row.cells[1].textContent.replace(/[^\d,-]/g, '').replace('.', '').replace(',', '.')
        );
        const type = row.cells[3].textContent;

        // Atualiza o total com base no tipo da transação
        if (type === 'entrada') {
            totalIncome -= value;
        } else {
            totalExpense -= value;
        }

        row.remove();
        updateSummary();
    }
}

// Inicializa os eventos
document.getElementById('add-transaction-btn').addEventListener('click', addTransaction);
document.getElementById('transaction-list').addEventListener('click', function (event) {
    markAsPaid(event);
    deleteTransaction(event);
});

// Atualiza o resumo ao carregar a página
updateSummary();