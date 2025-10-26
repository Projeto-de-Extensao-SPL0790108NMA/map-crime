
# 🛰️ CrimeMap

### Plataforma de Denúncias Anônimas e Mapeamento de Criminalidade

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
- Vite + React Router  
- Zustand (gerenciamento de estado)  
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
🔄 CRUD de denúncias  
🔄 Integração com mapa interativo (Leaflet / Mapbox)  
🔲 Filtro por tipo de crime e localização  

### 📡 **Fase 3: Recursos Avançados**
🔲 Sistema de estatísticas e relatórios  
🔲 Notificações
🔲 Painel administrativo (Django Admin customizado)  
🔲 Upload seguro de mídia  

### 🚀 **Fase 4: Otimização e Implantação**
🔲 Testes automatizados completos  
🔲 Acessibilidade (WCAG)  
🔲 Monitoramento e observabilidade  
🔲 Implantação em produção  

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

# 🇺🇸 English Version

## 📋 About the Project

**CrimeMap** is an academic extension project from **Uninorte University**, developed by **Team Charlie**.  
It aims to build a **digital platform for anonymous crime reporting and mapping**, empowering citizens to contribute to **public safety and transparency** through technology.

Users can anonymously report incidents, which are processed and displayed on an **interactive map**, providing **geographical insights into local crime patterns**.

---

## 🎯 Objectives

- 📍 Map criminal incidents securely and anonymously  
- 🧩 Enable geospatial analysis of crime data  
- 👥 Encourage civic participation in public safety  
- 📊 Provide open data for research and prevention  
- 🔒 Ensure reporter confidentiality  

---

## 🚀 Technologies

### 🖥️ Frontend
- React 18 + TypeScript  
- Vite + React Router  
- Zustand (state management)  
- Axios (API requests)  
- TailwindCSS + ShadCN/UI  
- ESLint + Prettier  
- Jest + React Testing Library  

### ⚙️ Backend
- Django Framework  
- Django REST Framework (API)  
- PostgreSQL  
- Django ORM + Serializers  
- JWT Authentication  
- Swagger API Docs  
- pytest (tests)

### ☁️ Infrastructure
- Docker + Docker Compose  
- GitHub Actions (planned CI/CD)  
- Deployment (planned: Render / Railway / Vercel)

---

## 🗓️ Development Roadmap

### Phase 1 – Foundation ✅  
- Tech stack definition  
- Base environment setup  
- Database modeling  

### Phase 2 – Core Features 🔄  
- JWT Authentication  
- CRUD for reports  
- Interactive map integration  
- Filtering by category/location  

### Phase 3 – Advanced Features ⏳  
- Reports and analytics  
- notifications  
- Admin dashboard  
- Secure media uploads  

### Phase 4 – Optimization 🚀  
- Full testing coverage  
- Accessibility improvements  
- Deployment and monitoring  

---

## 📄 License

Licensed under the **MIT License** — see the LICENSE file for details.

---

## 👥 Team

Developed by **Team Charlie**  
📍 Uninorte University  
🎓 Courses: Software Factory | Extension Project | Advanced Topics in Computer Science
