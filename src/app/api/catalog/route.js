import { ensureCatalog, authorized, bundleSchema } from '@/lib/catalog';

export async function GET() {
  try {
    const sql = await ensureCatalog();
    const items = await sql`SELECT id, title, role, location, edition, published_at FROM catalog_publications ORDER BY published_at DESC LIMIT 200`;
    return Response.json({ items });
  } catch { return Response.json({ error: 'Catálogo indisponível.' }, { status: 503 }); }
}

export async function POST(request) {
  if (!authorized(request)) return Response.json({ error: 'Acesso negado.' }, { status: 401 });
  try {
    const raw = await request.text();
    if (raw.length > 4_000_000) return Response.json({ error: 'Pacote excede 4 MB.' }, { status: 413 });
    const bundle = bundleSchema.parse(JSON.parse(raw));
    const sql = await ensureCatalog();
    const id = crypto.randomUUID();
    const rows = await sql`INSERT INTO catalog_publications (id, title, role, location, edition, bundle)
      VALUES (${id}, ${bundle.contest.name}, ${bundle.contest.role}, ${bundle.contest.location}, ${bundle.syllabus.version}, ${JSON.stringify(bundle)}::jsonb)
      ON CONFLICT (title, role, location, edition) DO UPDATE SET bundle = EXCLUDED.bundle, published_at = now() RETURNING id`;
    return Response.json({ id: rows[0].id }, { status: 201 });
  } catch { return Response.json({ error: 'Pacote inválido ou publicação indisponível.' }, { status: 400 }); }
}
