# condo-admin

Super-admin panel for Momentum. Create administradoras, empreendimentos, import users/lotes, and first admin users.

## Setup

1. `npm install`
2. `condo-api` must be running on port 3000
3. `npm run dev` (runs on port 5174, proxies API to /api)

## Usage

Login with SUPER_ADMIN credentials (CPF + password from seed: 99999999999 / super123).

- **Dashboard**: Overview of administradoras and empreendimentos
- **Administradoras**: List and create administradoras
- **Nova venda**: Onboarding wizard (administradora + empreendimento + first admin user in one flow)
- **Importar usuarios**: CSV import. Columns: cpf, name, email (optional), phone (optional). Auto-generated password returned per row.
- **Importar lotes**: CSV import. Columns: quadra_id, number, area (optional), latitude (optional), longitude (optional)
- **Novo lote**: Single lot creation with coordinates

## CSV templates

**Users** (users.csv):
```csv
cpf,name,email,phone
12345678901,Joao Silva,joao@email.com,11999999999
98765432100,Maria Santos,,
```

**Lotes** (lotes.csv):
```csv
quadra_id,number,area,latitude,longitude
<uuid-da-quadra>,1,250.5,-23.1436,-48.4248
<uuid-da-quadra>,2,300,-23.1437,-48.4249
```

## Env

- `VITE_API_URL`: API base URL (default: /api in dev, http://localhost:3000 in prod)
