# 🛍️ Classificados dos Amigos

Uma aplicação simples e moderna para você e seus amigos venderem seus pertences, sem complicações de autenticação ou cadastros complexos.

## 🚀 Características

- **Simples e Intuitivo**: Não precisa de login, basta adicionar e vender
- **Responsivo**: Funciona perfeitamente no desktop e mobile
- **Upload de Imagens**: Até 5 fotos por produto
- **Busca e Filtros**: Encontre rapidamente o que procura
- **WhatsApp Integrado**: Contato direto com o vendedor
- **Deploy Gratuito**: Backend no Render, Frontend no Netlify

## 🛠️ Stack Tecnológica

### Frontend
- **Nuxt.js 3** - Framework Vue.js
- **Tailwind CSS** - Estilização
- **Netlify** - Hospedagem

### Backend
- **Node.js** - Runtime
- **Express** - Framework web
- **Multer** - Upload de arquivos
- **JSON Files** - Banco de dados simples
- **Render** - Hospedagem

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/classificados-dos-amigos.git
cd classificados-dos-amigos
```

### 2. Configure o Backend

```bash
# Entre na pasta do backend
mkdir classificados-backend
cd classificados-backend

# Copie os arquivos server.js e package.json criados anteriormente

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev
```

O backend estará rodando em `http://localhost:3000`

### 3. Configure o Frontend

```bash
# Em outra aba do terminal, crie a pasta do frontend
mkdir classificados-frontend
cd classificados-frontend

# Copie todos os arquivos do frontend criados anteriormente
# (package.json, nuxt.config.ts, pages/, components/, assets/)

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev
```

O frontend estará rodando em `http://localhost:3000` (Nuxt escolherá automaticamente a porta 3001 se a 3000 estiver ocupada)

## 🌐 Deploy

### Deploy do Backend (Render)

1. **Crie uma conta no Render**: https://render.com
2. **Conecte seu repositório GitHub**
3. **Crie um novo Web Service**
4. **Configure:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`

### Deploy do Frontend (Netlify)

1. **Crie uma conta no Netlify**: https://netlify.com
2. **Conecte seu repositório GitHub**
3. **Configure:**
   - Build command: `npm run generate`
   - Publish directory: `dist`
   - **Environment Variables:**
     - `NUXT_PUBLIC_API_URL`: URL do seu backend no Render

## ⚙️ Configuração de Environment Variables

### Backend (.env)
```bash
PORT=3000
NODE_ENV=production
```

### Frontend (.env)
```bash
NUXT_PUBLIC_API_URL=https://seu-backend.onrender.com
```

## 🎯 Estrutura de Pastas Recomendada

```
classificados-dos-amigos/
├── README.md
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── produtos.json (criado automaticamente)
│   └── uploads/ (criado automaticamente)
└── frontend/
    ├── package.json
    ├── nuxt.config.ts
    ├── assets/
    │   └── css/
    │       └── main.css
    ├── components/
    │   └── ProductCard.vue
    ├── pages/
    │   ├── index.vue
    │   ├── adicionar.vue
    │   └── produto/
    │       └── [id].vue
    └── public/
        └── favicon.ico
```

## 🔧 Personalização

### Adicionar novas categorias
Edite os arrays de categorias em:
- `backend/server.js` (validação)
- `frontend/pages/index.vue` (filtros)
- `frontend/pages/adicionar.vue` (formulário)

### Personalizar cores
Modifique as classes Tailwind nos componentes ou adicione cores customizadas no `nuxt.config.ts`.

### Adicionar campos
1. **Backend**: Adicione campos no modelo de produto em `server.js`
2. **Frontend**: Adicione campos no formulário `adicionar.vue` e na exibição

## 🐛 Solução de Problemas

### CORS Error
Certifique-se de que o backend está configurado corretamente para aceitar requests do frontend:

```javascript
app.use(cors({
  origin: ['https://seu-site.netlify.app', 'http://localhost:3000']
}));
```

### Imagens não carregam
Verifique se:
1. A pasta `uploads` foi criada no backend
2. A URL da API está correta no frontend
3. O backend está servindo arquivos estáticos: `app.use('/uploads', express.static('uploads'))`

### Deploy falhou
- **Render**: Verifique os logs de build e certifique-se de que o `package.json` está correto
- **Netlify**: Verifique se o comando de build está correto (`npm run generate`) e se as environment variables estão configuradas

## 📱 Funcionalidades Futuras

- [ ] Sistema de favoritos
- [ ] Notificações por email
- [ ] Chat interno
- [ ] Sistema de avaliações
- [ ] Modo dark
- [ ] PWA (Progressive Web App)
- [ ] Integração com redes sociais

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🎉 Pronto para usar!

Seu sistema de classificados está pronto! Agora é só compartilhar com seus amigos e começar a vender.

---

**Desenvolvido com ❤️ para facilitar a vida entre amigos**
