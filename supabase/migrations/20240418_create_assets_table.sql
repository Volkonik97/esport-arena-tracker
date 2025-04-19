-- Create assets table for storing team and tournament logos
create table if not exists public.assets (
    id uuid default gen_random_uuid() primary key,
    entity_type text not null check (entity_type in ('team', 'tournament')),
    name text not null,
    logo_url text not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Unique constraint to prevent duplicates
    unique(entity_type, name)
);

-- Add RLS policies
alter table public.assets enable row level security;

-- Allow anyone to read assets
create policy "Assets are viewable by everyone"
    on public.assets for select
    using (true);

-- Allow authenticated users to insert/update assets
create policy "Authenticated users can insert assets"
    on public.assets for insert
    with check (auth.role() = 'authenticated');

create policy "Authenticated users can update assets"
    on public.assets for update
    using (auth.role() = 'authenticated');

-- Create index for faster lookups
create index if not exists assets_entity_type_name_idx
    on public.assets(entity_type, name);

-- Add function to automatically update updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$;

-- Add trigger to automatically update updated_at
create trigger assets_handle_updated_at
    before update on public.assets
    for each row
    execute function public.handle_updated_at();
