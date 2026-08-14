-- grème compatibility setup for the existing Supabase project.
-- Review and run this in the Supabase SQL editor.
-- It does not delete or replace existing tables or data.

grant usage on schema public to anon, authenticated;

-- The catalog is intended to be publicly browsable.
grant select on table public.products to anon, authenticated;
alter table public.products enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'products'
      and policyname = 'grème public product catalog'
  ) then
    create policy "grème public product catalog"
      on public.products
      for select
      to anon, authenticated
      using (true);
  end if;
end
$$;

-- Existing orders gain an owner reference without changing existing rows.
alter table public.orders
  add column if not exists user_id uuid references auth.users(id);

grant select, insert on table public.orders to authenticated;
grant select, insert on table public.order_items to authenticated;

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'orders'
      and policyname = 'grème users read own orders'
  ) then
    create policy "grème users read own orders"
      on public.orders
      for select
      to authenticated
      using (user_id = auth.uid());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'orders'
      and policyname = 'grème users create own orders'
  ) then
    create policy "grème users create own orders"
      on public.orders
      for insert
      to authenticated
      with check (user_id = auth.uid());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'order_items'
      and policyname = 'grème users read own order items'
  ) then
    create policy "grème users read own order items"
      on public.order_items
      for select
      to authenticated
      using (
        exists (
          select 1
          from public.orders
          where orders.id = order_items.order_id
            and orders.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'order_items'
      and policyname = 'grème users create own order items'
  ) then
    create policy "grème users create own order items"
      on public.order_items
      for insert
      to authenticated
      with check (
        exists (
          select 1
          from public.orders
          where orders.id = order_items.order_id
            and orders.user_id = auth.uid()
        )
      );
  end if;
end
$$;