import { AssistantRequest, AssistantResponse, Product } from './types';

const MOCK_PRODUCTS: Record<string, Product[]> = {
  sintoma: [
    {
      id: 'p1',
      name: 'Paracetamol 500mg',
      description: 'Analgésico y antipirético para dolor y fiebre',
      price: 4.50,
      image: 'https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Medicamentos'
    },
    {
      id: 'p2',
      name: 'Ibuprofeno 400mg',
      description: 'Antiinflamatorio para dolor e inflamación',
      price: 5.20,
      image: 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Medicamentos'
    }
  ],
  recomendacion: [
    {
      id: 'p3',
      name: 'Vitamina C 1000mg',
      description: 'Suplemento vitamínico para el sistema inmune',
      price: 12.90,
      image: 'https://images.pexels.com/photos/3683095/pexels-photo-3683095.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Vitaminas'
    },
    {
      id: 'p4',
      name: 'Omega-3',
      description: 'Ácidos grasos esenciales para la salud cardiovascular',
      price: 18.50,
      image: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Suplementos'
    }
  ],
  alternativas: [
    {
      id: 'p5',
      name: 'Paracetamol Genérico 500mg',
      description: 'Alternativa económica - Mismo principio activo',
      price: 2.90,
      image: 'https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Genéricos'
    },
    {
      id: 'p6',
      name: 'Ibuprofeno Genérico 400mg',
      description: 'Alternativa económica - Misma efectividad',
      price: 3.50,
      image: 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Genéricos'
    }
  ],
  cosmetica: [
    {
      id: 'p7',
      name: 'Crema Hidratante Facial',
      description: 'Hidratación profunda 24h para todo tipo de piel',
      price: 18.50,
      image: 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Cosmética'
    },
    {
      id: 'p8',
      name: 'Protector Solar SPF 50',
      description: 'Protección máxima contra rayos UVA/UVB',
      price: 16.90,
      image: 'https://images.pexels.com/photos/1029896/pexels-photo-1029896.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Cosmética'
    }
  ]
};

const RESPONSES: Record<string, AssistantResponse> = {
  'tengo un síntoma': {
    texto: 'Entiendo que tienes algún síntoma. ¿Podrías describirme más en detalle qué es lo que sientes? Por ejemplo: dolor de cabeza, fiebre, dolor de garganta, malestar estomacal, etc. Mientras tanto, aquí te muestro algunos productos que suelen ser útiles para síntomas comunes:',
    productos: MOCK_PRODUCTS.sintoma
  },
  'quiero una recomendación': {
    texto: '¡Por supuesto! Basándome en las tendencias de salud y bienestar, te recomiendo estos productos que son muy populares entre nuestros clientes y tienen excelentes beneficios:',
    productos: MOCK_PRODUCTS.recomendacion
  },
  'ver alternativas más baratas': {
    texto: 'Perfecto, aquí te muestro alternativas más económicas con la misma efectividad. Estos productos genéricos contienen los mismos principios activos que las marcas conocidas pero a un precio más accesible:',
    productos: MOCK_PRODUCTS.alternativas
  },
  'ver mis pedidos': {
    texto: 'Claro, puedes ver todos tus pedidos en la sección de Historial. Allí encontrarás el estado de tus pedidos actuales y el historial completo de compras. ¿Te gustaría que te lleve allí o prefieres que te ayude con algo más?',
    productos: undefined
  },
  'ver promociones': {
    texto: 'Actualmente tenemos estas promociones activas que pueden interesarte:\n\n• 20% de descuento en toda la línea de vitaminas\n• 2x1 en protectores solares\n• 15% en productos de dermocosmética\n\n¿Te gustaría ver productos específicos de alguna de estas categorías?',
    productos: undefined
  },
  'default': {
    texto: 'Gracias por tu consulta. Estoy aquí para ayudarte con recomendaciones de productos, información sobre síntomas, alternativas más económicas, o cualquier duda sobre tu salud y bienestar. ¿En qué puedo asistirte hoy?',
    productos: undefined
  }
};

function getResponseForMessage(mensaje: string): AssistantResponse {
  const mensajeLower = mensaje.toLowerCase().trim();

  if (mensajeLower.includes('síntoma') || mensajeLower.includes('sintoma') || mensajeLower.includes('dolor') || mensajeLower.includes('fiebre')) {
    return RESPONSES['tengo un síntoma'];
  }

  if (mensajeLower.includes('recomend') || mensajeLower.includes('suger') || mensajeLower.includes('acons')) {
    return RESPONSES['quiero una recomendación'];
  }

  if (mensajeLower.includes('barato') || mensajeLower.includes('económico') || mensajeLower.includes('alternativa') || mensajeLower.includes('genérico')) {
    return RESPONSES['ver alternativas más baratas'];
  }

  if (mensajeLower.includes('pedido') || mensajeLower.includes('orden') || mensajeLower.includes('compra')) {
    return RESPONSES['ver mis pedidos'];
  }

  if (mensajeLower.includes('promocion') || mensajeLower.includes('descuento') || mensajeLower.includes('oferta')) {
    return RESPONSES['ver promociones'];
  }

  if (mensajeLower.includes('hola') || mensajeLower.includes('buenos') || mensajeLower.includes('buenas')) {
    return {
      texto: '¡Hola! Soy tu asistente virtual de FarmaFácil. Estoy aquí para ayudarte con cualquier consulta sobre productos, síntomas, recomendaciones y promociones. ¿En qué puedo ayudarte hoy?',
      productos: undefined
    };
  }

  if (mensajeLower.includes('cosmética') || mensajeLower.includes('cosmetica') || mensajeLower.includes('crema') || mensajeLower.includes('piel')) {
    return {
      texto: 'Tenemos una excelente selección de productos de cosmética y cuidado de la piel. Aquí te muestro algunos de nuestros productos más recomendados:',
      productos: MOCK_PRODUCTS.cosmetica
    };
  }

  return RESPONSES['default'];
}

export const assistantMock = {
  async sendMessage(request: AssistantRequest): Promise<AssistantResponse> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return getResponseForMessage(request.mensaje);
  },

  getQuickActions() {
    return [
      { id: 'sintoma', label: 'Tengo un síntoma', message: 'Tengo un síntoma' },
      { id: 'recomendacion', label: 'Quiero una recomendación', message: 'Quiero una recomendación' },
      { id: 'alternativas', label: 'Ver alternativas más baratas', message: 'Ver alternativas más baratas' },
      { id: 'pedidos', label: 'Ver mis pedidos', message: 'Ver mis pedidos' },
      { id: 'promociones', label: 'Ver promociones', message: 'Ver promociones' }
    ];
  }
};
