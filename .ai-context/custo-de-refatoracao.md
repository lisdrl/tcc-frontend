# Custo de Refatoracao

Este documento compara o custo de refatoracao entre as copias do frontend em `version-0`, `version-1` e `version-2`.

`version-0` e tratado como baseline da comparacao. Portanto, suas metricas de arquivos alterados, linhas alteradas, pontos de integracao modificados e artefatos criados representam custo incremental igual a zero dentro deste conjunto de versoes.

## Metodo

As metricas abaixo consideram somente arquivos em `src`, para evitar que `package-lock.json`, metadados de build ou dependencias distorcam o custo de refatoracao da aplicacao.

| Projeto analisado | Comparacao usada |
| --- | --- |
| `version-0` | Baseline, sem versao anterior neste conjunto |
| `version-1` | `version-0/src` -> `version-1/src` |
| `version-2` | `version-1/src` -> `version-2/src` |

Definicoes usadas na contagem:

| Metrica | Definicao operacional |
| --- | --- |
| Arquivos alterados | Quantidade de arquivos adicionados, removidos ou modificados no diff entre a versao anterior e a versao analisada. Para `version-0`, o valor e 0 porque ela e o baseline. |
| Linhas adicionadas/removidas | Soma de insercoes e delecoes reportada pelo diff entre as duas copias de `src`. Para `version-0`, o valor e +0 / -0. |
| Churn de linhas | Soma de linhas adicionadas e removidas. Ajuda a medir volume total de edicao, mesmo quando parte das mudancas se cancela no saldo liquido. |
| Delta liquido de linhas | Linhas adicionadas menos linhas removidas. Ajuda a medir crescimento ou reducao final do codigo. |
| Pontos de integracao modificados | Arquivos de comportamento ou contrato na fronteira app-chat-provider que foram adicionados, removidos ou modificados. Nao inclui arquivos de barril `index.ts` nem ajustes apenas de texto/copy. |
| Componentes/hooks/servicos criados | Novos componentes, providers, hooks ou factories/servicos criados pela refatoracao da versao analisada. Arquivos apenas de tipos, config ou exportacao nao entram nessa contagem. |

Comandos-base usados para as metricas brutas:

```sh
git diff --no-index --shortstat version-0/src version-1/src
git diff --no-index --shortstat version-1/src version-2/src
git diff --no-index --name-status version-0/src version-1/src
git diff --no-index --name-status version-1/src version-2/src
git diff --no-index --numstat version-0/src version-1/src
git diff --no-index --numstat version-1/src version-2/src
```

## Visao Geral

| Projeto | Arquivos alterados | Linhas adicionadas | Linhas removidas | Pontos de integracao modificados | Componentes/hooks/servicos criados | Localizacao das mudancas |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `version-0` | 0 | 0 | 0 | 0 | 0 | Baseline sem mudanca incremental; a superficie inicial de integracao ja esta espalhada por app shell, `Header`, `features/orders`, `features/users` e `features/chat`. |
| `version-1` | 19 | 335 | 210 | 14 | 4 | Espalhada por app shell, `Header`, `features/orders`, `features/chat` e constantes de usuario. |
| `version-2` | 22 | 492 | 187 | 13 | 6 | Majoritariamente localizada em `features/chat`; fora dela houve ajustes pequenos de tipagem/texto e um arquivo de constante sem uso aparente. |

## Metricas Complementares

Estas metricas ajudam a interpretar a pergunta sobre localizacao das mudancas. `version-2` tem mais linhas alteradas que `version-1`, mas quase todo o churn fica dentro de `features/chat`.

| Projeto | Arquivos adicionados | Arquivos modificados | Arquivos removidos | Churn de linhas | Delta liquido de linhas |
| --- | ---: | ---: | ---: | ---: | ---: |
| `version-0` | 0 | 0 | 0 | 0 | 0 |
| `version-1` | 7 | 10 | 2 | 545 | +125 |
| `version-2` | 10 | 11 | 1 | 679 | +305 |

| Projeto | Arquivos alterados em `features/chat` | Arquivos alterados fora de `features/chat` | % de arquivos em `features/chat` | Churn em `features/chat` | Churn fora de `features/chat` | % do churn em `features/chat` |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `version-0` | 0 | 0 | N/A | 0 | 0 | N/A |
| `version-1` | 12 | 7 | 63% | 367 | 178 | 67% |
| `version-2` | 17 | 5 | 77% | 670 | 9 | 99% |

| Projeto | Total de arquivos em `src` | Arquivos em `features/chat` | Participacao de `features/chat` no projeto |
| --- | ---: | ---: | ---: |
| `version-0` | 44 | 10 | 23% |
| `version-1` | 49 | 16 | 33% |
| `version-2` | 58 | 24 | 41% |

Leitura: `version-1` reduz vazamento em `Header` e `orders`, mas para isso ainda toca varios consumidores fora de `features/chat`. `version-2` aumenta a estrutura interna de chat, especialmente com `core` e `adapters/sendbird`, mas concentra quase todo o volume de edicao nessa fronteira.

## Mudancas Fora de `features/chat`

