/**
 * Página do formulário (index.html).
 * Valida os dados, envia para a API e leva a pessoa para resultado.html.
 */
const formulario = document.querySelector('#form-perfil');
const botaoEnviar = formulario.querySelector('button[type="submit"]');
const modal = document.querySelector('#modal-erro');
const textoModal = document.querySelector('#modal-mensagem');
const botaoFecharModal = document.querySelector('#modal-fechar');

const TEXTO_BOTAO = botaoEnviar.textContent;
const MENSAGEM_INDISPONIVEL = 'O serviço ainda não está disponível. Tente novamente mais tarde.';

// "a, b, , c" -> ["a", "b", "c"] (sem espaços sobrando e sem itens vazios)
const separarLista = (texto) =>
  texto
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '');

const abrirModal = (mensagem) => {
  textoModal.textContent = mensagem;
  modal.showModal(); // a tecla Esc fecha sozinha
};

const definirCarregando = (carregando) => {
  botaoEnviar.disabled = carregando;
  botaoEnviar.textContent = carregando ? 'Enviando...' : TEXTO_BOTAO;
  botaoEnviar.setAttribute('aria-busy', String(carregando));
};

// Mostra o aviso no próprio campo; some assim que a pessoa volta a digitar
const avisarNoCampo = (campo, mensagem) => {
  campo.setCustomValidity(mensagem);
  campo.reportValidity();
};

formulario.querySelectorAll('input, textarea').forEach((campo) => {
  campo.addEventListener('input', () => campo.setCustomValidity(''));
});

botaoFecharModal.addEventListener('click', () => modal.close());

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  if (botaoEnviar.disabled) return; // evita clique duplo

  const campos = formulario.elements;
  const nome = campos.nome.value.trim();
  const hobbies = separarLista(campos.hobbies.value);
  const interesses = separarLista(campos.interesses.value);

  if (nome.length < 2) {
    avisarNoCampo(campos.nome, 'Informe seu nome (de 2 a 60 letras).');
    return;
  }
  if (hobbies.length === 0) {
    avisarNoCampo(campos.hobbies, 'Informe pelo menos um hobby.');
    return;
  }
  if (interesses.length === 0) {
    avisarNoCampo(campos.interesses, 'Informe pelo menos uma área de interesse.');
    return;
  }

  // Enquanto a API não estiver configurada, mostra o modal
  if (!CONFIG.API_URL) {
    abrirModal(MENSAGEM_INDISPONIVEL);
    return;
  }

  const perfil = { name: nome, hobbies, interests: interesses };

  definirCarregando(true);
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), CONFIG.TEMPO_LIMITE_MS);

  try {
    const resposta = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(perfil),
      signal: controlador.signal,
    });

    if (!resposta.ok) {
      throw new Error(`Status ${resposta.status}`);
    }

    const dados = await resposta.json();
    sessionStorage.setItem(CONFIG.CHAVE_RESULTADO, JSON.stringify(dados));
    window.location.href = 'resultado.html';
  } catch (erro) {
    const mensagem =
      erro.name === 'AbortError'
        ? 'O serviço demorou demais para responder. Tente novamente mais tarde.'
        : MENSAGEM_INDISPONIVEL;
    abrirModal(mensagem);
    definirCarregando(false); // o que a pessoa digitou continua nos campos
  } finally {
    clearTimeout(temporizador);
  }
});
