import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/UI';
import { 
  Users, 
  AlertCircle, 
  BarChart3, 
  Star, 
  ArrowLeft, 
  LogOut,
  ChevronRight,
  Calendar,
  User as UserIcon,
  Home
} from 'lucide-react';

export const DashboardPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'crises' | 'stats' | 'feedback'>('stats');
  const [users, setUsers] = useState<any[]>([]);
  const [crises, setCrises] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [usersData, crisesData, statsData] = await Promise.all([
          api.getUsers(),
          api.getCrises(),
          api.getStats()
        ]);
        setUsers(usersData);
        setCrises(crisesData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-orange-400 rounded-full animate-spin" />
        </div>
      );
    }

    switch (activeTab) {
      case 'users':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Usuários Cadastrados
            </h2>
            <div className="grid gap-3">
              {users.map(u => (
                <div key={u.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Desde</p>
                    <p className="text-xs font-bold text-slate-600">{u.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'crises':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              Registro de Crises
            </h2>
            <div className="grid gap-3">
              {crises.map(c => (
                <div key={c.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{c.type}</p>
                    <p className="text-xs font-bold text-rose-400 uppercase tracking-tight">{c.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Data</p>
                    <p className="text-xs font-bold text-slate-600">{c.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'stats':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              Estatísticas de Uso
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Cliques por Categoria</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Crise', value: stats.clicks.crise, color: 'bg-orange-400', total: 300 },
                    { label: 'Comunicação', value: stats.clicks.comunicacao, color: 'bg-emerald-400', total: 300 },
                    { label: 'Socialização', value: stats.clicks.socializacao, color: 'bg-violet-400', total: 300 },
                  ].map(item => (
                    <div key={item.label} className="space-y-1.5">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-slate-700">{item.label}</span>
                        <span className="text-slate-900">{item.value}</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${(item.value / item.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Feedback dos Pais</h3>
                <div className="flex items-center justify-around py-4">
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mx-auto mb-2">
                      <Star className="w-6 h-6 fill-current" />
                    </div>
                    <p className="text-2xl font-black text-slate-900">{stats.feedback.helped}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ajudou</p>
                  </div>
                  <div className="w-px h-12 bg-slate-100" />
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mx-auto mb-2">
                      <Star className="w-6 h-6" />
                    </div>
                    <p className="text-2xl font-black text-slate-900">{stats.feedback.notHelped}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Não Ajudou</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'feedback':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Feedbacks Detalhados
            </h2>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto">
                <Star className="w-8 h-8" />
              </div>
              <p className="text-slate-500 font-medium">Os feedbacks detalhados serão exibidos aqui conforme os pais utilizarem o app.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl border-x border-slate-200 overflow-hidden">
      <header className="bg-white p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Admin</h1>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors font-bold text-sm"
          title="Sair"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </button>
      </header>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-black text-xl">
            {user?.name.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Administrador</p>
            <p className="text-lg font-black text-slate-800">{user?.name}</p>
          </div>
        </div>

        <div className="flex-1">
          {renderContent()}
        </div>

        <div className="pt-8 pb-4">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onBack();
            }}
            className="w-full py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold text-sm shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Voltar ao início
          </button>
        </div>
      </div>

      <nav className="bg-white border-t border-slate-100 p-4 grid grid-cols-4 gap-2 sticky bottom-0">
        {[
          { id: 'stats', icon: BarChart3, label: 'Stats' },
          { id: 'users', icon: Users, label: 'Users' },
          { id: 'crises', icon: AlertCircle, label: 'Crises' },
          { id: 'feedback', icon: Star, label: 'Feedback' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              activeTab === tab.id ? 'bg-orange-50 text-orange-500' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
