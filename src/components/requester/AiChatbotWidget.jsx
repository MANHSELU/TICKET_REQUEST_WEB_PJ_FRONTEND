import { useState } from 'react'
import { Bot, Send, X } from 'lucide-react'
import '../../styles/requester/AiChatbotWidget.css'

function AiChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {isOpen && (
        <div className="ai-chat-panel">
          <header className="ai-chat-panel__header">
            <div className="ai-chat-panel__title">
              <span className="ai-chat-panel__icon">
                <Bot size={16} />
              </span>
              Trợ lý IT ảo
            </div>
            <button
              type="button"
              className="ai-chat-panel__close"
              onClick={() => setIsOpen(false)}
              aria-label="Đóng"
            >
              <X size={16} />
            </button>
          </header>

          <div className="ai-chat-panel__body">
            <div className="ai-chat-bubble ai-chat-bubble--bot">
              Xin chào! Mình là trợ lý ảo, có thể hỗ trợ bạn tìm hướng dẫn hoặc tạo ticket nhanh. Tính năng đang được hoàn thiện nhé!
            </div>
          </div>

          <form className="ai-chat-panel__input" onSubmit={(event) => event.preventDefault()}>
            <input type="text" placeholder="Nhập câu hỏi của bạn..." disabled />
            <button type="submit" aria-label="Gửi" disabled>
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="ai-chat-fab"
        onClick={() => setIsOpen((value) => !value)}
        aria-label="Mở trợ lý AI"
      >
        {isOpen ? <X size={22} /> : <Bot size={24} />}
      </button>
    </>
  )
}

export default AiChatbotWidget
