using System;

namespace Cadastrar_Tarefas.Models
{
    public class Tarefa
    {
        public int Id { get; set; }
        public string NomeTarefa { get; set; } = string.Empty;
        public string? DescricaoTarefa { get; set; }
        public string? StatusTarefa { get; set; }
        public DateTime DataTarefa { get; set; }
        public string? TempoParaFazerTarefa { get; set; }
        public string? OpniaoTarefaRealizada { get; set; }
    }
}
