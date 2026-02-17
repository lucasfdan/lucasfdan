function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: 'Playfair Display, serif', color: '#1e3a8a' }}
            >
              Giovanna Depollo
            </h3>
            <p className="text-slate-600 text-sm">
              Peças artesanais feitas com amor e dedicação.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm uppercase tracking-widest font-semibold mb-4 text-slate-700">
              Contato
            </h4>
            <p className="text-slate-600 text-sm">
              WhatsApp: +55 28 99920-5102
            </p>
            <p className="text-slate-600 text-sm mt-2">
              Instagram: @giovannadepollo
            </p>
          </div>
          
          <div>
            <h4 className="text-sm uppercase tracking-widest font-semibold mb-4 text-slate-700">
              Informações
            </h4>
            <p className="text-slate-600 text-sm mb-3">
              Cada peça é única e feita sob encomenda.
            </p>
            <a
              href="/login"
              className="text-slate-400 hover:text-[#1e3a8a] text-xs transition-colors"
            >
              Área Administrativa
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} GD Crochet. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;