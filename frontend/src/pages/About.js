import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function About() {
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
              Quem Sou Eu
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src="https://customer-assets.emergentagent.com/job_a9c1f199-6991-446a-a5a5-91a9c421bffb/artifacts/je2zj0by_quem%20sou%20eu.jpeg"
                alt="Giovanna De Pollo"
                className="w-full rounded-lg shadow-xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <h2
                className="text-3xl md:text-4xl font-medium"
                style={{ fontFamily: 'Playfair Display, serif', color: '#1e3a8a' }}
              >
                Giovanna De Pollo
              </h2>

              <div className="space-y-4 text-base md:text-lg leading-relaxed text-slate-600">
                <p>
                  Nascida em Cachoeiro de Itapemirim e criada em Jerônimo Monteiro, sou estudante de Psicologia na UFES e tenho 22 anos.
                </p>
                <p>
                  Apaixonada por animais, dança, pessoas e conversas, encontrei no crochê uma forma de expressão artística que combina perfeitamente com meu amor por manualidades.
                </p>
                <p>
                  Cada peça que crio é feita com dedicação e carinho, pensada para ser única e especial. Meu objetivo é transformar linhas e agulhas em peças que contem histórias e tragam beleza para o dia a dia.
                </p>
                <p>
                  Amo passeios na natureza e busco sempre inspirar-me no mundo ao meu redor para criar peças que refletem elegância e autenticidade.
                </p>
              </div>

              <div className="pt-6">
                <a
                  href="https://www.instagram.com/giovannadepollocroche"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-[#1e3a8a] hover:text-[#D4AF37] transition-colors font-medium"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  @giovannadepollocroche
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default About;
