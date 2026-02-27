import React, { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center px-6">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Įvyko klaida</h2>
            <p className="text-slate-400 mb-6">
              {this.state.error?.message || "Įvyko netikėta klaida"}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="px-6 py-2 bg-slate-800 border-2 border-blue-500 text-slate-200 rounded hover:bg-slate-700 transition-colors"
            >
              Bandyti dar kartą
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
