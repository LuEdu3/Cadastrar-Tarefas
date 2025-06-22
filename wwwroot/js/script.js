document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('tarefaForm');
    const logDiv = document.getElementById('log');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const tarefa = {
            nomeTarefa: form.nomeTarefa.value,
            descricaoTarefa: form.descricaoTarefa.value,
            statusTarefa: form.statusTarefa.value,
            dataTarefa: form.dataTarefa.value,
            tempoParaFazerTarefa: form.tempoParaFazerTarefa.value,
            opniaoTarefaRealizada: form.opniaoTarefaRealizada.value
        };

        try {
            const response = await fetch('/api/tarefas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tarefa)
            });
            if (response.ok) {
                const data = await response.json();
                logDiv.textContent = `Tarefa cadastrada com sucesso! ID: ${data.id}\n` + logDiv.textContent;
                form.reset();
            } else {
                const error = await response.text();
                logDiv.textContent = `Erro ao cadastrar tarefa: ${error}\n` + logDiv.textContent;
            }
        } catch (err) {
            logDiv.textContent = `Erro de conexão: ${err}\n` + logDiv.textContent;
        }
    });
});
