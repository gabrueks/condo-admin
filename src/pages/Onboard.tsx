import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { onboard, type OnboardBody } from '../api/onboard';

type Step = 1 | 2 | 3 | 4;

export default function Onboard() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<OnboardBody>({
    administradora: { name: '', slug: '' },
    empreendimento: { name: '', slug: '', address: '', city: '', state: '' },
    adminUser: { cpf: '', name: '', password: '', email: '', phone: '' },
    structure: undefined,
  });
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: onboard,
    onSuccess: () => {
      navigate('/');
    },
  });

  function updateAdmin(f: Partial<OnboardBody['administradora']>) {
    setForm((s) => ({
      ...s,
      administradora: { ...s.administradora, ...f },
    }));
  }
  function updateEmp(f: Partial<OnboardBody['empreendimento']>) {
    setForm((s) => ({
      ...s,
      empreendimento: { ...s.empreendimento, ...f },
    }));
  }
  function updateUser(f: Partial<OnboardBody['adminUser']>) {
    setForm((s) => ({
      ...s,
      adminUser: { ...s.adminUser, ...f },
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 4) {
      setStep((s) => (s + 1) as Step);
    } else {
      const body: OnboardBody = {
        ...form,
        adminUser: {
          ...form.adminUser,
          email: form.adminUser.email || undefined,
          phone: form.adminUser.phone || undefined,
        },
        empreendimento: {
          ...form.empreendimento,
          address: form.empreendimento.address || undefined,
          city: form.empreendimento.city || undefined,
          state: form.empreendimento.state || undefined,
        },
      };
      mutation.mutate(body);
    }
  }

  return (
    <div className="page">
      <h1>Nova venda / Onboarding</h1>
      <p className="step-indicator">Passo {step} de 4</p>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="section">
            <h2>Administradora</h2>
            <div className="field">
              <label>Nome</label>
              <input
                type="text"
                value={form.administradora.name}
                onChange={(e) => updateAdmin({ name: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Slug</label>
              <input
                type="text"
                value={form.administradora.slug}
                onChange={(e) =>
                  updateAdmin({ slug: e.target.value.replace(/[^a-z0-9-]/g, '') })
                }
                placeholder="ex: momentum"
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="section">
            <h2>Empreendimento</h2>
            <div className="field">
              <label>Nome</label>
              <input
                type="text"
                value={form.empreendimento.name}
                onChange={(e) => updateEmp({ name: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Slug</label>
              <input
                type="text"
                value={form.empreendimento.slug}
                onChange={(e) =>
                  updateEmp({ slug: e.target.value.replace(/[^a-z0-9-]/g, '') })
                }
                placeholder="ex: ninho-verde-ii"
                required
              />
            </div>
            <div className="field">
              <label>Endereco (opcional)</label>
              <input
                type="text"
                value={form.empreendimento.address}
                onChange={(e) => updateEmp({ address: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Cidade / Estado (opcional)</label>
              <input
                type="text"
                value={form.empreendimento.city}
                onChange={(e) => updateEmp({ city: e.target.value })}
                placeholder="Cidade"
              />
              <input
                type="text"
                value={form.empreendimento.state}
                onChange={(e) => updateEmp({ state: e.target.value })}
                placeholder="UF"
                maxLength={2}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="section">
            <h2>Primeiro admin</h2>
            <div className="field">
              <label>CPF (11 digitos)</label>
              <input
                type="text"
                value={form.adminUser.cpf}
                onChange={(e) =>
                  updateUser({ cpf: e.target.value.replace(/\D/g, '').slice(0, 11) })
                }
                required
              />
            </div>
            <div className="field">
              <label>Nome</label>
              <input
                type="text"
                value={form.adminUser.name}
                onChange={(e) => updateUser({ name: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Senha</label>
              <input
                type="password"
                value={form.adminUser.password}
                onChange={(e) => updateUser({ password: e.target.value })}
                required
                minLength={6}
              />
            </div>
            <div className="field">
              <label>Email (opcional)</label>
              <input
                type="email"
                value={form.adminUser.email}
                onChange={(e) => updateUser({ email: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Telefone (opcional)</label>
              <input
                type="text"
                value={form.adminUser.phone}
                onChange={(e) => updateUser({ phone: e.target.value })}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="section">
            <h2>Confirmar</h2>
            <p>Administradora: {form.administradora.name} ({form.administradora.slug})</p>
            <p>Empreendimento: {form.empreendimento.name} ({form.empreendimento.slug})</p>
            <p>Admin: {form.adminUser.name} (CPF {form.adminUser.cpf})</p>
            <p className="hint">Estrutura (setores/quadras/lotes) pode ser criada depois pelo admin.</p>
          </div>
        )}

        {mutation.error && (
          <p className="error">
            {(mutation.error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? 'Erro ao criar'}
          </p>
        )}

        <div className="form-actions">
          {step > 1 && (
            <button type="button" onClick={() => setStep((s) => (s - 1) as Step)}>
              Voltar
            </button>
          )}
          <button type="submit" disabled={mutation.isPending}>
            {step < 4 ? 'Proximo' : mutation.isPending ? 'Criando...' : 'Criar'}
          </button>
        </div>
      </form>
    </div>
  );
}
