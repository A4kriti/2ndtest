import Link from "next/link";
import { signUp } from '@/app/actions/auth'
 
export default async function RegisterPage(){
    return(
        <main className="min-h-screen flex items-center justify-center bg-white text-gray-700">
            <form action={signUp} className="w-full max-w-sm space-y-4 bg-white p-6 rounded-xl border">
                <h1 className="text-2xl font-bold text-center">Register</h1>

                <input name="name" placeholder="Name" required className="w-full border rounded p-2"/>
                <input name="email" type="email" placeholder="email" required className="w-full border rounded p-2"/>
                <input name="password" type="password" placeholder="password" required className="w-full border rounded p-2"/>

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Register
                </button>
                <p className="text-sm text-center">Already have a Account?{""}
                    <Link href="/login" className="text-blue-600 undeline"> Login</Link>
                </p>
            </form>
        </main>

    )
}
