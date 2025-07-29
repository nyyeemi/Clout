import { redirect, type ActionFunctionArgs } from "react-router";
import { useLoginMutation } from "~/redux/api/endpoints/auth";

import { useState } from "react";
import { useNavigate } from "react-router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, isError }] = useLoginMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await login({ username, password }).unwrap();
      if (token) {
        navigate("/dashboard");
      }
    } catch (err) {
      setErrorMessage("Invalid credentials");
    }
  };

  return (
    <main className="bg-stone-900 min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-stone-800 shadow-md p-6 rounded-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-semibold text-center text-white">Login</h1>

        <input
          name="username"
          placeholder="Username"
          className="w-full border p-2 rounded"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
        {isError || errorMessage ? (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        ) : null}
      </form>
    </main>
  );
}
