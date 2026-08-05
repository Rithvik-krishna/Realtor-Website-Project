import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Send, X, ArrowUpRight, Bot } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  links?: { title: string; page: string; param?: string }[];
}

export const AIAssistant: React.FC = () => {
  const { properties, setCurrentPage, setSelectedPropertyId, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Welcome to Kang Homes AI Assistant! I am trained on Ontario listings, MLS data, and GTA real estate trends. How can I assist you with Karan Kang, REALTOR® today?"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestPrompts = [
    'Oakville detached homes for sale',
    'Toronto condos near subway',
    'Mississauga waterfront properties',
    'Calculate home mortgage payment'
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      showToast('Kang Homes AI Assistant Connected', 'info');
    }
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "I have searched our active Ontario listings. Here are recommendations matching your query.";
      let links: Message['links'] = [];

      const query = text.toLowerCase();

      if (query.includes('vancouver') || query.includes('waterfront') || query.includes('mississauga')) {
        const vanc = properties.find(p => p.id === '1') || properties[0];
        botResponse = `Great choice. In our active inventory, "The Obsidian Point" ($18,450,000) features premium architecture and prime views. I have opened its details for you.`;
        links = [{ title: 'View Listing Details', page: 'property-detail', param: vanc.id }];
      } else if (query.includes('oakville') || query.includes('chalet') || query.includes('detached')) {
        const whis = properties.find(p => p.id === '2') || properties[1];
        botResponse = `Understood. "L'Alpage Alpine Retreat" ($12,800,000) represents a phenomenal home with top-tier finishes and spacious grounds.`;
        links = [{ title: 'View Property Page', page: 'property-detail', param: whis.id }];
      } else if (query.includes('yorkville') || query.includes('penthouse') || query.includes('toronto')) {
        const tor = properties.find(p => p.id === '3') || properties[2];
        botResponse = `Certainly! "The Luminary Penthouse" ($24,500,000) is a premier urban suite offering luxury finishes and Panoramic skyline views.`;
        links = [{ title: 'View Luminary Penthouse', page: 'property-detail', param: tor.id }];
      } else if (query.includes('mortgage') || query.includes('calculate')) {
        botResponse = `I'd be glad to help! You can use our built-in mortgage calculator on any property page to estimate down payments, interest rates, and monthly mortgage payments.`;
        links = [{ title: 'Open Property Calculator', page: 'property-detail', param: '1' }];
      } else {
        botResponse = `I have logged your query: "${text}". Feel free to browse our active property listings or contact Karan Kang, REALTOR® directly at 437-998-5873 for personalized guidance.`;
        links = [{ title: 'Browse All Listings', page: 'search' }, { title: 'Contact Karan Kang', page: 'contact' }];
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse, links }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleLinkClick = (link: { page: string; param?: string }) => {
    if (link.page === 'property-detail' && link.param) {
      setSelectedPropertyId(link.param);
      setCurrentPage('property-detail');
    } else {
      setCurrentPage(link.page);
    }
  };

  return (
    <>
      {/* Floating Assistant Button */}
      <button
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#0f172a',
          boxShadow: isOpen 
            ? '0 0 25px rgba(15, 23, 42, 0.5)' 
            : '0 8px 25px rgba(15, 23, 42, 0.35)',
          border: '2px solid #ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          cursor: 'pointer',
          zIndex: 9999,
          transition: 'all 0.3s ease'
        }}
        className="hover-lift"
        aria-label="Toggle Kang Homes AI Assistant"
      >
        {isOpen ? <X size={20} /> : <Bot size={22} />}
      </button>

      {/* Slide-out White Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '28px',
            width: '380px',
            height: '540px',
            maxHeight: 'calc(100vh - 120px)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9998,
            borderRadius: '20px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#E31837', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#111827', margin: 0 }}>Kang Homes AI</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#64748b' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  <span>Karan Kang REALTOR® Assistant</span>
                </div>
              </div>
            </div>
            <button onClick={toggleChat} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}>
              <X size={18} />
            </button>
          </div>

          {/* Chat Logs */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              background: '#ffffff'
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                <div
                  style={{
                    background: m.sender === 'user' 
                      ? '#E31837' 
                      : '#f1f5f9',
                    border: m.sender === 'user' 
                      ? 'none' 
                      : '1px solid #e2e8f0',
                    padding: '12px 16px',
                    borderRadius: m.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    color: m.sender === 'user' ? '#ffffff' : '#111827',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    fontWeight: 500
                  }}
                >
                  {m.text}
                </div>
                
                {/* Embedded actions */}
                {m.links && m.links.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                    {m.links.map((link, lIdx) => (
                      <button
                        key={lIdx}
                        onClick={() => handleLinkClick(link)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          color: '#E31837',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                        className="hover-lift"
                      >
                        <span>{link.title}</span>
                        <ArrowUpRight size={14} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', padding: '10px 14px', background: '#f1f5f9', borderRadius: '16px 16px 16px 4px', display: 'flex', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E31837', animation: 'typing-pulse 1s infinite' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E31837', animation: 'typing-pulse 1s infinite 0.2s' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E31837', animation: 'typing-pulse 1s infinite 0.4s' }} />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick recommendations */}
          {messages.length === 1 && (
            <div style={{ padding: '0 16px 12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Suggested Searches</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {suggestPrompts.map((p, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSend(p)}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      fontSize: '0.75rem',
                      color: '#334155',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    className="hover-lift"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input container */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            style={{
              padding: '12px 16px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '8px',
              background: '#f8fafc'
            }}
          >
            <input
              type="text"
              placeholder="Ask about properties, price, or Oakville..."
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '10px 14px',
                color: '#111827',
                fontSize: '0.85rem',
                flex: 1,
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500
              }}
            />
            <button
              type="submit"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: '#E31837',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <Send size={14} style={{ margin: '0 auto' }} />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes typing-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </>
  );
};
