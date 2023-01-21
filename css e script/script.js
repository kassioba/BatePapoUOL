let nome = [{ name: prompt("Qual seu nome?") }];

const chat = document.querySelector(".chat");



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
  pegarUsuarios();
  setInterval(pegarUsuarios, 10000);
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
  chat.innerHTML = "";
  for (let i = 0; i < mensagem.data.length; i++) {
    mensagemModeloStatus = `
    <div class="mensagem-status" data-test="message">
    <span class="hora">(${mensagem.data[i].time})</span>  <span class="nome">${mensagem.data[i].from}</span>  ${mensagem.data[i].text}
    </div>`;

    mensagemModeloMessage = `
    <div class="mensagem-normal" data-test="message">
    <span class="hora">(${mensagem.data[i].time})</span> <span class="nome">${mensagem.data[i].from}</span> para <span class="nome">${mensagem.data[i].to}</span>:  ${mensagem.data[i].text}
    </div>`;

    mensagemModeloPrivMessage = `
    <div class="mensagem-reservada" data-test="message">
    <span class="hora">(${mensagem.data[i].time})</span>  <span class="nome">${mensagem.data[i].from}</span> reservadamente para <span class="nome">${mensagem.data[i].to}</span>:  ${mensagem.data[i].text}
    </div>`;

    if (mensagem.data[i].type === "status") {
      chat.innerHTML += mensagemModeloStatus;
    } else if (mensagem.data[i].type === "message") {
      chat.innerHTML += mensagemModeloMessage;
    } else if (
      mensagem.data[i].type === "private_message" &&
      mensagem.data[i].to === nome[0].name
    ) {
      chat.innerHTML += mensagemModeloPrivMessage;
    }
  }
  document.querySelector(".chat").lastChild.scrollIntoView(true);
}

function falhouBM(a) {
  alert("buscar mensagens falhou - " + a.data);
}

let destinatario = "";
let tipoMensagem = "message";

function enviarMensagem() {
  const textoEscrito = document.querySelector("input");

  if (destinatario === "") {
    destinatario = "Todos";
  }

  const mensagem = {
    from: `${nome[0].name}`,
    to: `${destinatario}`,
    text: `${textoEscrito.value}`,
    type: `${tipoMensagem}`,
  };

  const promessa = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    mensagem
  );

  promessa.then(mensagemEnviada);
  promessa.catch(mensagemNaoEnviada);
}
function mensagemEnviada() {
  document.querySelector("input").value = "";
  buscarMensagem();
}
function mensagemNaoEnviada() {
  window.location.reload();
}

function pegarUsuarios() {
  const promessa = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/participants"
  );

  promessa.then(pegarUsuariosSucesso);
}
function pegarUsuariosSucesso(usuarios) {
  const usuariosAtivos = document.querySelector(".usuarios");

  usuariosAtivos.innerHTML = "";

  for (let i = 0; i < usuarios.data.length; i++) {
    usuariosAtivos.innerHTML += `
    <div class="usuario" onclick='adicionarCheck(this)'>
        <ion-icon name="person-circle"></ion-icon>
        <div class="texto-menu">${usuarios.data[i].name}</div>
        <img src="./ícones/check.png" alt="" class="check">
    </div>`;
  }
}

function desativarMenu() {
  document.querySelector(".container-bonus").classList.add("desativado");
}

function ativarMenu() {
  document.querySelector(".container-bonus").classList.remove("desativado");
}

function adicionarCheck(elemento) {
  console.log(elemento);
  const ativado = document.querySelector(".ativado");
  if (ativado !== null) {
    ativado.classList.remove("ativado");
    elemento.querySelector(".check").classList.add("ativado");
  } else {
    elemento.querySelector(".check").classList.add("ativado");
  }
}