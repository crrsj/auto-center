const API_URL = 'http://localhost:8080/api';
let listaServicosLocal = [];
document.addEventListener('DOMContentLoaded', () => {
    carregarServicos();
    
    document.getElementById("menu-toggle").addEventListener("click", () => {
        document.getElementById("wrapper").classList.toggle("toggled");
    });
});




// Carrega os dados da API ao iniciar
async function carregarServicos() {
    try {
        const res = await fetch(`${API_URL}/servicos`);
        const json = await res.json();
        
        // Ajuste para paginação do Spring
        listaServicosLocal = Array.isArray(json) ? json : (json.content || []);
        
        renderizarTabela(listaServicosLocal);
    } catch (e) {
        console.error("Erro ao carregar serviços:", e);
    }
}

function renderizarTabela(dados) {
    const corpo = document.getElementById('tabelaServicos');
    if (!corpo) return;

    corpo.innerHTML = dados.map(s => {
        // Garantia de dados para evitar erros de 'undefined'
        const v = s.veiculo || { modelo: 'N/A', placa: '---' };
        const c = s.cliente || { nome: 'N/A' };
        
        return `
        <tr>
            <td class="ps-4">
                <span class="fw-bold text-primary">#${s.ordemServico || s.id}</span><br>
                <small class="badge bg-light text-dark border">${s.tipoServico}</small>
            </td>
            <td>
                <div class="fw-bold text-dark">${c.nome}</div>
                <small class="text-muted">${v.modelo} • <span class="fw-bold text-dark">${v.placa}</span></small>
            </td>
            <td class="small text-muted">
                <div class="d-flex flex-column">
                    <span><i class="far fa-calendar-plus me-1"></i> ${formatarData(s.dataEntrada)}</span>
                    <span><i class="far fa-calendar-check me-1"></i> ${formatarData(s.dataSaida)}</span>
                </div>
            </td>
          <td>
        <div class="d-flex align-items-center gap-2">
            <span class="status-badge ${s.statusServico === 'ORCAMENTO' ? 'status-orcamento' : 'status-servico'}">
                ${s.statusServico}
            </span>
            <span class="status-badge ${s.statusPagamento === 'PENDENTE' ? 'pag-pendente' : 'pag-pago'}">
                ${s.statusPagamento}
            </span>
         </div>
      </td>
            <td class="fw-bold text-dark">
                R$ ${parseFloat(s.valor || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </td>
            <td class="text-center">
                <div class="d-flex justify-content-center gap-2">
                    <button class="btn btn-sm text-primary p-0" onclick="visualizarServico(${s.id})" title="Visualizar">
                        <i class="fas fa-eye fa-lg"></i>
                    </button>
                    <button class="btn btn-sm text-warning p-0" onclick="prepararEdicaoServico(${s.id})" title="Editar">
                        <i class="fas fa-edit fa-lg"></i>
                    </button>
                    <button class="btn btn-sm text-danger p-0" onclick="excluirServico(${s.id})" title="Excluir">
                        <i class="fas fa-trash-can fa-lg"></i>
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

// Certifique-se de ter essa função auxiliar para as datas não darem erro
function formatarData(data) {
    if (!data) return "--/--/----";
    try {
        const partes = data.split('-');
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    } catch (e) {
        return data;
    }
}

// Função de Filtro por Status
function filtrarPor(tipo, elemento) {
    // Estética dos botões
    document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
    if(elemento) elemento.classList.add('active');

    // Lógica de filtragem
    let filtrados = (tipo === 'TODOS') 
        ? listaServicosLocal 
        : listaServicosLocal.filter(s => s.statusServico === tipo);

    renderizarTabela(filtrados);
}

// Inicia o carregamento
document.addEventListener('DOMContentLoaded', carregarServicos);


async function excluirServico(id) {
    if (confirm("⚠️ Deseja realmente excluir esta O.S.? Esta ação é irreversível.")) {
        const res = await fetch(`${API_URL}/servicos/${id}`, { method: 'DELETE' });
        if (res.ok) carregarServicos();
    }
}


// 1. Função para carregar os dados da O.S. no Modal
async function prepararEdicaoServico(id) {
    try {
        const res = await fetch(`${API_URL}/servicos/${id}`);
        const s = await res.json();

        // Preenche os campos do formulário
        document.getElementById('editServicoId').value = s.id;
        document.getElementById('editTipoServico').value = s.tipoServico;
        document.getElementById('editValorServico').value = s.valor;
        document.getElementById('editDataEntrada').value = s.dataEntrada;
        document.getElementById('editDataSaida').value = s.dataSaida;
        document.getElementById('editStatusServico').value = s.statusServico;
        document.getElementById('editStatusPagamento').value = s.statusPagamento;
        document.getElementById('editDescricaoServico').value = s.descricao || '';

        // Abre o modal
        const modal = new bootstrap.Modal(document.getElementById('modalEditarServico'));
        modal.show();
    } catch (e) {
        alert("Erro ao buscar dados da O.S.");
    }
}

// 2. Função para enviar o PUT para o Back-end
document.getElementById('formEditarServico').onsubmit = async function(e) {
    e.preventDefault();
    const id = document.getElementById('editServicoId').value;
    
    const dadosAtualizados = {
        tipoServico: document.getElementById('editTipoServico').value,
        valor: document.getElementById('editValorServico').value,
        dataEntrada: document.getElementById('editDataEntrada').value,
        dataSaida: document.getElementById('editDataSaida').value,
        statusServico: document.getElementById('editStatusServico').value,
        statusPagamento: document.getElementById('editStatusPagamento').value,
        descricao: document.getElementById('editDescricaoServico').value
    };

    try {
        const res = await fetch(`${API_URL}/servicos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosAtualizados)
        });

        if (res.ok) {
            alert("✅ Ordem de Serviço atualizada!");
            bootstrap.Modal.getInstance(document.getElementById('modalEditarServico')).hide();
            carregarServicos(); // Atualiza a tabela
        } else {
            alert("❌ Erro ao atualizar serviço.");
        }
    } catch (e) {
        alert("⚠️ Erro de conexão.");
    }
};