Esta tabela explicita o que ficou fora da feature de chat em cada diff. Ela evita que a conclusao dependa apenas de uma frase qualitativa.

| Projeto | Arquivos fora de `features/chat` alterados | Natureza da mudanca |
| --- | --- | --- |
| `version-0` | Nenhum por diff; baseline | Nao aplicavel. |
| `version-1` | `src/App.tsx`; `src/components/Header/Header.tsx`; `src/components/UnreadBadge/UnreadBadge.tsx`; `src/features/orders/components/ListItem/ListItem.tsx`; `src/features/orders/components/OrderDetails/OrderDetails.tsx`; `src/features/users/constants/index.ts`; `src/pages/Home/Home.tsx` | Mudancas funcionais em app shell, header e orders; ajustes menores em badge, users e titulo da pagina. |
| `version-2` | `src/App.tsx`; `src/components/Header/Header.tsx`; `src/components/UnreadBadge/UnreadBadge.tsx`; `src/features/users/constants/index.ts`; `src/pages/Home/Home.tsx` | Mudancas pontuais fora de chat: tipagem/copy e uma constante de usuario adicionada sem referencia aparente no proprio `version-2/src`. |

## `version-0`

| Metrica | Valor |
| --- | --- |
| Comparacao | Baseline, sem versao anterior neste conjunto |
| Arquivos alterados | 0 |
| Linhas adicionadas/removidas | +0 / -0 |
| Pontos de integracao modificados | 0 |
| Componentes/hooks/servicos criados | 0 |
| Mudancas localizadas em `features/chat`? | Nao aplicavel como diff, pois e o baseline. Como arquitetura inicial, o conhecimento do provider esta espalhado por app shell, `Header`, `features/orders`, `features/users` e `features/chat`. |

| Superficie inicial de integracao | Observacao |
| --- | --- |
| `src/App.tsx` | Inicializa o provider de chat diretamente no app shell. |
| `src/components/Header/Header.tsx` | Consulta unread count total usando conceitos do provider. |
| `src/features/orders/components/ListItem/ListItem.tsx` | Consulta unread count por pedido usando conceitos do provider. |
| `src/features/orders/components/OrderDetails/OrderDetails.tsx` | Trabalha com identificador de conversa ligado ao provider. |
| `src/features/users/constants/index.ts` | Mantem constante de usuario nomeada a partir do provider. |
| `src/features/chat/components/ChatButton/ChatButton.tsx` | Usa hook de criacao de canal diretamente acoplado ao provider. |
| `src/features/chat/components/ChatModal/ChatModal.tsx` | Renderiza UI do provider diretamente. |
| `src/features/chat/components/ChatModal/ChatModal.styles.ts` | Contem seletor visual especifico do provider. |
| `src/features/chat/hooks/useCreateChannel/index.ts` | Cria canal usando SDK/provider diretamente. |

| Componentes/hooks/servicos criados | Quantidade | Itens |
| --- | ---: | --- |
| Componentes/providers | 0 | Nenhum por refatoracao; `version-0` e baseline. |
| Hooks | 0 | Nenhum por refatoracao; `version-0` e baseline. |
| Servicos/factories | 0 | Nenhum por refatoracao; `version-0` e baseline. |
| Total | 0 | Custo incremental zero. |

## `version-1`

| Metrica | Valor |
| --- | --- |
| Comparacao | `version-0/src` -> `version-1/src` |
| Arquivos alterados | 19 |
| Linhas adicionadas/removidas | +335 / -210 |
| Pontos de integracao modificados | 14 |
| Componentes/hooks/servicos criados | 4 |
| Mudancas localizadas em `features/chat`? | Nao. A refatoracao espalhou mudancas por app shell, componente compartilhado de header, pedidos, chat e constantes de usuario. |

| Pontos de integracao modificados | Motivo |
| --- | --- |
| `src/App.tsx` | Troca a composicao direta do provider pelo `ChatProvider` exportado pela feature de chat. |
| `src/components/Header/Header.tsx` | Remove leitura direta do SDK da Sendbird e passa a consumir `useTotalUnreadMessages`. |
| `src/features/chat/components/ChatButton/ChatButton.tsx` | Troca `useCreateChannel` pela facade `useStartOrderChat`. |
| `src/features/chat/components/ChatModal/ChatModal.tsx` | Muda a API publica de `type/channelUrl` para `mode/conversationId`. |
| `src/features/chat/config/chatConfig.ts` | Cria configuracao isolada para credenciais e usuario de chat. |
| `src/features/chat/hooks/useCreateChannel/index.ts` | Remove o hook antigo acoplado diretamente a criacao de canal Sendbird. |
| `src/features/chat/hooks/useOrderChatUnreadCount/index.ts` | Cria hook para unread count por pedido. |
| `src/features/chat/hooks/useStartOrderChat/index.ts` | Cria hook para iniciar conversa de pedido. |
| `src/features/chat/hooks/useTotalUnreadMessages/index.ts` | Cria hook para unread count total. |
| `src/features/chat/providers/ChatProvider.tsx` | Cria wrapper de provider dentro de `features/chat`. |
| `src/features/chat/types.ts` | Cria tipos app-owned como `ConversationId` e `OrderChatTarget`. |
| `src/features/orders/components/ListItem/ListItem.tsx` | Remove consulta direta ao SDK e passa a consumir hook de chat. |
| `src/features/orders/components/OrderDetails/OrderDetails.tsx` | Remove `SENDBIRD_USER_ID` e troca `channelUrl` por `ConversationId`. |
| `src/features/users/constants/index.ts` | Remove constante especifica de Sendbird do dominio de usuarios. |

