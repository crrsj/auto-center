  const API_URL = 'http://localhost:8080/api';

  // Função para cadastrar novo cliente
document.getElementById('formCliente').onsubmit = async function(e) {
    e.preventDefault(); // Impede o recarregamento da página

    // Captura os dados do formulário de forma dinâmica
    const formData = new FormData(this);
    const dadosCliente = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${API_URL}/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosCliente)
        });

        if (response.ok) {
            // Feedback visual de sucesso
            alert("✅ Cliente cadastrado com sucesso!");

            // 1. Limpa os campos do formulário
            this.reset();

            // 2. Fecha o modal do Bootstrap
            const modalElement = document.getElementById('modalCliente');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }

            // 3. Atualiza os selects de clientes em outros modais (Veículo e O.S.)
            // Isso garante que o novo cliente já apareça para seleção imediata
            await carregarClientesParaSelects();

        } else {
            const erro = await response.json();
            alert("❌ Erro ao cadastrar: " + (erro.message || "Verifique os dados."));
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("⚠️ Não foi possível conectar ao servidor. Verifique se o Back-end está rodando.");
    }
};


// Função para cadastrar veículo vinculado a um cliente
document.getElementById('formVeiculo').onsubmit = async function(e) {
    e.preventDefault(); // Evita o refresh da página

    // Captura os dados do formulário
    const formData = new FormData(this);
    const dadosVeiculo = Object.fromEntries(formData.entries());

    // O clienteId é essencial para o Back-end saber de quem é o carro
    const clienteId = dadosVeiculo.clienteId;

    if (!clienteId) {
        alert("⚠️ Por favor, selecione um proprietário para o veículo.");
        return;
    }

    try {
        // Rota: POST /api/veiculos/{clienteId}
        const response = await fetch(`${API_URL}/veiculos/${clienteId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                marca: dadosVeiculo.marca,
                modelo: dadosVeiculo.modelo,
                anoModelo: dadosVeiculo.anoModelo,
                placa: dadosVeiculo.placa.toUpperCase(), // Garante placa em caixa alta
                seguro: dadosVeiculo.seguro,
                vistoria: dadosVeiculo.vistoria
            })
        });

        if (response.ok) {
            alert("🚗 Veículo cadastrado e vinculado com sucesso!");

            // 1. Reseta o formulário
            this.reset();

            // 2. Fecha o modal
            const modalVeiculo = document.getElementById('modalVeiculo');
            bootstrap.Modal.getInstance(modalVeiculo).hide();

            // 3. Opcional: Se estiver no meio de uma criação de O.S., 
            // atualiza a lista de veículos do cliente selecionado lá
            const selCliOS = document.getElementById('selCliOS');
            if(selCliOS && selCliOS.value === clienteId) {
                carregarVeiculosDoCliente(clienteId);
            }

        } else {
            const erro = await response.json();
            alert("❌ Erro ao salvar veículo: " + (erro.message || "Verifique os dados."));
        }
    } catch (error) {
        console.error("Erro ao cadastrar veículo:", error);
        alert("⚠️ Erro de conexão com o servidor.");
    }
};

// Configuração de datas e inputs
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#dataAtual').forEach(el => el.valueAsDate = new Date());
    carregarClientesParaSelects();
    carregarServicosTabela();
});

// 1. CARREGAR VEÍCULOS POR CLIENTE (O segredo do seu novo Backend)
async function carregarVeiculosDoCliente(clienteId) {
    const selVeiculo = document.getElementById('selVeiculoOS');
    if (!clienteId) {
        selVeiculo.innerHTML = '<option value="">Selecione o cliente...</option>';
        return;
    }
    
    selVeiculo.innerHTML = '<option value="">Carregando veículos...</option>';
    try {
        const res = await fetch(`${API_URL}/clientes/${clienteId}`);
        const cliente = await res.json();
        const veiculos = cliente.veiculos || [];
        
        if (veiculos.length === 0) {
            selVeiculo.innerHTML = '<option value="">Nenhum veículo vinculado!</option>';
            return;
        }

        selVeiculo.innerHTML = veiculos.map(v => 
            `<option value="${v.id}">${v.modelo} (${v.placa})</option>`
        ).join('');
    } catch (e) {
        selVeiculo.innerHTML = '<option value="">Erro ao buscar veículos</option>';
    }
}

// 2. CADASTRO DE VEÍCULO (Usando a rota /{clienteId})
document.getElementById('formVeiculo').onsubmit = async function(e) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(this).entries());
    
    try {
        const res = await fetch(`${API_URL}/veiculos/${d.clienteId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(d)
        });

        if (res.ok) {
            alert("Veículo vinculado com sucesso!");
            this.reset();
            bootstrap.Modal.getInstance(document.getElementById('modalVeiculo')).hide();
        }
    } catch (err) { alert("Erro ao conectar com servidor."); }
};

