
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-accent)] dark:from-[var(--color-bg-dark)] dark:to-[var(--color-bg-dark)]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="space-y-6">
            <h1 className="heading text-5xl lg:text-7xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] bg-clip-text text-transparent">
              Welcome to n8n-v0
            </h1>
            <p className="text-xl lg:text-2xl text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80 max-w-3xl mx-auto">
              The powerful automation platform that connects your apps and services to create seamless workflows
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth" className="button-primary text-lg px-8 py-4">
              Get Started
            </Link>
            <Link to="/dashboard" className="button-secondary text-lg px-8 py-4">
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="card text-center group hover:shadow-lg transition-all duration-200">
            <div className="w-16 h-16 bg-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="heading text-xl mb-4">Lightning Fast</h3>
            <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">
              Execute workflows at lightning speed with our optimized processing engine
            </p>
          </div>

          <div className="card text-center group hover:shadow-lg transition-all duration-200">
            <div className="w-16 h-16 bg-[var(--color-success)] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="heading text-xl mb-4">Reliable</h3>
            <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">
              Built with enterprise-grade reliability and error handling
            </p>
          </div>

          <div className="card text-center group hover:shadow-lg transition-all duration-200">
            <div className="w-16 h-16 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="heading text-xl mb-4">Easy to Use</h3>
            <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">
              Intuitive drag-and-drop interface makes automation accessible to everyone
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="card max-w-4xl mx-auto">
            <h2 className="heading text-3xl lg:text-4xl mb-6">
              Ready to Automate Your Workflow?
            </h2>
            <p className="text-lg text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80 mb-8">
              Join thousands of users who are already automating their daily tasks
            </p>
            <Link to="/auth" className="button-primary text-lg px-8 py-4">
              Start Building Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;