# Cadastrar-Tarefas

![Badge](https://img.shields.io/badge/status-em%20desenvolvimento-blue)

Sistema web para cadastro, acompanhamento e conclusão de tarefas.

## Índice
- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## Sobre o Projeto
O **Cadastrar-Tarefas** é uma aplicação web para gerenciar tarefas, permitindo cadastrar, listar, marcar como concluídas e visualizar detalhes de cada tarefa. O sistema possui interface moderna, modo noturno e integração com banco de dados MySQL.

## Funcionalidades
- Cadastro de tarefas com nome, descrição, status, data, tempo e opinião
- Listagem de tarefas cadastradas
- Edição e exclusão de tarefas
- Marcação de tarefas como concluídas
- Modo noturno
- Menu lateral de configurações
- Sistema de logs para todas as ações
- Interface responsiva para dispositivos móveis
- Alternância entre cadastro e lista de tarefas no mobile via switch no menu lateral
- Layout moderno, com formulário e tabela ocupando quase toda a tela no mobile

## Tecnologias Utilizadas
- .NET 8 (backend)
- ASP.NET Core Web API
- Entity Framework Core + Pomelo MySQL
- MySQL
- HTML5, CSS3 (customizado e responsivo), JavaScript

## Como Rodar Localmente
1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/Cadastrar-Tarefas.git
   ```
2. **Configure o banco de dados:**
   - Crie um banco MySQL e ajuste a string de conexão em `appsettings.json`.
   - Execute o script SQL em `Script/tarefaTabela.sql` para criar a tabela.
3. **Restaure os pacotes e rode o projeto:**
   ```bash
   dotnet restore
   dotnet build
   dotnet run
   ```
4. **Acesse:**
   - Frontend: [http://localhost:5000](http://localhost:5000) (ou porta configurada)
   - API: [http://localhost:5000/api/tarefas](http://localhost:5000/api/tarefas)

## Estrutura do Projeto
```
Cadastrar-Tarefas/
├── Controllers/           # Controllers da API
├── Data/                  # Contexto do banco de dados
├── Models/                # Modelos de dados
├── wwwroot/
│   ├── css/               # Estilos
│   ├── js/                # Scripts
│   └── index.html         # Página principal
├── Script/                # Scripts SQL e diagramas
├── appsettings.json       # Configurações
├── Program.cs             # Inicialização da aplicação
└── ...
```

## Contribuição
1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m 'feat: minha nova feature'`
4. Push para a branch: `git push origin minha-feature`
5. Abra um Pull Request

## Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.