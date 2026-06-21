import React, { useState } from 'react';
import { CartItem, Order, UserProfile, Coupon } from '../types';
import { Trash2, Plus, Minus, CreditCard, ArrowRight, ShieldCheck, CheckCircle2, Copy, AlertCircle, MapPin, Truck, Ticket, ArrowLeft, ExternalLink } from 'lucide-react';

interface CartCheckoutProps {
  cartItems: CartItem[];
  user: UserProfile;
  coupons: Coupon[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCompleteOrder: (order: Order) => void;
  onBackToShopping: () => void;
  highContrast: boolean;
}

export const CartCheckout: React.FC<CartCheckoutProps> = ({
  cartItems,
  user,
  coupons,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCompleteOrder,
  onBackToShopping,
  highContrast
}) => {
  const [step, setStep] = useState<'cart' | 'address' | 'payment' | 'confirmation'>('cart');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(user.savedAddresses[0] || '');
  const [shippingCost] = useState(0); // Free by default for VIP Indigo
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao' | 'boleto'>('pix');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4421');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [pixCopied, setPixCopied] = useState(false);

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discount = (subtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountFixed) {
      discount = appliedCoupon.discountFixed;
    }
  }

  const total = subtotal - discount + shippingCost;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const found = coupons.find((c) => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (found) {
      if (subtotal >= found.minSpend) {
        setAppliedCoupon(found);
        setCouponCode('');
      } else {
        setCouponError(`Este cupom exige compra mínima de R$ ${found.minSpend.toFixed(2)}`);
      }
    } else {
      setCouponError('Cupom inválido ou expirado');
    }
  };

  const handleFinalizePayment = () => {
    const newOrder: Order = {
      id: `PED-${Math.floor(100000 + Math.random() * 900000)}`,
      date: 'Agora mesmo',
      items: [...cartItems],
      total: total,
      shippingAddress: selectedAddress,
      paymentMethod: paymentMethod,
      status: paymentMethod === 'pix' ? 'pago' : paymentMethod === 'cartao' ? 'em_separacao' : 'pagamento_pendente',
      estimatedDelivery: 'Em até 2 dias úteis',
      trackingSteps: [
        { status: 'Pedido realizado', description: 'Recebemos seu pedido no sistema', date: 'Agora', completed: true },
        { status: 'Pagamento', description: paymentMethod === 'boleto' ? 'Aguardando compensação bancária' : 'Pagamento aprovado com sucesso', date: paymentMethod === 'boleto' ? 'Pendente' : 'Agora', completed: paymentMethod !== 'boleto' },
        { status: 'Em separação', description: 'Separação no centro de distribuição FULL', date: 'Pendente', completed: false },
        { status: 'Em trânsito', description: 'Transportadora parceira Índigo Express', date: 'Pendente', completed: false },
      ]
    };

    setCreatedOrder(newOrder);
    onCompleteOrder(newOrder);
    onClearCart();
    setStep('confirmation');
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText('00020126580014br.gov.bcb.pix0136indigo-pay@mercadopago.com.br5204000053039865802BR5925Mercado Indigo Marketplace6009SAO PAULO62070503***6304E2A1');
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  if (step === 'confirmation' && createdOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-left">
        <div className={`rounded-3xl border p-8 shadow-2xl space-y-8 ${
          highContrast ? 'bg-black text-yellow-300 border-2 border-yellow-400' : 'bg-white text-slate-800 border-slate-200'
        }`}>
          <div className="text-center space-y-3 pb-6 border-b border-slate-100">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h2 className="text-3xl font-black tracking-tight">Pedido Realizado com Sucesso!</h2>
            <p className={`text-sm ${highContrast ? 'text-yellow-400' : 'text-slate-500'}`}>
              Código do Pedido: <strong className="font-mono text-indigo-600 font-bold">{createdOrder.id}</strong>
            </p>
          </div>

          {/* Payment specific guidelines */}
          {createdOrder.paymentMethod === 'pix' && (
            <div className={`p-6 rounded-2xl border space-y-4 ${highContrast ? 'bg-zinc-900 border-yellow-400' : 'bg-indigo-50/60 border-indigo-200'}`}>
              <p className="font-bold text-base text-center">Escaneie o QR Code Pix para aprovação instantânea</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="w-40 h-40 bg-white p-3 rounded-2xl shadow border border-slate-200 flex flex-col items-center justify-center">
                  {/* Simulated QR code representation */}
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs text-center p-2 rounded-xl">
                    [ QR Code Pix Simulado ]
                  </div>
                </div>
                <div className="space-y-3 flex-1 max-w-sm text-center sm:text-left">
                  <p className="text-xs">Ou copie o código "Pix Copia e Cola" abaixo no aplicativo do seu banco:</p>
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 truncate">
                    <span>00020126580014br.gov.bcb.pix0136indigo-pay...</span>
                  </div>
                  <button
                    onClick={copyPixCode}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      pixCopied
                        ? 'bg-emerald-600 text-white'
                        : (highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-indigo-600 text-white hover:bg-indigo-700')
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                    <span>{pixCopied ? 'Código Copiado com Sucesso!' : 'Copiar Código Pix'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {createdOrder.paymentMethod === 'boleto' && (
            <div className="p-6 rounded-2xl border bg-amber-50 border-amber-200 text-amber-950 space-y-2 text-xs">
              <p className="font-bold text-sm">Boleto gerado com sucesso!</p>
              <p>O boleto vence em 3 dias úteis. A aprovação do pagamento ocorre em até 2 dias úteis após a compensação.</p>
              <button className="mt-2 bg-amber-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2.5 shadow">
                <ExternalLink className="w-4 h-4" />
                <span>Visualizar e Imprimir Boleto</span>
              </button>
            </div>
          )}

          {/* Tracking timeline */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Acompanhe seu pedido</h3>
            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {createdOrder.trackingSteps.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <div className={`absolute -left-[27px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 text-[10px] font-bold ${
                    step.completed
                      ? 'bg-emerald-500 text-white border-white shadow'
                      : 'bg-slate-200 text-slate-500 border-slate-300'
                  }`}>
                    {step.completed ? '✓' : idx + 1}
                  </div>
                  <div className="text-xs space-y-0.5">
                    <p className={`font-bold text-sm ${step.completed ? (highContrast ? 'text-yellow-300' : 'text-slate-900') : 'text-slate-400'}`}>
                      {step.status}
                    </p>
                    <p className={`opacity-80 ${highContrast ? 'text-yellow-400/80' : 'text-slate-500'}`}>{step.description}</p>
                    <span className="text-[10px] opacity-60 block">{step.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs opacity-80">
              <p className="font-bold">Endereço de Entrega:</p>
              <p>{createdOrder.shippingAddress}</p>
            </div>
            <button
              onClick={onBackToShopping}
              className={`px-8 py-3.5 rounded-2xl font-bold text-xs transition-all shadow-md ${
                highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-left">
      {/* Step Progress Bar */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between text-xs font-bold relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-10" />
          
          {[
            { id: 'cart', label: '1. Carrinho' },
            { id: 'address', label: '2. Entrega' },
            { id: 'payment', label: '3. Pagamento' },
          ].map((s) => {
            const isActive = step === s.id;
            return (
              <div key={s.id} className="flex flex-col items-center gap-2 bg-slate-50 px-3 py-1 rounded-full">
                <span className={`px-3 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? (highContrast ? 'bg-yellow-400 text-black ring-2 ring-white font-black' : 'bg-indigo-600 text-white shadow-md')
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: CART ITEMS */}
      {step === 'cart' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart list */}
          <div className="lg:col-span-8 space-y-4">
            <div className={`rounded-3xl border p-6 shadow-sm space-y-6 ${
              highContrast ? 'bg-black text-yellow-300 border-2 border-yellow-400' : 'bg-white text-slate-800 border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b pb-4 border-slate-100">
                <h2 className="text-xl font-bold tracking-tight">Meu Carrinho ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} itens)</h2>
                {cartItems.length > 0 && (
                  <button
                    onClick={onClearCart}
                    className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
                  >
                    Esvaziar Carrinho
                  </button>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="p-12 text-center space-y-4">
                  <p className="text-base font-bold opacity-80">Seu carrinho está vazio no momento.</p>
                  <p className="text-xs opacity-60">Aproveite as ofertas do Mercado Índigo e adicione produtos ao seu carrinho.</p>
                  <button
                    onClick={onBackToShopping}
                    className={`px-6 py-3 rounded-2xl font-bold text-xs transition-all ${
                      highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                    }`}
                  >
                    Explorar Produtos
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                        />
                        <div className="space-y-1">
                          <h3 className="font-bold text-sm line-clamp-2">{item.product.title}</h3>
                          <p className={`text-xs font-bold ${highContrast ? 'text-yellow-300' : 'text-indigo-600'}`}>
                            R$ {item.product.price.toFixed(2)} cada
                          </p>
                          <p className="text-[10px] text-emerald-600 font-bold">Entrega FULL com Frete Grátis</p>
                        </div>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 border border-slate-200 dark:border-zinc-700">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-extrabold text-sm min-w-[90px] text-right">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </span>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-50"
                          aria-label={`Remover ${item.product.title} do carrinho`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary & Coupons */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`rounded-3xl border p-6 space-y-6 shadow-sm ${
              highContrast ? 'bg-black text-yellow-300 border-2 border-yellow-400' : 'bg-white text-slate-800 border-slate-200'
            }`}>
              <h3 className="font-bold text-lg border-b pb-3 border-slate-100">Resumo da Compra</h3>

              {/* Coupon Form */}
              <div className="space-y-3">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Cupom (ex: INDIGO10)"
                      className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                        highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300 placeholder-yellow-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    Aplicar
                  </button>
                </form>

                {couponError && (
                  <p className="text-xs text-rose-500 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {couponError}
                  </p>
                )}

                {appliedCoupon && (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 text-emerald-950 rounded-xl border border-emerald-200 text-xs font-bold">
                    <span>🎟️ Cupom {appliedCoupon.code} ativado!</span>
                    <button onClick={() => setAppliedCoupon(null)} className="text-rose-500 hover:underline">
                      Remover
                    </button>
                  </div>
                )}
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-2.5 text-xs pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="opacity-80">Subtotal dos produtos</span>
                  <span className="font-bold">R$ {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Desconto do Cupom</span>
                    <span>- R$ {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="opacity-80">Frete (Entrega FULL)</span>
                  <span className="font-bold text-emerald-600">Grátis</span>
                </div>
                <div className="flex justify-between text-base font-black pt-3 border-t border-slate-100">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>

              {cartItems.length > 0 && (
                <button
                  onClick={() => setStep('address')}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-sm transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2 ${
                    highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500 ring-2 ring-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
                  }`}
                >
                  <span>Continuar para Entrega</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <div className="text-[11px] opacity-70 text-center flex items-center justify-center gap-1.5 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Ambiente 100% Seguro Mercado Pago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: SHIPPING ADDRESS */}
      {step === 'address' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className={`rounded-3xl border p-8 space-y-6 shadow-sm ${
            highContrast ? 'bg-black text-yellow-300 border-2 border-yellow-400' : 'bg-white text-slate-800 border-slate-200'
          }`}>
            <div className="flex items-center gap-3 border-b pb-4 border-slate-100">
              <MapPin className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-bold tracking-tight">Selecione o Endereço de Entrega</h2>
            </div>

            <div className="space-y-4">
              {user.savedAddresses.map((addr, idx) => (
                <label
                  key={idx}
                  className={`p-4 rounded-2xl border flex items-start gap-4 cursor-pointer transition-all ${
                    selectedAddress === addr
                      ? (highContrast ? 'bg-zinc-900 border-yellow-400 ring-2 ring-yellow-400' : 'bg-indigo-50 border-indigo-600 shadow-sm')
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress === addr}
                    onChange={() => setSelectedAddress(addr)}
                    className="mt-1 w-4 h-4 text-indigo-600 focus:ring-yellow-400"
                  />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-sm">Endereço Principal {idx + 1}</p>
                    <p className={`leading-relaxed ${highContrast ? 'text-yellow-200' : 'text-slate-600'}`}>{addr}</p>
                    <p className="text-[10px] text-emerald-600 font-bold pt-1">Envio FULL agendado para este endereço</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Delivery options */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                Opções de Frete Disponíveis
              </h3>
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-950 flex items-center justify-between text-xs font-bold">
                <div>
                  <p className="text-sm">Envio FULL VIP Índigo</p>
                  <p className="font-normal text-slate-600">Entregue por transportadora própria em até 2 dias úteis</p>
                </div>
                <span className="text-sm font-black text-emerald-600">GRÁTIS</span>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                onClick={() => setStep('cart')}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-xs transition-all border ${
                  highContrast ? 'bg-zinc-900 text-yellow-300 border-yellow-400' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao Carrinho</span>
              </button>
              <button
                onClick={() => setStep('payment')}
                className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg ${
                  highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
                }`}
              >
                <span>Ir para Pagamento</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: PAYMENT METHOD */}
      {step === 'payment' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className={`rounded-3xl border p-8 space-y-6 shadow-sm ${
            highContrast ? 'bg-black text-yellow-300 border-2 border-yellow-400' : 'bg-white text-slate-800 border-slate-200'
          }`}>
            <div className="flex items-center gap-3 border-b pb-4 border-slate-100">
              <CreditCard className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-bold tracking-tight">Como prefere pagar?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'pix', label: 'Pix', desc: 'Aprovação na hora (10% OFF em itens selecionados)' },
                { id: 'cartao', label: 'Cartão de Crédito', desc: 'Em até 12x sem juros' },
                { id: 'boleto', label: 'Boleto Bancário', desc: 'Aprovação em 1 a 2 dias úteis' },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 cursor-pointer transition-all ${
                    paymentMethod === m.id
                      ? (highContrast ? 'bg-zinc-900 border-yellow-400 ring-2 ring-yellow-400' : 'bg-indigo-50 border-indigo-600 shadow-sm')
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{m.label}</span>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === m.id}
                      onChange={() => setPaymentMethod(m.id as any)}
                      className="w-4 h-4 text-indigo-600 focus:ring-yellow-400"
                    />
                  </div>
                  <p className="text-xs opacity-80 leading-snug">{m.desc}</p>
                </label>
              ))}
            </div>

            {/* Simulated Card input if cartao */}
            {paymentMethod === 'cartao' && (
              <div className={`p-6 rounded-2xl border space-y-4 ${highContrast ? 'bg-zinc-900 border-yellow-400' : 'bg-slate-50 border-slate-200'}`}>
                <p className="font-bold text-sm">Dados do Cartão (Simulado)</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold block mb-1">Número do Cartão</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-xs border border-slate-300 bg-white text-slate-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold block mb-1">Validade</label>
                      <input type="text" placeholder="MM/AA" defaultValue="12/31" className="w-full px-4 py-2.5 rounded-xl text-xs border border-slate-300 bg-white text-slate-800" />
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-1">CVV</label>
                      <input type="text" placeholder="123" defaultValue="887" className="w-full px-4 py-2.5 rounded-xl text-xs border border-slate-300 bg-white text-slate-800" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Total recap & Finalize button */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs opacity-80">Total a pagar:</p>
                <p className="text-2xl font-black text-indigo-600 dark:text-yellow-300">
                  R$ {total.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setStep('address')}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-xs transition-all border ${
                    highContrast ? 'bg-zinc-900 text-yellow-300 border-yellow-400' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
                <button
                  onClick={handleFinalizePayment}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg ${
                    highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
                  }`}
                >
                  <span>Confirmar e Concluir Compra</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
