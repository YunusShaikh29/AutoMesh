import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-automation.jpg";
import patternBackground from "@/assets/pattern-background.jpg";
import workflowIllustration from "@/assets/workflow-illustration.jpg";
import integrationsShowcase from "@/assets/integrations-showcase.jpg";
import analyticsDashboard from "@/assets/analytics-dashboard.jpg";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="heading text-xl font-bold">AutoMesh</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] hover:text-[var(--color-primary)] transition-colors">Features</a>
              <a href="#how-it-works" className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] hover:text-[var(--color-primary)] transition-colors">How it Works</a>
              <a href="#pricing" className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] hover:text-[var(--color-primary)] transition-colors">Pricing</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth" className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] hover:text-[var(--color-primary)] transition-colors">Sign In</Link>
              <Link to="/auth" className="button-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url(${patternBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-[var(--color-accent)] dark:bg-[var(--color-border-dark)] px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse-subtle"></div>
                  <span className="text-sm font-medium">Automate Everything</span>
                </div>
                <h1 className="heading text-5xl lg:text-7xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] bg-clip-text text-transparent">
                  Workflow Automation Made Simple
                </h1>
                <p className="text-xl lg:text-2xl text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80 max-w-2xl">
                  Connect your apps, automate repetitive tasks, and focus on what matters most. Build powerful workflows without writing a single line of code.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth" className="button-primary text-lg px-8 py-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Start Free Trial
                </Link>
                <Link to="/dashboard" className="button-secondary text-lg px-8 py-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  View Demo
                </Link>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="heading text-2xl font-bold text-[var(--color-primary)]">10K+</div>
                  <div className="text-sm opacity-80">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="heading text-2xl font-bold text-[var(--color-primary)]">1M+</div>
                  <div className="text-sm opacity-80">Workflows Created</div>
                </div>
                <div className="text-center">
                  <div className="heading text-2xl font-bold text-[var(--color-primary)]">99.9%</div>
                  <div className="text-sm opacity-80">Uptime</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-2xl opacity-20 blur-3xl"></div>
              <img 
                src={heroImage} 
                alt="Workflow automation dashboard"
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-[var(--color-accent)]/30 dark:bg-[var(--color-bg-dark)]">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 mb-16">
            <h2 className="heading text-4xl lg:text-5xl font-bold">
              Everything You Need to Automate
            </h2>
            <p className="text-xl text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80 max-w-3xl mx-auto">
              Powerful features designed to make automation accessible to everyone, from beginners to enterprise teams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center group hover:shadow-lg transition-all duration-200">
              <div className="w-16 h-16 bg-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="heading text-xl mb-4">Lightning Fast</h3>
              <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">
                Execute workflows at lightning speed with our optimized processing engine built for scale.
              </p>
            </div>

            <div className="card text-center group hover:shadow-lg transition-all duration-200">
              <div className="w-16 h-16 bg-[var(--color-success)] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="heading text-xl mb-4">Enterprise Ready</h3>
              <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">
                Built with enterprise-grade security, reliability, and compliance standards in mind.
              </p>
            </div>

            <div className="card text-center group hover:shadow-lg transition-all duration-200">
              <div className="w-16 h-16 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="heading text-xl mb-4">Drag & Drop Builder</h3>
              <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">
                Intuitive visual workflow builder that makes automation accessible to everyone.
              </p>
            </div>

            <div className="card text-center group hover:shadow-lg transition-all duration-200">
              <div className="w-16 h-16 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-success)] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="heading text-xl mb-4">500+ Integrations</h3>
              <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">
                Connect with all your favorite apps and services with our extensive integration library.
              </p>
            </div>

            <div className="card text-center group hover:shadow-lg transition-all duration-200">
              <div className="w-16 h-16 bg-gradient-to-r from-[var(--color-success)] to-[var(--color-primary-light)] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="heading text-xl mb-4">Real-time Analytics</h3>
              <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">
                Monitor workflow performance and optimize your automations with detailed analytics.
              </p>
            </div>

            <div className="card text-center group hover:shadow-lg transition-all duration-200">
              <div className="w-16 h-16 bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="heading text-xl mb-4">Team Collaboration</h3>
              <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">
                Work together seamlessly with advanced sharing, permissions, and version control.
              </p>
            </div>
          </div>

          {/* Integrations Showcase */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="heading text-3xl font-bold mb-4">
                Connect Everything
              </h3>
              <p className="text-lg text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">
                Seamlessly integrate with all your favorite tools and services
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-success)] rounded-2xl opacity-10 blur-2xl"></div>
              <img 
                src={integrationsShowcase} 
                alt="Popular app integrations showcase"
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>

          {/* Analytics Preview */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="heading text-3xl font-bold mb-4">
                Monitor & Optimize
              </h3>
              <p className="text-lg text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">
                Real-time insights into your automation performance
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-success)] to-[var(--color-primary-light)] rounded-2xl opacity-10 blur-2xl"></div>
              <img 
                src={analyticsDashboard} 
                alt="Analytics dashboard interface"
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 mb-16">
            <h2 className="heading text-4xl lg:text-5xl font-bold">
              How It Works
            </h2>
            <p className="text-xl text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80 max-w-3xl mx-auto">
              Create powerful automations in just three simple steps. No coding required.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="heading text-xl mb-2">Choose Your Trigger</h3>
                  <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">
                    Select from hundreds of trigger events like new emails, form submissions, or scheduled times to start your workflow.
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-success)] text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="heading text-xl mb-2">Add Actions</h3>
                  <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">
                    Drag and drop actions to process data, send notifications, update databases, and connect with your favorite apps.
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-primary-light)] text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="heading text-xl mb-2">Activate & Monitor</h3>
                  <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">
                    Turn on your workflow and watch it run automatically. Monitor performance and optimize as needed.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-success)] to-[var(--color-primary)] rounded-2xl opacity-20 blur-3xl"></div>
              <img 
                src={workflowIllustration} 
                alt="Workflow creation process"
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-[var(--color-accent)]/30 dark:bg-[var(--color-bg-dark)]">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 mb-16">
            <h2 className="heading text-4xl lg:text-5xl font-bold">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">
              Choose the plan that fits your automation needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="card text-center">
              <div className="mb-8">
                <h3 className="heading text-xl mb-2">Starter</h3>
                <div className="text-4xl font-bold text-[var(--color-primary)] mb-2">$0</div>
                <div className="text-sm opacity-80">Forever free</div>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[var(--color-success)] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  100 workflow executions/month
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[var(--color-success)] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  5 active workflows
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[var(--color-success)] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Email support
                </li>
              </ul>
              <Link to="/auth" className="button-secondary w-full">
                Get Started
              </Link>
            </div>

            <div className="card text-center relative border-2 border-[var(--color-primary)]">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-[var(--color-primary)] text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="mb-8">
                <h3 className="heading text-xl mb-2">Professional</h3>
                <div className="text-4xl font-bold text-[var(--color-primary)] mb-2">$29</div>
                <div className="text-sm opacity-80">per month</div>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[var(--color-success)] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  10,000 workflow executions/month
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[var(--color-success)] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited workflows
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[var(--color-success)] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[var(--color-success)] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced integrations
                </li>
              </ul>
              <Link to="/auth" className="button-primary w-full">
                Start Free Trial
              </Link>
            </div>

            <div className="card text-center">
              <div className="mb-8">
                <h3 className="heading text-xl mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-[var(--color-primary)] mb-2">$99</div>
                <div className="text-sm opacity-80">per month</div>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[var(--color-success)] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited executions
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[var(--color-success)] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Team collaboration
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[var(--color-success)] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  24/7 phone support
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[var(--color-success)] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom integrations
                </li>
              </ul>
              <Link to="/auth" className="button-secondary w-full">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="card max-w-4xl mx-auto text-center bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Automate Your Workflow?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who are already saving hours every day with powerful automation workflows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth" className="button-secondary text-lg px-8 py-4 bg-white text-[var(--color-primary)] hover:bg-gray-100">
                Start Free Trial
              </Link>
              <button className="button-primary text-lg px-8 py-4 bg-white/20 text-white border border-white/30 hover:bg-white/30">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-bg-dark)] text-[var(--color-text-dark)] py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">AutoMesh</span>
              </div>
              <p className="opacity-80">
                The most powerful and intuitive workflow automation platform for modern teams.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 opacity-80">
                <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Templates</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 opacity-80">
                <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">About</a></li>
                <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 opacity-80">
                <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[var(--color-border-dark)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="opacity-80">&copy; 2024 AutoMesh. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="opacity-80 hover:text-[var(--color-primary)] transition-colors">Privacy</a>
              <a href="#" className="opacity-80 hover:text-[var(--color-primary)] transition-colors">Terms</a>
              <a href="#" className="opacity-80 hover:text-[var(--color-primary)] transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;