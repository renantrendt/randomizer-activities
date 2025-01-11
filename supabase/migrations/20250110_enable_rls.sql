-- Enable RLS
alter table categories enable row level security;
alter table activities enable row level security;

-- Create policies for categories
create policy "Enable read access for all users" on categories for select using (true);
create policy "Enable insert for all users" on categories for insert with check (true);
create policy "Enable update for all users" on categories for update using (true);
create policy "Enable delete for all users" on categories for delete using (true);

-- Create policies for activities
create policy "Enable read access for all users" on activities for select using (true);
create policy "Enable insert for all users" on activities for insert with check (true);
create policy "Enable update for all users" on activities for update using (true);
create policy "Enable delete for all users" on activities for delete using (true);
