import { useState } from "react";
import Editor from "./components/editor";
import Spinner from "./components/spinner";
import React from "react";

// Simple error boundary
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can log error here
    // console.error(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h2>
          <p className="text-gray-700 mb-4">{this.state.error?.message || "The editor failed to load. Please check your backend server and try again."}</p>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  const [user, setUser] = useState<string>("");
  const [formData, setFormData] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  if (user === "") {
    return (
      <div className="fixed w-full h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-white to-pink-200 animate-fade-in">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!formData) return;
            setLoading(true);
            setTimeout(() => {
              setUser(`${formData}-${Math.round(Math.random() * 1000)}`);
              setLoading(false);
            }, 800); // Simulate loading
          }}
          className="backdrop-blur-md bg-white/70 shadow-2xl rounded-2xl p-8 flex flex-col gap-y-4 w-full max-w-md border border-indigo-100 animate-slide-up"
        >
          <h2 className="text-2xl font-bold text-indigo-700 mb-2 text-center tracking-tight">Welcome to CollabCode</h2>
          <label htmlFor="username" className="text-gray-700 font-medium">Enter your name:</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="border-2 border-indigo-400 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200 text-lg"
            value={formData}
            onChange={(e) => setFormData(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <p className="text-sm text-gray-500 text-center">Enter your name to start collaborating in a room.</p>
          <div className="flex justify-end items-center mt-2">
            {loading ? (
              <Spinner />
            ) : (
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200"
              >
                Enter
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex flex-col">
      {/* Modern Header */}
      <header className="w-full py-6 px-4 flex items-center justify-between bg-white/80 shadow-md backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-extrabold text-indigo-600 tracking-tight">CollabCode</span>
          <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-mono">BETA</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-medium">👤 {user.split("-")[0]}</span>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-2 py-8 animate-fade-in">
        <div className="w-full max-w-4xl bg-white/80 rounded-2xl shadow-2xl p-6 mt-6 backdrop-blur-md border border-indigo-100 animate-slide-up">
          <h1 className="text-2xl font-bold text-indigo-700 mb-4 text-center">Collaborative Real-Time Editor</h1>
          <ErrorBoundary>
            <Editor username={user} />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default App;

// Add fade-in and slide-up animations to Tailwind config or index.css if not present.
