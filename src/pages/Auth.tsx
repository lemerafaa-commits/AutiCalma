import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/UI';
import { Waves, Heart, Mail, Lock, User } from 'lucide-react';

export const LoginPage: React.FC<{ onSwitch: () => void; onSuccess: () => void; initialMessage?: string }> = ({ onSwitch, onSuccess, initialMessage }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(initialMessage || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await login({ email, password });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <div className="w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center p-3 shadow-lg shadow-blue-100">
            <Waves className="w-full h-full text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">AutiCalma</h1>
            <p className="text-slate-500 font-medium">Bem-vindo de volta, cuidador.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-sm font-bold text-center">
              {success}
            </div>
          )}
          
          <Input 
            label="Email" 
            type="email" 
            placeholder="seu@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input 
            label="Senha" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" isLoading={isLoading} className="mt-4">
            Entrar
          </Button>
        </form>

        <div className="flex flex-col gap-4 text-center">
          <button 
            onClick={onSwitch}
            className="text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors"
          >
            Não tem uma conta? <span className="text-orange-400">Cadastre-se</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC<{ onSwitch: () => void; onSuccess: () => void }> = ({ onSwitch, onSuccess }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setIsLoading(true);
    try {
      await register({ name, email, password });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <div className="w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center p-3 shadow-lg shadow-blue-100">
            <Waves className="w-full h-full text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Criar Conta</h1>
            <p className="text-slate-500 font-medium">Junte-se à nossa comunidade de apoio.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold text-center">
              {error}
            </div>
          )}
          
          <Input 
            label="Nome Completo" 
            placeholder="Seu nome" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input 
            label="Email" 
            type="email" 
            placeholder="seu@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input 
            label="Senha" 
            type="password" 
            placeholder="Mínimo 6 caracteres" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input 
            label="Confirmar Senha" 
            type="password" 
            placeholder="Repita sua senha" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" isLoading={isLoading} className="mt-4">
            Cadastrar
          </Button>
        </form>

        <div className="flex flex-col gap-4 text-center">
          <button 
            onClick={onSwitch}
            className="text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors"
          >
            Já tem uma conta? <span className="text-orange-400">Entre aqui</span>
          </button>
        </div>
      </div>
    </div>
  );
};
