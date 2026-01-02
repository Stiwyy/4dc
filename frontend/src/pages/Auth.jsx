import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '', username: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                const res = await authAPI.login(formData.email, formData.password);
                login({
                    uid: res.data.userId,
                    email: res.data.email,
                    username: res.data.email
                });

                navigate('/dashboard');

            } else {
                const res = await authAPI.register(formData.email, formData.password, formData.username);

                login({
                    uid: res.data.uid,
                    email: formData.email,
                    username: res.data.username
                });

                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || "Connection refused or invalid credentials.";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
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

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <Input
                            label="Codename"
                            placeholder="Username"
                            value={formData.username}
                            onChange={e => setFormData({...formData, username: e.target.value})}
                            required
                        />
                    )}
                    <Input
                        label="Email"
                        type="email"
                        placeholder="user@encrypted.net"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        required
                    />
                    <Input
                        label="Key / Password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        required
                    />

                    {error && (
                        <div className="text-xs text-red-500 font-mono border border-red-900/50 bg-red-900/10 p-2 rounded">
                            Error: {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Processing...' : (isLogin ? 'Establish Connection' : 'Generate Identity')}
                    </Button>
                </form>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        className="text-xs text-neutral-500 hover:text-emerald-500 transition-colors"
                    >
                        {isLogin ? 'Need an account? Register' : 'Already have keys? Login'}
                    </button>
                </div>
            </div>
        </div>
    );
}