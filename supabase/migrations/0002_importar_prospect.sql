-- Inserts a company and its single contact atomically. Returns false, inserting nothing,
-- when the domain or the email is already registered or blocked.
create or replace function importar_prospect(
  p_dominio text,
  p_nome_empresa text,
  p_cidade text,
  p_email text,
  p_snov_prospect_id text,
  p_primeiro_nome text,
  p_cargo text,
  p_lista_origem text
) returns boolean
language plpgsql as $$
declare
  v_empresa_id uuid;
begin
  if exists (select 1 from bloqueados
              where email = lower(p_email)
                 or dominio in (lower(p_dominio), split_part(lower(p_email), '@', 2))) then
    return false;
  end if;

  insert into empresas (dominio, nome, cidade)
  values (lower(p_dominio), p_nome_empresa, p_cidade)
  on conflict (dominio) do nothing
  returning id into v_empresa_id;

  if v_empresa_id is null then
    return false;
  end if;

  insert into prospects (empresa_id, email, snov_prospect_id, primeiro_nome, cargo, lista_origem)
  values (v_empresa_id, lower(p_email), p_snov_prospect_id, p_primeiro_nome, p_cargo, p_lista_origem)
  on conflict (email) do nothing;

  if not found then
    -- Email already belongs to another company: undo the empresa insert.
    raise exception using errcode = 'P0001', message = 'email_ja_existe';
  end if;

  return true;
exception
  when raise_exception then
    if sqlerrm = 'email_ja_existe' then
      return false;
    end if;
    raise;
end;
$$;

revoke execute on function importar_prospect(text, text, text, text, text, text, text, text) from public;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke execute on function importar_prospect(text, text, text, text, text, text, text, text) from anon, authenticated;
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function importar_prospect(text, text, text, text, text, text, text, text) to service_role;
  end if;
end;
$$;
