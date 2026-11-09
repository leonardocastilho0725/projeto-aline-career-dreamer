/**
 * Página de resultado (resultado.html).
 * Mostra o perfil devolvido pela API.
 * Para testar SEM o backend, abra: resultado.html?exemplo
 */
const secaoResultado = document.querySelector('#resultado');
const secaoSemResultado = document.querySelector('#sem-resultado');
const campoNome = document.querySelector('#nome-usuario');
const campoSintese = document.querySelector('#sintese');
const listaCarreiras = document.querySelector('#lista-carreiras');
const modeloCarreira = document.querySelector('#modelo-carreira');

// Exemplo (?exemplo) ou o que o formulário salvou no sessionStorage
const obterDados = () => {
  const parametros = new URLSearchParams(window.location.search);
  if (parametros.has('exemplo')) {
    return DADOS_EXEMPLO;
  }
  try {
    const texto = sessionStorage.getItem(CONFIG.CHAVE_RESULTADO);
    return texto ? JSON.parse(texto) : null;
  } catch (erro) {
    return null;
  }
};

const dadosSaoValidos = (dados) =>
  Boolean(dados) &&
  typeof dados.user_name === 'string' &&
  Array.isArray(dados.recommended_careers) &&
  dados.recommended_careers.length > 0;

const criarItens = (textos) =>
  (Array.isArray(textos) ? textos : []).map((texto) => {
    const item = document.createElement('li');
    item.textContent = texto;
    return item;
  });

const criarCartaoCarreira = (carreira, ehPrimeira) => {
  const cartao = modeloCarreira.content.cloneNode(true);
  const nota = Math.min(100, Math.max(0, Number(carreira.match_score) || 0));

  cartao.querySelector('.carreira__titulo').textContent = carreira.title;
  cartao.querySelector('.carreira__percentual').textContent = `${nota}%`;
  cartao.querySelector('.barra__nivel').style.setProperty('--nivel', `${nota}%`);
  cartao.querySelector('.carreira__resumo').textContent = carreira.summary;
  cartao.querySelector('.chips').append(...criarItens(carreira.key_skills));
  cartao.querySelector('.roteiro').append(...criarItens(carreira.learning_path));

  if (ehPrimeira) {
    cartao.querySelector('.carreira').classList.add('carreira--principal');
    cartao.querySelector('.carreira__selo').hidden = false;
  }

  return cartao;
};

const mostrarResultado = (dados) => {
  campoNome.textContent = dados.user_name;
  campoSintese.textContent = dados.career_identity_statement;

  // da mais compatível para a menos compatível
  const carreiras = [...dados.recommended_careers].sort(
    (a, b) => b.match_score - a.match_score
  );

  carreiras.forEach((carreira, indice) => {
    listaCarreiras.append(criarCartaoCarreira(carreira, indice === 0));
  });

  secaoResultado.hidden = false;
};

const dados = obterDados();

if (dadosSaoValidos(dados)) {
  mostrarResultado(dados);
} else {
  secaoSemResultado.hidden = false;
}
