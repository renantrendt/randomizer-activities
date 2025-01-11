-- Create tables for our schema
create table if not exists categories (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists activities (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    url text not null,
    category_id uuid references categories(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index if not exists activities_category_id_idx on activities(category_id);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create triggers
create trigger categories_updated_at
    before update on categories
    for each row
    execute function update_updated_at_column();

create trigger activities_updated_at
    before update on activities
    for each row
    execute function update_updated_at_column();
