let atividadeAtual = 0;
let pontuacaoTotal = 0;
let dificuldade = 1;
let pontuacaoMeta = 500;
let estadoJogoMemoria = {
  cartasViradas: [],
  paresCombinados: 0,
  totalPares: 0,
  podeVirar: true,
};
let melhorTempoDigitacao = Infinity;
let inicioTempoDigitacao;
let botaoClicado = false;

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
  {
    tipo: "memoria",
    titulo: "Jogo da Memória",
    conteudo: ["👾", "🎠", "🍫", "🛹", "✨", "😺"],
  },
  {
    tipo: "palavrasEmbaralhadas",
    titulo: "Palavras Embaralhadas",
    conteudo: [
      {
        palavra: "BUDAPESTE",
        dica: "É uma capital europeia cortada por um famoso rio, e seu nome começa com 'B'.",
      },
    ],
  },
  {
    tipo: "jogoMatematica",
    titulo: "Desafio Matemático",
    conteudo: {
      dificuldade: 1,
      operacoes: ["+", "-", "*"],
    },
  },
  {
    tipo: "jogoDigitacao",
    titulo: "Digitação Rápida",
    conteudo: ["A filha da xuxa se chama sasha"],
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
    case "memoria":
      carregarJogoMemoria(atividade.conteudo);
      break;
    case "palavrasEmbaralhadas":
      carregarPalavrasEmbaralhadas(atividade.conteudo[0]);
      break;
    case "jogoMatematica":
      carregarJogoMatematica(atividade.conteudo);
      break;
    case "jogoDigitacao":
      carregarJogoDigitacao(atividade.conteudo[0]);
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

function carregarJogoMemoria(itens) {
  const elementoConteudo = document.getElementById("conteudoAtividade");
  const itensEmbaralhados = [...itens, ...itens].sort(
    () => Math.random() - 0.5
  );

  estadoJogoMemoria = {
    cartasViradas: [],
    paresCombinados: 0,
    totalPares: itens.length,
    podeVirar: true,
  };

  elementoConteudo.innerHTML = `
            <div class="jogo-memoria">
                ${itensEmbaralhados
                  .map(
                    (item, indice) => `
                      <div class= "carta-memoria" onclick="virarCarta(this, '${item}')" data-index="${indice}">
                          ${item}
                        </div>
                      `
                  )
                  .join("")}
                    </div>
                `;
}

function virarCarta(carta, item) {
  if (
    !estadoJogoMemoria.podeVirar ||
    carta.classList.contains("virada") ||
    carta.classList.contains("combinada")
  ) {
    return;
  }

  carta.classList.add("virada");
  estadoJogoMemoria.cartasViradas.push(carta);

  if (estadoJogoMemoria.cartasViradas.length === 2) {
    estadoJogoMemoria.podeVirar = false;
    verificarCombinacao();
  }
}

function verificarCombinacao() {
  const [carta1, carta2] = estadoJogoMemoria.cartasViradas;
  const combinacao = carta1.textContent.trim() === carta2.textContent.trim();

  if (combinacao) {
    carta1.classList.add("combinada");
    carta2.classList.add("combinada");
    estadoJogoMemoria.paresCombinados++;
    atualizarPontuacao(25);
    mostrarRetorno("+25 pontos", true);

    if (estadoJogoMemoria.paresCombinados === estadoJogoMemoria.totalPares) {
      setTimeout(proximaAtividade, 1000);
    }
  } else {
    setTimeout(() => {
      carta1.classList.remove("virada");
      carta2.classList.remove("virada");
    }, 1000);
  }

  estadoJogoMemoria.cartasViradas = [];
  setTimeout(() => {
    estadoJogoMemoria.podeVirar = true;
  }, 1000);
}

function carregarPalavrasEmbaralhadas(dadosPalavra) {
  const palavraEmbaralhada = dadosPalavra.palavra
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
  const elementoConteudo = document.getElementById("conteudoAtividade");
  elementoConteudo.innerHTML = `
            <div class="palavras-embaralhadas">
                <h3>Dica: ${dadosPalavra.dica}</h3>
                <p>Palavra embaralhada: ${palavraEmbaralhada}</p>
                <input type="text" id="tentativaPalavra" placeholder="Digite sua resposta">
                <button onclick="verificarPalavraEmbaralhada('${dadosPalavra.palavra}')">Verificar</button>
            </div>
          `;
}

function verificarPalavraEmbaralhada(palavraCorreta) {
  const tentativa = document
    .getElementById("tentativaPalavra")
    .value.toUpperCase();
  if (tentativa === palavraCorreta) {
    atualizarPontuacao(120);
    mostrarRetorno("+120 pontos", true);
    setTimeout(proximaAtividade, 1000);
  } else {
    mostrarRetorno("Tente novamente", false);
  }
}

function carregarJogoMatematica(configMatematica) {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operacao =
    configMatematica.operacoes[
      Math.floor(Math.random() * configMatematica.operacoes.length)
    ];

  const elementoConteudo = document.getElementById("conteudoAtividade");
  elementoConteudo.innerHTML = `
          <div class="jogo-matematica">
              <h3>${num1} ${operacao} ${num2} = ?</h3>
              <input type="number" id="respostaMatematica">
              <button onclick="verificarRespostaMatematica(${num1}, ${num2}, '${operacao}')">Verificar</button>
          </div>
        `;
}

function verificarRespostaMatematica(num1, num2, operacao) {
  const respostaUsuario = parseInt(
    document.getElementById("respostaMatematica").value
  );
  let respostaCorreta;

  switch (operacao) {
    case "+":
      respostaCorreta = num1 + num2;
      break;
    case "-":
      respostaCorreta = num1 - num2;
      break;
    case "*":
      respostaCorreta = num1 * num2;
      break;
  }

  if (respostaUsuario === respostaCorreta) {
    atualizarPontuacao(100);
    mostrarRetorno("+100 pontos", true);
    setTimeout(proximaAtividade, 1000);
  } else {
    mostrarRetorno("Tente Novamente", false);
  }
}

function carregarJogoDigitacao(texto) {
  const elementoConteudo = document.getElementById("conteudoAtividade");
  elementoConteudo.innerHTML = `
            <div class="jogo-digitacao">
                <p>Digite o texto abaixo:</p>
                <p>${texto}</p>
                <div class="jogo-digitacao-flex">
                <textarea id="entradaDigitacao" rows="3" oninput="iniciarTempoDigitacao()"></textarea>
                <button onclick="verificarDigitacao('${texto}')">Verificar</button>
                </div>
            </div>
        `;
}

function verificarDigitacao(textoCorreto) {
  const textoUsuario = document.getElementById("entradaDigitacao").value.trim();
  if (textoUsuario === textoCorreto) {
    const tempoFinal = new Date();
    const tempoGasto = (tempoFinal - inicioTempoDigitacao) / 1000;

    document.getElementById("tempoDigitacaoAtual").textContent =
      formatarTempo(tempoGasto);

    if (tempoGasto < melhorTempoDigitacao) {
      melhorTempoDigitacao = tempoGasto;
      document.getElementById("melhorTempoDigitacao").textContent =
        formatarTempo(tempoGasto);
    }

    atualizarPontuacao(100);
    mostrarRetorno(`+100 pontos | Tempo: ${formatarTempo(tempoGasto)}`, true);
    inicioTempoDigitacao = null;
    setTimeout(proximaAtividade, 1500);
  } else {
    mostrarRetorno("Tente novamente", false);
  }
}

function formatarTempo(segundos) {
  return `${segundos.toFixed(2)}s`;
}

function iniciarTempoDigitacao() {
  if (!inicioTempoDigitacao) {
    inicioTempoDigitacao = new Date();
  }
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
  if (botaoClicado) return;
  botaoClicado = true;
  const pergunta = atividades[atividadeAtual].conteudo[0];
  if (resposta === pergunta.respostaCorreta) {
    atualizarPontuacao(120);
    mostrarRetorno("+120 pontos", true);
    setTimeout(proximaAtividade, 1000);
  } else {
    mostrarRetorno("Tente novamente", false);
    botaoClicado = false;
  }
}

function proximaAtividade() {
  atividadeAtual = (atividadeAtual + 1) % atividades.length;
  botaoClicado = false;
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
