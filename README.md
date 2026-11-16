# NextStep — Mapeamento Vocacional

Página web que ajuda estudantes a descobrir **carreiras em tecnologia** a partir dos seus hobbies e interesses.
A pessoa preenche um formulário, os dados são enviados a uma API com inteligência artificial e a página de
resultado mostra as carreiras mais compatíveis, com porcentagem de compatibilidade, competências-chave e um roteiro de estudos.

**Site:** https://leonardocastilho0725.github.io/projeto-aline-career-dreamer/

> Projeto acadêmico de Front-End — Análise e Desenvolvimento de Sistemas.
> Baseado no projeto [LiniiS/career-dreamer](https://github.com/LiniiS/career-dreamer), que continha defeitos propositais a serem encontrados e corrigidos.

## Equipe
- Leonardo Castilho
- Alessandro Manoel
- Jonathan Buono

## Funcionalidades
- Formulário com validação nativa do HTML5 e validação em JavaScript (nome de 2 a 60 caracteres, itens vazios descartados, espaços removidos, aviso no próprio campo).
- Envio à API com `fetch` e `async/await`, com limite de tempo, indicador de carregamento e bloqueio de clique duplo.
- Modal "Tente mais tarde" para quando a API não está configurada, falha ou demora demais (fecha com o botão "Entendi" ou com Esc). Os dados digitados são mantidos.
- Página de resultado montada dinamicamente: carreiras da mais para a menos compatível, barra de compatibilidade, competências-chave, roteiro de estudos e destaque "Melhor combinação".
- Resumo rápido com a melhor combinação, botão **Salvar como PDF** (com estilo de impressão) e botão **Refazer mapeamento**.
- Mensagem amigável quando a página de resultado é aberta sem dados.

## Tecnologias
HTML5, CSS3 e JavaScript (ES6) puro, sem frameworks. Ferramentas: Visual Studio Code com Live Server, Git/GitHub e as ferramentas do navegador (Console, modo dispositivo e Lighthouse).

## Estrutura
```
index.html          página inicial com o formulário
resultado.html      página de resultado
css/style.css       estilos (tema azul escuro e dourado)
js/config.js        configuração (URL da API, tempo limite)
js/app.js           validação e envio do formulário
js/resultado.js     leitura dos dados e exibição do resultado
js/dados-exemplo.js dados de teste (resultado.html?exemplo)
```

## Como executar
1. Baixe ou clone o repositório.
2. Abra a pasta no VS Code, clique com o botão direito em `index.html` e escolha **Open with Live Server**.
3. Para ver o resultado sem usar a API, acesse `resultado.html?exemplo`.

## Configurando a API
O endereço da API fica em um único lugar, `js/config.js`:

```js
const CONFIG = Object.freeze({
  API_URL: 'https://google-career-dreamer-api.onrender.com/api/career-match',
  TEMPO_LIMITE_MS: 60000,
  CHAVE_RESULTADO: 'careerDreamer:resultado',
});
```

- Enquanto `API_URL` estiver vazia, o site mostra o modal "Tente mais tarde".
- A API fica em servidor gratuito: **a primeira resposta pode levar cerca de 1 minuto** para o servidor "acordar".

**Contrato da API** — `POST` em JSON, com `Content-Type: application/json`:

```json
{
  "name": "Ana Maria Clara",
  "hobbies": ["dançar", "cantar"],
  "interests": ["design de jogos", "desenvolvimento de pessoas"]
}
```

A resposta traz `user_name`, `career_identity_statement` e `recommended_careers` (cada carreira com `id`, `title`, `match_score`, `summary`, `key_skills` e `learning_path`).

## Correções realizadas
Foram corrigidos 13 problemas apontados pelo cliente:

| # | Problema | Correção |
|---|----------|----------|
| 01 | Botão não enviava o formulário | `type="submit"` |
| 02 | Campo Nome só aceitava números | `type="text"` com `required`, `minlength` e `maxlength` |
| 03 | Formulário com campos lado a lado | `flex-direction: column` e botão com largura total |
| 04 | Página ruim no celular | meta `viewport` e largura fluida no `.container` |
| 05 | Navegador oferecia tradução | `lang="pt-BR"` |
| 06 | Erros de português | textos revisados |
| 07 | Rótulos com baixo contraste | cores seguindo a WCAG AA |
| 08 | Rótulos sem `for` e foco invisível | `for`/`id` e `:focus-visible` |
| 09 | Página sem estrutura semântica | `header`, `main`, `section`, `footer`, `h1`, `ol` |
| 10 | Formulário aceitava dados vazios | `trim`, `filter` e avisos no campo |
| 11 | `alert()` do navegador | modal com `<dialog>` |
| 12 | Sem integração com a API | `fetch` com tempo limite e tratamento de erros |
| 13 | Página de resultado em branco | renderização com `<template>` |

## Acessibilidade e responsividade
Idioma `pt-BR`, HTML semântico, rótulos ligados aos campos, contraste seguindo a WCAG AA, foco visível na navegação por teclado, modal que fecha com Esc e layout adaptado a telas a partir de 360 px. 

desenvolvedor - Leonardo Castilho
