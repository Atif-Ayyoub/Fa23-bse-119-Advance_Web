-- AdFlow Pro Phase 1 base schema

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  role text check (role in ('client', 'moderator', 'admin', 'super_admin')) default 'client',
  status text check (status in ('active', 'suspended')) default 'active',
  created_at timestamptz default now()
);

create table if not exists seller_profiles (
  id bigserial primary key,
  user_id uuid unique references profiles(id) on delete cascade,
  display_name text not null,
  business_name text,
  phone text,
  city_id bigint,
  is_verified boolean default false,
  created_at timestamptz default now()
);

create table if not exists packages (
  id bigserial primary key,
  name text unique not null,
  duration_days int not null,
  weight int not null,
  homepage_visibility boolean default false,
  is_featured boolean default false,
  refresh_days int,
  price numeric(10, 2) not null,
  badge text,
  created_at timestamptz default now()
);

create table if not exists categories (
  id bigserial primary key,
  name text unique not null,
  slug text unique not null,
  is_active boolean default true
);

create table if not exists cities (
  id bigserial primary key,
  name text unique not null,
  slug text unique not null,
  is_active boolean default true
);

create table if not exists ads (
  id bigserial primary key,
  user_id uuid references profiles(id) on delete cascade,
  package_id bigint references packages(id),
  title text not null,
  slug text unique not null,
  category_id bigint references categories(id),
  city_id bigint references cities(id),
  description text not null,
  status text not null check (
    status in (
      'draft',
      'submitted',
      'under_review',
      'payment_pending',
      'payment_submitted',
      'payment_verified',
      'scheduled',
      'published',
      'expired',
      'rejected',
      'archived'
    )
  ) default 'draft',
  publish_at timestamptz,
  expire_at timestamptz,
  featured boolean default false,
  admin_boost int default 0,
  moderation_notes text,
  rejection_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists ad_media (
  id bigserial primary key,
  ad_id bigint references ads(id) on delete cascade,
  source_type text check (source_type in ('image', 'youtube', 'cdn', 'other')),
  original_url text not null,
  thumbnail_url text,
  validation_status text check (validation_status in ('pending', 'valid', 'invalid')) default 'pending',
  created_at timestamptz default now()
);

create table if not exists payments (
  id bigserial primary key,
  ad_id bigint references ads(id) on delete cascade,
  amount numeric(10, 2) not null,
  method text not null,
  transaction_ref text unique,
  sender_name text,
  screenshot_url text,
  status text check (status in ('pending', 'verified', 'rejected')) default 'pending',
  verified_by uuid references profiles(id),
  verified_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists notifications (
  id bigserial primary key,
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text,
  is_read boolean default false,
  link text,
  created_at timestamptz default now()
);

create table if not exists audit_logs (
  id bigserial primary key,
  actor_id uuid references profiles(id),
  action_type text not null,
  target_type text not null,
  target_id text not null,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz default now()
);

create table if not exists ad_status_history (
  id bigserial primary key,
  ad_id bigint references ads(id) on delete cascade,
  previous_status text,
  new_status text not null,
  changed_by uuid references profiles(id),
  note text,
  changed_at timestamptz default now()
);

create table if not exists learning_questions (
  id bigserial primary key,
  question text not null,
  answer text not null,
  topic text,
  difficulty text,
  is_active boolean default true
);

create table if not exists system_health_logs (
  id bigserial primary key,
  source text not null,
  response_ms int,
  checked_at timestamptz default now(),
  status text not null
);

alter table profiles enable row level security;
alter table seller_profiles enable row level security;
alter table ads enable row level security;
alter table ad_media enable row level security;
alter table payments enable row level security;
alter table notifications enable row level security;
alter table audit_logs enable row level security;
alter table ad_status_history enable row level security;
alter table system_health_logs enable row level security;

-- Client policies: own profile, own ads, own notifications.
create policy "profiles_self_select" on profiles
for select using (auth.uid() = id);

create policy "profiles_self_update" on profiles
for update using (auth.uid() = id)
with check (auth.uid() = id);

create policy "ads_client_select_own" on ads
for select using (auth.uid() = user_id);

create policy "ads_client_insert_own" on ads
for insert with check (auth.uid() = user_id);

create policy "ads_client_update_own" on ads
for update using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "notifications_owner_select" on notifications
for select using (auth.uid() = user_id);

create policy "notifications_owner_insert" on notifications
for insert with check (auth.uid() = user_id);

create policy "notifications_staff_insert" on notifications
for insert with check (
  exists (
    select 1
    from profiles p
    where p.id = auth.uid()
      and p.role in ('moderator', 'admin', 'super_admin')
      and p.status = 'active'
  )
);

create policy "payments_client_select_own" on payments
for select using (
  exists (
    select 1
    from ads a
    where a.id = payments.ad_id
      and a.user_id = auth.uid()
  )
);

create policy "payments_client_insert_own" on payments
for insert with check (
  exists (
    select 1
    from ads a
    where a.id = payments.ad_id
      and a.user_id = auth.uid()
      and a.status in ('payment_pending', 'rejected', 'payment_submitted')
  )
);

-- Moderator and admin broad read/write access.
create policy "ads_moderator_admin_select" on ads
for select using (
  exists (
    select 1
    from profiles p
    where p.id = auth.uid()
      and p.role in ('moderator', 'admin', 'super_admin')
      and p.status = 'active'
  )
);

create policy "ads_admin_update" on ads
for update using (
  exists (
    select 1
    from profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'super_admin')
      and p.status = 'active'
  )
)
with check (
  exists (
    select 1
    from profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'super_admin')
      and p.status = 'active'
  )
);

