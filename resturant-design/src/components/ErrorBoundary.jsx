import { Component } from "react";

// ==========================================================================
// ERROR BOUNDARY — Catches runtime errors in any child component tree
// Prevents a single broken component from crashing the entire app
// ==========================================================================
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          fontFamily: "'DM Sans', sans-serif",
          background: "#fff8f8",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#fee2e2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            marginBottom: 20,
          }}
        >
          ⚠️
        </div>

        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#2C2F34",
            marginBottom: 8,
          }}
        >
          Something went wrong
        </h1>

        <p
          style={{
            fontSize: 14,
            color: "#6b7280",
            maxWidth: 420,
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          An unexpected error occurred in this section. Don&apos;t worry — your
          cart and session data are safe. Try going back to the home page.
        </p>

        {/* Error detail (dev-friendly, collapsible) */}
        {this.state.error && (
          <details
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: "10px 16px",
              fontSize: 11,
              color: "#9ca3af",
              maxWidth: 480,
              textAlign: "left",
              marginBottom: 24,
              cursor: "pointer",
            }}
          >
            <summary style={{ fontWeight: 600, cursor: "pointer", color: "#6b7280" }}>
              Error details
            </summary>
            <pre style={{ marginTop: 8, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {this.state.error.toString()}
            </pre>
          </details>
        )}

        <button
          onClick={this.handleReset}
          style={{
            background: "#AD343E",
            color: "#fff",
            border: "none",
            borderRadius: 999,
            padding: "10px 28px",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          ← Back to Home
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
