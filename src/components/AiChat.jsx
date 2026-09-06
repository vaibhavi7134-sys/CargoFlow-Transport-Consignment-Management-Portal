// components/AiChat.jsx
import { useState, useRef, useEffect } from 'react';
import './AiChat.css';

const INITIAL_MESSAGES = [
  {
    id: 'init-1',
    from: 'bot',
    text: "👋 Hi! I'm CargoBot, your AI Logistics Assistant. Ask me about tracking, bookings, rates, or shipment status!",
    time: 'Just now',
  },
];

const QUICK_REPLIES = [
  '📍 Track a shipment',
  '📦 How to book?',
  '💰 Pricing & rates',
  '📋 My shipments',
  '📞 Contact support',
];

function getBotReply(userText, consignments = [], onNavigate) {
  const query = userText.toLowerCase().trim();

  // Check for docket number in text
  const docketMatch = userText.match(/\b(?:CF-\d{4,8}|[A-Za-z]{2,3}-\d{3,8}|\d{4,8})\b/i);
  if (docketMatch) {
    const docketNum = docketMatch[0].toUpperCase();
    const found = consignments.find(
      c => c.docketNumber?.toUpperCase() === docketNum || c.docketNumber?.includes(docketNum)
    );
    if (found) {
      return {
        text: `🔍 Found Docket **${found.docketNumber}**:\n• Status: **${found.status || 'Booked'}**\n• Customer: ${found.customerName || 'N/A'}\n• Route: ${found.consignorCity || 'Origin'} ➔ ${found.consigneeCity || 'Destination'}\n• Amount: ₹${Number(found.totalAmount || 0).toLocaleString('en-IN')}`,
        action: { label: 'Open Tracking Page', page: 'track' },
      };
    } else {
      return {
        text: `I searched for docket **${docketNum}**, but couldn't locate it in active records. You can look it up with our live tracking tool!`,
        action: { label: 'Go to Track Order', page: 'track' },
      };
    }
  }

  if (query.includes('track') || query.includes('status') || query.includes('where is')) {
    if (consignments.length > 0) {
      const latest = consignments[consignments.length - 1];
      return {
        text: `To track an order, enter your Docket Number. For instance, your latest order is **${latest.docketNumber}** (${latest.status || 'Booked'}).`,
        action: { label: 'Open Track Order', page: 'track' },
      };
    }
    return {
      text: 'You can track any shipment using the Docket Number generated during booking.',
      action: { label: 'Open Track Order', page: 'track' },
    };
  }

  if (query.includes('book') || query.includes('create') || query.includes('new consignment')) {
    return {
      text: 'Ready to book a new consignment? Fill in the consignor, consignee, and item specifications in our simple 4-step form with auto-rate calculation.',
      action: { label: 'Start New Booking', page: 'booking' },
    };
  }

  if (query.includes('pricing') || query.includes('rate') || query.includes('cost') || query.includes('fee')) {
    return {
      text: 'CargoFlow calculates costs dynamically based on Rate per unit × Quantity. All taxes and totals are computed instantly in the booking step.',
      action: { label: 'Calculate in Booking', page: 'booking' },
    };
  }

  if (query.includes('shipment') || query.includes('order') || query.includes('record') || query.includes('list')) {
    return {
      text: `You currently have **${consignments.length}** shipment record${consignments.length === 1 ? '' : 's'} registered in your portal.`,
      action: { label: 'View Shipments Table', page: 'shipments' },
    };
  }

  if (query.includes('contact') || query.includes('support') || query.includes('call') || query.includes('help') || query.includes('phone')) {
    return {
      text: 'Need human assistance? Our 24/7 Logistics Operations Desk is available at support@cargoflow.com or 1800-CARGO-FLOW.',
      action: { label: 'Go to Contact Page', page: 'contact' },
    };
  }

  if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
    return {
      text: "Hello! How can I assist with your freight operations today? You can ask me to track a docket, check rates, or show your orders.",
    };
  }

  return {
    text: "I can help with shipment tracking, consignment creation, pricing calculations, and operational questions. Try selecting one of the quick options below!",
  };
}

