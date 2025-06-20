var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Servir arquivos estáticos da pasta wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/", () => "Hello World!");

app.Run();
