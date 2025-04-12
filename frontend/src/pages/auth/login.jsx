import { useState } from 'react'
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ErrorBox from "./AuthErrorBox"

function Login() {
  const navigate = useNavigate();

  const login = async () => {
    await axios.post("http://localhost:3001/api/auth/login/", { email, password }, {
      withCredentials: true
    });
    navigate("/dashboard");
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login();
    }
    catch(err) {
      const data = err.response?.data;
      setError({
        title: data?.title || 'Login Error',
        description: data?.description || data?.message || err.message
      });
    }
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState({ title: '', description: '' });

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <a
                  href="#"
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md">
                    {/* For our logo. */}
                  </div>
                  <span className="sr-only">Hieroglyph.</span>
                </a>
                <h1 className="text-xl font-bold">Welcome to Hieroglyph</h1>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/register" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>
              <ErrorBox 
                title={error.title}
                description={error.description}
                onClear={() => setError({title: '', description: ''})}
              />
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Login