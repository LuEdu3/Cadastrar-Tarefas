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
        
        listaTarefas.innerHTML = tarefas.map(tarefa => `
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
                ${tarefa.opniaoTarefaRealizada ? `<div class="tarefa-opiniao" style="margin-top: 8px; font-style: italic; color: #666;">Opinião: ${tarefa.opniaoTarefaRealizada}</div>` : ''}
            </div>
        `).join('');
    }

    // Carrega as tarefas quando a página é carregada
    document.addEventListener('DOMContentLoaded', carregarTarefas);
});
