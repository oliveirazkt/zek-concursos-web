# Contrato do catálogo NEXO

O formato de conteúdo usado pelo painel e pelo mobile é `nexo-edital`, versão `1`.

```json
{
  "format": "nexo-edital",
  "version": 1,
  "contest": { "name": "...", "role": "...", "location": "..." },
  "syllabus": { "version": "...", "source": {} },
  "topics": [],
  "concepts": [],
  "edges": [],
  "questions": []
}
```

IDs estáveis devem ser preservados entre versões quando representarem a mesma entidade. Uma nova publicação não pode alterar silenciosamente o significado de tentativas já registradas no aparelho. Correções incompatíveis devem criar nova versão e manter a proveniência.

O endpoint público de leitura entrega apenas publicações. Rascunhos, tokens, PDFs originais e dados administrativos não fazem parte da resposta do catálogo.
