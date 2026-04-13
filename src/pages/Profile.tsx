import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  User, 
  Mail, 
  Shield, 
  ArrowLeft, 
  LogOut, 
  Baby, 
  Brain, 
  Zap, 
  Heart,
  CheckCircle2,
  Save
} from 'lucide-react';

interface ChildProfile {
  name: string;
  age: string;
  gender: string;
  behaviors: string[];
  triggers: string[];
  calmingMethods: string;
  favoriteActivities: string;
}

const BEHAVIOR_OPTIONS = [
  'Crises em público',
  'Dificuldade de comunicação',
  'Sensibilidade a som',
  'Sensibilidade a toque',
  'Agressividade',
  'Ansiedade'
];

const TRIGGER_OPTIONS = [
  'Lugares cheios',
  'Barulho alto',
  'Mudança de rotina',
  'Luzes fortes',
  'Texturas de roupas',
  'Outros'
];

export const ProfilePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [profile, setProfile] = useState<ChildProfile>({
    name: '',
    age: '',
    gender: '',
    behaviors: [],
    triggers: [],
    calmingMethods: '',
    favoriteActivities: ''
  });

  useEffect(() => {
    if (user) {
      const loadProfile = async () => {
        const data = await api.getChildProfile(user.id);
        if (data) setProfile(data);
      };
      loadProfile();
    }
  }, [user]);

  if (!user) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.saveChildProfile(user.id, profile);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Erro ao salvar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const toggleBehavior = (behavior: string) => {
    setProfile(prev => ({
      ...prev,
      behaviors: prev.behaviors.includes(behavior)
        ? prev.behaviors.filter(b => b !== behavior)
        : [...prev.behaviors, behavior]
    }));
  };

  const toggleTrigger = (trigger: string) => {
    setProfile(prev => ({
      ...prev,
      triggers: prev.triggers.includes(trigger)
        ? prev.triggers.filter(t => t !== trigger)
        : [...prev.triggers, trigger]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl border-x border-slate-200 overflow-hidden">
      <header className="bg-white p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Meu Perfil</h1>
        </div>
        {user.role === 'user' && (
          <button 
            onClick={handleSave}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              saveSuccess 
                ? 'bg-green-500 text-white' 
                : 'bg-orange-400 text-white hover:bg-orange-500 active:scale-95'
            }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saveSuccess ? 'Salvo!' : 'Salvar'}
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto pb-12">
        {/* User Info Section */}
        <section className="p-6 bg-white border-b border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 font-black text-2xl shadow-inner">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">{user.name}</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                {user.role === 'admin' ? 'Administrador' : 'Usuário AutiCalma'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3 border border-slate-100">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-slate-600">{user.email}</span>
            </div>
          </div>
        </section>

        {user.role === 'user' && (
          <>
            {/* Child Profile Section */}
            <section className="p-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Baby className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-black text-slate-800">Dados da Criança</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 ml-1">Nome da Criança</label>
                  <input 
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    placeholder="Ex: Pedro"
                    className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 font-bold text-slate-700 shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 ml-1">Idade</label>
                    <input 
                      type="number"
                      value={profile.age}
                      onChange={(e) => setProfile({...profile, age: e.target.value})}
                      placeholder="Anos"
                      className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 font-bold text-slate-700 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 ml-1">Gênero</label>
                    <select 
                      value={profile.gender}
                      onChange={(e) => setProfile({...profile, gender: e.target.value})}
                      className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 font-bold text-slate-700 shadow-sm appearance-none"
                    >
                      <option value="">Opcional</option>
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Behaviors */}
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-black text-slate-800">Comportamentos</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {BEHAVIOR_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => toggleBehavior(opt)}
                      className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all flex items-center justify-between ${
                        profile.behaviors.includes(opt)
                          ? 'bg-orange-50 border-orange-200 text-orange-600'
                          : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {opt}
                      {profile.behaviors.includes(opt) && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Triggers */}
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-black text-slate-800">Gatilhos Comuns</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRIGGER_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => toggleTrigger(opt)}
                      className={`px-4 py-2 rounded-full border font-bold text-xs transition-all ${
                        profile.triggers.includes(opt)
                          ? 'bg-slate-800 border-slate-800 text-white'
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-black text-slate-800">Preferências</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 ml-1">O que acalma a criança?</label>
                    <textarea 
                      value={profile.calmingMethods}
                      onChange={(e) => setProfile({...profile, calmingMethods: e.target.value})}
                      placeholder="Ex: Ouvir música clássica, abraço apertado..."
                      rows={3}
                      className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 font-bold text-slate-700 shadow-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 ml-1">Atividades favoritas</label>
                    <textarea 
                      value={profile.favoriteActivities}
                      onChange={(e) => setProfile({...profile, favoriteActivities: e.target.value})}
                      placeholder="Ex: Montar blocos, desenhar, parques..."
                      rows={3}
                      className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 font-bold text-slate-700 shadow-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button at bottom */}
              <div className="pt-6">
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-lg ${
                    saveSuccess 
                      ? 'bg-green-500 text-white' 
                      : 'bg-orange-400 text-white hover:bg-orange-500 active:scale-95'
                  }`}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : saveSuccess ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Save className="w-6 h-6" />
                  )}
                  {saveSuccess ? 'Perfil Atualizado!' : 'Salvar Perfil'}
                </button>
              </div>
            </section>
          </>
        )}

        {/* Logout Section */}
        <section className="p-6 mt-4">
          <button 
            onClick={() => {
              logout();
              onBack();
            }}
            className="w-full py-4 bg-rose-50 text-rose-500 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair da Conta
          </button>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-300 font-medium">AutiCalma v1.1.0 • Personalização Ativa</p>
          </div>
        </section>
      </div>
    </div>
  );
};

