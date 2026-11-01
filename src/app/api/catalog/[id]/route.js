import { ensureCatalog } from '@/lib/catalog';

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    if (!/^[0-9a-f-]{36}$/i.test(id)) return Response.json({ error: 'ID inválido.' }, { status: 400 });
    const sql = await ensureCatalog();
    const rows = await sql`SELECT bundle FROM catalog_publications WHERE id = ${id}::uuid`;
    if (!rows.length) return Response.json({ error: 'Concurso não encontrado.' }, { status: 404 });
    return Response.json(rows[0].bundle);
  } catch { return Response.json({ error: 'Catálogo indisponível.' }, { status: 503 }); }
}
