/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { useState } from "react";

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16 text-blue-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1}
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
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        {formSubmitted ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <MailIcon />
            </div>
            <h1 className="text-2xl font-bold">Check your inbox</h1>
            <p className="text-gray-400">
              We've sent a magic link to{" "}
              <span className="font-semibold text-gray-200">{email}</span>.
              Click the link to sign in.
            </p>
            <p className="text-sm text-gray-500">
              (In development, the link is logged to your backend console.)
            </p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold">Sign In or Sign Up</h1>
              <p className="text-gray-400">
                Enter your email to receive a magic link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
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
                  className="w-full px-4 py-2 text-gray-100 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly={isLoading}
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send Magic Link"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
