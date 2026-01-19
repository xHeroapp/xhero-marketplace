"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupportStatus } from "@/hooks/useSupportStatus";
import { useAuthStore } from "@/store/authStore";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";

const Message = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { isOnline, isLoading: isStatusLoading } = useSupportStatus();
  const { messages, isLoading: isChatLoading, error: chatError, sendMessage, conversationId } = useChatMessages(user?.id);
  const { isOtherTyping, broadcastTyping } = useTypingIndicator(conversationId, user?.id);

  const [inputText, setInputText] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOtherTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      await sendMessage(inputText);
      setInputText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    broadcastTyping();
  };

  if (!isHydrated) {
    return (
      <div className="chat-page">
        <div className="chat-header">
          <div className="skeleton-avatar" />
          <div className="skeleton-text" />
        </div>
        <style jsx>{`
          .chat-page {
            display: flex;
            flex-direction: column;
            height: 100vh;
            background: #f5f5f7;
          }
          .chat-header {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            background: #fff;
            border-bottom: 1px solid rgba(0,0,0,0.06);
            gap: 12px;
          }
          .skeleton-avatar {
            width: 40px;
            height: 40px;
            background: #e0e0e0;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
          }
          .skeleton-text {
            width: 120px;
            height: 16px;
            background: #e0e0e0;
            border-radius: 4px;
            animation: pulse 1.5s infinite;
          }
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="chat-page">
        {/* Header */}
        <div className="chat-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => router.back()}>
              <i className="ti ti-arrow-left"></i>
            </button>
            <div className="agent-avatar">
              <img src="/assets/img/bg-img/9.jpg" alt="Support" width={40} height={40} />
              <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
            </div>
            <div className="agent-info">
              <h6>xHero Support</h6>
              <span className={`status-text ${isOnline ? 'online' : 'offline'}`}>
                {isStatusLoading ? '...' : isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          <div className="header-right">
            <button className="action-btn">
              <i className="ti ti-dots-vertical"></i>
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="messages-container">
          <div className="messages-wrapper">
            {/* Date Divider */}
            <div className="date-divider">
              <span>Today</span>
            </div>

            {/* Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-row ${msg.sender_type === "user" ? "user" : "agent"}`}
              >
                {msg.sender_type === "admin" && (
                  <div className="agent-avatar-small">
                    <img src="/assets/img/bg-img/9.jpg" alt="" width={28} height={28} />
                  </div>
                )}
                <div className="message-bubble-wrapper">
                  <div className={`message-bubble ${msg.sender_type}`}>
                    <p>{msg.content}</p>
                  </div>
                  <span className="message-time">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isOtherTyping && (
              <div className="message-row agent">
                <div className="agent-avatar-small">
                  <img src="/assets/img/bg-img/9.jpg" alt="" width={28} height={28} />
                </div>
                <div className="message-bubble-wrapper">
                  <div className="message-bubble agent">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="input-area">
          <form onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <button type="button" className="attach-btn">
                <i className="ti ti-paperclip"></i>
              </button>
              <textarea
                ref={textareaRef}
                className={`message-input ${chatError ? "error" : ""}`}
                placeholder={chatError || "Type a message..."}
                value={inputText}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={isChatLoading || !!chatError || !conversationId}
                style={chatError ? { borderColor: "#ef4444", cursor: "not-allowed" } : {}}
              />
              <button
                type="submit"
                className={`send-btn ${inputText.trim() ? "active" : ""}`}
                disabled={!inputText.trim() || isChatLoading || !conversationId}
              >
                <i className="ti ti-send"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .chat-page {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #f5f5f7;
        }

        /* ========== Header ========== */
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-right {
          width: 44px;
        }

        .back-btn,
        .action-btn {
          width: 44px;
          height: 44px;
          border: none;
          background: transparent;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
          flex-shrink: 0;
        }

        .back-btn:hover,
        .action-btn:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .back-btn i,
        .action-btn i {
          font-size: 22px;
          color: #1d1d1f;
        }

        .header-center {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .agent-avatar {
          position: relative;
          width: 40px;
          height: 40px;
        }

        .agent-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .status-dot {
          position: absolute;
          bottom: 1px;
          right: 1px;
          width: 12px;
          height: 12px;
          border: 2px solid white;
          border-radius: 50%;
          transition: background-color 0.3s ease;
        }

        .status-dot.online {
          background: #34c759;
        }

        .status-dot.offline {
          background: #8e8e93;
        }

        .agent-info {
          text-align: left;
        }

        .agent-info h6 {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          color: #1d1d1f;
        }

        .status-text {
          font-size: 12px;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .status-text.online {
          color: #34c759;
        }

        .status-text.offline {
          color: #8e8e93;
        }

        /* ========== Messages Container ========== */
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          scroll-behavior: smooth;
        }

        .messages-wrapper {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .date-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 16px 0;
        }

        .date-divider span {
          background: rgba(0, 0, 0, 0.05);
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          color: #86868b;
          font-weight: 500;
        }

        .message-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
        }

        .message-row.user {
          flex-direction: row-reverse;
        }

        .agent-avatar-small {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
        }

        .agent-avatar-small img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .message-bubble-wrapper {
          display: flex;
          flex-direction: column;
          max-width: 75%;
        }

        .message-row.user .message-bubble-wrapper {
          align-items: flex-end;
        }

        .message-bubble {
          padding: 10px 14px;
          border-radius: 18px;
          animation: bubbleIn 0.3s ease;
        }

        @keyframes bubbleIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .message-bubble.agent {
          background: #ffffff;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .message-bubble.user {
          background: linear-gradient(135deg, #007aff 0%, #0056d6 100%);
          border-bottom-right-radius: 4px;
        }

        .message-bubble p {
          margin: 0;
          font-size: 15px;
          line-height: 1.4;
        }

        .message-bubble.agent p {
          color: #1d1d1f;
        }

        .message-bubble.user p {
          color: #ffffff;
        }

        .message-time {
          font-size: 11px;
          color: #86868b;
          margin-top: 4px;
          padding: 0 4px;
        }

        /* Typing Indicator */
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 0;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #86868b;
          border-radius: 50%;
          animation: typingBounce 1.4s infinite ease-in-out both;
        }

        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes typingBounce {
          0%,
          80%,
          100% {
            transform: scale(0.6);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* ========== Input Area ========== */
        .input-area {
          padding: 12px 16px;
          padding-bottom: max(12px, env(safe-area-inset-bottom));
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }

        .input-wrapper {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          background: #f5f5f7;
          border-radius: 24px;
          padding: 6px 6px 6px 12px;
          max-width: 600px;
          margin: 0 auto;
        }

        .attach-btn {
          width: 36px;
          height: 36px;
          border: none;
          background: transparent;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .attach-btn:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .attach-btn i {
          font-size: 20px;
          color: #86868b;
        }

        .message-input {
          flex: 1;
          border: none;
          background: transparent;
          resize: none;
          font-size: 16px;
          line-height: 1.4;
          color: #1d1d1f;
          padding: 8px 0;
          max-height: 100px;
          font-family: inherit;
        }

        .message-input::placeholder {
          color: #86868b;
        }

        .message-input:focus {
          outline: none;
        }

        .send-btn {
          width: 36px;
          height: 36px;
          border: none;
          background: #e5e5ea;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .send-btn i {
          font-size: 18px;
          color: #86868b;
          transition: color 0.2s ease;
        }

        .send-btn.active {
          background: linear-gradient(135deg, #007aff 0%, #0056d6 100%);
        }

        .send-btn.active i {
          color: #ffffff;
        }

        .send-btn:disabled {
          cursor: not-allowed;
        }

        /* ========== Scrollbar ========== */
        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }

        /* ========== Responsive ========== */
        @media (max-width: 480px) {
          .message-bubble-wrapper {
            max-width: 85%;
          }

          .agent-avatar-small {
            width: 24px;
            height: 24px;
          }
        }

        /* Dark Mode Overrides */
        :global([theme-color="dark"]) .chat-page {
          background: #000000;
        }

        :global([theme-color="dark"]) .chat-header {
          background: rgba(28, 28, 30, 0.95);
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        :global([theme-color="dark"]) .agent-info h6 {
          color: #ffffff;
        }

        :global([theme-color="dark"]) .back-btn i,
        :global([theme-color="dark"]) .action-btn i {
          color: #ffffff;
        }

        :global([theme-color="dark"]) .date-divider span {
          background: rgba(255, 255, 255, 0.1);
          color: #98989d;
        }

        :global([theme-color="dark"]) .message-bubble.agent {
          background: #2c2c2e;
          box-shadow: none;
        }

        :global([theme-color="dark"]) .message-bubble.agent p {
          color: #ffffff;
        }

        :global([theme-color="dark"]) .input-area {
          background: rgba(28, 28, 30, 0.95);
          border-top-color: rgba(255, 255, 255, 0.1);
        }

        :global([theme-color="dark"]) .input-wrapper {
          background: #1c1c1e;
        }

        :global([theme-color="dark"]) .message-input {
          color: #ffffff;
        }

        :global([theme-color="dark"]) .message-input::placeholder {
          color: #98989d;
        }

        :global([theme-color="dark"]) .attach-btn i {
          color: #98989d;
        }

        :global([theme-color="dark"]) .send-btn:not(.active) {
          background: #3a3a3c;
        }
      `}</style>
    </>
  );
};

export default Message;

