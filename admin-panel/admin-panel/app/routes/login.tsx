import { redirect, type ActionFunctionArgs } from "react-router";
import { useLoginMutation } from "~/redux/api/endpoints/auth";

export async function action({ request }: ActionFunctionArgs) {
  const [login, { isLoading, isError }] = useLoginMutation();
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const token = await login({ username, password }).unwrap();

  if (token) {
    localStorage.setItem("token", "mock-token");
    return redirect("/dashboard");
  }

  return { error: "Invalid credentials" };
}

export default function Login() {
  //const [login, { isLoading, isError }] = useLoginMutation();

  //const token = await login({username, password}).unwrap();

  return (
    <main className="bg-stone-900 min-h-screen flex items-center justify-center p-6">
      <form
        method="post"
        className="bg-stone-800 shadow-md p-6 rounded-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">Login</h1>

        <input
          name="username"
          placeholder="Username"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
        >
          Sign In
        </button>
      </form>
    </main>
  );
}
