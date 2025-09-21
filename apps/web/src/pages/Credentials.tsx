/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import axios from "axios";
import { z } from "zod";
import { createCredentialBodySchema, CREDENTIAL_TYPE } from "common/types";

type Credential = z.infer<typeof createCredentialBodySchema> & { id: string };

type NewCredentialState = Omit<z.infer<typeof createCredentialBodySchema>, 'data'> & {
    data: {
        apiKey?: string;
        botToken?: string;
    }
}

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'type') {
        const newType = value as CREDENTIAL_TYPE;

        if (newType === CREDENTIAL_TYPE.telegram) {
            setNewCredential({ name: newCredential.name, type: newType, data: { botToken: '' } });
        } else { 
            setNewCredential({ name: newCredential.name, type: newType, data: { apiKey: '' } });
        }
    } else if (name === 'apiKey' || name === 'botToken') {
        setNewCredential(prev => ({ 
            ...prev, 
            data: { ...prev.data, [name]: value } 
        }));
    } else {
        setNewCredential(prev => ({ ...prev, [name]: value }));
    }
  };


  const handleCreateCredential = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/v0/credentials", newCredential);
      fetchCredentials();
      setIsModalOpen(false);
      setNewCredential({ name: "", type: CREDENTIAL_TYPE.openai, data: { apiKey: "" } });
    } catch (err: any) {
      setError("Failed to create credential. " + (err.response?.data?.details[0]?.message || ''));
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

  const renderDataInput = () => {
    if (newCredential.type === CREDENTIAL_TYPE.telegram) {
        return (
            <div className="mb-6">
                <label htmlFor="botToken" className="block text-sm font-medium text-gray-700">Bot Token</label>
                <input
                  type="password"
                  id="botToken"
                  name="botToken"
                  value={newCredential.data.botToken || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Paste your bot token here"
                  required
                />
            </div>
        )
    }
    return (
        <div className="mb-6">
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">API Key</label>
            <input
              type="password"
              id="apiKey"
              name="apiKey"
              value={newCredential.data.apiKey || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Paste your secret key here"
              required
            />
        </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Credentials</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Add Credential
        </button>
      </div>

      {isLoading && <p>Loading credentials...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {credentials.length > 0 ? (
            credentials.map((cred) => (
              <li key={cred.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">{cred.name}</p>
                  <p className="text-sm text-gray-500 uppercase">{cred.type}</p>
                </div>
                <button
                  onClick={() => handleDeleteCredential(cred.id)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <p className="p-4 text-gray-500">No credentials found.</p>
          )}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Add New Credential</h2>
            <form onSubmit={handleCreateCredential}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newCredential.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., My OpenAI Key"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  id="type"
                  name="type"
                  value={newCredential.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.values(CREDENTIAL_TYPE).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              {renderDataInput()}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
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