function filtrarPor(tipo, elemento) {
    // 1. Remove destaque de todos os botões
    document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
    
    // 2. Adiciona destaque no botão clicado
    if(elemento) elemento.classList.add('active');

    // 3. Filtra a lista que salvamos globalmente
    let filtrados = [];
    if (tipo === 'TODOS') {
        filtrados = listaServicosLocal;
    } else {
        filtrados = listaServicosLocal.filter(s => s.statusServico === tipo);
    }

    renderizarTabela(filtrados);
}

// 2. Função de busca por texto (funciona para serviços e orçamentos ao mesmo tempo)
function buscarGeral(termo) {
    const t = termo.toLowerCase();
    const resultado = listaServicosLocal.filter(s => 
        s.cliente?.nome?.toLowerCase().includes(t) || 
        s.veiculo?.placa?.toLowerCase().includes(t) ||
        s.tipoServico?.toLowerCase().includes(t)
    );
    renderizarTabela(resultado);
}


function buscarTexto(termo) {
    const t = termo.toLowerCase();
    const filtrados = listaServicosLocal.filter(s => 
        s.cliente?.nome?.toLowerCase().includes(t) || 
        s.veiculo?.placa?.toLowerCase().includes(t) ||
        s.tipoServico?.toLowerCase().includes(t)
    );
    renderizarTabela(filtrados);
}

async function visualizarServico(id) {
    try {
        const res = await fetch(`${API_URL}/servicos/${id}`);
        if (!res.ok) throw new Error("Não foi possível obter os dados da O.S.");
        const s = await res.json();
        
        const container = document.getElementById('conteudoVisualizacao');
        if (!container) return console.error("ERRO: Elemento 'conteudoVisualizacao' não encontrado!");

        // Montagem do layout destacado (Ficha Técnica)
        container.innerHTML = `
            <div class="row g-4">
                <div class="col-12 border-bottom pb-3 d-flex justify-content-between align-items-center">
                    <div>
                        <span class="text-muted small fw-bold text-uppercase">Número da O.S.</span>
                        <h2 class="fw-bold text-primary mb-0">#${s.ordemServico || s.id}</h2>
                    </div>
                    <div class="text-end">
                        <span class="status-badge ${s.statusServico === 'ORCAMENTO' ? 'status-orcamento' : 'status-servico'} px-3 py-2 fs-6">
                            ${s.statusServico}
                        </span>
                    </div>
                </div>

                <div class="col-md-6">
                    <h6 class="text-muted fw-bold small text-uppercase mb-3"><i class="fas fa-user me-2"></i>Cliente</h6>
                    <p class="mb-1"><strong>Nome:</strong> ${s.cliente?.nome || 'N/A'}</p>
                    <p class="mb-1"><strong>Telefone:</strong> ${s.cliente?.telefone || '---'}</p>
                </div>
                <div class="col-md-6 border-start ps-4">
                    <h6 class="text-muted fw-bold small text-uppercase mb-3"><i class="fas fa-car me-2"></i>Veículo</h6>
                    <p class="mb-1"><strong>Modelo:</strong> ${s.veiculo?.modelo || '---'}</p>
                    <p class="mb-0"><strong>Placa:</strong> <span class="badge bg-dark">${s.veiculo?.placa || '---'}</span></p>
                </div>

                <div class="col-12 bg-light p-3 rounded-3 shadow-sm border-start border-primary border-4">
                    <h6 class="text-muted fw-bold small text-uppercase mb-2">Serviço Solicitado / Diagnóstico</h6>
                    <h5 class="fw-bold text-dark">${s.tipoServico}</h5>
                    <p class="text-secondary mb-0 mt-2">${s.descricao || 'Nenhuma observação técnica registrada.'}</p>
                </div>

                <div class="col-md-6 d-flex align-items-end">
                    <div class="text-muted small">
                        <i class="far fa-calendar-alt me-1"></i> Entrada: ${new Date(s.dataEntrada).toLocaleDateString()}<br>
                        <i class="far fa-calendar-check me-1"></i> Previsão: ${new Date(s.dataSaida).toLocaleDateString()}
                    </div>
                </div>
                <div class="col-md-6 text-end">
                    <span class="text-muted small text-uppercase fw-bold">Total do Serviço</span>
                    <h2 class="text-success fw-bold mb-0">R$ ${parseFloat(s.valor || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h2>
                    <span class="badge ${s.statusPagamento === 'PAGO' ? 'bg-success' : 'bg-danger'} px-3 mt-1">
                        PAGAMENTO ${s.statusPagamento}
                    </span>
                </div>
            </div>
        `;

        // Ativa o modal do Bootstrap
        const myModal = new bootstrap.Modal(document.getElementById('modalVisualizarOS'));
        myModal.show();
        
    } catch (e) {
        console.error("Erro ao carregar detalhes:", e);
        alert("Erro ao carregar os dados da O.S.");
    }
}