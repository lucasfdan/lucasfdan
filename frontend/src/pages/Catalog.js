import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1765813132366-fdac6cb1f0ef?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDB8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwY3JvY2hldCUyMGZhc2hpb24lMjB3b21hbiUyMGJlYWNoJTIwc3Vuc2V0fGVufDB8fHx8MTc3MTI5Njc2Mnww&ixlib=rb-4.1.0&q=85"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-medium tracking-tight leading-tight mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Peças Artesanais
              <br />
              Feitas com Amor
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto"
            >
              Crochê de qualidade, peças únicas e exclusivas
            </motion.p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-normal tracking-tight mb-4"
              style={{ fontFamily: 'Playfair Display, serif', color: '#1e3a8a' }}
            >
              Nosso Catálogo
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
              Explore nossa coleção de peças artesanais
            </p>
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <div className="loading-spinner"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-red-600">Erro ao carregar produtos: {error}</p>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-600 text-lg">Nenhum produto disponível no momento.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {products.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Catalog;