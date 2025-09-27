/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { useState } from "react";

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-20 w-20 text-[var(--color-primary)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`/api/v0/auth/signin`, { email });

      if (response.status !== 200) {
        throw new Error("Something went wrong. Please try again.");
      }
      console.log(email);

      setFormSubmitted(true);
    } catch (err: any) {
      setError(err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-accent)] dark:from-[var(--color-bg-dark)] dark:to-[var(--color-bg-dark)] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="card">
          {formSubmitted ? (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-[var(--color-accent)] dark:bg-[var(--color-border-dark)]">
                  <MailIcon />
                </div>
              </div>
              <div className="space-y-3">
                <h1 className="heading text-3xl">Check your inbox</h1>
                <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">
                  We've sent a magic link to{" "}
                  <span className="font-semibold text-[var(--color-primary)]">{email}</span>.
                  Click the link to sign in.
                </p>
                <p className="text-sm text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-60">
                  (In development, the link is logged to your backend console.)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <h1 className="heading text-3xl">Welcome Back</h1>
                <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">
                  Enter your email to receive a magic link and get started.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={handleOnChange}
                    placeholder="name@example.com"
                    className="input"
                    readOnly={isLoading}
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="button-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-pulse-subtle w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Sending...
                    </span>
                  ) : (
                    "Send Magic Link"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
