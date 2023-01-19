let nome = [{ name: prompt("Qual seu nome?") }];

const chat = document.querySelector(".chat");

console.log(nome[0].name);

entrarSala();

function entrarSala() {
  const requisicaoNome = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    nome[0]
  );

  requisicaoNome.then(sucesso);
  requisicaoNome.catch(falhou);
}

function sucesso(dados) {
  chat.innerHTML += `<div class="mensagem-status"><span class="hora">(09:22:28)</span>  <span class="nome">${nome[0].name}</span>  entra na sala...</div>`;

  setInterval(afirmarPresenca, 5000);
}

function falhou(erro) {
  const statusCode = erro.response.status;
  if (statusCode === 400) {
    nomeIndisponivel();
  }
}

function nomeIndisponivel() {
  nome = [
    { name: prompt("Esse nome já está em uso! Por favor, escolha outro.") },
  ];
  const requisicaoNome = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    nome[0]
  );

  requisicaoNome.then(sucesso);
  requisicaoNome.catch(falhou);
}

function afirmarPresenca() {
  axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nome[0]);
}
