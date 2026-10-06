import { useState } from "react";

import {
  Bot,
  Send,
  Sparkles,
  User,
  Plus,
  Menu,
  X,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  Check,
} from "lucide-react";

import FileUpload from "./components/FileUpload";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

import "./App.css";

// =========================
// Main App
// =========================

function App() {

  // =========================
  // ADMIN LOGIN ROUTE
  // =========================

  if (window.location.pathname === "/admin") {
    return (
      <AdminLogin
        onLogin={() => {
          window.location.href = "/admin/dashboard";
        }}
      />
    );
  }

  // =========================
  // ADMIN DASHBOARD ROUTE
  // =========================

  if (
    window.location.pathname ===
    "/admin/dashboard"
  ) {
    return <AdminDashboard />;
  }

  // =========================
  // Chat Messages
  // =========================

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text:
        "Hi! 👋 I'm your AI customer support assistant. How can I help you today?",
    },
  ]);

  // =========================
  // Input
  // =========================

  const [input, setInput] = useState("");

  // =========================
  // Loading
  // =========================

  const [loading, setLoading] = useState(false);

  // =========================
  // Mobile Sidebar
  // =========================

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =========================
  // Feedback
  // =========================

  const [feedback, setFeedback] = useState({});

  // =========================
  // Suggestions
  // =========================

  const suggestions = [
    "What is the refund policy?",
    "How long does shipping take?",
    "What is the return policy?",
    "How can I cancel my order?",
  ];

  // =========================
  // Send Chat Message
  // =========================

  const sendMessage = async (message = input) => {

    if (!message.trim() || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      text: message,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setInput("");
    setLoading(true);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Server error"
        );
      }

      if (data.reply) {

        setMessages((prev) => [
          ...prev,

          {
            role: "bot",
            text: data.reply,

            // Store question with AI answer
            question: message,
          },
        ]);

      } else {

        throw new Error(
          "No response received"
        );
      }

    } catch (error) {

      console.error(error);

      setMessages((prev) => [
        ...prev,

        {
          role: "bot",

          text:
            "Sorry, something went wrong. Please make sure the backend server is running.",

          error: true,
        },
      ]);

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // Submit Feedback
  // =========================

  const submitFeedback = async (
    messageIndex,
    rating
  ) => {

    // Prevent duplicate feedback
    if (feedback[messageIndex]) {
      return;
    }

    const botMessage =
      messages[messageIndex];

    if (
      !botMessage ||
      botMessage.role !== "bot"
    ) {
      return;
    }

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/feedback",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            question:
              botMessage.question ||
              "Unknown question",

            answer: botMessage.text,

            rating: rating,

          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.detail ||
            "Feedback submission failed"
        );
      }

      console.log(
        "Feedback submitted:",
        data
      );

      // Save selected feedback locally
      setFeedback((prev) => ({
        ...prev,

        [messageIndex]: rating,
      }));

    } catch (error) {

      console.error(
        "Feedback error:",
        error
      );

      alert(
        "Unable to submit feedback. Please try again."
      );
    }
  };

  // =========================
  // Enter Key
  // =========================

  const handleKeyDown = (e) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      sendMessage();
    }
  };

  // =========================
  // New Chat
  // =========================

  const newChat = () => {

    setMessages([
      {
        role: "bot",

        text:
          "Hi! 👋 I'm your AI customer support assistant. How can I help you today?",
      },
    ]);

    setInput("");

    setFeedback({});

    setSidebarOpen(false);
  };

  // =========================
  // CUSTOMER CHAT UI
  // =========================

  return (
    <div className="app">

      {/* =========================
          Mobile Overlay
      ========================= */}

      {sidebarOpen && (
        <div
          className="mobile-overlay"

          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* =========================
          Sidebar
      ========================= */}

      <aside
        className={`sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >

        <div className="sidebar-header">

          <div className="brand">

            <div className="brand-icon">

              <Bot size={22} />

            </div>

            <div>

              <h2>
                AI Support
              </h2>

              <span>
                Customer Assistant
              </span>

            </div>

          </div>

          <button
            className="close-sidebar"

            onClick={() =>
              setSidebarOpen(false)
            }
          >

            <X size={20} />

          </button>

        </div>

        {/* New Chat */}

        <button
          className="new-chat-btn"

          onClick={newChat}
        >

          <Plus size={19} />

          New Conversation

        </button>

        {/* Recent Conversations */}

        <div className="sidebar-section">

          <p className="section-title">
            Recent conversations
          </p>

          <div className="conversation active">

            <div className="conversation-dot" />

            <span>
              Customer Support
            </span>

          </div>

        </div>

        {/* Sidebar Bottom */}

        <div className="sidebar-bottom">

          <div className="secure-box">

            <ShieldCheck size={18} />

            <div>

              <strong>
                AI Powered
              </strong>

              <p>
                Fast & secure support
              </p>

            </div>

          </div>

        </div>

      </aside>

      {/* =========================
          Main
      ========================= */}

      <main className="main">

        {/* =========================
            Header
        ========================= */}

        <header className="topbar">

          <button
            className="menu-btn"

            onClick={() =>
              setSidebarOpen(true)
            }
          >

            <Menu size={22} />

          </button>

          <div className="mobile-brand">

            <div className="brand-icon">

              <Bot size={20} />

            </div>

            <strong>
              AI Support
            </strong>

          </div>

          <div className="header-actions">

            <FileUpload />

            <div className="status">

              <span className="status-dot" />

              Online

            </div>

          </div>

        </header>

        {/* =========================
            Chat Area
        ========================= */}

        <section className="chat-area">

          <div className="messages">

            {messages.map(
              (message, index) => (

                <div
                  key={index}

                  className={`message-row ${message.role}`}
                >

                  {/* Avatar */}

                  <div className="avatar">

                    {message.role ===
                    "bot" ? (

                      <Bot size={18} />

                    ) : (

                      <User size={18} />

                    )}

                  </div>

                  {/* Message Content */}

                  <div className="message-content">

                    <div
                      className={`message-bubble ${
                        message.error
                          ? "error-message"
                          : ""
                      }`}
                    >

                      {message.text}

                    </div>

                    {/* =========================
                        Feedback Buttons
                    ========================= */}

                    {message.role ===
                      "bot" &&

                      !message.error &&

                      index !== 0 && (

                        <div className="feedback-container">

                          <span className="feedback-label">
                            Was this helpful?
                          </span>

                          <div className="feedback-buttons">

                            {/* Helpful */}

                            <button

                              className={`feedback-btn ${
                                feedback[index] ===
                                "helpful"
                                  ? "selected"
                                  : ""
                              }`}

                              onClick={() =>
                                submitFeedback(
                                  index,
                                  "helpful"
                                )
                              }

                              disabled={
                                !!feedback[index]
                              }

                              title="Helpful"
                            >

                              {feedback[index] ===
                              "helpful" ? (

                                <Check
                                  size={15}
                                />

                              ) : (

                                <ThumbsUp
                                  size={15}
                                />

                              )}

                              <span>
                                Helpful
                              </span>

                            </button>

                            {/* Not Helpful */}

                            <button

                              className={`feedback-btn ${
                                feedback[index] ===
                                "not_helpful"
                                  ? "selected"
                                  : ""
                              }`}

                              onClick={() =>
                                submitFeedback(
                                  index,
                                  "not_helpful"
                                )
                              }

                              disabled={
                                !!feedback[index]
                              }

                              title="Not helpful"
                            >

                              {feedback[index] ===
                              "not_helpful" ? (

                                <Check
                                  size={15}
                                />

                              ) : (

                                <ThumbsDown
                                  size={15}
                                />

                              )}

                              <span>
                                Not Helpful
                              </span>

                            </button>

                          </div>

                          {/* Feedback submitted */}

                          {feedback[index] && (

                            <span className="feedback-thanks">

                              Thanks for your feedback!

                            </span>

                          )}

                        </div>

                      )}

                  </div>

                </div>

              )
            )}

            {/* =========================
                Typing Indicator
            ========================= */}

            {loading && (

              <div className="message-row bot">

                <div className="avatar">

                  <Bot size={18} />

                </div>

                <div className="typing">

                  <span />

                  <span />

                  <span />

                </div>

              </div>

            )}

          </div>

          {/* =========================
              Suggestions
          ========================= */}

          {messages.length <= 1 &&
            !loading && (

              <div className="suggestions">

                <div className="suggestion-heading">

                  <Sparkles size={16} />

                  <span>
                    Try asking
                  </span>

                </div>

                <div className="suggestion-list">

                  {suggestions.map(
                    (
                      question,
                      index
                    ) => (

                      <button
                        key={index}

                        onClick={() =>
                          sendMessage(
                            question
                          )
                        }
                      >

                        {question}

                      </button>

                    )
                  )}

                </div>

              </div>

            )}

          {/* =========================
              Input
          ========================= */}

          <div className="input-wrapper">

            <div className="input-box">

              <textarea

                value={input}

                onChange={(e) =>
                  setInput(
                    e.target.value
                  )
                }

                onKeyDown={
                  handleKeyDown
                }

                placeholder="Ask anything about your order..."

                rows="1"

              />

              <button

                className="send-btn"

                onClick={() =>
                  sendMessage()
                }

                disabled={
                  !input.trim() ||
                  loading
                }
              >

                <Send size={19} />

              </button>

            </div>

            <p className="input-note">

              AI responses are generated
              from your company knowledge
              base.

            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;