| Componentes/hooks/servicos criados | Quantidade | Itens |
| --- | ---: | --- |
| Componentes/providers | 1 | `ChatProvider` |
| Hooks | 3 | `useOrderChatUnreadCount`, `useStartOrderChat`, `useTotalUnreadMessages` |
| Servicos/factories | 0 | Nenhum |
| Total | 4 | 1 provider + 3 hooks |

## `version-2`

| Metrica | Valor |
| --- | --- |
| Comparacao | `version-1/src` -> `version-2/src` |
| Arquivos alterados | 22 |
| Linhas adicionadas/removidas | +492 / -187 |
| Pontos de integracao modificados | 13 |
| Componentes/hooks/servicos criados | 6 |
| Mudancas localizadas em `features/chat`? | Parcialmente sim. A mudanca arquitetural ficou em `features/chat`; fora dela os diffs foram pontuais, como tipagem em `App.tsx`, texto em `Header`/`Home`/`UnreadBadge` e `src/features/users/constants/index.ts`. |

| Pontos de integracao modificados | Motivo |
| --- | --- |
| `src/features/chat/adapters/sendbird/SendbirdChatProvider.tsx` | Cria o provider especifico da Sendbird e conecta SDK, client e views ao contrato interno. |
| `src/features/chat/adapters/sendbird/SendbirdChatViews.tsx` | Isola os componentes UIKit da Sendbird atras de `ChatViews`. |
| `src/features/chat/adapters/sendbird/createSendbirdChatClient.ts` | Centraliza chamadas SDK, queries e subscriptions da Sendbird em um client provider-specific. |
| `src/features/chat/components/ChatModal/ChatModal.tsx` | Remove imports diretos do UIKit e passa a consumir views provider-neutral. |
| `src/features/chat/core/ChatContext.ts` | Cria contexto para a implementacao ativa de chat. |
| `src/features/chat/core/ChatImplementationProvider.tsx` | Cria provider do contrato interno de chat. |
| `src/features/chat/core/chatTypes.ts` | Expande os tipos para `ChatClient`, `ChatViews` e `ChatImplementation`. |
| `src/features/chat/core/useChatClient.ts` | Cria hook para acessar o client provider-neutral. |
| `src/features/chat/core/useChatImplementation.ts` | Cria hook para acessar client e views da implementacao ativa. |
| `src/features/chat/hooks/useOrderChatUnreadCount/index.ts` | Troca o acesso direto ao SDK pelo `ChatClient`. |
| `src/features/chat/hooks/useStartOrderChat/index.ts` | Troca a criacao direta de canal pelo `ChatClient`. |
| `src/features/chat/hooks/useTotalUnreadMessages/index.ts` | Troca handlers diretos da Sendbird por subscriptions do `ChatClient`. |
| `src/features/chat/providers/ChatProvider.tsx` | Passa a compor `SendbirdChatProvider` em vez do provider UIKit diretamente. |

| Componentes/hooks/servicos criados | Quantidade | Itens |
| --- | ---: | --- |
| Componentes/providers | 2 | `SendbirdChatProvider`, `ChatImplementationProvider` |
| Hooks | 2 | `useChatClient`, `useChatImplementation` |
| Servicos/factories | 2 | `createSendbirdChatClient`, `createSendbirdChatViews` |
| Total | 6 | 2 providers + 2 hooks + 2 factories |

## Leitura Comparativa

| Projeto | Interpretacao do custo |
| --- | --- |
| `version-0` | Baseline sem custo incremental medido; serve como ponto de partida com integracao espalhada pela aplicacao. |
| `version-1` | Maior custo espalhado pela aplicacao: remove acoplamento de `Header` e `orders`, mas exige alteracoes em consumidores e na facade de chat. |
| `version-2` | Maior custo estrutural dentro de `features/chat`: cria adapter e contratos, reduzindo a necessidade de tocar areas de produto. |

## Limites da Leitura

| Ponto | Impacto |
| --- | --- |
| Testes automatizados | Nao foram encontrados arquivos `*.test.*`, `*.spec.*` ou pastas `__tests__` em `version-0/src`, `version-1/src` ou `version-2/src`. Portanto, o documento mede custo de refatoracao por superficie de codigo, mas nao mede custo de criacao/adaptacao de testes. |
| Pontos de integracao | A contagem exige julgamento arquitetural: arquivos de barril e ajustes apenas textuais ficam fora, enquanto arquivos que alteram contrato, provider, hooks ou consumidores app-chat entram. |
| Dependencias e lockfiles | Foram ignorados de proposito para manter a analise focada no codigo da aplicacao. |
