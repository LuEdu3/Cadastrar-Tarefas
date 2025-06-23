using Microsoft.EntityFrameworkCore;
using Cadastrar_Tarefas.Models;

namespace Cadastrar_Tarefas.Data
{
    public class TarefasContext : DbContext
    {
        public TarefasContext(DbContextOptions<TarefasContext> options) : base(options) { }

        public DbSet<Tarefa> Tarefas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Tarefa>().ToTable("table1");
            modelBuilder.Entity<Tarefa>().Property(t => t.StatusTarefa).HasColumnType("enum('Concluido','Em Andamento')");
            modelBuilder.Entity<Tarefa>().Property(t => t.OpniaoTarefaRealizada).HasColumnName("opniãoTarefaRealizada");
        }
    }
}
