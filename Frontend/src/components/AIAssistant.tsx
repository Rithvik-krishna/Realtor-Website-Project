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
      text: "Welcome to NovaAI, your private concierge. I am trained on high-end Canadian listings and architecture trends. How can I curate your experience today?"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestPrompts = [
    'Show me waterfront properties in Vancouver',
    'Chalet in Whistler ski resort',
    'Yorkville Penthouse investment',
    'Calculate a $15M estate mortgage'
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      showToast('NovaAI Securing Secure Quantum Connection...', 'info');
    }
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput('');
    setIsTyping(true);

    // Simulate luxury botanical response
    setTimeout(() => {
      let botResponse = "I have analyzed our off-market portfolio. Here are some options tailored to your prompt.";
      let links: Message['links'] = [];

      const query = text.toLowerCase();

      if (query.includes('vancouver') || query.includes('waterfront')) {
        const vanc = properties.find(p => p.id === '1') || properties[0];
        botResponse = `Excellent taste. In West Vancouver, I suggest examining "The Obsidian Point" ($18,450,000). It features premium structural glass embedded directly into basalt cliffs. I have activated its profile on your screen.`;
        links = [{ title: 'View Obsidian Point', page: 'property-detail', param: vanc.id }];
      } else if (query.includes('whistler') || query.includes('chalet') || query.includes('alpine')) {
        const whis = properties.find(p => p.id === '2') || properties[1];
        botResponse = `Understood. In Whistler, "L'Alpage Alpine Retreat" is our premier alpine listing ($12,800,000). It is a gorgeous timber chalet situated directly in the Benchlands with direct ski-in/ski-out rights.`;
        links = [{ title: 'View L\'Alpage Retreat', page: 'property-detail', param: whis.id }];
      } else if (query.includes('yorkville') || query.includes('penthouse') || query.includes('toronto')) {
        const tor = properties.find(p => p.id === '3') || properties[2];
        botResponse = `Certainly. In Toronto, "The Luminary Penthouse" in Yorkville ($24,500,000) represents our absolute flagship high-rise skyscraper suite. It boasts custom Italian glass and a heated rooftop pool.`;
        links = [{ title: 'View Luminary Penthouse', page: 'property-detail', param: tor.id }];
      } else if (query.includes('mortgage') || query.includes('calculate')) {
        botResponse = `I would be happy to assist. I have opened the mortgage dashboard. For a standard $15M property, assuming a 20% down payment ($3M) and a 4.5% interest rate over 25 years, the estimated principal & interest payment would be roughly $66,700 monthly.`;
        links = [{ title: 'Try Calculator', page: 'property-detail', param: '3' }];
      } else {
        botResponse = `I have logged your request: "${text}". I will scanning our private vault of Canadian properties. In the meantime, I highly recommend browsing our active coastal collection or speaking with one of our licensed senior partners.`;
        links = [{ title: 'Browse Active Listings', page: 'search' }];
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse, links }]);
      setIsTyping(false);
    }, 1500);
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
      {/* Floating Sparkles Button */}
      <button
        onClick={toggleChat}
        className="magnetic-item"
        style={{
          position: 'fixed',
          bottom: '32px',
          left: '32px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-blue-primary) 0%, var(--color-lavender-dark) 100%)',
          boxShadow: isOpen 
            ? '0 0 30px rgba(167, 139, 250, 0.6)' 
            : '0 10px 25px rgba(124, 58, 237, 0.4), 0 0 10px rgba(167, 139, 250, 0.2)',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          cursor: 'pointer',
          zIndex: 999,
          transition: 'var(--transition-smooth)'
        }}
      >
        {isOpen ? <X size={20} /> : <Bot size={22} style={{ animation: 'sparkle-rotate 4s infinite linear' }} />}
      </button>

      {/* Slide-out glass drawer */}
      {isOpen && (
        <div
          className="glass-panel"
          style={{
            position: 'fixed',
            bottom: '100px',
            left: '32px',
            width: '380px',
            height: '550px',
            maxHeight: 'calc(100vh - 150px)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 998,
            borderRadius: '24px',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(167, 139, 250, 0.1)',
            overflow: 'hidden',
            animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(90deg, rgba(30,58,138,0.3) 0%, rgba(124,58,237,0.1) 100%)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={16} style={{ color: 'var(--color-lavender)' }} />
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 600, letterSpacing: '-0.01em', color: '#ffffff' }}>NovaAI Intelligence</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  <span>Real-Time Market Ledger Connected</span>
                </div>
              </div>
            </div>
            <button onClick={toggleChat} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} className="hover-lift">
              <X size={16} />
            </button>
          </div>

          {/* Chat Logs */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
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
                      ? 'linear-gradient(135deg, var(--color-blue-primary), var(--color-lavender-dark))' 
                      : 'rgba(255,255,255,0.03)',
                    border: m.sender === 'user' 
                      ? 'none' 
                      : '1px solid rgba(255,255,255,0.05)',
                    padding: '12px 16px',
                    borderRadius: m.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    lineHeight: '1.5'
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
                        className="btn btn-secondary"
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          justifyContent: 'space-between',
                          width: '100%',
                          background: 'rgba(167, 139, 250, 0.05)'
                        }}
                      >
                        <span style={{ color: 'var(--color-lavender)', fontWeight: 500 }}>{link.title}</span>
                        <ArrowUpRight size={12} style={{ opacity: 0.7 }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px 16px 16px 4px', display: 'flex', gap: '4px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--color-lavender)', animation: 'typing-pulse 1s infinite' }} />
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--color-lavender)', animation: 'typing-pulse 1s infinite 0.2s' }} />
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--color-lavender)', animation: 'typing-pulse 1s infinite 0.4s' }} />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick recommendations */}
          {messages.length === 1 && (
            <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Suggested Curations</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {suggestPrompts.map((p, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSend(p)}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'var(--transition-fast)'
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
              padding: '16px',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              gap: '8px',
              background: 'rgba(8,14,36,0.3)'
            }}
          >
            <input
              type="text"
              placeholder="Ask NovaAI about properties..."
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: '#ffffff',
                fontSize: '0.82rem',
                flex: 1,
                outline: 'none',
                fontFamily: 'var(--font-sans)'
              }}
            />
            <button
              type="submit"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--color-blue-primary), var(--color-lavender-dark))',
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

      {/* Custom Styles for AI Assistant */}
      <style>{`
        @keyframes sparkle-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes typing-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </>
  );
};
