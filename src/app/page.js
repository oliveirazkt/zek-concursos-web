import Link from 'next/link';

export default function Home() {
  return <main className="mx-auto max-w-3xl p-8 space-y-6">
    <p className="font-semibold text-red-700">NEXO</p>
    <h1 className="text-4xl font-semibold">Concursos prontos para estudar</h1>
    <p>O catálogo publicado é consultado pelo aplicativo Android. A edição de conteúdo fica na área administrativa.</p>
    <Link href="/admin" className="inline-block rounded bg-red-700 px-5 py-3 text-white">Área administrativa</Link>
  </main>;
}
