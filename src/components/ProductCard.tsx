import React from 'react';
import { Product } from '../types';
import { Heart, Star, Zap, ShoppingCart, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  isFavorite: boolean;
  onToggleFavorite: (productId: string, e: React.MouseEvent) => void;
  highContrast: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
  highContrast
}) => {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={() => onSelect(product)}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col h-full border focus-within:ring-2 focus-within:ring-yellow-400 ${
        highContrast
          ? 'bg-black text-yellow-300 border-2 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
          : 'bg-white text-slate-800 border-slate-200 shadow-sm hover:shadow-xl'
      }`}
    >
      {/* Product image wrapper */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden flex items-center justify-center">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        
        {/* Favorite button */}
        <button
          onClick={(e) => onToggleFavorite(product.id, e)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow transition-transform hover:scale-110 active:scale-95 z-10 ${
            highContrast ? 'bg-zinc-900 border border-yellow-400 text-yellow-300' : 'bg-white/80 hover:bg-white text-slate-600'
          }`}
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start pointer-events-none z-10">
          {product.fullDelivery && (
            <span className={`flex items-center gap-1 text-[10px] font-black tracking-wider uppercase px-2 py-1 rounded-md shadow ${
              highContrast ? 'bg-yellow-400 text-black' : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
            }`}>
              <Zap className="w-3 h-3 fill-current animate-pulse" />
              FULL
            </span>
          )}
          {discountPercent > 0 && (
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md shadow ${
              highContrast ? 'bg-yellow-500 text-black' : 'bg-indigo-600 text-white'
            }`}>
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Condition tag */}
        <div className="absolute bottom-2 left-2 pointer-events-none">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
            highContrast ? 'bg-zinc-900 text-yellow-300 border border-yellow-500' : 'bg-slate-900/70 text-white backdrop-blur-sm'
          }`}>
            {product.condition === 'novo' ? 'Novo' : 'Usado'}
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 text-left">
        <div>
          {/* Seller micro info */}
          <p className={`text-[11px] mb-1 font-medium truncate ${highContrast ? 'text-yellow-400' : 'text-slate-400'}`}>
            Por {product.seller.name}
          </p>

          <h3 className={`font-semibold text-sm line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors ${
            highContrast ? 'group-hover:text-yellow-400' : 'text-slate-800'
          }`}>
            {product.title}
          </h3>
        </div>

        {/* Pricing & rating */}
        <div className="mt-auto space-y-2">
          {/* Rating */}
          <div className="flex items-center gap-1 text-xs">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className={`ml-1 font-bold ${highContrast ? 'text-yellow-300' : 'text-slate-700'}`}>{product.rating}</span>
            </div>
            <span className={`text-[11px] ${highContrast ? 'text-yellow-400/80' : 'text-slate-400'}`}>
              ({product.reviewsCount})
            </span>
          </div>

          {/* Price Block */}
          <div>
            {product.originalPrice && (
              <p className={`text-xs line-through font-medium ${highContrast ? 'text-yellow-400/70' : 'text-slate-400'}`}>
                R$ {product.originalPrice.toFixed(2)}
              </p>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-tight">
                R$ {product.price.toFixed(2)}
              </span>
            </div>
            <p className={`text-xs font-semibold mt-0.5 ${highContrast ? 'text-yellow-300' : 'text-emerald-600'}`}>
              em {product.installments.count}x de R$ {product.installments.amount.toFixed(2)} {product.installments.interestFree && 'sem juros'}
            </p>
          </div>

          {/* Shipping badge */}
          {product.freeShipping && (
            <p className={`text-[11px] font-extrabold ${highContrast ? 'text-yellow-400 underline' : 'text-emerald-600'} flex items-center gap-1`}>
              <Check className="w-3.5 h-3.5" /> Frete grátis
            </p>
          )}

          {/* Add to cart quick button */}
          <button
            onClick={(e) => onAddToCart(product, e)}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 ${
              highContrast
                ? 'bg-yellow-400 hover:bg-yellow-500 text-black font-black mt-2'
                : 'bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white mt-2 border border-indigo-100'
            }`}
            aria-label={`Adicionar ${product.title} ao carrinho`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Adicionar ao carrinho</span>
          </button>
        </div>
      </div>
    </div>
  );
};
