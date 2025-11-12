
# 🛰️ CrimeMap

### Plataforma de Denúncias Anônimas e Mapeamento de Criminalidade

---

<p align="center">
  <a href="BackEnd/api_django/README.md"><code>Back-end</code></a> •
  <a href="BackEnd/api_django/docs/README.md"><code>Documentação da API</code></a> •
  <a href="web/README.md"><code>Front-end</code></a>
</p>

---

🌐 **Idioma | Language**

| Linguagem | Link |
|------------|------|
| 🇧🇷 Português | Você está aqui |
| 🇺🇸 English | [Click here](#english-version) |

---

## 📋 Sobre o Projeto

O **CrimeMap** é um projeto de extensão acadêmica da **Faculdade Uninorte**, desenvolvido pela **Equipe Charlie**.  
Seu propósito é criar uma **plataforma digital de denúncias anônimas e mapeamento de criminalidade**, permitindo que cidadãos contribuam para a **segurança pública e a transparência social** por meio da tecnologia.

O sistema possibilita que usuários registrem ocorrências de forma anônima, que são processadas e exibidas em um **mapa interativo**, oferecendo **insights geográficos sobre a criminalidade local**.

---

## 🎯 Objetivos

- 📍 Mapear incidentes criminais de forma anônima e segura  
- 🧩 Facilitar a análise geoespacial de dados sobre criminalidade  
- 👥 Promover a participação cidadã na segurança pública  
- 📊 Fornecer dados abertos e estatísticas para estudos e prevenção  
- 🔒 Garantir a confidencialidade dos denunciantes  

---

## 🚀 Tecnologias

### 🖥️ **Frontend**
- React 18 + TypeScript  
- Vite + TanStack Router
- Axios (consumo da API)  
- TailwindCSS + ShadCN/UI  
- ESLint + Prettier  
- Jest + React Testing Library  

### ⚙️ **Backend**
- Django Framework  
- Django REST Framework (API RESTful)  
- PostgreSQL  
- Django ORM + Serializers  
- Autenticação JWT  
- Swagger (documentação da API)  
- pytest (testes automatizados)

### ☁️ **Infraestrutura**
- Docker + Docker Compose  
- CI/CD (planejado via GitHub Actions)  
- Implantação (planejada: Render / Railway / Vercel)  

---

## 🗓️ Roteiro de Desenvolvimento

### 📅 **Fase 1: Fundação (Concluída)**
✅ Definição da stack tecnológica  
✅ Estrutura inicial do repositório  
✅ Configuração de ambiente com Docker  
✅ Criação do banco de dados e modelos iniciais  

### ⚙️ **Fase 2: Funcionalidades Principais (Em Andamento)**
✅ Autenticação JWT  
✅ CRUD de denúncias  
✅ Integração com mapa interativo (Leaflet / Mapbox)  
✅ Filtro por tipo de crime e localização  

### 📡 **Fase 3: Recursos Avançados**
✅ Sistema de estatísticas e relatórios  
🔲 Notificações<br>
✅ Painel administrativo (Django Admin customizado)  
✅ Upload seguro de mídia  

### 🚀 **Fase 4: Otimização e Implantação**
✅ Testes automatizados completos  
🔲 Acessibilidade (WCAG)  
🔲 Monitoramento e observabilidade  
🔄 Implantação em produção  

---

## 🔧 Configuração de Desenvolvimento

### 📋 **Pré-requisitos**
- Node.js 18+  
- Python 3.11+  
- Docker + Docker Compose  
- pnpm (ou npm/yarn)  

### ⚙️ **Instalação**

```bash
# Clonar o repositório
git clone [url-do-repositorio]
cd crimemap

# Subir containers
docker-compose up -d

# Instalar dependências do frontend
cd frontend
pnpm install
pnpm dev
```

A aplicação estará disponível em:  
🖥️ `http://localhost:5173` (Frontend)  
⚙️ `http://localhost:8000` (Backend)

---

## 📋 Padrões e Boas Práticas

- **Idioma do projeto:** Inglês (en-US)  
- **Commits Convencionais:**  
  ```
  feat: add report submission module
  fix: resolve map marker duplication
  docs: update API documentation
  style: apply prettier formatting
  refactor: optimize state management
  test: add coverage for ReportForm
  ```
- **Git Hooks (Husky):**
  - pre-commit: lint + format  
  - pre-push: testes  
  - commit-msg: validação de padrão semântico  

---

## 🤝 Contribuição

1. Faça um fork do projeto  
2. Crie uma branch para sua feature  
   ```bash
   git checkout -b feature/nova-feature
   ```
3. Faça commits seguindo o padrão  
4. Envie um Pull Request  

---

## 📄 Licença

Licenciado sob a **MIT License** — consulte o arquivo `LICENSE`.

---

## 👥 Equipe

Desenvolvido pela **Equipe Charlie**  
📍 Faculdade Uninorte  
🎓 Disciplinas: Fábrica de Software | Projeto de Extensão | Tópicos Avançados em Ciência da Computação

---

<a id="english-version"></a>

# 🇺🇸 English Version

## 📋 About the Project

**CrimeMap** is an academic extension project from **Uninorte University**, developed by **Team Charlie**.  
Its purpose is to build a **digital platform for anonymous crime reporting and crime mapping**, enabling citizens to contribute to **public safety and transparency** through technology.

Users can anonymously register incidents that are processed and displayed on an **interactive map**, offering **geospatial insights about local criminal activity**.

---

## 🎯 Objectives

- 📍 Map criminal incidents anonymously and securely  
- 🧩 Facilitate geospatial analysis of crime data  
- 👥 Promote civic participation in public safety  
- 📊 Provide open data and statistics for research and prevention  
- 🔒 Guarantee reporter confidentiality  

---

## 🚀 Technologies

### 🖥️ **Frontend**
- React 18 + TypeScript  
- Vite + React Router  
- Zustand (state management)  
- Axios (API consumption)  
- TailwindCSS + ShadCN/UI  
- ESLint + Prettier  
- Jest + React Testing Library  

### ⚙️ **Backend**
- Django Framework  
- Django REST Framework (REST API)  
- PostgreSQL  
- Django ORM + Serializers  
- JWT Authentication  
- Swagger (API docs)  
- pytest (automated tests)

### ☁️ **Infrastructure**
- Docker + Docker Compose  
- CI/CD (planned via GitHub Actions)  
- Deployment (planned: Render / Railway / Vercel)  

---

## 🗓️ Development Roadmap

### 📅 **Phase 1: Foundation (Completed)**
✅ Tech stack definition  
✅ Initial repository structure  
✅ Environment setup with Docker  
✅ Database creation and initial models  

### ⚙️ **Phase 2: Core Features (In Progress)**
✅ JWT Authentication  
✅ Reports CRUD  
✅ Interactive map integration (Leaflet / Mapbox)  
✅ Filtering by crime type and location  

### 📡 **Phase 3: Advanced Features**
✅ Statistics and reporting system  
🔲 Notifications  
✅ Administrative panel (custom Django Admin)  
✅ Secure media uploads  

### 🚀 **Phase 4: Optimization & Deployment**
✅ Full automated test coverage  
🔲 Accessibility (WCAG) improvements  
🔲 Monitoring and observability  
🔄 Production deployment  

---

## 🔧 Development Setup

### 📋 **Prerequisites**
- Node.js 18+  
- Python 3.11+  
- Docker + Docker Compose  
- pnpm (or npm/yarn)  

### ⚙️ **Installation**

```bash
# Clone the repository
git clone [repository-url]
cd crimemap

# Start containers
docker-compose up -d

# Install frontend dependencies
cd frontend
pnpm install
pnpm dev
```

Application URLs:  
🖥️ `http://localhost:5173` (Frontend)  
⚙️ `http://localhost:8000` (Backend)

---

## 📋 Standards & Best Practices

- **Project language:** English (en-US).  
- **Conventional Commits:**  
  ```
  feat: add report submission module
  fix: resolve map marker duplication
  docs: update API documentation
  style: apply prettier formatting
  refactor: optimize state management
  test: add coverage for ReportForm
  ```
- **Git Hooks (Husky):**
  - pre-commit: lint + format  
  - pre-push: tests  
  - commit-msg: semantic pattern validation  

---

## 🤝 Contribution

1. Fork this repository.  
2. Create a feature branch:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit your changes following the conventional commit pattern.  
4. Open a Pull Request.  

---

## 📄 License

Licensed under the **MIT License** — see the `LICENSE` file for details.

---

## 👥 Team

Developed by **Team Charlie**  
📍 Uninorte University  
🎓 Courses: Software Factory | Extension Project | Advanced Topics in Computer Science
