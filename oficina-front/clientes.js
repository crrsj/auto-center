const API_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    carregarClientes();
    
    // Toggle Menu
    document.getElementById("menu-toggle").addEventListener("click", () => {
        document.getElementById("wrapper").classList.toggle("toggled");
    });
});

async function carregarClientes() {
    try {
        const res = await fetch(`${API_URL}/clientes`);
        const json = await res.json();
        
        // Ajuste para lidar com a paginação do Spring (Pageable)
        const clientes = Array.isArray(json) ? json : (json.content || []);
        
        const corpo = document.getElementById('tabelaClientes');
        corpo.innerHTML = clientes.map(c => `
            <tr>
                <td class="ps-4 text-muted">#${c.id}</td>
                <td><span class="fw-bold text-dark">${c.nome}</span></td>
                <td>${c.telefone}</td>
                <td>${c.email || '---'}</td>
                <td><span class="badge bg-info text-dark">${c.veiculos ? c.veiculos.length : 0} veículos</span></td>
                <td class="text-center">
                    <button class="btn-action btn-edit me-1" onclick="prepararEdicao(${c.id})" title="Editar">
                        <i class="fas fa-pen-to-square"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="excluirCliente(${c.id})" title="Excluir">
                        <i class="fas fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (e) { 
        console.error("Erro ao carregar clientes", e); 
        alert("Erro ao conectar com o servidor.");
    }
}


// DELETAR CLIENTE
async function excluirCliente(id) {
    if (confirm("⚠️ Tem certeza que deseja excluir este cliente? Isso removerá todos os veículos e O.S. vinculadas!")) {
        try {
            const res = await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' });
            if (res.ok) {
                alert("Cliente removido!");
                carregarClientes();
            }
        } catch (e) { alert("Erro ao excluir."); }
    }
}

// PREPARAR EDIÇÃO (Busca dados e abre modal)
async function prepararEdicao(id) {
    try {
        const res = await fetch(`${API_URL}/clientes/${id}`);
        const c = await res.json();
        
        document.getElementById('editClientId').value = c.id;
        document.getElementById('editClientNome').value = c.nome;
        document.getElementById('editClientTelefone').value = c.telefone;
        document.getElementById('editClientEmail').value = c.email || '';
        
        new bootstrap.Modal(document.getElementById('modalEditarCliente')).show();
    } catch (e) { alert("Erro ao buscar dados do cliente."); }
}

// ATUALIZAR (Submit do Form de Edição)
document.getElementById('formEditarCliente').onsubmit = async function(e) {
    e.preventDefault();
    const id = document.getElementById('editClientId').value;
    const dados = Object.fromEntries(new FormData(this).entries());

    try {
        const res = await fetch(`${API_URL}/clientes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (res.ok) {
            alert("Cliente atualizado!");
            bootstrap.Modal.getInstance(document.getElementById('modalEditarCliente')).hide();
            carregarClientes();
        }
    } catch (e) { alert("Erro ao atualizar cliente."); }
};


// Captura o formulário de edição
const formEditar = document.getElementById('formEditarCliente');

formEditar.onsubmit = async function(e) {
    e.preventDefault(); // Evita que a página recarregue

    // Recupera o ID que foi armazenado no input hidden ao abrir o modal
    const id = document.getElementById('editClientId').value;

    // Monta o objeto com os dados atualizados
    const dadosAtualizados = {
        nome: document.getElementById('editClientNome').value,
        telefone: document.getElementById('editClientTelefone').value,
        email: document.getElementById('editClientEmail').value // Aqui garante o envio do e-mail
    };

    try {
        const response = await fetch(`${API_URL}/clientes/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (response.ok) {
            // 1. Feedback de sucesso
            alert("✅ Cliente atualizado com sucesso!");

            // 2. Fecha o modal usando a instância do Bootstrap
            const modalElement = document.getElementById('modalEditarCliente');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();

            // 3. Recarrega a lista para mostrar os novos dados (incluindo o e-mail)
            carregarClientes();
        } else {
            const erro = await response.json();
            alert("❌ Erro ao atualizar: " + (erro.message || "Verifique os dados."));
        }
    } catch (error) {
        console.error("Erro na requisição PUT:", error);
        alert("⚠️ Erro de conexão com o servidor.");
    }
};


carregarClientes();