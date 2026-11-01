import { neon } from '@neondatabase/serverless';
import { z } from 'zod';

export const bundleSchema = z.object({
  format: z.literal('nexo-edital'), version: z.literal(1),
  contest: z.object({ name: z.string().min(1), role: z.string().min(1), location: z.string() }),
  syllabus: z.object({ version: z.string().min(1), source: z.object({ title: z.string().min(1) }).passthrough() }),
  topics: z.array(z.object({ id: z.string(), title: z.string(), discipline: z.string() }).passthrough()).min(1),
  concepts: z.array(z.unknown()), edges: z.array(z.unknown()), questions: z.array(z.unknown()),
}).passthrough();

export function database() {
  const connectionString = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL não configurada.');
  return neon(connectionString);
}

export async function ensureCatalog() {
  const sql = database();
  await sql`CREATE TABLE IF NOT EXISTS catalog_publications (
    id UUID PRIMARY KEY, title TEXT NOT NULL, role TEXT NOT NULL,
    location TEXT NOT NULL, edition TEXT NOT NULL, bundle JSONB NOT NULL,
    published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (title, role, location, edition)
  )`;
  return sql;
}

export function authorized(request) {
  const secret = process.env.ADMIN_TOKEN;
  return Boolean(secret && request.headers.get('authorization') === `Bearer ${secret}`);
}
