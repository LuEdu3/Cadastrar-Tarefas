var builder = WebApplication.CreateBuilder(args);

// Adiciona o contexto do banco de dados MySQL
builder.Services.AddDbContext<Cadastrar_Tarefas.Data.TarefasContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    )
);

var app = builder.Build();

// Servir arquivos estáticos da pasta wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/", () => "Hello World!");

app.Run();
