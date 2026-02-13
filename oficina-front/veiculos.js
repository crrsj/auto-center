const API_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    carregarVeiculos();
    
    // Filtro de busca em tempo real
    document.getElementById('buscaVeiculo').addEventListener('keyup', function(e) {
        const termo = e.target.value.toLowerCase();
        const linhas = document.querySelectorAll('#tabelaVeiculos tr');
        
        linhas.forEach(linha => {
            const texto = linha.innerText.toLowerCase();
            linha.style.display = texto.includes(termo) ? '' : 'none';
        });
    });
});

async function carregarVeiculos() {
    try {
        const res = await fetch(`${API_URL}/veiculos`);
        const json = await res.json();
        const veiculos = Array.isArray(json) ? json : (json.content || []);
        
        const corpo = document.getElementById('tabelaVeiculos');
        corpo.innerHTML = veiculos.map(v => `
            <tr>
                <td class="ps-4">
                    <div class="fw-bold text-dark">${v.modelo}</div>
                    <small class="text-muted text-uppercase">${v.marca} | ${v.anoModelo || '---'}</small>
                </td>
                <td>
                    <div class="placa-badge">
                        <div class="placa-header">BRASIL</div>
                        <div class="placa-body">${v.placa}</div>
                    </div>
                </td>
                <td>
                    <div class="small fw-bold">${v.cliente ? v.cliente.nome : 'Sem dono'}</div>
                    <small class="text-muted">${v.cliente ? v.cliente.telefone : ''}</small>
                </td>
                <td><span class="badge ${v.seguro === 'NAO' ? 'bg-secondary' : 'bg-primary'}">${v.seguro}</span></td>
                <td>
                    <span class="badge ${v.vistoria === 'REALIZADA' ? 'bg-success' : 'bg-danger'}">
                        ${v.vistoria}
                    </span>
                </td>
                <td class="text-center">
                    <button class="btn-action bg-warning-subtle text-warning me-1" onclick="prepararEdicao(${v.id})">
                        <i class="fas fa-edit"></i>
                    </button>                  
                </td>
            </tr>
        `).join('');
    } catch (e) { console.error("Erro ao carregar veículos", e); }
}

async function excluirVeiculo(id) {
    if (confirm("Deseja remover este veículo? Esta ação não pode ser desfeita.")) {
        const res = await fetch(`${API_URL}/veiculos/${id}`, { method: 'DELETE' });
        if (res.ok) { carregarVeiculos(); }
    }
}

async function prepararEdicao(id) {
    const res = await fetch(`${API_URL}/veiculos/${id}`);
    const v = await res.json();
    
    document.getElementById('editVeiculoId').value = v.id;
    document.getElementById('editVeiculoMarca').value = v.marca;
    document.getElementById('editVeiculoModelo').value = v.modelo;
    document.getElementById('editVeiculoPlaca').value = v.placa;
    document.getElementById('editVeiculoAno').value = v.anoModelo;
    document.getElementById('editVeiculoSeguro').value = v.seguro;
    document.getElementById('editVeiculoVistoria').value = v.vistoria;
    
    new bootstrap.Modal(document.getElementById('modalEditarVeiculo')).show();
}

document.getElementById('formEditarVeiculo').onsubmit = async function(e) {
    e.preventDefault();
    const id = document.getElementById('editVeiculoId').value;
    const dados = {
        marca: document.getElementById('editVeiculoMarca').value,
        modelo: document.getElementById('editVeiculoModelo').value,
        placa: document.getElementById('editVeiculoPlaca').value,
        anoModelo: document.getElementById('editVeiculoAno').value,
        seguro: document.getElementById('editVeiculoSeguro').value,
        vistoria: document.getElementById('editVeiculoVistoria').value
    };

    const res = await fetch(`${API_URL}/veiculos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });

    if (res.ok) {
        bootstrap.Modal.getInstance(document.getElementById('modalEditarVeiculo')).hide();
        carregarVeiculos();
    }
};