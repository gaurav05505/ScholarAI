import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0D10] text-[#E5E7EB] flex flex-col items-center justify-center p-6 font-sans">
          <div className="max-w-2xl w-full bg-[#16191D] border border-red-500/30 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <h2 className="text-xl font-bold">Workspace Runtime Encountered an Issue</h2>
            </div>
            <p className="text-sm text-[#8B9099] mb-4">
              {this.state.error?.toString()}
            </p>
            {this.state.errorInfo?.componentStack && (
              <pre className="bg-[#0E1013] border border-[#25282D] p-4 rounded-xl text-xs text-red-300 overflow-x-auto max-h-60 no-scrollbar mb-6">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
                window.location.reload();
              }}
              className="bg-[#1D4ED8] hover:bg-[#2563EB] text-white px-5 py-2.5 rounded-2xl text-xs font-semibold cursor-pointer transition-all"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
