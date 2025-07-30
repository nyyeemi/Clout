import { useState } from "react";
import { useNavigate } from "react-router";
import { useLoginMutation } from "~/redux/api/endpoints/auth";

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
        navigate("/");
      }
    } catch (err) {
      setErrorMessage("Invalid credentials");
    }
  };

  return (
    <main className="bg-black min-h-screen min-w-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-950 border border-neutral-800 text-white shadow-lg p-8 rounded-lg w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Login</h1>

        <input
          name="username"
          placeholder="Username"
          className="w-full bg-neutral-900 text-white placeholder-neutral-400 border border-neutral-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full bg-neutral-900 text-white placeholder-neutral-400 border border-neutral-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 rounded-md transition-colors"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>

        {isError || errorMessage ? (
          <p className="text-red-500 text-sm text-center">{errorMessage}</p>
        ) : null}
      </form>
    </main>
  );
}
