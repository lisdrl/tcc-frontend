# Análise de Portabilidade

Este documento compara `version-0`, `version-1` e `version-2` quanto ao esforço necessário para trocar o provider de chat atualmente baseado em Sendbird.

## Critérios de Contagem

As métricas abaixo foram levantadas somente sobre os arquivos de código em `src`.

| Métrica | Definição operacional |
| --- | --- |
| Total de módulos | Número total de arquivos `.ts` e `.tsx` em `src`. |
| Imports do Sendbird | Número de declarações `import` que referenciam `@sendbird/*`. |
| Módulos com import Sendbird | Número de arquivos com pelo menos um `import` de `@sendbird/*`. |
| Módulos que usam SDK diretamente | Arquivos que leem `useSendbird`/`stores.sdkStore.sdk` ou chamam APIs como `sdk.groupChannel`, handlers, queries e `createChannel`; componentes UIKit sem chamada direta ao SDK ficam fora desta contagem. |
| Pontos de integração/troca | Módulos-fonte que precisariam ser revisados para substituir Sendbird por outro provider, incluindo inicialização, configuração, hooks, UI, adapter e estilos provider-specific. |
| Tipos/conceitos do provider espalhados | Arquivos com nomes ou conceitos provider-specific, como `Sendbird`, `SENDBIRD`, `GroupChannel`, `channelUrl`, `QueryType`, `UserEventHandler` ou seletor CSS interno do Sendbird. |
| IPT | `número de módulos que precisariam ser alterados para trocar o provider / número total de módulos relevantes`. |
| IVP | Quantidade de módulos fora da camada de integração que conhecem o provider. |

## Visão Geral das Métricas

| Métrica | `version-0` | `version-1` | `version-2` |
| --- | ---: | ---: | ---: |
| Total de módulos | 44 | 49 | 58 |
| Imports do Sendbird | 11 | 11 | 8 |
| Módulos com import Sendbird | 5 | 5 | 3 |
| Módulos que usam SDK diretamente | 3 | 3 | 2 |
| Pontos de integração/troca | 9 | 7 | 6 |
| Tipos/conceitos do provider espalhados | 8 | 6 | 5 |
| Dependência `@sendbird/uikit-react` em `package.json` | Sim | Sim | Sim |

Observação: `version-2` ainda tem 5 arquivos com conceitos Sendbird, mas a maior parte está concentrada em `features/chat/adapters/sendbird`. Por isso a leitura arquitetural melhora mesmo quando a contagem bruta de termos provider-specific não zera.

## Dependências por Camada

| Camada | `version-0` | `version-1` | `version-2` |
| --- | ---: | ---: | ---: |
| Hooks com dependência direta do provider | 1 | 3 | 0 |
| Componentes app-facing com dependência provider-specific | 5 | 2 | 1 |
| Stores/state locais com dependência provider-specific | 0 | 0 | 0 |
| Módulos que acessam o store interno do Sendbird (`stores.sdkStore.sdk`) | 3 | 3 | 1 |

Leitura por camada:

| Projeto | Hooks | Components | Stores |
| --- | --- | --- | --- |
| `version-0` | `features/chat/hooks/useCreateChannel/index.ts` | `Header`, `ListItem`, `OrderDetails`, `ChatModal.tsx`, `ChatModal.styles.ts` | Nenhum store local acoplado; o acoplamento ocorre via `useSendbird().state.stores.sdkStore.sdk`. |
| `version-1` | `useStartOrderChat`, `useTotalUnreadMessages`, `useOrderChatUnreadCount` | `ChatModal.tsx`, `ChatModal.styles.ts` | Nenhum store local acoplado; hooks ainda acessam `stores.sdkStore.sdk`. |
| `version-2` | Nenhum hook app-facing usa Sendbird diretamente | `ChatModal.styles.ts` ainda conhece classe CSS interna do Sendbird; o restante fica no adapter | Nenhum store local acoplado; o acesso ao store interno do Sendbird fica em `SendbirdChatProvider`. |

## IPT e IVP

Para o IPT, os módulos relevantes são os módulos que participam da superfície de chat/provider: inicialização, configuração, hooks de chat, componentes de chat, consumidores em header/orders, contratos/core e adapters.

| Projeto | Módulos a alterar | Total de módulos relevantes | IPT | IVP |
| --- | ---: | ---: | ---: | ---: |
| `version-0` | 9 | 9 | 1,00 | 8 |
| `version-1` | 7 | 13 | 0,54 | 5 |
| `version-2` | 6 | 20 | 0,30 | 1 |

Interpretação:

| Projeto | Leitura do IPT | Leitura do IVP |
| --- | --- | --- |
| `version-0` | Trocar o provider afeta toda a superfície relevante de chat. | Como não há adapter ou camada explícita de integração, praticamente todo conhecimento de Sendbird é vazamento arquitetural. |
| `version-1` | A troca fica mais concentrada em `features/chat`, mas ainda exige alterar hooks e UI app-facing. | Header e orders já não conhecem Sendbird, mas hooks e `ChatModal` ainda vazam provider para fora de uma camada de integração dedicada. |
| `version-2` | A troca fica majoritariamente no adapter, provider selection, config e um estilo residual. | O único vazamento fora da camada de integração é o seletor `.sendbird-channel-list__header` em `ChatModal.styles.ts`. |

## Superfície de Vazamento do Provider

