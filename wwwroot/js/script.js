document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('tarefaForm');
    const logDiv = document.getElementById('log');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const tarefa = {
            nomeTarefa: formData.get('nomeTarefa'),
            descricaoTarefa: formData.get('descricaoTarefa'),
            statusTarefa: formData.get('statusTarefa'),
            dataTarefa: formData.get('dataTarefa'),
            tempoParaFazerTarefa: formData.get('tempoParaFazerTarefa'),
            opniaoTarefaRealizada: formData.get('opniaoTarefaRealizada')
        };

        try {
            const response = await fetch('/api/tarefas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tarefa)
            });

            const log = document.getElementById('log');
            
            if (response.ok) {
                const novaTarefa = await response.json();
                log.innerHTML += `<div style="color: green;">✓ Tarefa "${tarefa.nomeTarefa}" cadastrada com sucesso!</div>`;
                this.reset();
                carregarTarefas(); // Recarrega a lista de tarefas
            } else {
                log.innerHTML += `<div style="color: red;">✗ Erro ao cadastrar tarefa: ${response.status}</div>`;
            }
        } catch (error) {
            const log = document.getElementById('log');
            log.innerHTML += `<div style="color: red;">✗ Erro de conexão: ${error.message}</div>`;
        }
    });

    // Função para carregar e exibir todas as tarefas
    async function carregarTarefas() {
        try {
            const response = await fetch('/api/tarefas');
            
            if (response.ok) {
                const tarefas = await response.json();
                exibirTarefas(tarefas);
            } else {
                console.error('Erro ao carregar tarefas:', response.status);
            }
        } catch (error) {
            console.error('Erro de conexão ao carregar tarefas:', error);
        }
    }

    // Função para exibir as tarefas na tela
    function exibirTarefas(tarefas) {
        const listaTarefas = document.getElementById('listaTarefas');
        
        if (tarefas.length === 0) {
            listaTarefas.innerHTML = '<div style="text-align: center; color: #666; margin-top: 20px;">Nenhuma tarefa cadastrada</div>';
            return;
        }
        // Exibir as tarefas mais novas primeiro
        listaTarefas.innerHTML = tarefas.reverse().map(tarefa => `
            <div class="tarefa-item">
                <div class="tarefa-nome">${tarefa.nomeTarefa}</div>
                <div class="tarefa-descricao">${tarefa.descricaoTarefa || 'Sem descrição'}</div>
                <div class="tarefa-info">
                    <span class="tarefa-status ${tarefa.statusTarefa === 'Concluido' ? 'status-concluido' : 'status-andamento'}">
                        ${tarefa.statusTarefa}
                    </span>
                    <span class="tarefa-data">${new Date(tarefa.dataTarefa).toLocaleString('pt-BR')}</span>
                </div>
                ${tarefa.tempoParaFazerTarefa ? `<div class="tarefa-tempo">Tempo: ${tarefa.tempoParaFazerTarefa}</div>` : ''}
                ${tarefa.opniaoTarefaRealizada ? `<div class="tarefa-opiniao" style="margin-top: 8px; font-style: italic;">Opinião: ${tarefa.opniaoTarefaRealizada}</div>` : ''}
                <div class="tarefa-acoes">
                    ${tarefa.statusTarefa === 'Em Andamento' ? 
                        `<button class="btn-concluir" onclick="marcarComoConcluida(${tarefa.id})">✓ Marcar como Concluída</button>` : 
                        `<span class="tarefa-concluida">✓ Concluída</span>`
                    }
                </div>
            </div>
        `).join('');
    }    // Carrega as tarefas quando a página é carregada
    carregarTarefas();
});

// Função para marcar tarefa como concluída
async function marcarComoConcluida(tarefaId) {
    try {
        // Primeiro, busca a tarefa atual
        const responseGet = await fetch(`/api/tarefas/${tarefaId}`);
        if (!responseGet.ok) {
            throw new Error('Erro ao buscar tarefa');
        }
        
        const tarefa = await responseGet.json();
        
        // Atualiza o status para "Concluido"
        tarefa.statusTarefa = 'Concluido';
        
        // Envia a atualização
        const responsePut = await fetch(`/api/tarefas/${tarefaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tarefa)
        });

        if (responsePut.ok) {
            const log = document.getElementById('log');
            log.innerHTML += `<div style="color: green;">✓ Tarefa "${tarefa.nomeTarefa}" marcada como concluída!</div>`;
            
            // Recarrega a lista de tarefas
            const form = document.getElementById('tarefaForm');
            const event = new Event('carregarTarefas');
            document.dispatchEvent(event);
            
            // Chama a função diretamente já que está no escopo global
            const response = await fetch('/api/tarefas');
            if (response.ok) {
                const tarefas = await response.json();
                const listaTarefas = document.getElementById('listaTarefas');
                
                if (tarefas.length === 0) {
                    listaTarefas.innerHTML = '<div style="text-align: center; color: #666; margin-top: 20px;">Nenhuma tarefa cadastrada</div>';
                    return;
                }
                
                listaTarefas.innerHTML = tarefas.map(t => `
                    <div class="tarefa-item">
                        <div class="tarefa-nome">${t.nomeTarefa}</div>
                        <div class="tarefa-descricao">${t.descricaoTarefa || 'Sem descrição'}</div>
                        <div class="tarefa-info">
                            <span class="tarefa-status ${t.statusTarefa === 'Concluido' ? 'status-concluido' : 'status-andamento'}">
                                ${t.statusTarefa}
                            </span>
                            <span class="tarefa-data">${new Date(t.dataTarefa).toLocaleString('pt-BR')}</span>
                        </div>
                        ${t.tempoParaFazerTarefa ? `<div class="tarefa-tempo">Tempo: ${t.tempoParaFazerTarefa}</div>` : ''}
                        ${t.opniaoTarefaRealizada ? `<div class="tarefa-opiniao" style="margin-top: 8px; font-style: italic; color: #666;">Opinião: ${t.opniaoTarefaRealizada}</div>` : ''}
                        <div class="tarefa-acoes">
                            ${t.statusTarefa === 'Em Andamento' ? 
                                `<button class="btn-concluir" onclick="marcarComoConcluida(${t.id})">✓ Marcar como Concluída</button>` : 
                                `<span class="tarefa-concluida">✓ Concluída</span>`
                            }
                        </div>
                    </div>
                `).join('');
            }
        } else {
            const log = document.getElementById('log');
            log.innerHTML += `<div style="color: red;">✗ Erro ao marcar tarefa como concluída: ${responsePut.status}</div>`;
        }
    } catch (error) {
        const log = document.getElementById('log');
        log.innerHTML += `<div style="color: red;">✗ Erro de conexão: ${error.message}</div>`;
    }
}
