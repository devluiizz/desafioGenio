let atividadeAtual = 0;
let pontuacaoTotal = 0;
let dificuldade = 1;
let pontuacaoMeta = 500;

const atividades = [
  {
    tipo: "questionario",
    titulo: "Quiz de Geografia",
    conteudo: [
      {
        pergunta: "Qual é a capital do Brasil?",
        opcoes: ["Rio de Janeiro", "Recife", "Brasília", "Belo Horizonte"],
        respostaCorreta: 2,
      },
    ],
  },
  {
    tipo: "questionario",
    titulo: "Quiz de História",
    conteudo: [
      {
        pergunta: "Em que ano o Brasil foi descoberto?",
        opcoes: ["1499", "1500", "1501", "1502"],
        respostaCorreta: 1,
      },
    ],
  },
];

function mostrarRetorno(mensagem, sucesso) {
  const elementoRetorno = document.getElementById("retorno");
  elementoRetorno.textContent = mensagem;
  elementoRetorno.className = `retorno ${sucesso ? "sucesso" : "erro"}`;
  setTimeout(() => {
    elementoRetorno.className = "retorno";
  }, 2000);
}

function carregarAtividade() {
  const atividade = atividades[atividadeAtual];
  const elementoTitulo = document.getElementById("tituloAtividade");
  const elementoConteudo = document.getElementById("conteudoAtividade");

  elementoTitulo.textContent = atividade.titulo;
  elementoConteudo.innerHTML = "";

  switch (atividade.tipo) {
    case "questionario":
      carregarQuestionario(atividade.conteudo[0]);
      break;
  }
}

function carregarQuestionario(pergunta) {
  const elementoConteudo = document.getElementById("conteudoAtividade");
  elementoConteudo.innerHTML = `
            <p>${pergunta.pergunta}</p>
            <div class="opcoes">
            ${pergunta.opcoes
              .map(
                (opcao, indice) => `
                <button class="botao" onclick="verificarResposta(${indice})">${opcao}</button>
                `
              )
              .join("")}
              </div>
              `;
}

function atualizarPontuacao(pontos) {
  pontuacaoTotal += pontos;
  document.getElementById("pontuacaoTotal").textContent = pontuacaoTotal;
  document.getElementById("pontuacaoAtual").textContent = pontuacaoTotal;

  if (
    pontuacaoTotal >= pontuacaoMeta &&
    !document.getElementById("trofeu").classList.contains("mostrar")
  ) {
    document.getElementById("trofeu").classList.add("mostrar");
    mostrarRetorno("🎉 Parabéns! Você atingiu sua meta! 🎉", true);
  }
}

function verificarResposta(resposta) {
  const pergunta = atividades[atividadeAtual].conteudo[0];
  if (resposta === pergunta.respostaCorreta) {
    atualizarPontuacao(120);
    mostrarRetorno("+120 pontos", true);
    setTimeout(proximaAtividade, 1000);
  } else {
    mostrarRetorno("Tente novamente", false);
  }
}

function proximaAtividade() {
  atividadeAtual = (atividadeAtual + 1) % atividades.length;
  carregarAtividade();
}

function definirMeta() {
  const meta = parseInt(document.getElementById("entradaMeta").value);
  if (meta >= 100) {
    pontuacaoMeta = meta;
    document.getElementById("pontuacaoMeta").textContent = meta;
    document.getElementById("configMeta").style.display = "none";
    carregarAtividade();
  }
}

carregarAtividade();
