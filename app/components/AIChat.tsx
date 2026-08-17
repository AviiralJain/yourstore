"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './AIChat.module.css';
import { WHATSAPP_NUMBER } from '../lib/contact';

type Message = {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  quickActions?: string[];
  isWhatsApp?: boolean;
};

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: "Hi! 👋 I'm YOURSTORE AI. I can help you find drone components, understand products, or plan your UAV project.",
      quickActions: [
        "Find a drone part",
        "Which motor should I choose?",
        "I need a flight controller",
        "Build a drone project",
        "Talk to YOURSTORE"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleQuickAction = (action: string) => {
    // Add user message
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: action
    };
    
    setMessages(prev => [...prev, userMsg]);

    // Simulate small delay for natural UX
    setTimeout(() => {
      let response: Message;

      switch(action) {
        case "Find a drone part":
          response = {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: "Sure! What are you looking for?",
            quickActions: ["Motors", "ESCs", "Flight Controllers", "Propellers", "Sensors", "Frames"]
          };
          break;
        case "Which motor should I choose?":
          response = {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: "It depends on your drone size, frame, propeller and required thrust. Tell me your drone type or target payload and I can help narrow it down.",
            quickActions: ["Talk to an expert"]
          };
          break;
        case "I need a flight controller":
          response = {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: "We currently have flight controllers suitable for different UAV and FPV builds. You can browse our products or tell me your drone type and requirements.",
            quickActions: ["View Flight Controllers", "Talk to an expert"]
          };
          break;
        case "Build a drone project":
          response = {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: "Absolutely. YOURSTORE can help with custom UAV projects, including college projects, prototypes and application-specific builds.",
            quickActions: ["Start Your Project", "Chat on WhatsApp"]
          };
          break;
        case "Talk to YOURSTORE":
        case "Talk to an expert":
        case "Chat on WhatsApp":
          response = {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: "Connecting you to our team. Click below to continue on WhatsApp.",
            isWhatsApp: true
          };
          break;
        case "Motors":
        case "ESCs":
        case "Flight Controllers":
        case "Propellers":
        case "Sensors":
        case "Frames":
          response = {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: `You can explore our selection of ${action} in the products section. Need more specific help?`,
            quickActions: ["Talk to an expert"]
          };
          break;
        case "View Flight Controllers":
        case "Start Your Project":
          response = {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: "Great! Let's connect you with the right resources.",
            quickActions: ["Chat on WhatsApp"]
          };
          break;
        default:
          response = {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: "I can currently help with products, drone components and custom project requirements. For detailed assistance, you can connect with our team on WhatsApp.",
            quickActions: ["Chat on WhatsApp"]
          };
      }

      setMessages(prev => [...prev, response]);
    }, 400);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    handleQuickAction(inputValue.trim());
    setInputValue('');
  };

  return (
    <>
      <button 
        className={styles.fab} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close AI Assistant" : "Ask YOURSTORE AI"}
        aria-expanded={isOpen}
        aria-controls="ai-chat-panel"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        )}
      </button>

      {isOpen && (
        <div id="ai-chat-panel" className={styles.chatWindow}>
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <h3 className={styles.title}>YOURSTORE AI</h3>
              <p className={styles.subtitle}>Your drone parts & project assistant</p>
            </div>
            <button className={styles.closeButton} onClick={() => setIsOpen(false)} aria-label="Close Chat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div className={styles.messagesContainer}>
            {messages.map((msg) => (
              <div key={msg.id} className={`${styles.messageWrapper} ${msg.sender === 'user' ? styles.userWrapper : styles.assistantWrapper}`}>
                <div className={`${styles.messageBubble} ${msg.sender === 'user' ? styles.userBubble : styles.assistantBubble}`}>
                  {msg.text}
                </div>
                
                {msg.isWhatsApp && (
                  <a 
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi YOURSTORE, I need help with a drone component/project.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappLink}
                  >
                    Open WhatsApp &rarr;
                  </a>
                )}
                
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div className={styles.quickActions}>
                    {msg.quickActions.map((action, idx) => (
                      <button 
                        key={idx} 
                        className={styles.quickActionButton}
                        onClick={() => handleQuickAction(action)}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className={styles.inputArea} onSubmit={handleSend}>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="Ask about drone parts or projects..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className={styles.sendButton} aria-label="Send message" disabled={!inputValue.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
};
