// --- Sistema de Rotas Well Tec ---
const routes = {
  home: renderHome,
  cadastro: renderCadastro,
  lista: renderLista
};

// --- Template Engine Simples ---
function renderTemplate(html) {
  const app = document.getElementById('app');
  app.innerHTML = html;
}

// --- Função de Navegação Well Tec ---
function navigate(page) {
  window.location.hash = page;
}

// --- Manipulação do Hash para Rotas ---
window.addEventListener('hashchange', () => {
  const page = location.hash.replace('#', '') || 'home';
  routes[page]();
});

// --- Página Inicial ---
function renderHome() {
  renderTemplate(`
    <h1 class="text-2xl font-bold mb-4 text-center">Bem-vindo à Well Tec</h1>
    <div class="flex flex-col gap-3">
      <button onclick="navigate('cadastro')" class="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Cadastrar Usuário</button>
      <button onclick="navigate('lista')" class="bg-gray-500 text-white py-2 rounded hover:bg-gray-600">Ver Usuários</button>
    </div>
  `);
}

// --- Página de Cadastro ---
function renderCadastro() {
  renderTemplate(`
    <h1 class="text-2xl font-bold mb-4 text-center">Cadastro de Usuário</h1>
    <form id="formCadastro" class="flex flex-col gap-3">
      <input id="nome" class="border p-2 rounded" placeholder="Nome completo" required>
      <input id="email" class="border p-2 rounded" placeholder="E-mail" type="email" required>
      <input id="senha" class="border p-2 rounded" placeholder="Senha" type="password" minlength="6" required>
      <button type="submit" class="bg-green-500 text-white py-2 rounded hover:bg-green-600">Salvar</button>
      <button type="button" onclick="navigate('home')" class="bg-gray-300 py-2 rounded">Voltar</button>
    </form>
    <p id="msg" class="text-red-500 mt-2 text-center"></p>
  `);

  document.getElementById('formCadastro').addEventListener('submit', handleFormSubmit);
}

// --- Validação e Armazenamento ---
function handleFormSubmit(event) {
  event.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const msg = document.getElementById('msg');

  // Verificação de consistência de dados
  if (nome.length < 3) {
    msg.textContent = "❌ O nome deve ter pelo menos 3 caracteres.";
    return;
  }
  if (!email.includes('@') || !email.includes('.')) {
    msg.textContent = "❌ Informe um e-mail válido.";
    return;
  }
  if (senha.length < 6) {
    msg.textContent = "❌ A senha deve ter pelo menos 6 caracteres.";
    return;
  }

  // Se tudo certo, salva no LocalStorage
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  usuarios.push({ nome, email });
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  msg.classList.remove('text-red-500');
  msg.classList.add('text-green-600');
  msg.textContent = "Usuário cadastrado com sucesso!";

  setTimeout(() => navigate('lista'), 1000);
}

// --- Página de Lista de Usuários ---
function renderLista() {
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const listaHTML = usuarios.map(u => `
    <li class="border p-2 rounded">${u.nome} <br><span class="text-gray-500 text-sm">${u.email}</span></li>
  `).join('');

  renderTemplate(`
    <h1 class="text-2xl font-bold mb-4 text-center">Lista de Usuários</h1>
    <ul class="flex flex-col gap-2">${listaHTML || '<p class="text-center text-gray-500">Nenhum usuário cadastrado.</p>'}</ul>
    <button onclick="navigate('home')" class="bg-gray-400 text-white mt-4 py-2 rounded w-full hover:bg-gray-500">Voltar</button>
  `);
}

// --- Inicializa a Aplicação ---
window.addEventListener('load', () => {
  const page = location.hash.replace('#', '') || 'home';
  routes[page]();
});
