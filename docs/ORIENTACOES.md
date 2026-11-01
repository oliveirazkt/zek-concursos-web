# Orientações do app_web — NEXO

## Objetivo

`app_web` é o painel administrativo e a API de catálogo do NEXO. O cadastro, a revisão e a publicação de concursos, editais, tópicos e provas acontecem aqui. O aplicativo Android consulta somente conteúdo publicado e mantém o estudo, o plano e o histórico no aparelho.

## Arquitetura

- Next.js com App Router e Route Handlers.
- Neon PostgreSQL como persistência do catálogo publicado.
- `@neondatabase/serverless` para acesso ao banco em funções da Vercel.
- `DATABASE_URL_POOLED` é preferida para requisições da API; `DATABASE_URL` fica como fallback e deve ser usada em tarefas administrativas que exigirem conexão direta.
- O Android conhece apenas a URL HTTPS da aplicação web. Nunca deve receber credenciais do Neon ou tokens administrativos.

## Variáveis de ambiente

As variáveis ficam no `.env.local` durante o desenvolvimento e nas Environment Variables da Vercel durante a implantação:

- `DATABASE_URL_POOLED`: conexão pooled usada pela API.
- `DATABASE_URL`: conexão direta usada como fallback e para migrações controladas.
- `ADMIN_TOKEN`: token necessário para publicar pacotes.

Arquivos `.env*` não devem ser commitados. Não exibir valores dessas variáveis em logs, testes, respostas HTTP ou commits.

## Contrato da API

- `GET /api/catalog`: lista publicações disponíveis.
- `GET /api/catalog/:id`: retorna um pacote `nexo-edital` publicado.
- `POST /api/catalog`: publica ou atualiza um pacote revisado; exige `Authorization: Bearer <ADMIN_TOKEN>`.

O pacote precisa ser validado antes da gravação. Publicação deve ser idempotente pela combinação concurso, cargo, localidade e versão do edital. O mobile só importa o pacote depois de mostrar um resumo e confirmar a operação.

## Processamento de PDFs

PDFs não devem ser enviados diretamente em uma requisição comum da Function. Arquivos grandes exigem armazenamento de objetos e processamento assíncrono com estado, retomada e logs. A IA deve produzir uma proposta revisável; somente conteúdo confirmado deve entrar em uma publicação.

## Regras de segurança

- Manter o banco sem acesso direto pelo APK.
- Validar tamanho, tipo, esquema e origem dos arquivos recebidos.
- Não aceitar SQL, instruções de shell ou comandos provenientes de PDFs.
- Não publicar uma questão ou tópico sem evidência e revisão necessárias.
- Aplicar autenticação administrativa e limitar tentativas de publicação.
- Retornar erros genéricos ao cliente e registrar detalhes somente em logs privados.

## Verificação

Antes de publicar:

1. executar `pnpm lint`;
2. executar `pnpm exec next build --webpack`;
3. testar `GET /api/catalog` e `GET /api/catalog/:id` com banco configurado;
4. testar uma publicação com token administrativo sem incluir `.env.local` no commit;
5. confirmar que o pacote importado pelo mobile passa no `bundleSchema`.

O build local não comprova a conexão com o Neon sem variáveis válidas e uma consulta real.
