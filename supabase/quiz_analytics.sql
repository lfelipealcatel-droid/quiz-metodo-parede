-- =============================================================================
-- Quiz VITTALLE — Camada de analytics append-only (quiz_events)
--
-- INSTRUÇÕES PARA O FOUNDER:
-- 1. Abra o projeto Supabase de PRODUÇÃO (o mesmo cujo Project URL e anon key
--    vão para o .env do quiz).
-- 2. Vá em SQL Editor > New query.
-- 3. Cole TODO o conteúdo deste arquivo e clique em Run.
-- 4. Rode uma vez só. É seguro rodar de novo (usa "if not exists" / "or replace"
--    onde possível), mas não precisa.
--
-- O QUE ISSO CRIA:
-- - Uma única tabela nova: public.quiz_events.
-- - Essa tabela é append-only: o app (chave anon) só tem permissão de INSERT.
--   Não existe policy de SELECT/UPDATE/DELETE para anon — ou seja, o próprio
--   quiz (rodando no navegador do usuário) NUNCA consegue ler, alterar ou
--   apagar dados desta tabela ou de qualquer outra.
--
-- O QUE ISSO NÃO TOCA:
-- - Nenhuma tabela existente do seu projeto (profiles, purchases, entitlements,
--   webhook_events, etc.) é lida, alterada ou referenciada por este script.
-- - Nenhum trigger, função ou policy de outra tabela é modificado.
-- =============================================================================

create table if not exists public.quiz_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  event_type text not null,
  step_order int,
  step_name text,
  step_type text,
  question_id text,
  question_text text,
  answer_value jsonb,
  answer_label jsonb,
  payload jsonb,
  diagnosis_code text,
  utms jsonb,
  created_at timestamptz not null default now()
);

-- Índices para consultas comuns (por sessão, por tipo de evento, por período).
create index if not exists quiz_events_session_id_idx on public.quiz_events (session_id);
create index if not exists quiz_events_event_type_idx  on public.quiz_events (event_type);
create index if not exists quiz_events_created_at_idx  on public.quiz_events (created_at);

-- ─── Segurança: RLS + apenas INSERT para anon ────────────────────────────────
alter table public.quiz_events enable row level security;

-- Remove qualquer privilégio herdado por padrão antes de conceder só o INSERT.
revoke all on table public.quiz_events from anon, authenticated;

grant insert on table public.quiz_events to anon;

drop policy if exists "anon can insert quiz events" on public.quiz_events;
create policy "anon can insert quiz events"
  on public.quiz_events
  for insert
  to anon
  with check (true);

-- NENHUMA policy de SELECT/UPDATE/DELETE é criada para anon nem authenticated.
-- Isso significa: o cliente do quiz (chave anon, rodando no navegador) só
-- consegue INSERIR eventos. Não existe forma de ler, alterar ou apagar dados
-- desta tabela usando a chave anon.

-- =============================================================================
-- USO FUTURO (dashboard admin) — NÃO EXECUTAR AGORA, deixado comentado de
-- propósito. Quando o dashboard for construído, escolher UMA das opções:
--
-- OPÇÃO 1 — Dashboard usa a service_role key (recomendado para um script/admin
-- tool interno, nunca exposto no navegador). service_role já ignora RLS
-- automaticamente, então nenhuma policy adicional é necessária.
--
-- OPÇÃO 2 — Dashboard com login de usuário autenticado (Supabase Auth) lendo
-- direto do navegador. Nesse caso, ativar a policy de SELECT abaixo:
--
-- create policy "authenticated can read quiz events"
--   on public.quiz_events
--   for select
--   to authenticated
--   with check (true);
--
-- Não ativar nenhuma das duas opções sem necessidade — a tabela deve
-- permanecer "escrita apenas" pelo cliente até que o dashboard exista.
-- =============================================================================
