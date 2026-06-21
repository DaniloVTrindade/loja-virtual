import React, { useMemo, useState } from 'react';
import { LockKeyhole, Mail, ShieldCheck, UserPlus, UserRound, Users } from 'lucide-react';
import { AuthRecord, ManagerProfile, StoreAccount } from '../types';

interface AuthPanelProps {
  managers: ManagerProfile[];
  clientAccounts: AuthRecord[];
  managerAccounts: AuthRecord[];
  onRegisterClient: (account: AuthRecord) => void;
  onSaveManagerPassword: (account: AuthRecord) => void;
  onLogin: (account: StoreAccount) => void;
  onBack: () => void;
  highContrast: boolean;
}

const avatarForName = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Cliente')}&background=312e81&color=fff&bold=true`;

export const AuthPanel: React.FC<AuthPanelProps> = ({
  managers,
  clientAccounts,
  managerAccounts,
  onRegisterClient,
  onSaveManagerPassword,
  onLogin,
  onBack,
  highContrast
}) => {
  const [mode, setMode] = useState<'client-login' | 'client-register' | 'manager'>('client-register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [selectedManagerId, setSelectedManagerId] = useState(managers[0]?.id || '');
  const [managerPassword, setManagerPassword] = useState('');
  const [message, setMessage] = useState('');

  const selectedManager = managers.find((manager) => manager.id === selectedManagerId) || managers[0];
  const selectedManagerAccount = useMemo(
    () => managerAccounts.find((account) => account.id === selectedManagerId),
    [managerAccounts, selectedManagerId]
  );
  const managerHasPassword = Boolean(selectedManagerAccount);

  const resetMessage = () => setMessage('');

  const handleClientRegister = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessage();
    if (!name.trim() || !email.trim() || password.length < 4) {
      setMessage('Preencha nome, e-mail e uma senha com pelo menos 4 caracteres.');
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (clientAccounts.some((account) => account.email.toLowerCase() === normalizedEmail)) {
      setMessage('Esse e-mail ja esta cadastrado. Use a aba Entrar como cliente.');
      return;
    }

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
    onRegisterClient(account);
    onLogin(account);
  };

  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessage();
    const account = clientAccounts.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
    if (!account || account.password !== password) {
      setMessage('E-mail ou senha de cliente incorretos.');
      return;
    }
    onLogin(account);
  };

  const handleManagerAccess = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessage();
    if (!selectedManager || managerPassword.length < 4) {
      setMessage('A senha do gerente precisa ter pelo menos 4 caracteres.');
      return;
    }

    if (!managerHasPassword) {
      const account: AuthRecord = {
        id: selectedManager.id,
        role: 'manager',
        name: selectedManager.name,
        email: selectedManager.email,
        avatar: selectedManager.avatar,
        password: managerPassword,
        createdAt: new Date().toISOString()
      };
      onSaveManagerPassword(account);
      onLogin(account);
      return;
    }

    if (selectedManagerAccount?.password !== managerPassword) {
      setMessage('Senha de gerente incorreta.');
      return;
    }
    onLogin(selectedManagerAccount);
  };

  const fieldClass = 'w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500';

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
              <p className="text-xs text-indigo-200">Cadastro de cliente e acesso gerencial</p>
            </div>
          </div>

          <div className="mt-10 space-y-5 text-sm leading-relaxed">
            <div className="flex gap-3">
              <UserPlus className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p>Clientes criam a propria conta, informam nome, e-mail, senha e endereco para acessar compras e pedidos.</p>
            </div>
            <div className="flex gap-3">
              <Users className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
              <p>Gerentes usam perfis fixos da loja. No primeiro acesso, cada gerente cadastra sua senha diretamente aqui.</p>
            </div>
            <div className="flex gap-3">
              <LockKeyhole className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <p>As contas ficam salvas neste navegador. Em producao, isso vira backend com senha criptografada e recuperacao segura.</p>
            </div>
          </div>
        </section>

        <section className="p-8 lg:p-10">
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { id: 'client-register', label: 'Cadastrar', icon: UserPlus },
              { id: 'client-login', label: 'Cliente', icon: UserRound },
              { id: 'manager', label: 'Gerente', icon: ShieldCheck }
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

          {mode === 'client-register' && (
            <form onSubmit={handleClientRegister} className="space-y-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-indigo-600">Novo cliente</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight">Criar conta</h2>
              </div>
              <input className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" />
              <input className={fieldClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" type="email" />
              <input className={fieldClass} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" type="password" />
              <input className={fieldClass} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Endereco principal opcional" />
              <button type="submit" className="w-full py-4 rounded-2xl bg-indigo-600 text-white text-sm font-black hover:bg-indigo-700 shadow-lg">
                Cadastrar e entrar
              </button>
            </form>
          )}

          {mode === 'client-login' && (
            <form onSubmit={handleClientLogin} className="space-y-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-indigo-600">Cliente cadastrado</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight">Entrar na conta</h2>
              </div>
              <input className={fieldClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" type="email" />
              <input className={fieldClass} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" type="password" />
              <button type="submit" className="w-full py-4 rounded-2xl bg-indigo-600 text-white text-sm font-black hover:bg-indigo-700 shadow-lg">
                Entrar como cliente
              </button>
              {clientAccounts.length === 0 && (
                <p className="text-xs text-slate-500">Ainda nao existe cliente cadastrado neste navegador.</p>
              )}
            </form>
          )}

          {mode === 'manager' && (
            <form onSubmit={handleManagerAccess} className="space-y-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-indigo-600">Equipe Indigo White</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight">Acesso de gerente</h2>
              </div>
              <select className={fieldClass} value={selectedManagerId} onChange={(e) => { setSelectedManagerId(e.target.value); setManagerPassword(''); setMessage(''); }}>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name} - {managerAccounts.some((account) => account.id === manager.id) ? 'senha cadastrada' : 'cadastrar senha'}
                  </option>
                ))}
              </select>
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                <img src={selectedManager.avatar} alt={selectedManager.name} className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-black">{selectedManager.name}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {selectedManager.email}
                  </p>
                </div>
              </div>
              <input
                className={fieldClass}
                value={managerPassword}
                onChange={(e) => setManagerPassword(e.target.value)}
                placeholder={managerHasPassword ? 'Senha do gerente' : 'Crie uma senha para este gerente'}
                type="password"
              />
              <button type="submit" className="w-full py-4 rounded-2xl bg-slate-950 text-white text-sm font-black hover:bg-indigo-900 shadow-lg">
                {managerHasPassword ? 'Entrar como gerente' : 'Cadastrar senha e entrar'}
              </button>
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
