# Ferramentas GitHub Alimentadas por URL UX

Aqui está uma lista de ferramentas que usam a mesma estrutura de URL do GitHub, permitindo que você as use apenas mudando sua URL.

Para navegar até sua página desejada mais facilmente, vá de qualquer URL 'github.com/_' para 'forgithub.com/_' e você receberá **links rápidos**! Você pode favoritar seus preferidos, ou depois que se lembrar deles, pode visitá-los diretamente.

## Editores

- bolt.new - [abrir no bolt․new](https://bolt.new/github.com)
- stackblitz.com - [abrir no stackblitz](https://stackblitz.com/github.com)
- pr.new - [abrir com codeflow](https://pr.new/github.com)
- github.dev - [VSCode no navegador](https://github.dev)

## Contexto LLM

- gitingest.com - [base de código amigável para prompts](https://gitingest.com)
- uithub.com - [base de código amigável para prompts](https://uithub.com)
- github.gg - [chat com base de código](https://github.gg)
- githuq.com - [chat com código](https://githuq.com)

## Diversos

- log.forgithub.com - [obter últimos commits e informações de contribuidores](https://log.forgithub.com)
- gitpodcast.com - [base de código para podcast](https://gitpodcast.com)
- gitdiagram.com - [base de código para diagrama](https://gitdiagram.com)
- githubtracker.com [rastrear commits, issues, prs e mais](https://githubtracker.com)

# Contribuindo

Por favor, faça um PR para quaisquer ferramentas adicionais com os seguintes requisitos:

- siga a mesma estrutura no README
- a ferramenta deve suportar pelo menos a estrutura de URL `/[owner]/[repo]/[page]/[branch]/[...path]` ou um subconjunto dela
- a ferramenta deve ter um modelo de negócios freemium e não exigir login inicialmente
- pontos extras se a ferramenta expuser um `openapi.json` em sua raiz

# Por quê?

[![](thumb.png)](https://github.com/janwilmake/forgithub/raw/refs/heads/main/demo.mov)

URL UX torna as ferramentas altamente acessíveis. Como muito do que os desenvolvedores fazem gira em torno de repositórios, achei que esse seria um bom foco. 'Repo para Qualquer Coisa' é o sonho!

![](urlux.png)

# HISTÓRICO DE MUDANÇAS

- 2025-01-12 - criada a versão inicial do forgithub.com
- 2025-01-18 - layout melhorado
- 2025-01-27 - adicionada ogimage e adicionadas colunas e favicons ao website. corrigido ci/cd