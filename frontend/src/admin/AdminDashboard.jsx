import { useEffect, useState } from "react";
import {
  BarChart3,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Bot,
} from "lucide-react";

import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    helpful: 0,
    not_helpful: 0,
    satisfaction: 0,
  });

  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Load Dashboard Data
  // =========================

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [statsResponse, feedbackResponse] =
        await Promise.all([
          fetch(
            "http://127.0.0.1:8000/admin/feedback/stats"
          ),

          fetch(
            "http://127.0.0.1:8000/admin/feedback"
          ),
        ]);

      const statsData =
        await statsResponse.json();

      const feedbackData =
        await feedbackResponse.json();

      if (!statsResponse.ok) {
        throw new Error(
          statsData.detail ||
            "Unable to load statistics"
        );
      }

      if (!feedbackResponse.ok) {
        throw new Error(
          feedbackData.detail ||
            "Unable to load feedback"
        );
      }

      setStats({
        total:
          statsData.total ||
          statsData.total_feedback ||
          0,

        helpful:
          statsData.helpful || 0,

        not_helpful:
          statsData.not_helpful || 0,

        satisfaction:
          statsData.satisfaction ||
          statsData.helpful_percentage ||
          0,
      });

      setFeedback(
        feedbackData.feedback ||
          feedbackData ||
          []
      );

    } catch (err) {

      console.error(
        "Dashboard error:",
        err
      );

      setError(
        err.message ||
          "Unable to load dashboard data."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    window.location.href = "/admin";
  };

  // =========================
  // Dashboard
  // =========================

  return (
    <div className="admin-dashboard">

      {/* =========================
          Sidebar
      ========================= */}

      <aside className="admin-sidebar">

        <div className="admin-brand">

          <div className="admin-brand-icon">
            <Bot size={24} />
          </div>

          <div>
            <h2>AI Support</h2>

            <span>
              Admin Panel
            </span>
          </div>

        </div>

        <div className="admin-nav">

          <div className="admin-nav-item active">
            <BarChart3 size={19} />
            Dashboard
          </div>

          <div className="admin-nav-item">
            <MessageSquare size={19} />
            Feedback
          </div>

          <div className="admin-nav-item">
            <FileText size={19} />
            Knowledge Base
          </div>

        </div>

        <div className="admin-sidebar-bottom">

          <div className="admin-secure">

            <ShieldCheck size={18} />

            <div>
              <strong>
                Admin Access
              </strong>

              <span>
                Secure session
              </span>
            </div>

          </div>

          <button
            className="admin-logout"
            onClick={handleLogout}
          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

      </aside>

      {/* =========================
          Main Content
      ========================= */}

      <main className="admin-main">

        {/* Header */}

        <header className="admin-header">

          <div>

            <p className="admin-small-title">
              ADMIN PANEL
            </p>

            <h1>
              Dashboard
            </h1>

            <p className="admin-header-text">
              Monitor your AI customer support
              performance.
            </p>

          </div>

          <button
            className="refresh-btn"
            onClick={loadDashboard}
            disabled={loading}
          >

            <RefreshCw
              size={17}
              className={
                loading
                  ? "refresh-spin"
                  : ""
              }
            />

            Refresh

          </button>

        </header>

        {/* Error */}

        {error && (

          <div className="dashboard-error">

            <XCircle size={19} />

            <span>
              {error}
            </span>

          </div>

        )}

        {/* =========================
            Stats
        ========================= */}

        <section className="stats-grid">

          {/* Total */}

          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon purple">
                <MessageSquare size={22} />
              </div>

            </div>

            <p className="stat-label">
              Total Feedback
            </p>

            <h2>
              {loading
                ? "..."
                : stats.total}
            </h2>

            <span className="stat-description">
              Customer responses
            </span>

          </div>

          {/* Helpful */}

          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon green">
                <CheckCircle size={22} />
              </div>

            </div>

            <p className="stat-label">
              Helpful
            </p>

            <h2>
              {loading
                ? "..."
                : stats.helpful}
            </h2>

            <span className="stat-description">
              Positive responses
            </span>

          </div>

          {/* Not Helpful */}

          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon red">
                <XCircle size={22} />
              </div>

            </div>

            <p className="stat-label">
              Not Helpful
            </p>

            <h2>
              {loading
                ? "..."
                : stats.not_helpful}
            </h2>

            <span className="stat-description">
              Negative responses
            </span>

          </div>

          {/* Satisfaction */}

          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon blue">
                <BarChart3 size={22} />
              </div>

            </div>

            <p className="stat-label">
              Satisfaction
            </p>

            <h2>
              {loading
                ? "..."
                : `${stats.satisfaction}%`}
            </h2>

            <span className="stat-description">
              Helpful response rate
            </span>

          </div>

        </section>

        {/* =========================
            Content Grid
        ========================= */}

        <section className="dashboard-content">

          {/* Feedback Overview */}

          <div className="dashboard-card overview-card">

            <div className="card-header">

              <div>
                <h3>
                  Feedback Overview
                </h3>

                <p>
                  Customer response distribution
                </p>
              </div>

              <BarChart3 size={21} />

            </div>

            <div className="feedback-chart">

              <div className="chart-row">

                <div className="chart-label">
                  <span>
                    Helpful
                  </span>

                  <strong>
                    {stats.helpful}
                  </strong>
                </div>

                <div className="chart-track">

                  <div
                    className="chart-bar helpful-bar"
                    style={{
                      width:
                        stats.total > 0
                          ? `${
                              (stats.helpful /
                                stats.total) *
                              100
                            }%`
                          : "0%",
                    }}
                  />

                </div>

              </div>

              <div className="chart-row">

                <div className="chart-label">

                  <span>
                    Not Helpful
                  </span>

                  <strong>
                    {stats.not_helpful}
                  </strong>

                </div>

                <div className="chart-track">

                  <div
                    className="chart-bar not-helpful-bar"
                    style={{
                      width:
                        stats.total > 0
                          ? `${
                              (stats.not_helpful /
                                stats.total) *
                              100
                            }%`
                          : "0%",
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* Knowledge Base */}

          <div className="dashboard-card knowledge-card">

            <div className="card-header">

              <div>
                <h3>
                  Knowledge Base
                </h3>

                <p>
                  AI support documents
                </p>
              </div>

              <FileText size={21} />

            </div>

            <div className="knowledge-box">

              <div className="knowledge-icon">
                <FileText size={25} />
              </div>

              <div>

                <strong>
                  Customer Support Policy
                </strong>

                <span>
                  PDF knowledge source
                </span>

              </div>

            </div>

            <div className="knowledge-status">

              <span className="status-online-dot" />

              Knowledge base active

            </div>

          </div>

        </section>

        {/* =========================
            Recent Feedback
        ========================= */}

        <section className="dashboard-card feedback-card">

          <div className="card-header">

            <div>

              <h3>
                Recent Feedback
              </h3>

              <p>
                Latest customer responses
              </p>

            </div>

            <MessageSquare size={21} />

          </div>

          {loading ? (

            <div className="empty-state">
              Loading feedback...
            </div>

          ) : feedback.length === 0 ? (

            <div className="empty-state">

              <MessageSquare size={30} />

              <h4>
                No feedback yet
              </h4>

              <p>
                Customer feedback will
                appear here.
              </p>

            </div>

          ) : (

            <div className="feedback-table-wrapper">

              <table className="feedback-table">

                <thead>

                  <tr>

                    <th>
                      Question
                    </th>

                    <th>
                      Answer
                    </th>

                    <th>
                      Rating
                    </th>

                    <th>
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {feedback
                    .slice(0, 10)
                    .map(
                      (item, index) => (

                        <tr key={item.id || index}>

                          <td>
                            {item.question ||
                              "—"}
                          </td>

                          <td>
                            {item.answer ||
                              "—"}
                          </td>

                          <td>

                            <span
                              className={`rating-badge ${
                                item.rating ===
                                "helpful"
                                  ? "rating-helpful"
                                  : "rating-negative"
                              }`}
                            >

                              {item.rating ===
                              "helpful"
                                ? "Helpful"
                                : "Not Helpful"}

                            </span>

                          </td>

                          <td>

                            {item.created_at
                              ? new Date(
                                  item.created_at
                                ).toLocaleDateString()
                              : "—"}

                          </td>

                        </tr>

                      )
                    )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;