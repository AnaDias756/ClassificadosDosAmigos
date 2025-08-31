const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Criar pasta uploads se não existir
const createUploadsDir = async () => {
  try {
    await fs.mkdir('uploads', { recursive: true });
  } catch (error) {
    console.log('Pasta uploads já existe ou erro:', error.message);
  }
};

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas!'));
    }
  }
});

// Simulação de banco de dados (JSON file)
const DB_FILE = 'produtos.json';

// Função para ler produtos do arquivo
const lerProdutos = async () => {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return []; // Retorna array vazio se arquivo não existir
  }
};

// Função para salvar produtos no arquivo
const salvarProdutos = async (produtos) => {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(produtos, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao salvar produtos:', error);
    return false;
  }
};

// ROTAS

// GET /api/produtos - Listar todos os produtos
app.get('/api/produtos', async (req, res) => {
  try {
    const produtos = await lerProdutos();
    const produtosAtivos = produtos.filter(p => p.ativo !== false);
    
    // Ordenar por data de criação (mais recentes primeiro)
    produtosAtivos.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));
    
    res.json(produtosAtivos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// GET /api/produtos/:id - Buscar produto por ID
app.get('/api/produtos/:id', async (req, res) => {
  try {
    const produtos = await lerProdutos();
    const produto = produtos.find(p => p.id === req.params.id);
    
    if (!produto || produto.ativo === false) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

// POST /api/produtos - Criar novo produto
app.post('/api/produtos', upload.array('imagens', 5), async (req, res) => {
  try {
    const { titulo, descricao, preco, categoria, vendedor, whatsapp, condicao } = req.body;
    
    // Validações básicas
    if (!titulo || !descricao || !preco || !vendedor) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: titulo, descricao, preco, vendedor' 
      });
    }

    // URLs das imagens
    const imagens = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    const novoProduto = {
      id: uuidv4(),
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      preco: parseFloat(preco),
      categoria: categoria || 'outros',
      vendedor: vendedor.trim(),
      whatsapp: whatsapp || '',
      condicao: condicao || 'usado',
      imagens,
      criadoEm: new Date().toISOString(),
      ativo: true
    };

    const produtos = await lerProdutos();
    produtos.push(novoProduto);
    
    const sucesso = await salvarProdutos(produtos);
    
    if (sucesso) {
      res.status(201).json(novoProduto);
    } else {
      res.status(500).json({ error: 'Erro ao salvar produto' });
    }
    
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/produtos/:id/vendido - Marcar como vendido
app.put('/api/produtos/:id/vendido', async (req, res) => {
  try {
    const produtos = await lerProdutos();
    const index = produtos.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    produtos[index].ativo = false;
    produtos[index].vendidoEm = new Date().toISOString();
    
    const sucesso = await salvarProdutos(produtos);
    
    if (sucesso) {
      res.json({ message: 'Produto marcado como vendido' });
    } else {
      res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
    
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// GET /api/buscar - Buscar produtos
app.get('/api/buscar', async (req, res) => {
  try {
    const { q, categoria } = req.query;
    const produtos = await lerProdutos();
    let resultado = produtos.filter(p => p.ativo !== false);
    
    if (q) {
      const termo = q.toLowerCase();
      resultado = resultado.filter(produto => 
        produto.titulo.toLowerCase().includes(termo) ||
        produto.descricao.toLowerCase().includes(termo) ||
        produto.vendedor.toLowerCase().includes(termo)
      );
    }
    
    if (categoria && categoria !== 'todos') {
      resultado = resultado.filter(produto => produto.categoria === categoria);
    }
    
    // Ordenar por relevância/data
    resultado.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));
    
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Erro na busca' });
  }
});

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Classificados dos Amigos funcionando!',
    version: '1.0.0'
  });
});

// Middleware de erro
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Arquivo muito grande. Máximo 5MB.' });
    }
  }
  
  console.error('Erro:', error.message);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Inicializar servidor
const iniciarServidor = async () => {
  console.log('Iniciando servidor...');
  try {
    await createUploadsDir();
    console.log('Pasta uploads criada/verificada');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📂 Uploads salvos em: ${path.resolve('uploads')}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
  }
};

console.log('Chamando iniciarServidor...');
iniciarServidor().catch(console.error);