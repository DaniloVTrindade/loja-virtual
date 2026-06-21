import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Zap, Ticket } from 'lucide-react';
import { Coupon } from '../types';

interface BannerProps {
  coupons: Coupon[];
  onSelectCategory: (cat: string) => void;
  onOpenCoupons: () => void;
  highContrast: boolean;
}

export const BannerSlider: React.FC<BannerProps> = ({
  coupons,
  onSelectCategory,
  onOpenCoupons,
  highContrast
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Curadoria Tech Indigo White',
      subtitle: 'Poucos produtos, mais qualidade e ofertas reais',
      description: 'Smartphones, monitores e fones premium selecionados para validar demanda com margem e experiencia superior.',
      badge: 'Semana do Consumidor',
      badgeIcon: Zap,
      bgClass: 'from-indigo-900 via-indigo-800 to-purple-900',
      textHighClass: 'bg-black text-yellow-300 border-2 border-yellow-400',
      actionText: 'Ver Eletrônicos',
      actionCat: 'eletronicos',
      img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Experiencia VIP Indigo White',
      subtitle: 'Cupons exclusivos de ate R$ 50 OFF',
      description: 'Aproveite o cupom INDIGO10 ou FRETEGRATIS e garanta envios expressos com o selo FULL para todo o Brasil.',
      badge: 'Assinante Ativo',
      badgeIcon: Sparkles,
      bgClass: 'from-purple-900 via-violet-800 to-indigo-950',
      textHighClass: 'bg-zinc-950 text-yellow-300 border-2 border-yellow-400',
      actionText: 'Resgatar Cupons',
      actionCat: 'cupons',
      img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Casa, moda e rotina premium',
      subtitle: 'Selecao de produtos com entrega garantida',
      description: 'Cafeteiras 3-em-1, Jaquetas Puffer de Inverno e muito mais com garantia total de 30 dias para devolução.',
      badge: 'Moda & Lar',
      badgeIcon: Ticket,
      bgClass: 'from-indigo-950 via-purple-900 to-indigo-900',
      textHighClass: 'bg-black text-yellow-300 border-2 border-yellow-500',
      actionText: 'Ver Casa & Decoração',
      actionCat: 'casa',
      img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];
  const Icon = slide.badgeIcon;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${
        highContrast ? slide.textHighClass : `bg-gradient-to-r ${slide.bgClass} text-white`
      }`}>
        {/* Background decorative shine */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-300 via-indigo-600 to-transparent pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 p-6 md:p-12 relative z-10">
          {/* Left Text content */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase ${
              highContrast ? 'bg-yellow-400 text-black' : 'bg-white/20 text-purple-200 backdrop-blur-md border border-white/10'
            }`}>
              <Icon className="w-3.5 h-3.5" />
              <span>{slide.badge}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
              {slide.title}
            </h2>
            <p className={`text-lg md:text-2xl font-bold tracking-tight ${highContrast ? 'text-yellow-200' : 'text-purple-200'}`}>
              {slide.subtitle}
            </p>
            <p className={`text-sm md:text-base max-w-lg leading-relaxed ${highContrast ? 'text-yellow-300/90' : 'text-indigo-100'}`}>
              {slide.description}
            </p>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  if (slide.actionCat === 'cupons') {
                    onOpenCoupons();
                  } else {
                    onSelectCategory(slide.actionCat);
                  }
                }}
                className={`px-8 py-4 rounded-2xl font-black text-sm transition-all transform active:scale-95 shadow-lg focus:ring-4 focus:ring-yellow-400 outline-none ${
                  highContrast 
                    ? 'bg-yellow-400 text-black hover:bg-yellow-500 ring-2 ring-white' 
                    : 'bg-white text-indigo-900 hover:bg-indigo-50 shadow-indigo-500/20'
                }`}
              >
                {slide.actionText} →
              </button>
              
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-3 py-2 rounded-xl border ${
                  highContrast ? 'border-yellow-400 text-yellow-300' : 'bg-black/20 border-white/10 text-indigo-100'
                }`}>
                  🎫 Use o cupom: <strong className="font-mono text-yellow-300">{coupons[0]?.code}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right Image overlay */}
          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="relative aspect-video lg:aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 transform rotate-1 group hover:rotate-0 transition-transform duration-300">
              <img
                src={slide.img}
                alt={slide.title}
                className="w-full h-full object-cover object-center filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-3 text-white text-xs border border-white/10 flex items-center justify-between">
                <div>
                  <p className="font-bold text-yellow-300">Selo FULL de Entrega</p>
                  <p className="text-[10px] text-slate-300">Compra garantida com 30 dias de teste</p>
                </div>
                <div className="bg-emerald-500 text-white font-black text-[10px] px-2 py-1 rounded">
                  ATIVO
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className={`absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full backdrop-blur-md transition-colors ${
            highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-black/30 hover:bg-black/50 text-white border border-white/20'
          }`}
          aria-label="Banner anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full backdrop-blur-md transition-colors ${
            highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-black/30 hover:bg-black/50 text-white border border-white/20'
          }`}
          aria-label="Próximo banner"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === idx 
                  ? (highContrast ? 'bg-yellow-400 w-8' : 'bg-yellow-300 w-8') 
                  : 'bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Ir para slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