Comparar apenas arquivos com import direto de `@sendbird/*` subestima o acoplamento real, porque deixa escapar conceitos provider-specific que circulam sem import direto, como `SENDBIRD_USER_ID`, `channelUrl` e seletores CSS internos como `.sendbird-*`.

A métrica mais fiel para demonstrar acoplamento é a superfície de vazamento do provider: módulos fora da camada de integração que conhecem conceitos específicos da Sendbird.

| Métrica | `version-0` | `version-1` | `version-2` | Leitura |
| --- | ---: | ---: | ---: | --- |
| Módulos com conceitos Sendbird | 8 | 6 | 5 | Mostra onde qualquer conceito do provider aparece, com ou sem import direto. |
| IVP: vazamentos fora da integração | 8 | 5 | 1 | Mostra se o conhecimento do provider está espalhado pela aplicação ou isolado em uma camada/adapters de integração. |

Exemplos de vazamentos que não dependem de import direto:

| Projeto | Exemplo | Impacto |
| --- | --- | --- |
| `version-0` | `SENDBIRD_USER_ID` em `src/features/users/constants/index.ts` | O domínio de usuário passa a carregar nomenclatura do provider. |
| `version-0` | `channelUrl` em `src/features/orders/components/OrderDetails/OrderDetails.tsx` | A feature de pedidos conhece o identificador nativo da Sendbird. |
| `version-0` | `.sendbird-channel-list__header` em `src/features/chat/components/ChatModal/ChatModal.styles.ts` | A camada visual depende da estrutura interna do UIKit da Sendbird. |
| `version-1` | `SendbirdGroupChannelType` em `src/features/chat/components/ChatModal/ChatModal.tsx` | O modal app-facing ainda manipula tipo nativo do provider. |
| `version-2` | `.sendbird-channel-list__header` em `src/features/chat/components/ChatModal/ChatModal.styles.ts` | Resta um vazamento visual fora do adapter, embora SDK e UIKit estejam isolados. |

## Vazamento em Áreas de Produto

Outra leitura útil é contar quantas áreas de produto, fora do núcleo de integração de chat, conhecem Sendbird. Esta métrica é especialmente didática porque evidencia a diferença entre acoplamento espalhado e acoplamento isolado.

| Área de produto que conhece Sendbird | `version-0` | `version-1` | `version-2` |
| --- | ---: | ---: | ---: |
| App/header/orders/users | 5 | 0 | 0 |

Na `version-0`, Sendbird aparece no app shell, no header, em componentes de pedidos, em constantes de usuário e no chat app-facing. Nas versões `version-1` e `version-2`, header e pedidos deixam de conhecer Sendbird diretamente; a diferença é que `version-2` também empurra SDK e UIKit para um adapter explícito.

## Pontos de Integração por Projeto

| Projeto | Pontos de integração/troca |
| --- | --- |
| `version-0` | `src/App.tsx`; `src/components/Header/Header.tsx`; `src/features/users/constants/index.ts`; `src/features/orders/components/ListItem/ListItem.tsx`; `src/features/orders/components/OrderDetails/OrderDetails.tsx`; `src/features/chat/components/ChatButton/ChatButton.tsx`; `src/features/chat/components/ChatModal/ChatModal.tsx`; `src/features/chat/components/ChatModal/ChatModal.styles.ts`; `src/features/chat/hooks/useCreateChannel/index.ts` |
| `version-1` | `src/features/chat/providers/ChatProvider.tsx`; `src/features/chat/config/chatConfig.ts`; `src/features/chat/hooks/useStartOrderChat/index.ts`; `src/features/chat/hooks/useTotalUnreadMessages/index.ts`; `src/features/chat/hooks/useOrderChatUnreadCount/index.ts`; `src/features/chat/components/ChatModal/ChatModal.tsx`; `src/features/chat/components/ChatModal/ChatModal.styles.ts` |
| `version-2` | `src/features/chat/providers/ChatProvider.tsx`; `src/features/chat/config/chatConfig.ts`; `src/features/chat/adapters/sendbird/SendbirdChatProvider.tsx`; `src/features/chat/adapters/sendbird/SendbirdChatViews.tsx`; `src/features/chat/adapters/sendbird/createSendbirdChatClient.ts`; `src/features/chat/components/ChatModal/ChatModal.styles.ts` |

## Módulos com SDK Direto

| Projeto | Módulos |
| --- | --- |
| `version-0` | `src/components/Header/Header.tsx`; `src/features/orders/components/ListItem/ListItem.tsx`; `src/features/chat/hooks/useCreateChannel/index.ts` |
| `version-1` | `src/features/chat/hooks/useStartOrderChat/index.ts`; `src/features/chat/hooks/useTotalUnreadMessages/index.ts`; `src/features/chat/hooks/useOrderChatUnreadCount/index.ts` |
| `version-2` | `src/features/chat/adapters/sendbird/SendbirdChatProvider.tsx`; `src/features/chat/adapters/sendbird/createSendbirdChatClient.ts` |

## Conclusão Comparativa

| Projeto | Resultado de portabilidade |
| --- | --- |
| `version-0` | Baixa portabilidade. Sendbird aparece na inicialização da aplicação, em componentes compartilhados, em orders, em hooks e na UI de chat. |
| `version-1` | Portabilidade intermediária. Header e orders deixam de conhecer Sendbird, mas hooks e modal de chat continuam acoplados ao SDK/UIKit. |
| `version-2` | Melhor portabilidade entre as três versões. O acoplamento fica concentrado no adapter Sendbird e em um ponto residual de estilo, reduzindo o IPT e o IVP. |