// 3. GERAÇÃO DE O.S. (Usando /{clienteId}/{veiculoId})
document.getElementById('formServico').onsubmit = async function(e) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(this).entries());

    try {
        const res = await fetch(`${API_URL}/servicos/${d.clienteId}/${d.veiculoId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(d)
        });

        if (res.ok) {
            alert("O.S. Gerada!");
            this.reset();
            bootstrap.Modal.getInstance(document.getElementById('modalServico')).hide();
            carregarServicosTabela();
        }
    } catch (err) { alert("Erro ao gerar serviço."); }
};

async function carregarServicosTabela() {
    try {
        const res = await fetch(`${API_URL}/servicos`);
        const json = await res.json();
        const servicos = Array.isArray(json) ? json : (json.content || []);
        
        const corpo = document.getElementById('tabelaCorpo');
        corpo.innerHTML = servicos.map(s => {
            const v = s.veiculo || {};
            const c = s.cliente || {};
            
            return `
            <tr>
                <td><span class="fw-bold text-primary">#${s.ordemServico || s.id}</span></td>
                <td>
                    <div class="fw-bold">${c.nome || '---'}</div>
                    <small class="text-muted">${v.modelo || 'Sem veículo'}</small>
                </td>
                <td>
                    <div class="placa-box">
                        <div class="placa-head">BRASIL</div>
                        <div class="placa-num">${v.placa || '-------'}</div>
                    </div>
                </td>
                <td class="small">
                    <i class="far fa-calendar-check text-muted"></i> ${s.dataEntrada ? s.dataEntrada.split('-').reverse().join('/') : '--'}<br>
                    <i class="far fa-calendar-times text-danger"></i> ${s.dataSaida ? s.dataSaida.split('-').reverse().join('/') : '--'}
                </td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge-status ${s.statusServico === 'ORCAMENTO' ? 'status-orcamento' : 'status-servico'}">
                            ${s.statusServico}
                        </span>
                        <span class="badge-pagamento ${s.statusPagamento === 'PENDENTE' ? 'pag-pendente' : 'pag-pago'}">
                            <i class="fas ${s.statusPagamento === 'PAGO' ? 'fa-check-circle' : 'fa-clock'}"></i> ${s.statusPagamento}
                        </span>
                    </div>
                </td>
                <td class="fw-bold text-dark">R$ ${parseFloat(s.valor || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary border-0" onclick="visualizarServico(${s.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>`;
        }).join('');

        // Atualiza os contadores do dashboard
        document.getElementById('dashOrc').innerText = servicos.filter(x => x.statusServico === 'ORCAMENTO').length;
        document.getElementById('dashServ').innerText = servicos.filter(x => x.statusServico === 'SERVICO').length;
    } catch (e) { 
        console.error("Erro ao carregar tabela:", e); 
    }
}

async function visualizarServico(id) {
    try {
        const res = await fetch(`${API_URL}/servicos/${id}`);
        if (!res.ok) throw new Error("Serviço não encontrado");
        
        const s = await res.json();
        const v = s.veiculo || { modelo: 'Não informado', marca: '-', placa: '-------', seguro: 'NAO', vistoria: 'PENDENTE' };
        const c = s.cliente || { nome: 'Não informado', telefone: '-' };

        // Formatação de Datas
        const formatarData = (data) => data ? data.split('-').reverse().join('/') : '--/--/----';

        // Estilização dinâmica para Seguro
        const coresSeguro = {
            'MAPFRE': '#cc092f', 'PORTO': '#004a94', 'AZUL': '#009fe3', 'TOKIO': '#008349'
        };
        const corSeguro = coresSeguro[v.seguro] || '#6c757d';

        // Estilização dinâmica para Vistoria
        const isVistoriaOk = v.vistoria === 'REALIZADA';
        const corVistoria = isVistoriaOk ? '#198754' : '#dc3545';
        const iconeVistoria = isVistoriaOk ? 'fa-check-double' : 'fa-triangle-exclamation';

        document.getElementById('conteudoDetalhes').innerHTML = `
            <div class="p-4">
                <div class="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <h4 class="fw-bold text-primary mb-0">ORDEM DE SERVIÇO #${s.ordemServico || s.id}</h4>
                        <span class="badge bg-secondary mt-1">${s.tipoServico || 'GERAL'}</span>
                    </div>
                    <div class="text-end">
                        <span class="badge-status ${s.statusServico === 'ORCAMENTO' ? 'status-orcamento' : 'status-servico'} d-inline-block mb-1">
                            ${s.statusServico}
                        </span>
                        <br>
                        <span class="badge-pagamento ${s.statusPagamento === 'PENDENTE' ? 'pag-pendente' : 'pag-pago'}">
                            ${s.statusPagamento}
                        </span>
                    </div>
                </div>

                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="card h-100 border-0 bg-light p-3">
                            <label class="small fw-bold text-muted text-uppercase mb-2"><i class="fas fa-user me-1"></i> Cliente</label>
                            <h6 class="fw-bold mb-1">${c.nome}</h6>
                            <p class="small text-muted mb-0">${c.telefone}</p>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card h-100 border-0 bg-light p-3">
                            <label class="small fw-bold text-muted text-uppercase mb-2"><i class="fas fa-car me-1"></i> Veículo</label>
                            <h6 class="fw-bold mb-2">${v.modelo} <small class="text-muted">(${v.marca})</small></h6>
                            <div class="placa-box">
                                <div class="placa-head">BRASIL</div>
                                <div class="placa-num">${v.placa}</div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="p-2 border rounded">
                            <div class="row text-center">
                                <div class="col-6 border-end">
                                    <label class="d-block small text-muted fw-bold">ENTRADA</label>
                                    <span class="small fw-bold">${formatarData(s.dataEntrada)}</span>
                                </div>
                                <div class="col-6">
                                    <label class="d-block small text-muted fw-bold">PREVISÃO</label>
                                    <span class="small fw-bold text-danger">${formatarData(s.dataSaida)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <label class="small fw-bold text-muted text-uppercase d-block mb-1">Seguro</label>
                        <div class="p-2 rounded text-white text-center fw-bold small" style="background-color: ${corSeguro}; min-height: 38px; display: flex; align-items: center; justify-content: center;">
                            ${v.seguro}
                        </div>
                    </div>
                    <div class="col-md-3">
                        <label class="small fw-bold text-muted text-uppercase d-block mb-1">Vistoria</label>
                        <div class="p-2 rounded text-white text-center fw-bold small" style="background-color: ${corVistoria}; min-height: 38px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas ${iconeVistoria} me-1"></i> ${v.vistoria}
                        </div>
                    </div>

                    <div class="col-12 mt-3">
                        <label class="small fw-bold text-muted text-uppercase d-block mb-2"><i class="fas fa-clipboard-list me-1"></i> Descrição do Serviço</label>
                        <div class="p-3 border rounded bg-white" style="min-height: 100px; font-size: 0.9rem; color: #444;">
                            ${s.descricao || '<em>Nenhum detalhe adicional informado.</em>'}
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-dark text-white p-4 d-flex justify-content-between align-items-center rounded-bottom">
                <div>
                    <small class="text-uppercase opacity-50 d-block" style="font-size: 0.7rem;">Valor Total do Serviço</small>
                    <h2 class="m-0 fw-bold text-warning">R$ ${parseFloat(s.valor || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h2>
                </div>
                <div class="text-end opacity-50">
                    <i class="fas fa-file-invoice-dollar fa-2x"></i>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('modalDetalhesServico'));
        modal.show();

    } catch (e) {
        console.error(e);
        alert("Erro ao carregar detalhes do serviço.");
    }
}

// 6. POPULAR SELECTS DE CLIENTES
async function carregarClientesParaSelects() {
    try {
        const res = await fetch(`${API_URL}/clientes`);
        const json = await res.json();
        const clientes = Array.isArray(json) ? json : (json.content || []);
        
        document.querySelectorAll('.select-clientes').forEach(sel => {
            sel.innerHTML = '<option value="">Selecione...</option>' + 
                clientes.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
        });
    } catch (e) { console.error(e); }
}


document.getElementById("menu-toggle").addEventListener("click", () => {
    document.getElementById("wrapper").classList.toggle("toggled");
});