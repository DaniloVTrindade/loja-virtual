import { ManagerProfile, Product, StorePolicy, UserProfile, Coupon, Order } from '../types';

export const CATEGORIES = [
  { id: 'eletronicos', name: 'Eletrônicos', icon: 'Smartphone' },
  { id: 'moda', name: 'Moda & Acessórios', icon: 'Shirt' },
  { id: 'casa', name: 'Casa & Decoração', icon: 'Home' },
  { id: 'esportes', name: 'Esportes & Lazer', icon: 'Activity' },
  { id: 'automotivo', name: 'Automotivo', icon: 'Car' },
  { id: 'brinquedos', name: 'Brinquedos', icon: 'Gamepad2' },
  { id: 'supermercado', name: 'Supermercado', icon: 'ShoppingBasket' },
  { id: 'livros', name: 'Livros & Cultura', icon: 'BookOpen' },
];

export const MOCK_COUPONS: Coupon[] = [
  { code: 'INDIGO10', discountPercent: 10, minSpend: 100, description: '10% OFF em todo o site (acima de R$ 100)', expiresIn: 'Expira hoje às 23:59' },
  { code: 'FRETEGRATIS', discountFixed: 25, minSpend: 150, description: 'R$ 25 de desconto no Frete (acima de R$ 150)', expiresIn: 'Expira em 3 dias' },
  { code: 'MEGA50', discountFixed: 50, minSpend: 300, description: 'R$ 50 OFF para compras acima de R$ 300', expiresIn: 'Exclusivo VIP Índigo' },
];

export const INITIAL_USER: UserProfile = {
  id: 'client-1',
  role: 'client',
  name: 'Mariana Pires',
  email: 'mariana.pires@indigo.me',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  walletBalance: 845.20,
  walletEarnings: 12.45,
  tier: 'VIP Índigo',
  savedAddresses: [
    'Rua das Hortênsias, 420 - Apto 32 - Jardim Botânico, Curitiba - PR, 80210-210',
    'Av. Paulista, 1000 - Conjunto 14 - Bela Vista, São Paulo - SP, 01310-100'
  ],
  favoriteIds: ['prod-1', 'prod-4']
};

export const MANAGERS: ManagerProfile[] = [
  {
    id: 'manager-1',
    name: 'Danilo',
    email: 'danilo@indigowhite.com.br',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'manager',
    permissions: ['dashboard', 'products', 'orders', 'prices', 'policies', 'ai'],
    lastAccess: 'Hoje, 09:12'
  },
  {
    id: 'manager-2',
    name: 'Alexsander',
    email: 'alexsander@indigowhite.com.br',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'manager',
    permissions: ['dashboard', 'products', 'orders', 'prices', 'policies', 'ai'],
    lastAccess: 'Hoje, 08:40'
  },
  {
    id: 'manager-3',
    name: 'Jander',
    email: 'jander@indigowhite.com.br',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    role: 'manager',
    permissions: ['dashboard', 'products', 'orders', 'prices', 'policies', 'ai'],
    lastAccess: 'Ontem, 18:21'
  },
  {
    id: 'manager-4',
    name: 'David',
    email: 'david@indigowhite.com.br',
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=150&auto=format&fit=crop&q=80',
    role: 'manager',
    permissions: ['dashboard', 'products', 'orders', 'prices', 'policies', 'ai'],
    lastAccess: 'Ontem, 16:05'
  },
  {
    id: 'manager-5',
    name: 'Benny',
    email: 'benny@indigowhite.com.br',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    role: 'manager',
    permissions: ['dashboard', 'products', 'orders', 'prices', 'policies', 'ai'],
    lastAccess: '20 Jun, 07:55'
  }
];

