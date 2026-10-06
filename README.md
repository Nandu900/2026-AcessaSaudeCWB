# AcessaSaudeCWB

Protótipo acadêmico de um aplicativo para facilitar o acesso a serviços de saúde em Curitiba. O projeto demonstra fluxos de atendimento, seleção de unidades, registro de triagens e consulta de informações em uma planilha Google.

## Demonstração

[Abrir o aplicativo publicado](https://2026-acessa-saude-cwb.vercel.app/)

## Funcionalidades

- Cadastro de nome, e-mail e telefone no perfil da sessão do navegador, sem autenticação.
- Seleção de especialidade e sintomas rápidos, com campo separado para observações.
- Consulta das unidades cadastradas na aba `Unidades` e contagem de agendamentos por unidade.
- Registro de solicitações de atendimento e de triagens de urgência.
- Consulta de agendamentos e triagens pelo e-mail informado no perfil.
- Dados fictícios de demonstração em `Acompanhar`.

## Tecnologias

- Next.js e React
- TypeScript
- Tailwind CSS
- Google Sheets e Google Apps Script
- Vercel

## Estrutura

O aplicativo Next.js está dentro de `AcessaSaudeCWB/`. O script para integrar a planilha fica em [`AcessaSaudeCWB/scripts/Code.gs`](AcessaSaudeCWB/scripts/Code.gs).

## Executar localmente

Requisitos: Node.js 20.9 ou superior e pnpm.

```bash
git clone https://github.com/Nandu900/2026-AcessaSaudeCWB.git
cd 2026-AcessaSaudeCWB/AcessaSaudeCWB
pnpm install
cp .env.example .env.local
```

Abra `.env.local` e preencha `GOOGLE_APPS_SCRIPT_URL` com a URL do App da Web do Apps Script, terminada em `/exec`. Em seguida, inicie o aplicativo:

```bash
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000). Para verificar os tipos:

```bash
pnpm exec tsc --noEmit
```

Sem `GOOGLE_APPS_SCRIPT_URL`, as telas abrem, mas os recursos conectados à planilha não funcionam.

## Configurar uma planilha própria

1. Crie ou abra uma planilha Google e deixe a aba `Unidades` preenchida com as unidades de demonstração.
2. Na própria planilha, abra **Extensões → Apps Script** e copie [`Code.gs`](AcessaSaudeCWB/scripts/Code.gs) para o editor.
3. Execute `setupSheets` e autorize o script. Ele cria as abas necessárias e completa cabeçalhos ausentes sem apagar linhas existentes.
4. Em **Implantar → Nova implantação → App da Web**, escolha **Executar como: eu** e **Quem pode acessar: qualquer pessoa**. Copie a URL terminada em `/exec`.
5. Use essa URL em `GOOGLE_APPS_SCRIPT_URL` no `.env.local` para o teste local e nas variáveis de ambiente do Vercel para o deploy.

O script utiliza as abas `Unidades`, `Agendamentos`, `Triagens` e `Acessos`. As contagens dos cards são calculadas a partir dos registros de Agendamentos, relacionando primeiro pelo `UnidadeID` e usando o nome da unidade como alternativa para registros antigos.

## Publicação

O projeto publicado no Vercel usa `AcessaSaudeCWB` como **Root Directory** e a variável de ambiente `GOOGLE_APPS_SCRIPT_URL`. Se o repositório estiver conectado ao Vercel, um push para `main` inicia um novo deploy.

## Limitações do protótipo

- Não há autenticação: nome, e-mail e telefone ficam no `sessionStorage` da aba atual. O filtro por e-mail em Acompanhar serve para demonstração, não como controle de acesso seguro.
- O App da Web do Apps Script é acessível conforme as permissões configuradas na implantação. Use somente dados fictícios; não registre dados reais de saúde ou informações sensíveis.
- As filas e alguns registros em Acompanhar são exemplos demonstrativos. Um agendamento com status `Solicitado` não representa uma vaga confirmada pela unidade.
- A integração com Google Sheets é destinada à demonstração acadêmica e não substitui um sistema clínico ou de atendimento de emergência.
