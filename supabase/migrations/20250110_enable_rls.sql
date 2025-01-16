-- Enable RLS
alter table categories enable row level security;
alter table activities enable row level security;

-- Drop existing policies
drop policy if exists "Enable read access for all users" on categories;
drop policy if exists "Enable insert for all users" on categories;
drop policy if exists "Enable update for all users" on categories;
drop policy if exists "Enable delete for all users" on categories;

drop policy if exists "Enable read access for all users" on activities;
drop policy if exists "Enable insert for all users" on activities;
drop policy if exists "Enable update for all users" on activities;
drop policy if exists "Enable delete for all users" on activities;

-- Create policies for categories
create policy "Public categories are viewable by everyone" 
on categories for select 
using (is_public = true);

create policy "Users can view their own categories" 
on categories for select 
using (auth.uid() = user_id);

create policy "Users can insert their own categories" 
on categories for insert 
with check (auth.uid() = user_id);

create policy "Users can update their own categories" 
on categories for update 
using (auth.uid() = user_id);

create policy "Users can delete their own categories" 
on categories for delete 
using (auth.uid() = user_id);

-- Create policies for activities
create policy "Public activities are viewable by everyone" 
on activities for select 
using (is_public = true);

create policy "Users can view their own activities" 
on activities for select 
using (auth.uid() = user_id);

create policy "Users can insert their own activities" 
on activities for insert 
with check (auth.uid() = user_id);

create policy "Users can update their own activities" 
on activities for update 
using (auth.uid() = user_id);

create policy "Users can delete their own activities" 
on activities for delete 
using (auth.uid() = user_id);
