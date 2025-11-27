import React, { useState } from 'react';
import { MOCK_CHATS } from '../constants';
import { Message, MessageStatus, ChatSession } from '../types';
import { Card, Input, Button } from '../components/ui/Components';
import { Search, Send, MoreVertical, Phone, Video } from 'lucide-react';

const ChatViewer: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string>(MOCK_CHATS[0].id);
  const [inputText, setInputText] = useState('');
  
  // Mock messages for the selected chat
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Olá! Gostaria de saber o valor do Botox.', isBot: false, timestamp: '10:40' },
    { id: '2', text: 'Olá! Sou a Ana da Estética.AI. O valor para aplicação de Botox é R$ 800,00 por região. Gostaria de agendar uma avaliação gratuita?', isBot: true, timestamp: '10:40', status: MessageStatus.READ },
    { id: '3', text: 'Sim, tem horário para amanhã?', isBot: false, timestamp: '10:42' },
  ]);

  const selectedChat = MOCK_CHATS.find(c => c.id === selectedChatId);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: MessageStatus.SENT
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <div className="h-[calc(100vh-120px)] md:h-[calc(100vh-64px)] -m-4 md:-m-8 flex bg-white border-t border-gray-200">
      
      {/* SIDEBAR LIST */}
      <div className="w-full md:w-80 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-3 bg-gray-50 border-b border-gray-200">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Buscar conversa..." 
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                />
             </div>
        </div>
        <div className="flex-1 overflow-y-auto">
            {MOCK_CHATS.map((chat) => (
                <div 
                    key={chat.id}
                    onClick={() => setSelectedChatId(chat.id)}
                    className={`p-4 flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                        selectedChatId === chat.id ? 'bg-gray-100' : ''
                    }`}
                >
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-600 font-bold">
                        {chat.customerName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="font-semibold text-gray-900 text-sm truncate">{chat.customerName}</span>
                            <span className="text-[10px] text-gray-400">{chat.timestamp}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="hidden md:flex flex-1 flex-col bg-[#e5ddd5]/30 relative">
        {/* Chat Header */}
        <div className="h-16 bg-gray-50 border-b border-gray-200 flex items-center justify-between px-6">
            {selectedChat && (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
                        {selectedChat.customerName.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{selectedChat.customerName}</h3>
                        <p className="text-xs text-gray-500">Online</p>
                    </div>
                </div>
            )}
            <div className="flex items-center gap-4 text-gray-500">
                <Phone size={20} className="cursor-pointer hover:text-gray-900" />
                <Video size={20} className="cursor-pointer hover:text-gray-900" />
                <MoreVertical size={20} className="cursor-pointer hover:text-gray-900" />
            </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isBot ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-lg px-4 py-2 shadow-sm text-sm ${
                        msg.isBot ? 'bg-gray-900 text-white rounded-tr-none' : 'bg-white text-gray-900 rounded-tl-none'
                    }`}>
                        <p>{msg.text}</p>
                        <div className={`text-[10px] text-right mt-1 ${msg.isBot ? 'text-gray-400' : 'text-gray-400'}`}>
                            {msg.timestamp}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center gap-2">
                <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Digite uma mensagem (intervenção humana)..."
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-900 bg-white"
                />
                <Button size="icon" onClick={handleSendMessage}>
                    <Send size={18} />
                </Button>
            </div>
            <p className="text-xs text-center text-gray-400 mt-2">O bot está pausado enquanto você digita.</p>
        </div>
      </div>

    </div>
  );
};

export default ChatViewer;