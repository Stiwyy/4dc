import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate(); // Zum Weiterleiten

    const handleFakeLogin = (e) => {
        e.preventDefault();
        console.log("Visual Test: Logging in...");
        // Wir tun so, als ob wir uns einloggen und gehen zum Dashboard
        navigate('/dashboard');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl border border-neutral-800 bg-neutral-900/30 p-10 backdrop-blur-md shadow-2xl">

                <div className="text-center">
                    <Terminal className="mx-auto h-12 w-12 text-emerald-500" />
                    <h2 className="mt-4 text-2xl font-bold tracking-tight">4dc System Access</h2>
                    <p className="mt-2 text-sm text-neutral-400">
                        {isLogin ? 'Enter credentials to decrypt.' : 'Initialize new identity.'}
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleFakeLogin}>
                    {!isLogin && (
                        <Input label="Codename" placeholder="Username" />
                    )}
                    <Input label="Email" type="email" placeholder="user@encrypted.net" />
                    <Input label="Key / Password" type="password" placeholder="••••••••" />

                    <Button type="submit" className="w-full">
                        {isLogin ? 'Establish Connection' : 'Generate Identity'}
                    </Button>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-xs text-neutral-500 hover:text-emerald-500 transition-colors"
                    >
                        {isLogin ? 'Need an account? Register' : 'Already have keys? Login'}
                    </button>
                </div>
            </div>
        </div>
    );
}