import Link from "next/link";
import { signIn } from "@/app/actions/auth";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-black">
      <form
        action={signIn}
        className="w-full max-w-sm space-y-4 bg-white p-6 rounded-xl border"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full border rounded p-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full border rounded p-2"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p className="text-sm text-center">
          Don;t have an account?{" "}
          <Link href="/register" className="text-blue-600 underline">
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}