export default function AiChat({ consignments = [], onNavigate }) {
  const [isOpen, setIsOpen]           = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput]             = useState('');
  const [isTyping, setIsTyping]       = useState(false);
  const [messages, setMessages]       = useState(() => {
    try {
      const saved = sessionStorage.getItem('cf-chat-history');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  useEffect(() => {
    try {
      sessionStorage.setItem('cf-chat-history', JSON.stringify(messages));
    } catch {
      // ignore storage error
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const timeStr = new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

    const userMsg = {
      id: `usr-${Date.now()}`,
      from: 'user',
      text,
      time: timeStr,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotReply(text, consignments, onNavigate);
      const botMsg = {
        id: `bot-${Date.now()}`,
        from: 'bot',
        text: botResponse.text,
        action: botResponse.action,
        time: new Intl.DateTimeFormat('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date()),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleActionClick = (page) => {
    if (onNavigate && page) {
      onNavigate(page);
    }
  };

  return (
    <div className="aichat-root" aria-label="AI Support Chat">
      {/* Chat Window */}
      {isOpen && (
        <div
          className={`aichat-window${isMinimized ? ' aichat-minimized' : ''}`}
          role="dialog"
          aria-label="CargoBot Support Chat"
        >
          {/* Header */}
          <div className="aichat-header">
            <div className="aichat-header-info">
              <div className="aichat-avatar">🤖</div>
              <div>
                <div className="aichat-name">CargoBot AI</div>
                <div className="aichat-status">
                  <span className="aichat-online-dot" /> Online · Instant Support
                </div>
              </div>
            </div>
            <div className="aichat-header-btns">
              <button
                className="aichat-icon-btn"
                onClick={() => setIsMinimized(m => !m)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
              >
                {isMinimized ? '▲' : '▼'}
              </button>
              <button
                className="aichat-icon-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Body when not minimized */}
          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="aichat-messages" role="log" aria-live="polite">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`aichat-msg aichat-msg-${msg.from}`}
                  >
                    {msg.from === 'bot' && (
                      <div className="aichat-msg-avatar" aria-hidden="true">🤖</div>
                    )}
                    <div className="aichat-msg-bubble">
                      <div className="aichat-msg-text">
                        {msg.text.split('\n').map((line, idx) => (
                          <div key={idx} className="chat-line">
                            {line.startsWith('• ') ? (
                              <span>&nbsp;&nbsp;{line}</span>
                            ) : (
                              line
                            )}
                          </div>
                        ))}
                      </div>

                      {msg.action && (
                        <div style={{ marginTop: '8px' }}>
                          <button
                            className="aichat-quick-btn"
                            style={{
                              background: 'var(--color-violet)',
                              color: '#fff',
                              border: 'none',
                              padding: '6px 14px',
                            }}
                            onClick={() => handleActionClick(msg.action.page)}
                          >
                            {msg.action.label} →
                          </button>
                        </div>
                      )}

                      <div className="aichat-msg-time">{msg.time}</div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="aichat-msg aichat-msg-bot">
                    <div className="aichat-msg-avatar" aria-hidden="true">🤖</div>
                    <div className="aichat-msg-bubble">
                      <div className="aichat-typing">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              <div className="aichat-quick-replies" aria-label="Suggested questions">
                {QUICK_REPLIES.map(q => (
                  <button
                    key={q}
                    className="aichat-quick-btn"
                    onClick={() => sendMessage(q.replace(/^[^\w\s]+\s*/, ''))}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="aichat-input-row">
                <input
                  ref={inputRef}
                  type="text"
                  className="aichat-input"
                  placeholder="Ask CargoBot anything..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Type message"
                />
                <button
                  className="aichat-send-btn"
                  onClick={() => sendMessage()}
                  disabled={!input.trim()}
                  aria-label="Send message"
                  title="Send"
                >
                  ➤
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Trigger Bubble */}
      <button
        className={`aichat-bubble${isOpen ? ' aichat-bubble-active' : ''}`}
        onClick={() => {
          setIsOpen(o => !o);
          setIsMinimized(false);
        }}
        aria-label={isOpen ? 'Close AI Support Chat' : 'Open AI Support Chat'}
        title="AI Support Chat"
        id="aichat-toggle-btn"
      >
        {!isOpen && <span className="aichat-bubble-pulse" aria-hidden="true" />}
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}
