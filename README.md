# 🗂️ Kanban Personalizado para Gestão de Projetos

Este é um aplicativo web estilo Kanban desenvolvido por mim, com foco na colaboração entre desenvolvedores da minha equipe. O sistema foi criado porque nenhuma ferramenta disponível oferecia exatamente o que precisávamos, então decidi construir uma solução sob medida.

---

## 🎯 Objetivo

Criar uma plataforma de gerenciamento de projetos que atendesse às necessidades específicas da equipe de desenvolvimento, com autenticação segura, organização por tarefas e atualizações em tempo real para facilitar o trabalho em conjunto.

---

## 🚀 Tecnologias Utilizadas

- **ReactJS** (interface do usuário)
- **Vite.js** (build tool ultrarrápida)
- **Firebase Authentication** (login seguro)
- **Firebase Realtime Database** (banco de dados em tempo real)
- **JavaScript**, **HTML5**, **CSS3**

---

## 🧩 Funcionalidades

- Autenticação de usuários com Firebase
- Criação e gerenciamento de quadros Kanban
- Atribuição de tarefas por coluna (A Fazer, Em Progresso, Teste, Bugs, Concluído)
- Sincronização em tempo real entre membros da equipe
- Interface amigável e responsiva

---

## 🛠️ Instalação

1. **Clone o repositório:**

```bash
git clone https://github.com/Hitjunior001/my-kanban.git
cd /my-kanban
npm install
```
Configure o Firebase:

Crie um projeto em https://console.firebase.google.com
Ative a autenticação e realtime Database

Crie um arquivo .env na raiz com as credenciais:

.env
```
VITE_API_KEY=sua_api_key
VITE_AUTH_DOMAIN=seu_auth_domain
VITE_DATABASE_URL=sua_database_url
VITE_PROJECT_ID=seu_project_id
VITE_STORAGE_BUCKET=seu_storage_bucket
VITE_MESSAGING_SENDER_ID=seu_sender_id
VITE_APP_ID=seu_app_id
Inicie o servidor de desenvolvimento:
```


🤝 Contribuição
Este projeto foi desenvolvido com foco nas necessidades da minha equipe, mas sugestões de melhoria são bem-vindas!
Sinta-se livre para forkar, enviar pull requests ou abrir issues.


📌 Link do Projeto
GitHub: https://github.com/Hitjunior001/my-kanban/
Demonstração: https://hitjunior001.github.io/my-kanban/#/login
