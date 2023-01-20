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

function sucesso() {
  setInterval(afirmarPresenca, 5000);
  buscarMensagem();
  setInterval(buscarMensagem, 3000);
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

function buscarMensagem() {
  const promessa = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );

  promessa.then(sucessoBM);
  promessa.catch(falhouBM);
}

let mensagemModeloStatus = undefined;
let mensagemModeloMessage = undefined;
let mensagemModeloPrivMessage = undefined;

function sucessoBM(mensagem) {
  console.log(mensagem.data);

  chat.innerHTML = "";
  for (let i = 0; i < mensagem.data.length; i++) {
    mensagemModeloStatus = `
    <div class="mensagem-status">
    <span class="hora">(${mensagem.data[i].time})</span>  <span class="nome">${mensagem.data[i].from}</span>  ${mensagem.data[i].text}
    </div>`;

    mensagemModeloMessage = `
    <div class="mensagem-normal">
    <span class="hora">(${mensagem.data[i].time})</span> <span class="nome">${mensagem.data[i].from}</span> para <span class="nome">${mensagem.data[i].to}</span>:  ${mensagem.data[i].text}
    </div>`;

    mensagemModeloPrivMessage = `
    <div class="mensagem-reservada">
    <span class="hora">(${mensagem.data[i].time})</span>  <span class="nome">${mensagem.data[i].from}</span> reservadamente para <span class="nome">${mensagem.data[i].to}</span>:  ${mensagem.data[i].text}
    </div>`;

    if (mensagem.data[i].type === "status") {
      chat.innerHTML += mensagemModeloStatus;
    } else if (mensagem.data[i].type === "message") {
      chat.innerHTML += mensagemModeloMessage;
    } else if (mensagem.data[i].type === "private_message") {
      chat.innerHTML += mensagemModeloPrivMessage;
    }
  }
}
console.log(mensagemModeloStatus);
function falhouBM(a) {
  console.log("buscar mensagens falhou - " + a.data);
}