import Link from "next/link";

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-[#e8e6e1] font-sans px-6 py-12 flex items-center justify-center">
      <div className="text-center max-w-md w-full">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-4">
          Contacto
        </h1>
        <p className="text-zinc-600 mb-8">
          Contáctanos a través de WhatsApp para cualquier consulta.
        </p>
        <a 
          href="https://wa.me/541124072012" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full px-8 py-4 bg-[#25D366] text-white font-bold text-sm tracking-widest uppercase hover:bg-[#20bd5a] transition-colors mb-4"
        >
          Enviar mensaje
        </a>
        <Link href="/" className="inline-block px-8 py-4 bg-zinc-900 text-white font-bold text-sm tracking-widest uppercase hover:bg-zinc-800 transition-colors w-full">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
