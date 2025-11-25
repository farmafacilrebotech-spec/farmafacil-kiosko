'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  Loader2,
  User,
  Pill,
  Sparkles
} from 'lucide-react';
import { assistantMock } from '@/lib/assistantMock';
import type { ChatMessage, Product } from '@/lib/types';

export default function AsistentePage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const farmaciaId = 'F012';
  const clienteId = 'F012-000123';

  const quickActions = assistantMock.getQuickActions();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }

    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      sender: 'assistant',
      text: '¡Hola! Soy tu asistente virtual de FarmaFácil. Estoy aquí para ayudarte con recomendaciones de productos, consultas sobre síntomas, alternativas económicas y más. ¿En qué puedo asistirte hoy?',
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
  }, [router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsThinking(true);

    try {
      const response = await assistantMock.sendMessage({
        mensaje: messageText,
        farmaciaId,
        clienteId
      });

      setIsThinking(false);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.texto,
        timestamp: new Date().toISOString(),
        products: response.productos
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsThinking(false);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'assistant',
        text: 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (message: string) => {
    handleSendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex gap-3">
        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-gray-900 line-clamp-2">{product.name}</h4>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-[#47c7c0]">€{product.price.toFixed(2)}</span>
            <Button size="sm" variant="outline" className="h-7 text-xs border-[#47c7c0] text-[#47c7c0] hover:bg-[#47c7c0] hover:text-white">
              Ver
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#47c7c0] to-[#3db5af] px-6 py-6 shadow-lg flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Asistente FarmaFácil</h1>
            <p className="text-white/90 text-xs">Siempre disponible para ayudarte</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ paddingBottom: '180px' }}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.sender === 'user'
                ? 'bg-gradient-to-br from-[#47c7c0] to-[#3db5af]'
                : 'bg-white border-2 border-[#47c7c0]'
            }`}>
              {message.sender === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Pill className="w-5 h-5 text-[#47c7c0]" />
              )}
            </div>

            <div className={`flex flex-col max-w-[75%] ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-[#47c7c0] to-[#3db5af] text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.text}</p>
              </div>
              <span className="text-xs text-gray-500 mt-1 px-1">
                {formatTime(message.timestamp)}
              </span>

              {message.products && message.products.length > 0 && (
                <div className="mt-3 space-y-2 w-full">
                  {message.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-white border-2 border-[#47c7c0]">
              <Pill className="w-5 h-5 text-[#47c7c0]" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-[#47c7c0] animate-spin" />
                <span className="text-sm text-gray-600">Pensando...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.message)}
              disabled={isLoading}
              className="flex-shrink-0 text-xs border-[#47c7c0] text-[#47c7c0] hover:bg-[#47c7c0] hover:text-white transition-colors"
            >
              {action.label}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu consulta..."
            disabled={isLoading}
            className="flex-1 border-2 border-gray-200 focus:border-[#47c7c0]"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-[#47c7c0] to-[#3db5af] hover:from-[#3db5af] hover:to-[#2fa39d] text-white px-6"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
