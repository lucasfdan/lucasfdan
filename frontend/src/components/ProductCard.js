import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      data-testid={`product-card-${product.product_id}`}
    >
      <Link to={`/product/${product.product_id}`}>
        <div className="product-card group">
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 space-y-2">
            <h3
              className="text-xl font-medium text-slate-900"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {product.name}
            </h3>
            <p className="text-slate-600 text-sm line-clamp-2">
              {product.description}
            </p>
            <p className="text-2xl font-bold" style={{ color: '#D4AF37' }}>
              R$ {product.price.toFixed(2)}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {product.colors.slice(0, 4).map((color, idx) => (
                <div
                  key={idx}
                  className="w-6 h-6 rounded-full border-2 border-slate-200"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <div className="w-6 h-6 rounded-full border-2 border-slate-200 bg-slate-100 flex items-center justify-center text-xs text-slate-600">
                  +{product.colors.length - 4}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;