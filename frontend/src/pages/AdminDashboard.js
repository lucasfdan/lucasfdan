import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut, X } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sizes: [],
    colors: [],
    images: []
  });

  const availableSizes = ['P', 'M', 'G', 'Tamanho único'];
  const availableColors = ['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const openDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        sizes: product.sizes,
        colors: product.colors,
        images: product.images
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        sizes: [],
        colors: [],
        images: []
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const toggleSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const toggleColor = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || formData.sizes.length === 0 || formData.colors.length === 0 || formData.images.length === 0) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      sizes: formData.sizes,
      colors: formData.colors,
      images: formData.images
    };

    try {
      const url = editingProduct
        ? `${BACKEND_URL}/api/products/${editingProduct.product_id}`
        : `${BACKEND_URL}/api/products`;

      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(productData)
      });

      if (!response.ok) throw new Error('Failed to save product');

      toast.success(editingProduct ? 'Produto atualizado!' : 'Produto criado!');
      closeDialog();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Erro ao salvar produto');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete product');

      toast.success('Produto excluído!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erro ao excluir produto');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: 'Playfair Display, serif', color: '#1e3a8a' }}
          >
            Painel Admin - Giovanna Depollo
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors"
            data-testid="logout-button"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-slate-800">Produtos</h2>
          <button
            onClick={() => openDialog()}
            className="btn-primary flex items-center gap-2"
            data-testid="add-product-button"
          >
            <Plus size={20} />
            Adicionar Produto
          </button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-slate-200">
            <p className="text-slate-600 text-lg">Nenhum produto cadastrado ainda.</p>
            <button onClick={() => openDialog()} className="btn-primary mt-4">
              Criar Primeiro Produto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.product_id}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                data-testid={`product-admin-card-${product.product_id}`}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-800 truncate">{product.name}</h3>
                  <p className="text-slate-600 text-sm line-clamp-2">{product.description}</p>
                  <p className="text-xl font-bold" style={{ color: '#D4AF37' }}>
                    R$ {product.price.toFixed(2)}
                  </p>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => openDialog(product)}
                      className="flex-1 btn-secondary py-2 text-sm flex items-center justify-center gap-2"
                      data-testid={`edit-product-${product.product_id}`}
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.product_id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 text-sm rounded flex items-center justify-center gap-2 transition-colors"
                      data-testid={`delete-product-${product.product_id}`}
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Nome da Peça *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Bolsa de Crochê Colorida"
                required
                data-testid="product-name-input"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva a peça..."
                rows={4}
                required
                data-testid="product-description-input"
              />
            </div>

            <div>
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                required
                data-testid="product-price-input"
              />
            </div>

            <div>
              <Label>Tamanhos Disponíveis *</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`size-option ${formData.sizes.includes(size) ? 'selected' : ''}`}
                    data-testid={`size-selector-${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Cores Disponíveis *</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => toggleColor(color)}
                    className={`color-swatch ${formData.colors.includes(color) ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    title={color}
                    data-testid={`color-selector-${color}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="images">Imagens *</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="mt-2"
                data-testid="image-upload-input"
              />
              <p className="text-sm text-slate-500 mt-1">Você pode adicionar múltiplas imagens</p>

              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img src={image} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="remove-btn"
                        data-testid={`remove-image-${index}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                className="flex-1"
                data-testid="cancel-button"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#D4AF37] hover:bg-[#B4941F]"
                data-testid="save-product-button"
              >
                {editingProduct ? 'Atualizar' : 'Criar'} Produto
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminDashboard;
