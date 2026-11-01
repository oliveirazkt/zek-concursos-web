# Catálogo NEXO

Aplicação Next.js para publicar pacotes `nexo-edital` revisados no Neon e distribuí-los ao Android por HTTPS.

Configure `DATABASE_URL` (connection string do Neon) e `ADMIN_TOKEN` (segredo longo de administração) nas variáveis de ambiente da Vercel. Consulte `.env.example` apenas como modelo; não inclua segredos no repositório. A tabela `catalog_publications` é criada na primeira requisição. `/admin` publica um pacote JSON, `GET /api/catalog` lista versões e `GET /api/catalog/:id` entrega o pacote. `POST /api/catalog` exige `Authorization: Bearer` com o token administrativo.

O painel ainda recebe pacotes já revisados. A extração de PDFs e análise por IA devem ser implementadas em tarefas administrativas posteriores; não envie arquivos grandes diretamente às funções da Vercel.
