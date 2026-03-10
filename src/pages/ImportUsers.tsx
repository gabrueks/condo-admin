import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/auth-context';
import { getAdministradoras } from '../api/administradoras';
import { importUsers, type ImportUserResult } from '../api/imports';

export default function ImportUsers() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [administradoraId, setAdministradoraId] = useState('');
  const [results, setResults] = useState<ImportUserResult[] | null>(null);

  const { data: administradoras } = useQuery({
    queryKey: ['administradoras'],
    queryFn: getAdministradoras,
  });
  const administradorasList = administradoras ?? [];

  const mutation = useMutation({
    mutationFn: () =>
      importUsers(file!, user?.role === 'SUPER_ADMIN' ? administradoraId : undefined),
    onSuccess: (data) => setResults(data),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setResults(null);
    mutation.mutate();
  }

  function downloadTemplate() {
    const csv = 'cpf,name,email,phone\n12345678901,Joao Silva,joao@email.com,11999999999\n98765432100,Maria Santos,,\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadCsv() {
    if (!results) return;
    const header = 'cpf,name,temporaryPassword,created,error\n';
    const rows = results
      .map(
        (r) =>
          `${r.cpf},${r.name},${r.temporaryPassword},${r.created},${r.error ?? ''}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-import-result.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page">
      <h1>Importar usuarios</h1>
      <p className="hint">
        CSV: cpf, name, email (opcional), phone (opcional). Senha gerada automaticamente.
      </p>
      <button type="button" onClick={downloadTemplate} className="btn-outline">
        Baixar template
      </button>

      <form onSubmit={handleSubmit} className="section">
        {user?.role === 'SUPER_ADMIN' && (
          <div className="field">
            <label>Administradora (opcional - usa padrao se vazio)</label>
            <select
              value={administradoraId}
              onChange={(e) => setAdministradoraId(e.target.value)}
            >
              <option value="">Selecione</option>
              {administradorasList.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="field">
          <label>Arquivo CSV</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
          />
        </div>
        {mutation.error && (
          <p className="error">
            {(mutation.error as { response?: { data?: { message?: string } } })
              ?.response?.data?.message ?? 'Erro ao importar'}
          </p>
        )}
        <button type="submit" disabled={!file || mutation.isPending}>
          {mutation.isPending ? 'Importando...' : 'Importar'}
        </button>
      </form>

      {results && (
        <div className="section">
          <h2>Resultado</h2>
          <p>
            Criados: {results.filter((r) => r.created).length} / Erros:{' '}
            {results.filter((r) => !r.created).length}
          </p>
          <button onClick={downloadCsv} className="btn-primary">
            Baixar resultado CSV
          </button>
          <table>
            <thead>
              <tr>
                <th>CPF</th>
                <th>Nome</th>
                <th>Senha temporaria</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td>{r.cpf}</td>
                  <td>{r.name}</td>
                  <td>{r.temporaryPassword || '-'}</td>
                  <td>{r.created ? 'OK' : r.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