export const STORE_POLICIES: StorePolicy[] = [
  {
    slug: 'terms',
    title: 'Termos de uso',
    updatedAt: '20/06/2026',
    sections: [
      { heading: 'Uso da loja', body: 'Ao navegar e comprar na Indigo White, o cliente concorda em fornecer dados corretos, respeitar os fluxos de compra e utilizar a plataforma apenas para fins licitos.' },
      { heading: 'Pedidos e pagamentos', body: 'Pedidos ficam sujeitos a confirmacao de pagamento, disponibilidade de estoque e analise antifraude. Pix, boleto e cartao aparecem no checkout como meios suportados no prototipo.' },
      { heading: 'Conta do cliente', body: 'O cliente pode acessar pedidos, favoritos, enderecos e comunicacoes da loja. A conta e pessoal e deve ser protegida pelo titular.' }
    ]
  },
  {
    slug: 'privacy',
    title: 'Politica de privacidade',
    updatedAt: '20/06/2026',
    sections: [
      { heading: 'Dados coletados', body: 'Coletamos dados de cadastro, contato, endereco, historico de compras e preferencias para processar pedidos e melhorar a experiencia.' },
      { heading: 'Finalidade', body: 'Os dados sao usados para entrega, atendimento, prevencao a fraude, emails automaticos e recomendacoes de produtos.' },
      { heading: 'Controle do cliente', body: 'O cliente pode solicitar revisao, correcao ou exclusao de dados pelos canais de atendimento da loja.' }
    ]
  },
  {
    slug: 'returns',
    title: 'Troca e devolucao',
    updatedAt: '20/06/2026',
    sections: [
      { heading: 'Arrependimento', body: 'Compras podem ser devolvidas em ate 7 dias corridos apos o recebimento, conforme o Codigo de Defesa do Consumidor.' },
      { heading: 'Produto com defeito', body: 'Produtos com defeito serao analisados pela loja. Quando confirmado, o cliente pode escolher troca, reparo ou reembolso conforme a politica aplicavel.' },
      { heading: 'Como solicitar', body: 'A solicitacao deve ser aberta pelo perfil do cliente, informando pedido, motivo, fotos e preferencia de atendimento.' }
    ]
  },
  {
    slug: 'legal',
    title: 'Aviso legal',
    updatedAt: '20/06/2026',
    sections: [
      { heading: 'Informacoes da loja', body: 'Indigo White e uma marca em estruturacao. Dados fiscais, CNPJ e endereco definitivo devem ser preenchidos quando a empresa for formalizada.' },
      { heading: 'Conteudo e imagens', body: 'Imagens de demonstracao sao usadas no prototipo para representar categorias e produtos. Na operacao real, a loja deve usar imagens autorizadas.' },
      { heading: 'Limitacao do prototipo', body: 'Pagamentos, nota fiscal, antifraude, rastreio e IA aparecem como experiencia funcional simulada ate a integracao com servicos reais.' }
    ]
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Smartphone Índigo M1 Ultra 5G 256GB 12GB RAM Câmera Triple 108MP',
    price: 2499.00,
    originalPrice: 3299.00,
    installments: { count: 12, amount: 208.25, interestFree: true },
    freeShipping: true,
    fullDelivery: true,
    category: 'eletronicos',
    brand: 'Índigo Tech',
    condition: 'novo',
    stock: 25,
    rating: 4.8,
    reviewsCount: 142,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574274902120-e2b8344fbe3f?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Experimente a revolução da tecnologia com o novo Smartphone Índigo M1 Ultra 5G. Equipado com processador octa-core de última geração, 12GB de RAM para multitarefas sem engasgos e armazenamento gigante de 256GB. Sua tela AMOLED de 6.7" com 120Hz oferece fluidez imbatível. Perfeito para fotos noturnas com sensor de 108MP.',
    attributes: {
      'Tamanho da tela': '6.7 polegadas',
      'Resolução': '2712 x 1220 px (FHD+)',
      'Memória RAM': '12 GB',
      'Armazenamento': '256 GB',
      'Bateria': '5000 mAh com Carga Rápida 67W',
      'Câmera traseira principal': '108 Mpx + 8 Mpx + 2 Mpx',
      'Câmera frontal': '32 Mpx',
      'Sistema Operacional': 'Android 14 (ÍndigoOS)'
    },
    seller: {
      id: 'seller-1',
      name: 'Índigo Oficial',
      reputation: 'excelente',
      salesCount: 15890,
      rating: 4.9,
      location: 'São Paulo, SP',
      badge: 'Loja Oficial'
    },
    reviews: [
      { id: 'rev-1', user: 'Carlos Silva', rating: 5, date: '12 Fev 2026', comment: 'Aparelho espetacular! Câmera muito nítida e a bateria dura mais de um dia inteiro tranquilamente.', helpful: 15 },
      { id: 'rev-2', user: 'Fernanda Lima', rating: 5, date: '08 Fev 2026', comment: 'Chegou no dia seguinte pelo envio FULL. O design na cor violeta escuro é o mais bonito que já vi.', helpful: 8 },
      { id: 'rev-3', user: 'Marcos Vinicius', rating: 4, date: '25 Jan 2026', comment: 'Muito rápido, excelente tela. Apenas o carregador é um pouco pesado, mas carrega em 30 minutos.', helpful: 3 }
    ],
    questions: [
      { id: 'q-1', user: 'Renata Castro', question: 'Possui entrada para dois chips sim?', answer: 'Olá, Renata! Sim, o aparelho possui suporte para Dual SIM (Nano SIM) + eSIM simultâneos.', date: '10 Fev 2026', answeredDate: '10 Fev 2026' },
      { id: 'q-2', user: 'Rodrigo Santoro', question: 'Vem com película e capinha na caixa?', answer: 'Sim! Acompanha capinha transparente reforçada e película pré-aplicada de fábrica.', date: '04 Fev 2026', answeredDate: '05 Fev 2026' }
    ],
    featured: true,
    todayOffer: true
  },
  {
    id: 'prod-2',
    title: 'Fone de Ouvido Bluetooth Anima Sound Pro ANC Com Cancelamento de Ruído',
    price: 349.90,
    originalPrice: 599.90,
    installments: { count: 10, amount: 34.99, interestFree: true },
    freeShipping: true,
    fullDelivery: true,
    category: 'eletronicos',
    brand: 'Anima',
    condition: 'novo',
    stock: 48,
    rating: 4.7,
    reviewsCount: 89,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Isole-se do mundo e mergulhe no som cristalino dos Fones Anima Sound Pro. Com cancelamento ativo de ruído (ANC) híbrido de até 40dB e drivers dinâmicos de 40mm para graves imersivos. Design dobrável e ergonômico com almofadas de espuma com memória.',
    attributes: {
      'Tecnologia sem fio': 'Bluetooth 5.3',
      'Duração da Bateria': 'Até 35 horas com ANC ligado',
      'Cancelamento de ruído': 'Sim (ANC Inteligente)',
      'Microfone embutido': 'Sim, 4 microfones com ENC para chamadas',
      'Tempo de carregamento': '2 horas (USB-C)'
    },
    seller: {
      id: 'seller-2',
      name: 'Eletrônicos Barato SP',
      reputation: 'excelente',
      salesCount: 4320,
      rating: 4.8,
      location: 'Campinas, SP',
    },
    reviews: [
      { id: 'rev-4', user: 'Paulo Rocha', rating: 5, date: '01 Mar 2026', comment: 'Incrível o isolamento acústico! Trabalho num escritório barulhento e mudou minha vida.', helpful: 12 },
      { id: 'rev-5', user: 'Alice Martins', rating: 4, date: '18 Fev 2026', comment: 'Ótima qualidade de som e bem confortável. Só esquenta um pouco as orelhas no calor.', helpful: 5 }
    ],
    questions: [
      { id: 'q-3', user: 'Guilherme', question: 'Funciona perfeitamente no iPhone e Mac?', answer: 'Sim, Guilherme! Conexão universal com iOS, macOS, Android e Windows via Bluetooth 5.3.', date: '20 Fev 2026', answeredDate: '20 Fev 2026' }
    ],
    featured: true,
    todayOffer: true
  },
  {
    id: 'prod-3',
    title: 'Jaqueta Puffer Almofadada Masculina Impermeável Inverno Premium',
    price: 189.90,
    originalPrice: 289.90,
    installments: { count: 6, amount: 31.65, interestFree: true },
    freeShipping: true,
    fullDelivery: false,
    category: 'moda',
    brand: 'Vibe Fashion',
    condition: 'novo',
    stock: 15,
    rating: 4.5,
    reviewsCount: 54,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Jaqueta Puffer com forro acolchoado térmico, ideal para dias muito frios ou garoa leve. Confeccionada em náilon resinado repelente à água, fechamento frontal por zíper tratorado e gola alta. Possui bolsos laterais e bolso interno seguro para carteira ou celular.',
    attributes: {
      'Gênero': 'Masculino',
      'Material Principal': '100% Poliéster Premium',
      'Impermeabilidade': 'Resistente a água (chuva leve)',
      'Bolsos': '2 externos com zíper, 1 interno',
      'Indicação': 'Inverno, Motociclismo, Dia a dia'
    },
    seller: {
      id: 'seller-3',
      name: 'Moda Prime Outlet',
      reputation: 'bom',
      salesCount: 1840,
      rating: 4.6,
      location: 'Curitiba, PR'
    },
    reviews: [
      { id: 'rev-6', user: 'Thiago Mendes', rating: 5, date: '22 Fev 2026', comment: 'Jaqueta veste super bem, peguei o tamanho G e ficou na medida. Esquece o frio com ela!', helpful: 4 }
    ],
    questions: [
      { id: 'q-4', user: 'Bruno Alves', question: 'Tenho 1.82m e 85kg, qual tamanho recomenda?', answer: 'Olá Bruno! Para o seu porte, sugerimos o tamanho GG para ficar confortável caso use blusa grossa por baixo.', date: '15 Fev 2026', answeredDate: '15 Fev 2026' }
    ],
    featured: false
  },
  {
    id: 'prod-4',
    title: 'Monitor Ultrawide 34" Curvo Gamer IPS 165Hz QHD 1ms AMD FreeSync Premium',
    price: 3299.00,
    originalPrice: 3899.00,
    installments: { count: 12, amount: 274.91, interestFree: true },
    freeShipping: true,
    fullDelivery: true,
    category: 'eletronicos',
    brand: 'VisionTech',
    condition: 'novo',
    stock: 8,
    rating: 4.9,
    reviewsCount: 78,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Imersão absoluta para seus games e ganho brutal de produtividade. Monitor de 34 polegadas no formato 21:9 Ultrawide, curvatura 1500R suave para os olhos, taxa de atualização ultrarrápida de 165Hz e resolução impecável QuadHD (3440x1440px).',
    attributes: {
      'Resolução': 'Quad HD 3440 x 1440 px',
      'Taxa de atualização': '165 Hz',
      'Tempo de resposta': '1 ms (GTG)',
      'Painel': 'IPS com HDR 400',
      'Conectividade': '2x DisplayPort 1.4, 2x HDMI 2.0, 1x Áudio out'
    },
    seller: {
      id: 'seller-1',
      name: 'Índigo Oficial',
      reputation: 'excelente',
      salesCount: 15890,
      rating: 4.9,
      location: 'São Paulo, SP',
      badge: 'Loja Oficial'
    },
    reviews: [
      { id: 'rev-7', user: 'Ricardo Melo', rating: 5, date: '10 Mar 2026', comment: 'Espetáculo de monitor. A curvatura torna o uso diário muito agradável, e para simulação de corrida é incrível.', helpful: 19 }
    ],
    questions: [],
    featured: true
  },
  {
    id: 'prod-5',
    title: 'Cafeteira Expresso Multicápsulas 3 em 1 (Compatível Nespresso e Dolce Gusto)',
    price: 499.00,
    originalPrice: 699.00,
    installments: { count: 10, amount: 49.90, interestFree: true },
    freeShipping: true,
    fullDelivery: true,
    category: 'casa',
    brand: 'MultiCoffee',
    condition: 'novo',
    stock: 32,
    rating: 4.6,
    reviewsCount: 110,
    images: [
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Nunca mais fique limitado a uma única marca de café! A Cafeteira MultiCoffee acompanha 3 adaptadores originais para preparar cápsulas tipo Nespresso, Dolce Gusto e também pó de café comum. Bomba de pressão italiana de 19 bar que garante o expresso mais cremoso e aromático.',
    attributes: {
      'Pressão': '19 Bar',
      'Capacidade do reservatório': '800 ml',
      'Potência': '1450 W',
      'Voltagem': '110V ou 220V (Bivolt automático)',
      'Material': 'Aço Inox e Acrílico Preto'
    },
    seller: {
      id: 'seller-4',
      name: 'Eletro Casa Express',
      reputation: 'excelente',
      salesCount: 6510,
      rating: 4.8,
      location: 'Belo Horizonte, MG'
    },
    reviews: [
      { id: 'rev-8', user: 'Amanda Ribeiro', rating: 5, date: '04 Mar 2026', comment: 'Prática demais! Ter as 3 opções no mesmo aparelho liberou espaço na minha bancada. E sai super quente.', helpful: 7 }
    ],
    questions: [],
    featured: true,
    todayOffer: true
  },
  {
    id: 'prod-6',
    title: 'Tênis Esportivo Running Flutua Max Ultra Conforto Respirável',
    price: 229.90,
    originalPrice: 349.90,
    installments: { count: 6, amount: 38.31, interestFree: true },
    freeShipping: true,
    fullDelivery: true,
    category: 'esportes',
    brand: 'AeroStep',
    condition: 'novo',
    stock: 20,
    rating: 4.4,
    reviewsCount: 42,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Tecnologia de amortecimento Flutua Max que absorve até 85% do impacto nas passadas. Cabedal feito em malha tricô respirável sem costuras, adaptando-se ao formato do pé como uma meia. Solado com inserções de borracha antiderrapante.',
    attributes: {
      'Esportes indicados': 'Corrida, Academia, Caminhada leve',
      'Material': 'Mesh / Tecido Respirável',
      'Peso aproximado': '245g (tamanho 40)',
      'Garantia': '90 dias contra defeito de fabricação'
    },
    seller: {
      id: 'seller-5',
      name: 'Arena Sports Oficial',
      reputation: 'excelente',
      salesCount: 8990,
      rating: 4.7,
      location: 'Florianópolis, SC',
      badge: 'Loja Verificada'
    },
    reviews: [
      { id: 'rev-9', user: 'Sergio Miranda', rating: 5, date: '28 Fev 2026', comment: 'Tênis levíssimo e com um vermelho muito vibrante. Sensação de pisar nas nuvens.', helpful: 2 }
    ],
    questions: [],
    featured: false
  },
  {
    id: 'prod-7',
    title: 'Kit Jogo de Chaves e Ferramentas Cr-v Maleta Completa 142 Peças',
    price: 389.00,
    originalPrice: 489.00,
    installments: { count: 10, amount: 38.90, interestFree: true },
    freeShipping: true,
    fullDelivery: true,
    category: 'automotivo',
    brand: 'SteelPro',
    condition: 'novo',
    stock: 14,
    rating: 4.8,
    reviewsCount: 65,
    images: [
      'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'A solução definitiva para manutenções automotivas e reparos domésticos pesados. Maleta reforçada com catracas reversíveis de 1/2" e 1/4", soquetes normais e longos, chaves combinadas, alicates e bits diversos. Tudo fabricado em aço Cromo-Vanádio de altíssima durabilidade.',
    attributes: {
      'Quantidade de peças': '142 peças',
      'Material': 'Aço Cromo Vanádio (Cr-V)',
      'Estojo': 'Maleta termoplástica articulada com fechos de metal',
      'Peso': '7.2 kg'
    },
    seller: {
      id: 'seller-6',
      name: 'Mecânica Total Imports',
      reputation: 'excelente',
      salesCount: 3100,
      rating: 4.9,
      location: 'São Bernardo do Campo, SP'
    },
    reviews: [],
    questions: [],
    featured: false
  },
  {
    id: 'prod-8',
    title: 'Console Portátil Nitro Game Retro X IPS 64GB com 15.000 Jogos',
    price: 429.00,
    originalPrice: 599.00,
    installments: { count: 10, amount: 42.90, interestFree: true },
    freeShipping: true,
    fullDelivery: true,
    category: 'brinquedos',
    brand: 'RetroPlay',
    condition: 'novo',
    stock: 45,
    rating: 4.7,
    reviewsCount: 132,
    images: [
      'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Reviva a nostalgia dos fliperamas e dos consoles clássicos na palma da sua mão! Tela IPS de 3.5 polegadas de alta definição e ângulo de visão imbatível. Bateria com autonomia de 6 horas de diversão. Acompanha cartão de 64GB configurado com os grandes títulos dos anos 80, 90 e 2000.',
    attributes: {
      'Tela': '3.5 polegadas IPS OCA',
      'Armazenamento': 'Micro SD de 64 GB incluído',
      'Sistemas suportados': 'Mais de 25 emuladores clássicos',
      'Saída de Vídeo': 'Mini HDMI para jogar na TV',
      'Bateria': '3500 mAh recarregável via USB-C'
    },
    seller: {
      id: 'seller-2',
      name: 'Eletrônicos Barato SP',
      reputation: 'excelente',
      salesCount: 4320,
      rating: 4.8,
      location: 'Campinas, SP'
    },
    reviews: [
      { id: 'rev-10', user: 'Fabio Junior', rating: 5, date: '15 Fev 2026', comment: 'Melhor compra do ano! Roda ps1 e fliperama liso. A tela IPS faz muita diferença.', helpful: 11 }
    ],
    questions: [],
    featured: true,
    todayOffer: true
  },
  {
    id: 'prod-9',
    title: 'Kit Vinho Chileno Tinto Gran Reserva Valle del Colchagua 750ml (6 Garrafas)',
    price: 299.90,
    originalPrice: 420.00,
    installments: { count: 5, amount: 59.98, interestFree: true },
    freeShipping: true,
    fullDelivery: true,
    category: 'supermercado',
    brand: 'Santa Helena',
    condition: 'novo',
    stock: 18,
    rating: 4.9,
    reviewsCount: 45,
    images: [
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Seleção especial de vinhos tintos Cabernet Sauvignon Gran Reserva safra 2023. Estagiado por 12 meses em barricas de carvalho francês, traz notas marcantes de frutas negras maduras, pimenta e baunilha. Taninos elegantes e final persistente.',
    attributes: {
      'Tipo de vinho': 'Tinto Seco Gran Reserva',
      'País de origem': 'Chile (Valle del Colchagua)',
      'Teor Alcoólico': '13.8%',
      'Temperatura de serviço': '16°C a 18°C',
      'Harmonização': 'Carnes vermelhas assadas, queijos curados e massas condimentos'
    },
    seller: {
      id: 'seller-7',
      name: 'Adega Gourmet Prime',
      reputation: 'excelente',
      salesCount: 2240,
      rating: 4.9,
      location: 'Porto Alegre, RS'
    },
    reviews: [],
    questions: [],
    featured: false
  },
  {
    id: 'prod-10',
    title: 'Livro Hábitos Atômicos: Um Método Fácil e Comprovado para Quebrar Maus Hábitos',
    price: 49.90,
    originalPrice: 69.90,
    installments: { count: 1, amount: 49.90, interestFree: true },
    freeShipping: false,
    fullDelivery: true,
    category: 'livros',
    brand: 'Editora Alta Books',
    condition: 'novo',
    stock: 85,
    rating: 4.9,
    reviewsCount: 310,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Pequenas mudanças, resultados impressionantes. Se você tem dificuldade para mudar seus hábitos, o problema não é você, é o seu sistema. James Clear, um dos maiores especialistas mundiais no assunto, revela as estratégias práticas que o ensinarão, passo a passo, a criar bons hábitos e abandonar os ruins.',
    attributes: {
      'Autor': 'James Clear',
      'Formato': 'Capa Comum (Brochura)',
      'Número de páginas': '320 páginas',
      'Idioma': 'Português',
      'Editora': 'Alta Books'
    },
    seller: {
      id: 'seller-8',
      name: 'Livraria Leitura Direta',
      reputation: 'excelente',
      salesCount: 12500,
      rating: 4.9,
      location: 'São Paulo, SP'
    },
    reviews: [
      { id: 'rev-11', user: 'Beatriz Nogueira', rating: 5, date: '10 Mar 2026', comment: 'Leitura obrigatória para organizar a rotina. A entrega foi muito rápida.', helpful: 25 }
    ],
    questions: [],
    featured: false
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'PED-987452',
    date: '10 Fev 2026',
    items: [
      {
        product: MOCK_PRODUCTS[0], // Smartphone
        quantity: 1
      }
    ],
    total: 2499.00,
    shippingAddress: 'Rua das Hortênsias, 420 - Apto 32 - Jardim Botânico, Curitiba - PR, 80210-210',
    paymentMethod: 'pix',
    status: 'entregue',
    estimatedDelivery: '12 Fev 2026',
    trackingSteps: [
      { status: 'Pagamento aprovado', description: 'Pix confirmado via Mercado Pago', date: '10 Fev 2026 14:32', completed: true },
      { status: 'Pedido em separação', description: 'O vendedor está empacotando seu pedido no centro FULL', date: '10 Fev 2026 17:15', completed: true },
      { status: 'Em trânsito', description: 'O pacote saiu do centro de distribuição de Cajamar-SP', date: '11 Fev 2026 06:40', completed: true },
      { status: 'Entregue', description: 'Pacote recebido por Mariana Pires', date: '12 Fev 2026 15:20', completed: true },
    ]
  },
  {
    id: 'PED-102934',
    date: '12 Mar 2026',
    items: [
      {
        product: MOCK_PRODUCTS[4], // Cafeteira
        quantity: 1
      }
    ],
    total: 499.00,
    shippingAddress: 'Av. Paulista, 1000 - Conjunto 14 - Bela Vista, São Paulo - SP, 01310-100',
    paymentMethod: 'cartao',
    status: 'em_transito',
    estimatedDelivery: '16 Mar 2026',
    trackingSteps: [
      { status: 'Pagamento aprovado', description: 'Cartão Master final 4421 aprovado em 10x', date: '12 Mar 2026 09:10', completed: true },
      { status: 'Pedido em separação', description: 'Centro de distribuição FULL BH', date: '12 Mar 2026 13:40', completed: true },
      { status: 'Em trânsito', description: 'Transferência para unidade Cajamar-SP em andamento', date: '13 Mar 2026 04:12', completed: true },
      { status: 'Saiu para entrega', description: 'O entregador está a caminho do seu endereço', date: 'Pendente', completed: false },
    ]
  }
];

export const AI_FAQS = [
  { q: 'Como funciona o Frete Grátis no VIP Índigo?', a: 'Com o plano VIP Índigo (que já está ativado para você!), todos os produtos marcados com o selo FULL ou com valor acima de R$ 79 possuem frete grátis imediato para todo o Brasil.' },
  { q: 'É seguro pagar com Pix ou Cartão?', a: 'Sim! Nosso sistema utiliza tecnologia de ponta com garantia Mercado Pago. O dinheiro só é liberado para o vendedor após você receber e conferir o produto.' },
  { q: 'Posso devolver se me arrepender?', a: 'Claro! Você tem o programa Compra Garantida Índigo. Você pode devolver gratuitamente qualquer produto em até 30 dias após o recebimento, não importa o motivo.' },
  { q: 'Onde ajusto o tamanho da fonte ou contraste?', a: 'No menu flutuante de acessibilidade, ou clicando no ícone de Acessibilidade ♿ na barra superior do site. Lá você encontra botões para aumentar fonte, alto contraste e suporte para leitores de tela.' },
];