create policy "payments_admin_manage" on payments
for all using (
  exists (
    select 1
    from profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'super_admin')
      and p.status = 'active'
  )
)
with check (
  exists (
    select 1
    from profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'super_admin')
      and p.status = 'active'
  )
);

create policy "ad_media_owner_or_staff" on ad_media
for select using (
  exists (
    select 1
    from ads a
    where a.id = ad_media.ad_id
      and (
        a.user_id = auth.uid()
        or exists (
          select 1
          from profiles p
          where p.id = auth.uid()
            and p.role in ('moderator', 'admin', 'super_admin')
            and p.status = 'active'
        )
      )
  )
);

create policy "ad_media_owner_insert" on ad_media
for insert with check (
  exists (
    select 1
    from ads a
    where a.id = ad_media.ad_id
      and a.user_id = auth.uid()
  )
);

create policy "ad_media_owner_delete" on ad_media
for delete using (
  exists (
    select 1
    from ads a
    where a.id = ad_media.ad_id
      and a.user_id = auth.uid()
  )
);

create policy "ads_moderator_admin_update" on ads
for update using (
  exists (
    select 1
    from profiles p
    where p.id = auth.uid()
      and p.role in ('moderator', 'admin', 'super_admin')
      and p.status = 'active'
  )
)
with check (
  exists (
    select 1
    from profiles p
    where p.id = auth.uid()
      and p.role in ('moderator', 'admin', 'super_admin')
      and p.status = 'active'
  )
);

create policy "ad_status_history_staff_insert" on ad_status_history
for insert with check (
  exists (
    select 1
    from profiles p
    where p.id = auth.uid()
      and p.role in ('moderator', 'admin', 'super_admin')
      and p.status = 'active'
  )
  or changed_by = auth.uid()
);

create policy "ad_status_history_staff_select" on ad_status_history
for select using (
  exists (
    select 1
    from profiles p
    where p.id = auth.uid()
      and p.role in ('moderator', 'admin', 'super_admin')
      and p.status = 'active'
  )
);

create policy "audit_logs_staff_insert" on audit_logs
for insert with check (
  exists (
    select 1
    from profiles p
    where p.id = auth.uid()
      and p.role in ('moderator', 'admin', 'super_admin')
      and p.status = 'active'
  )
  or actor_id = auth.uid()
);

create policy "audit_logs_staff_select" on audit_logs
for select using (
  exists (
    select 1
    from profiles p
    where p.id = auth.uid()
      and p.role in ('moderator', 'admin', 'super_admin')
      and p.status = 'active'
  )
);

create policy "system_health_logs_admin_select" on system_health_logs
for select using (
  exists (
    select 1
    from profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'super_admin')
      and p.status = 'active'
  )
);

create policy "system_health_logs_admin_insert" on system_health_logs
for insert with check (
  exists (
    select 1
    from profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'super_admin')
      and p.status = 'active'
  )
);

-- Public listing policy: only active published ads.
create policy "ads_public_published_read" on ads
for select using (
  status = 'published'
  and (publish_at is null or publish_at <= now())
  and (expire_at is null or expire_at > now())
);
