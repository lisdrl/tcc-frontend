# SonarQube

Este repositório está configurado para analisar separadamente `version-0`, `version-1` e `version-2` no SonarQube.

## Objetivo

As análises geram projetos independentes no SonarQube:

| Projeto local | `sonar.projectKey` |
| --- | --- |
| `version-0` | `tcc-frontend-version-0` |
| `version-1` | `tcc-frontend-version-1` |
| `version-2` | `tcc-frontend-version-2` |

Isso permite comparar métricas como Cyclomatic Complexity e Cognitive Complexity entre as três versões sem misturar os resultados.

## Como executar

Suba o SonarQube local:

```sh
npm run sonar:up
```

Aguarde o SonarQube terminar a inicialização e acesse `http://localhost:9000`. Entre com o usuário inicial do SonarQube local e crie um token de análise.

Depois exporte o token no terminal:

```sh
export SONAR_TOKEN=<token-gerado-no-sonarqube>
```

Execute as análises:

```sh
npm run sonar:scan:version-0
npm run sonar:scan:version-1
npm run sonar:scan:version-2
```

Ou rode as três em sequência:

```sh
npm run sonar:scan:all
```

## Onde consultar as métricas

No SonarQube, abra cada projeto e consulte:

| Métrica | Local sugerido |
| --- | --- |
| Cyclomatic Complexity | `Measures` -> `Complexity` |
| Cognitive Complexity | `Measures` -> `Complexity` ou issues da regra de Cognitive Complexity |
| Arquivos/funções mais problemáticos | `Issues`, filtrando por regras de complexidade |

## Arquivos de configuração

Cada versão possui seu próprio `sonar-project.properties`, com `sonar.sources=src` e `sonar.typescript.tsconfigPath=tsconfig.app.json`.

O scanner gera `.scannerwork/` durante a análise. Essa pasta foi adicionada ao `.gitignore`.
