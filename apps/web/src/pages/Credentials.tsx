/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import axios from "axios";
import { z } from "zod";
import { createCredentialBodySchema, CREDENTIAL_TYPE } from "common/types";

type Credential = z.infer<typeof createCredentialBodySchema> & { id: string };

type NewCredentialState = Omit<
  z.infer<typeof createCredentialBodySchema>,
  "data"
> & {
  data: {
    apiKey?: string;
    botToken?: string;
  };
};

const Credentials = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCredential, setNewCredential] = useState<NewCredentialState>({
    name: "",
    type: CREDENTIAL_TYPE.openai,
    data: { apiKey: "" },
  });

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/v0/credentials");
      setCredentials(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch credentials.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "type") {
      const newType = value as CREDENTIAL_TYPE;

      if (newType === CREDENTIAL_TYPE.telegram) {
        setNewCredential({
          name: newCredential.name,
          type: newType,
          data: { botToken: "" },
        });
      } else {
        setNewCredential({
          name: newCredential.name,
          type: newType,
          data: { apiKey: "" },
        });
      }
    } else if (name === "apiKey" || name === "botToken") {
      setNewCredential((prev) => ({
        ...prev,
        data: { ...prev.data, [name]: value },
      }));
    } else {
      setNewCredential((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateCredential = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/v0/credentials", newCredential);
      fetchCredentials();
      setIsModalOpen(false);
      setNewCredential({
        name: "",
        type: CREDENTIAL_TYPE.openai,
        data: { apiKey: "" },
      });
    } catch (err: any) {
      setError(
        "Failed to create credential. " +
          (err.response?.data?.details[0]?.message || "")
      );
      console.error(err);
    }
  };

  const handleDeleteCredential = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this credential?")) {
      try {
        await axios.delete(`/api/v0/credentials/${id}`);
        fetchCredentials();
      } catch (err) {
        setError("Failed to delete credential.");
        console.error(err);
      }
    }
  };

  const handleConnectGoogle = async () => {
    try {
      const response = await axios.get("/api/v0/oauth/google/connect");
      const { url } = response.data;

      window.location.href = url;
    } catch (err) {
      setError("Failed to start Google connection.");
      console.error(err);
    }
  };

  const renderDataInput = () => {
    if (newCredential.type === CREDENTIAL_TYPE.telegram) {
      return (
        <div className="mb-6">
          <label
            htmlFor="botToken"
            className="block text-sm font-medium text-gray-700"
          >
            Bot Token
          </label>
          <input
            type="password"
            id="botToken"
            name="botToken"
            value={newCredential.data.botToken || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Paste your bot token here"
            required
          />
        </div>
      );
    }
    return (
      <div className="mb-6">
        <label
          htmlFor="apiKey"
          className="block text-sm font-medium text-gray-700"
        >
          API Key
        </label>
        <input
          type="password"
          id="apiKey"
          name="apiKey"
          value={newCredential.data.apiKey || ""}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Paste your secret key here"
          required
        />
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading text-4xl">Credentials</h1>
          <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80 mt-2">
            Manage your API keys and authentication credentials
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="button-primary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Credential
          </button>
          <button
            onClick={handleConnectGoogle}
            className="button-secondary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Add Gmail
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="animate-pulse-subtle w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto"></div>
            <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Loading credentials...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="card">
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {credentials.length === 0 && !isLoading ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-[var(--color-accent)] dark:bg-[var(--color-border-dark)] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h3 className="heading text-xl mb-2">No credentials found</h3>
          <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80 mb-6">
            Add your first credential to start building workflows
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="button-primary"
          >
            Add Your First Credential
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {credentials.map((cred) => (
            <div key={cred.id} className="card group hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="heading text-lg group-hover:text-[var(--color-primary)] transition-colors">
                    {cred.name}
                  </h3>
                  <p className="text-sm text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-60 uppercase font-medium">
                    {cred.type}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteCredential(cred.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                  title="Delete credential"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-60">
                <div className="w-2 h-2 bg-[var(--color-success)] rounded-full"></div>
                <span>Active</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading text-2xl">Add New Credential</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-60 hover:opacity-100 rounded-md hover:bg-[var(--color-accent)] dark:hover:bg-[var(--color-border-dark)]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateCredential} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newCredential.name}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="e.g., My OpenAI Key"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="type" className="block text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={newCredential.type}
                  onChange={handleInputChange}
                  className="input"
                >
                  {Object.values(CREDENTIAL_TYPE)
                    .filter((type) => type !== CREDENTIAL_TYPE.google_oauth)
                    .map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                </select>
              </div>
              
              {renderDataInput()}
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="button-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="button-primary">
                  Save Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Credentials;
