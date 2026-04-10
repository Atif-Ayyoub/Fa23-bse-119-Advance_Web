-- Fix signup RLS path for profiles and seller_profiles
-- Without these policies, authenticated users cannot create their own profile rows.

alter table profiles enable row level security;
alter table seller_profiles enable row level security;

-- Profiles: allow a signed-in user to insert exactly their own row.
drop policy if exists "profiles_self_insert" on profiles;
create policy "profiles_self_insert" on profiles
for insert
with check (auth.uid() = id);

-- Seller profile: owner can create/read/update/delete their own seller profile row.
drop policy if exists "seller_profiles_owner_select" on seller_profiles;
create policy "seller_profiles_owner_select" on seller_profiles
for select
using (user_id = auth.uid());

drop policy if exists "seller_profiles_owner_insert" on seller_profiles;
create policy "seller_profiles_owner_insert" on seller_profiles
for insert
with check (user_id = auth.uid());

drop policy if exists "seller_profiles_owner_update" on seller_profiles;
create policy "seller_profiles_owner_update" on seller_profiles
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "seller_profiles_owner_delete" on seller_profiles;
create policy "seller_profiles_owner_delete" on seller_profiles
for delete
using (user_id = auth.uid());
