import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/auth-context';
import { getAdministradoras } from '../api/administradoras';
import { importLotes, type ImportLoteResult } from '../api/imports';

export default function ImportLotes() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [administradoraId, setAdministradoraId] = useState('');
  const [results, setResults] = useState<ImportLoteResult[] | null>(null);

  const { data: administradoras } = useQuery({
    queryKey: ['administradoras'],
    queryFn: getAdministradoras,
  });
  const administradorasList = administradoras ?? [];

  const mutation = useMutation({
    mutationFn: () =>
      importLotes(
        file!,
        user?.role === 'SUPER_ADMIN' ? administradoraId : undefined
      ),
    onSuccess: (data) => setResults(data),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setResults(null);
    mutation.mutate();
  }

  function downloadTemplate() {
    const csv = 'quadra_id,number,area,latitude,longitude\n<uuid-da-quadra>,1,250.5,-23.1436,-48.4248\n<uuid-da-quadra>,2,300,-23.1437,-48.4249\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lotes-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadCsv() {
    if (!results) return;
    const header =
      'quadra_id,number,area,latitude,longitude,created,error\n';
    const rows = results
      .map(
        (r) =>
          `${r.quadraId},${r.number},${r.area ?? ''},${r.latitude ?? ''},${r.longitude ?? ''},${r.created},${r.error ?? ''}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lotes-import-result.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page">
      <h1>Importar lotes</h1>
      <p className="hint">
        CSV: quadra_id, number, area (opcional), latitude (opcional),
        longitude (opcional)
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
                <th>Quadra</th>
                <th>Numero</th>
                <th>Area</th>
                <th>Lat</th>
                <th>Lng</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td>{r.quadraId}</td>
                  <td>{r.number}</td>
                  <td>{r.area ?? '-'}</td>
                  <td>{r.latitude ?? '-'}</td>
                  <td>{r.longitude ?? '-'}</td>
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
