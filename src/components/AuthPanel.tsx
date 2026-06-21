import React, { useMemo, useState } from 'react';
import { LockKeyhole, Mail, ShieldCheck, UserPlus, UserRound } from 'lucide-react';
import { AuthRecord, ManagerProfile } from '../types';

interface AuthPanelProps {
  portal: 'public' | 'admin';
  managers: ManagerProfile[];
  onRegisterAccount: (account: AuthRecord) => void;
  onLoginRequest: (role: 'client' | 'manager', email: string, password: string) => Promise<AuthRecord>;
  onLogin: (account: AuthRecord) => void;
  onBack: () => void;
  highContrast: boolean;
}

const avatarForName = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Cliente')}&background=312e81&color=fff&bold=true`;

const TEAM_CODE = 'IW-TEAM-2026';

export const AuthPanel: React.FC<AuthPanelProps> = ({
  portal,
  managers,
  onRegisterAccount,
  onLoginRequest,
  onLogin,
  onBack,
  highContrast
}) => {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [managerId, setManagerId] = useState(managers[0]?.id || '');
  const [teamCode, setTeamCode] = useState('');
  const [message, setMessage] = useState('');

  const selectedManager = useMemo(
    () => managers.find((manager) => manager.id === managerId) || managers[0],
    [managers, managerId]
  );

  const fieldClass = 'w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500';

  const showError = (text: string) => setMessage(text);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const normalizedEmail = email.trim().toLowerCase();
    if (!name.trim() || !normalizedEmail || password.length < 4) {
      showError('Preencha nome, e-mail e uma senha com pelo menos 4 caracteres.');
      return;
    }

    if (portal === 'public') {
      const account: AuthRecord = {
        id: `client-${Date.now()}`,
        role: 'client',
        name: name.trim(),
        email: normalizedEmail,
        avatar: avatarForName(name.trim()),
        password,
        createdAt: new Date().toISOString(),
        savedAddresses: address.trim() ? [address.trim()] : []
      };
      Promise.resolve(onRegisterAccount(account));
      return;
    }

    if (teamCode.trim() !== TEAM_CODE) {
      showError('Codigo interno de equipe incorreto.');
      return;
    }

    const manager = selectedManager;
    const account: AuthRecord = {
      id: manager.id,
      role: 'manager',
      name: manager.name,
      email: normalizedEmail || manager.email,
      avatar: manager.avatar,
      password,
      createdAt: new Date().toISOString()
    };
    Promise.resolve(onRegisterAccount(account));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    onLoginRequest(portal === 'admin' ? 'manager' : 'client', email.trim(), password)
      .then((account) => onLogin(account))
      .catch(() => showError('E-mail ou senha incorretos.'));
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-[2rem] border overflow-hidden shadow-xl ${
        highContrast ? 'bg-black text-yellow-300 border-yellow-400' : 'bg-white text-slate-800 border-slate-200'
      }`}>
        <section className={`p-8 lg:p-10 ${
          highContrast ? 'bg-zinc-900' : 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white text-indigo-800 flex items-center justify-center font-black text-xl">IW</div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Indigo White</h1>
              <p className="text-xs text-indigo-200">
                {portal === 'admin' ? 'Area restrita' : 'Cadastro e acesso do cliente'}
              </p>
            </div>
          </div>

          <div className="mt-10 space-y-5 text-sm leading-relaxed">
            <div className="flex gap-3">
              <UserPlus className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p>Clientes criam a propria conta e entram na loja sem complicacao.</p>
            </div>
            <div className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
                <p>
                  {portal === 'admin'
                    ? 'O acesso interno fica reservado para quem tem o caminho oculto da equipe.'
                    : 'A interface publica mostra somente o fluxo do cliente.'}
                </p>
            </div>
            <div className="flex gap-3">
              <LockKeyhole className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <p>As contas ficam salvas neste navegador. Em producao, isso deve ir para um banco real com senha segura.</p>
            </div>
          </div>
        </section>

        <section className="p-8 lg:p-10">
          <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              { id: 'register', label: 'Cadastrar', icon: UserPlus },
              { id: 'login', label: 'Entrar', icon: UserRound }
            ].map((item) => {
              const Icon = item.icon;
              const active = mode === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setMode(item.id as typeof mode); setMessage(''); }}
                  className={`px-3 py-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 ${
                    active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {message && (
            <div className="mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
              {message}
            </div>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-indigo-600">Novo cadastro</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  {portal === 'admin' ? 'Cadastrar gerente' : 'Criar conta'}
                </h2>
              </div>

              <input className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" />
              <input className={fieldClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" type="email" />
              <input className={fieldClass} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" type="password" />
              <input className={fieldClass} value={address} onChange={(e) => setAddress(e.target.value)} placeholder={portal === 'admin' ? 'Endereco interno opcional' : 'Endereco principal opcional'} />

              {portal === 'admin' && (
                <>
                  <select
                    value={managerId}
                    onChange={(e) => setManagerId(e.target.value)}
                    className={fieldClass}
                  >
                    {managers.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name}
                      </option>
                    ))}
                  </select>
                  <input
                    className={fieldClass}
                    value={teamCode}
                    onChange={(e) => setTeamCode(e.target.value)}
                    placeholder="Codigo interno da equipe"
                    type="password"
                  />
                </>
              )}

              <button type="submit" className="w-full py-4 rounded-2xl bg-indigo-600 text-white text-sm font-black hover:bg-indigo-700 shadow-lg">
                {portal === 'admin' ? 'Cadastrar gerente e entrar' : 'Cadastrar e entrar'}
              </button>
            </form>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-indigo-600">Conta existente</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight">Entrar na conta</h2>
              </div>
              <input className={fieldClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" type="email" />
              <input className={fieldClass} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" type="password" />
              <button type="submit" className="w-full py-4 rounded-2xl bg-indigo-600 text-white text-sm font-black hover:bg-indigo-700 shadow-lg">
                Entrar
              </button>
              <p className="text-xs text-slate-500">
                {portal === 'admin'
                  ? 'Acesso reservado para a equipe.'
                  : 'Seu perfil fica salvo no navegador para este prototipo.'}
              </p>
            </form>
          )}

          <button type="button" onClick={onBack} className="mt-4 w-full py-3 rounded-2xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50">
            Voltar para a loja
          </button>
        </section>
      </div>
    </main>
  );
};
