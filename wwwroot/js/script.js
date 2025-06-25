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
                window.carregarTarefas(); // Atualização dinâmica
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

    // Tornar a função global para ser acessível
    window.carregarTarefas = carregarTarefas;

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
                    <button class="btn-editar" onclick="editarTarefa(${tarefa.id})">✏️ Editar</button>
                    <button class="btn-excluir" onclick="excluirTarefa(${tarefa.id})">🗑️ Excluir</button>
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
        }); if (responsePut.ok) {
            const log = document.getElementById('log');
            log.innerHTML += `<div style="color: green;">✓ Tarefa "${tarefa.nomeTarefa}" marcada como concluída!</div>`;

            // Recarrega a lista de tarefas de forma mais eficiente
            window.carregarTarefas();
        } else {
            const log = document.getElementById('log');
            log.innerHTML += `<div style="color: red;">✗ Erro ao marcar tarefa como concluída: ${responsePut.status}</div>`;
        }
    } catch (error) {
        const log = document.getElementById('log');
        log.innerHTML += `<div style="color: red;">✗ Erro de conexão: ${error.message}</div>`;
    }
}

// Função para editar tarefa
async function editarTarefa(tarefaId) {
    try {
        const response = await fetch(`/api/tarefas/${tarefaId}`);
        if (response.ok) {
            const tarefa = await response.json();

            // Cria modal de edição
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                    <h3>Editar Tarefa</h3>
                    <form id="editForm">
                        <label for="editNome">Nome:</label>
                        <input type="text" id="editNome" value="${tarefa.nomeTarefa}" required>
                        
                        <label for="editDescricao">Descrição:</label>
                        <textarea id="editDescricao">${tarefa.descricaoTarefa || ''}</textarea>
                        
                        <label for="editStatus">Status:</label>
                        <select id="editStatus">
                            <option value="Em Andamento" ${tarefa.statusTarefa === 'Em Andamento' ? 'selected' : ''}>Em Andamento</option>
                            <option value="Concluido" ${tarefa.statusTarefa === 'Concluido' ? 'selected' : ''}>Concluído</option>
                        </select>
                        
                        <label for="editData">Data:</label>
                        <input type="datetime-local" id="editData" value="${tarefa.dataTarefa.slice(0, 16)}" required>
                        
                        <label for="editTempo">Tempo para fazer:</label>
                        <input type="text" id="editTempo" value="${tarefa.tempoParaFazerTarefa || ''}">
                        
                        <label for="editOpiniao">Opinião:</label>
                        <textarea id="editOpiniao">${tarefa.opniaoTarefaRealizada || ''}</textarea>
                        
                        <button type="submit" id="salvarBtn" disabled>Salvar Alterações</button>
                        <button type="button" onclick="this.closest('.modal').remove()">Cancelar</button>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);
            modal.style.display = 'block';

            // Armazena valores originais para comparação
            const valoresOriginais = {
                nome: tarefa.nomeTarefa,
                descricao: tarefa.descricaoTarefa || '',
                status: tarefa.statusTarefa,
                data: tarefa.dataTarefa.slice(0, 16),
                tempo: tarefa.tempoParaFazerTarefa || '',
                opiniao: tarefa.opniaoTarefaRealizada || ''
            };

            // Função para verificar mudanças
            function verificarMudancas() {
                const valoresAtuais = {
                    nome: document.getElementById('editNome').value,
                    descricao: document.getElementById('editDescricao').value,
                    status: document.getElementById('editStatus').value,
                    data: document.getElementById('editData').value,
                    tempo: document.getElementById('editTempo').value,
                    opiniao: document.getElementById('editOpiniao').value
                };

                const houveMudanca = Object.keys(valoresOriginais).some(key =>
                    valoresOriginais[key] !== valoresAtuais[key]
                );

                document.getElementById('salvarBtn').disabled = !houveMudanca;
            }

            // Adiciona eventos de mudança nos campos
            ['editNome', 'editDescricao', 'editStatus', 'editData', 'editTempo', 'editOpiniao'].forEach(id => {
                document.getElementById(id).addEventListener('input', verificarMudancas);
                document.getElementById(id).addEventListener('change', verificarMudancas);
            });

            // Adiciona evento de submit
            document.getElementById('editForm').addEventListener('submit', async (e) => {
                e.preventDefault();

                const tarefaAtualizada = {
                    id: tarefaId,
                    nomeTarefa: document.getElementById('editNome').value,
                    descricaoTarefa: document.getElementById('editDescricao').value,
                    statusTarefa: document.getElementById('editStatus').value,
                    dataTarefa: document.getElementById('editData').value,
                    tempoParaFazerTarefa: document.getElementById('editTempo').value,
                    opniaoTarefaRealizada: document.getElementById('editOpiniao').value
                };

                const updateResponse = await fetch(`/api/tarefas/${tarefaId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(tarefaAtualizada)
                });

                const log = document.getElementById('log');
                if (updateResponse.ok) {
                    log.innerHTML += `<div style="color: blue;">✏️ Tarefa "${tarefaAtualizada.nomeTarefa}" editada com sucesso!</div>`;
                    modal.remove();
                    window.carregarTarefas(); // Atualização dinâmica
                } else {
                    log.innerHTML += `<div style="color: red;">✗ Erro ao editar tarefa!</div>`;
                }
            });
        }
    } catch (error) {
        const log = document.getElementById('log');
        log.innerHTML += `<div style="color: red;">✗ Erro ao carregar tarefa para edição: ${error.message}</div>`;
    }
}

// Função para excluir tarefa
async function excluirTarefa(tarefaId) {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
        return;
    }

    try {
        const response = await fetch(`/api/tarefas/${tarefaId}`, {
            method: 'DELETE'
        });

        const log = document.getElementById('log');
        if (response.ok) {
            log.innerHTML += `<div style="color: orange;">🗑️ Tarefa excluída com sucesso!</div>`;
            window.carregarTarefas(); // Atualização dinâmica
        } else {
            log.innerHTML += `<div style="color: red;">✗ Erro ao excluir tarefa!</div>`;
        }
    } catch (error) {
        const log = document.getElementById('log');
        log.innerHTML += `<div style="color: red;">✗ Erro de conexão ao excluir: ${error.message}</div>`;
    }
}
