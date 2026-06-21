import React, { useState } from 'react';
import { Product, Question } from '../types';
import { Star, Zap, ShoppingCart, CreditCard, ShieldCheck, Heart, MapPin, Check, MessageCircle, ArrowLeft, Award, Package, Truck } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onBuyNow: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (productId: string, e: React.MouseEvent) => void;
  highContrast: boolean;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onBack,
  onAddToCart,
  onBuyNow,
  isFavorite,
  onToggleFavorite,
  highContrast
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [cepInput, setCepInput] = useState('');
  const [shippingSimulation, setShippingSimulation] = useState<{ price: string; date: string } | null>(null);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [questionsList, setQuestionsList] = useState<Question[]>(product.questions);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleSimulateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (cepInput.trim().length >= 8) {
      setShippingSimulation({
        price: product.freeShipping ? 'Grátis (Plano VIP Índigo / FULL)' : 'R$ 14,90',
        date: 'Chega entre amanhã e sexta-feira'
      });
    }
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestionText.trim()) {
      const newQ: Question = {
        id: `q-${Date.now()}`,
        user: 'Você (Usuário)',
        question: newQuestionText,
        date: 'Agora mesmo',
      };
      setQuestionsList([newQ, ...questionsList]);
      setNewQuestionText('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Back navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a busca</span>
        </button>
        <span className={`text-xs font-semibold capitalize ${highContrast ? 'text-yellow-400' : 'text-slate-500'}`}>
          Mercado Índigo {'>'} {product.category} {'>'} {product.brand}
        </span>
      </div>

      {/* Main product wrapper */}
      <div className={`rounded-3xl border p-6 md:p-10 shadow-xl ${
        highContrast ? 'bg-black text-yellow-300 border-2 border-yellow-400' : 'bg-white text-slate-800 border-slate-200'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Images Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[500px] pr-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? (highContrast ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-indigo-600 shadow')
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative aspect-square bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
              <img
                src={product.images[activeImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                {product.fullDelivery && (
                  <span className={`flex items-center gap-1 text-xs font-black tracking-wider uppercase px-3 py-1.5 rounded-lg shadow-md ${
                    highContrast ? 'bg-yellow-400 text-black' : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                  }`}>
                    <Zap className="w-4 h-4 fill-current animate-pulse" />
                    FULL
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className={`text-xs font-black px-3 py-1 rounded-lg shadow-md ${
                    highContrast ? 'bg-yellow-500 text-black' : 'bg-indigo-600 text-white'
                  }`}>
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Buy Box & Product Details */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 text-left">
            <div>
              {/* Condition & sales mock */}
              <div className="flex items-center justify-between text-xs mb-2 opacity-80">
                <span>{product.condition === 'novo' ? 'Novo' : 'Usado'} | +500 vendidos</span>
                <button
                  onClick={(e) => onToggleFavorite(product.id, e)}
                  className={`p-2 rounded-full border transition-transform hover:scale-110 active:scale-95 ${
                    highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                  aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                {product.title}
              </h1>

              {/* Rating aggregate */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-sm font-bold">{product.rating}</span>
                <span className={`text-xs ${highContrast ? 'text-yellow-400' : 'text-slate-500'}`}>
                  ({product.reviewsCount} avaliações)
                </span>
              </div>

              {/* Price section */}
              <div className="mt-6">
                {product.originalPrice && (
                  <p className={`text-sm line-through ${highContrast ? 'text-yellow-400/70' : 'text-slate-400'}`}>
                    R$ {product.originalPrice.toFixed(2)}
                  </p>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tight">
                    R$ {product.price.toFixed(2)}
                  </span>
                </div>
                <p className={`text-sm font-bold mt-1 ${highContrast ? 'text-yellow-300' : 'text-emerald-600'}`}>
                  em {product.installments.count}x de R$ {product.installments.amount.toFixed(2)} {product.installments.interestFree && 'sem juros'}
                </p>

                <button
                  onClick={() => setShowPaymentModal(!showPaymentModal)}
                  className={`text-xs font-semibold mt-2 underline block ${highContrast ? 'text-yellow-300' : 'text-indigo-600'}`}
                >
                  Ver todos os meios de pagamento
                </button>

                {/* Simulated payment breakdown box */}
                {showPaymentModal && (
                  <div className={`mt-3 p-4 rounded-2xl border text-xs space-y-3 ${highContrast ? 'bg-zinc-900 border-yellow-400' : 'bg-slate-50 border-slate-200'}`}>
                    <p className="font-bold text-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-indigo-500" />
                      Meios de Pagamento Disponíveis
                    </p>
                    <div className="space-y-1">
                      <p className="font-bold text-emerald-600">Pix: R$ {product.price.toFixed(2)} (Aprovação imediata)</p>
                      <p>Cartão de Crédito em até 12x sem juros</p>
                      <p>Boleto Bancário (1 a 2 dias úteis para aprovação)</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping CEP calculation */}
              <div className={`mt-6 p-4 rounded-2xl border space-y-3 ${highContrast ? 'bg-zinc-900 border-yellow-400' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-emerald-600">
                      Chega grátis com o VIP Índigo
                    </p>
                    <p className={`text-xs ${highContrast ? 'text-yellow-300' : 'text-slate-500'}`}>
                      Benefício ativado para seu nível. Envio imediato do centro FULL.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSimulateShipping} className="flex gap-2 pt-2 border-t border-slate-200/60">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={cepInput}
                      onChange={(e) => setCepInput(e.target.value)}
                      placeholder="Calcular prazo (ex: 01310-100)"
                      className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                        highContrast ? 'bg-black border-yellow-400 text-yellow-300 placeholder-yellow-500' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    Calcular
                  </button>
                </form>

                {shippingSimulation && (
                  <div className="text-xs p-3 bg-emerald-50 text-emerald-950 rounded-xl border border-emerald-200 space-y-1">
                    <p className="font-bold">Frete: {shippingSimulation.price}</p>
                    <p>{shippingSimulation.date}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions: Buy Now & Add to Cart */}
            <div className="space-y-3 pt-4">
              <button
                onClick={() => onBuyNow(product)}
                className={`w-full py-4 px-6 rounded-2xl font-black text-base shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                  highContrast
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-black ring-2 ring-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Comprar Agora</span>
              </button>

              <button
                onClick={(e) => onAddToCart(product, e)}
                className={`w-full py-4 px-6 rounded-2xl font-black text-sm transition-all transform active:scale-95 flex items-center justify-center gap-2 border ${
                  highContrast
                    ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Adicionar ao carrinho</span>
              </button>
            </div>

            {/* Micro assurances */}
            <div className={`pt-4 border-t space-y-2 text-xs ${highContrast ? 'text-yellow-400 border-yellow-500/50' : 'text-slate-500 border-slate-100'}`}>
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span><strong className="font-bold">Compra Garantida:</strong> Receba o produto que está esperando ou devolvemos seu dinheiro.</span>
              </p>
              <p className="flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-600 shrink-0" />
                <span><strong className="font-bold">Devolução Grátis:</strong> Você tem 30 dias a partir da data de recebimento.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Details Section: Seller info, Description, Attributes, Q&A */}
        <div className="mt-12 pt-12 border-t border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
          {/* Left: Description & Specs */}
          <div className="lg:col-span-8 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-xl font-bold mb-4">Descrição do Produto</h2>
              <p className={`text-sm leading-relaxed whitespace-pre-line ${highContrast ? 'text-yellow-300' : 'text-slate-700'}`}>
                {product.description}
              </p>
            </div>

            {/* Specification Table */}
            <div>
              <h2 className="text-xl font-bold mb-4">Características Principais</h2>
              <div className={`rounded-2xl border overflow-hidden ${highContrast ? 'border-yellow-400' : 'border-slate-200'}`}>
                <table className="w-full text-xs md:text-sm">
                  <tbody>
                    {Object.entries(product.attributes).map(([key, value], idx) => (
                      <tr key={key} className={`border-b last:border-b-0 ${
                        idx % 2 === 0
                          ? (highContrast ? 'bg-zinc-900' : 'bg-slate-50')
                          : (highContrast ? 'bg-black' : 'bg-white')
                      }`}>
                        <td className="py-3 px-4 font-bold w-1/3 border-r border-slate-200/50">{key}</td>
                        <td className="py-3 px-4">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Q&A Section */}
            <div>
              <h2 className="text-xl font-bold mb-4">Perguntas e Respostas</h2>
              
              {/* Ask Input */}
              <form onSubmit={handleAskQuestion} className="mb-6">
                <label className="block text-xs font-bold mb-2">Qual informação você precisa?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Escreva sua pergunta ou dúvida..."
                    className={`flex-1 px-4 py-3 rounded-xl text-xs md:text-sm border focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                      highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300 placeholder-yellow-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                  <button
                    type="submit"
                    className={`px-6 py-3 rounded-xl font-bold text-xs transition-all ${
                      highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    Perguntar
                  </button>
                </div>
              </form>

              {/* Questions List */}
              <div className="space-y-4">
                {questionsList.length === 0 ? (
                  <p className="text-xs opacity-70 italic">Nenhuma pergunta feita ainda. Seja o primeiro a perguntar!</p>
                ) : (
                  questionsList.map((q) => (
                    <div key={q.id} className={`p-4 rounded-2xl border space-y-2 ${highContrast ? 'bg-zinc-900 border-yellow-500/50' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <MessageCircle className="w-4 h-4 text-indigo-600" />
                        <span>{q.question}</span>
                      </div>
                      {q.answer ? (
                        <div className="pl-6 border-l-2 border-slate-300 py-1 text-xs space-y-1">
                          <p className={`font-medium ${highContrast ? 'text-yellow-300' : 'text-slate-700'}`}>{q.answer}</p>
                          <span className="text-[10px] opacity-70">Respondido em {q.answeredDate}</span>
                        </div>
                      ) : (
                        <p className="pl-6 text-[11px] opacity-70 italic">O vendedor responderá em breve.</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Reviews list */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Opiniões dos Compradores</h2>
                <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
                  ★ {product.rating} de 5
                </span>
              </div>

              <div className="space-y-4">
                {product.reviews.length === 0 ? (
                  <p className="text-xs opacity-70 italic">Nenhuma avaliação cadastrada no momento.</p>
                ) : (
                  product.reviews.map((r) => (
                    <div key={r.id} className={`p-4 rounded-2xl border space-y-2 ${highContrast ? 'bg-zinc-900 border-yellow-500/50' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                            {r.user[0]}
                          </div>
                          <span className="text-xs font-bold">{r.user}</span>
                        </div>
                        <span className="text-[10px] opacity-70">{r.date}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: r.rating }).map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className={`text-xs leading-relaxed ${highContrast ? 'text-yellow-300' : 'text-slate-700'}`}>
                        {r.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Seller Info Box */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`p-6 rounded-3xl border space-y-4 shadow-sm ${highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-base">{product.seller.name}</p>
                  <p className="text-xs opacity-80 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {product.seller.location}
                  </p>
                </div>
              </div>

              {product.seller.badge && (
                <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 shadow-sm">
                  <Check className="w-4 h-4 text-yellow-400" />
                  <span>{product.seller.badge}</span>
                </div>
              )}

              {/* Reputation bar */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold opacity-80">Reputação do Vendedor</p>
                <div className="grid grid-cols-5 gap-1 h-2.5 rounded-full overflow-hidden bg-slate-200">
                  <div className="bg-red-500 opacity-20"></div>
                  <div className="bg-orange-500 opacity-20"></div>
                  <div className="bg-yellow-500 opacity-20"></div>
                  <div className="bg-lime-500 opacity-20"></div>
                  <div className="bg-emerald-500"></div>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="text-center">
                    <p className="font-extrabold text-sm">{product.seller.salesCount}</p>
                    <p className="opacity-70 text-[10px]">Vendas concluídas</p>
                  </div>
                  <div className="text-center">
                    <p className="font-extrabold text-sm text-emerald-600">99%</p>
                    <p className="opacity-70 text-[10px]">Entregas no prazo</p>
                  </div>
                  <div className="text-center">
                    <p className="font-extrabold text-sm text-indigo-600">★ {product.seller.rating}</p>
                    <p className="opacity-70 text-[10px]">Nota média</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
