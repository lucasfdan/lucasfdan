import { motion } from 'framer-motion';
import { Package, Truck, Clock, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function Shipping() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1
              className="text-4xl md:text-6xl font-normal tracking-tight mb-6"
              style={{ fontFamily: 'Playfair Display, serif', color: '#1e3a8a' }}
            >
              Forma de Envio
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
              Todas as informações sobre entrega e envio das suas peças
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="p-8 border border-slate-100 bg-slate-50 hover:bg-white transition-colors duration-300 rounded-lg"
            >
              <div className="w-14 h-14 rounded-full bg-[#1e3a8a] flex items-center justify-center mb-6">
                <Clock className="text-white" size={28} />
              </div>
              <h3
                className="text-2xl md:text-3xl font-normal mb-4"
                style={{ fontFamily: 'Playfair Display, serif', color: '#1e3a8a' }}
              >
                Tempo de Produção
              </h3>
              <p className="text-base md:text-lg leading-relaxed text-slate-600">
                Cada peça é feita sob encomenda com muito carinho. O tempo de produção varia de 7 a 15 dias úteis, dependendo da complexidade da peça.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="p-8 border border-slate-100 bg-slate-50 hover:bg-white transition-colors duration-300 rounded-lg"
            >
              <div className="w-14 h-14 rounded-full bg-[#D4AF37] flex items-center justify-center mb-6">
                <Package className="text-white" size={28} />
              </div>
              <h3
                className="text-2xl md:text-3xl font-normal mb-4"
                style={{ fontFamily: 'Playfair Display, serif', color: '#1e3a8a' }}
              >
                Embalagem
              </h3>
              <p className="text-base md:text-lg leading-relaxed text-slate-600">
                Todas as peças são cuidadosamente embaladas para garantir que cheguem perfeitas até você. Utilizamos materiais de qualidade para proteger sua encomenda.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="p-8 border border-slate-100 bg-slate-50 hover:bg-white transition-colors duration-300 rounded-lg"
            >
              <div className="w-14 h-14 rounded-full bg-[#1e3a8a] flex items-center justify-center mb-6">
                <Truck className="text-white" size={28} />
              </div>
              <h3
                className="text-2xl md:text-3xl font-normal mb-4"
                style={{ fontFamily: 'Playfair Display, serif', color: '#1e3a8a' }}
              >
                Opções de Envio
              </h3>
              <p className="text-base md:text-lg leading-relaxed text-slate-600">
                Trabalhamos com os Correios e transportadoras de confiança. O frete é calculado de acordo com sua localização e será informado no momento do pedido.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="p-8 border border-slate-100 bg-slate-50 hover:bg-white transition-colors duration-300 rounded-lg"
            >
              <div className="w-14 h-14 rounded-full bg-[#D4AF37] flex items-center justify-center mb-6">
                <MapPin className="text-white" size={28} />
              </div>
              <h3
                className="text-2xl md:text-3xl font-normal mb-4"
                style={{ fontFamily: 'Playfair Display, serif', color: '#1e3a8a' }}
              >
                Entrega Local
              </h3>
              <p className="text-base md:text-lg leading-relaxed text-slate-600">
                Para clientes da região de Cachoeiro de Itapemirim e Jerônimo Monteiro, oferecemos entrega em mãos sem custo adicional. Consulte disponibilidade!
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-slate-50 p-8 md:p-12 rounded-lg border border-slate-200"
          >
            <h3
              className="text-2xl md:text-3xl font-normal mb-6 text-center"
              style={{ fontFamily: 'Playfair Display, serif', color: '#1e3a8a' }}
            >
              Como Fazer Seu Pedido
            </h3>
            <div className="space-y-4 text-base md:text-lg leading-relaxed text-slate-600">
              <div className="flex gap-4">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: '#D4AF37' }}
                >
                  1
                </div>
                <p>Navegue pelo catálogo e escolha a peça que mais gosta</p>
              </div>
              <div className="flex gap-4">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: '#D4AF37' }}
                >
                  2
                </div>
                <p>Selecione o tamanho e a cor desejados</p>
              </div>
              <div className="flex gap-4">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: '#D4AF37' }}
                >
                  3
                </div>
                <p>Clique no botão "Encomendar pelo WhatsApp" e envie sua mensagem</p>
              </div>
              <div className="flex gap-4">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: '#D4AF37' }}
                >
                  4
                </div>
                <p>Combinaremos todos os detalhes: pagamento, frete e prazo de entrega</p>
              </div>
              <div className="flex gap-4">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: '#D4AF37' }}
                >
                  5
                </div>
                <p>Sua peça será produzida com todo carinho e enviada para você!</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-slate-600 mb-6">Ficou com alguma dúvida? Entre em contato!</p>
            <a
              href="https://wa.me/5528999205102"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp inline-flex"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Falar no WhatsApp
            </a>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Shipping;