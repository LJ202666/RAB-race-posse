-- RAB Race Posse — Supabase Database Schema
-- Run this in your Supabase SQL editor at:
-- https://supabase.com/dashboard → your project → SQL Editor

-- =====================
-- EVENTS TABLE
-- =====================
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  date date not null,
  location text,
  distances text[], -- e.g. ARRAY['5km', '10km', '21.1km']
  website text,
  description text,
  travel jsonb,       -- { mode: string, notes: string }
  accommodation jsonb, -- { name, address, booked }
  carpool jsonb[],    -- [{ driver, seats, from }]
  post_race jsonb,    -- { venue, time }
  created_at timestamptz default now()
);

-- =====================
-- RSVPs TABLE
-- =====================
create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  member_id int not null,
  status text check (status in ('going', 'maybe', 'not_going')) not null,
  created_at timestamptz default now(),
  unique(event_id, member_id)
);

-- =====================
-- MY RUNS TABLE
-- =====================
create table if not exists my_runs (
  id uuid primary key default gen_random_uuid(),
  member_id int not null,
  name text not null,
  date date not null,
  distance text,
  time text,
  pb boolean default false,
  event_id uuid references events(id) on delete set null,
  created_at timestamptz default now()
);

-- =====================
-- MEMBERS TABLE
-- =====================
create table if not exists members (
  id serial primary key,
  name text not null,
  avatar text,
  pace text,
  runs int default 0,
  role text default 'member' check (role in ('admin', 'member')),
  created_at timestamptz default now()
);

-- =====================
-- ROW LEVEL SECURITY
-- (Optional but recommended — allow all reads, auth for writes)
-- =====================
alter table events enable row level security;
alter table rsvps enable row level security;
alter table my_runs enable row level security;
alter table members enable row level security;

-- Allow anyone to read (for now — tighten later with auth)
create policy "Public read events" on events for select using (true);
create policy "Public read rsvps" on rsvps for select using (true);
create policy "Public read runs" on my_runs for select using (true);
create policy "Public read members" on members for select using (true);

-- Allow anyone to insert/update (tighten with auth later)
create policy "Public write events" on events for all using (true);
create policy "Public write rsvps" on rsvps for all using (true);
create policy "Public write runs" on my_runs for all using (true);
create policy "Public write members" on members for all using (true);

-- =====================
-- SEED DATA (optional — remove if you want a blank start)
-- =====================
insert into members (name, avatar, pace, runs, role) values
  ('Alex Chen', 'AC', '4:45/km', 47, 'admin'),
  ('Jamie Walsh', 'JW', '5:10/km', 31, 'member'),
  ('Sam Rivera', 'SR', '4:30/km', 62, 'member'),
  ('Taylor Nguyen', 'TN', '5:30/km', 18, 'member'),
  ('Morgan Lee', 'ML', '4:55/km', 44, 'member'),
  ('Jordan Park', 'JP', '5:05/km', 29, 'member'),
  ('Casey Kim', 'CK', '4:40/km', 55, 'member'),
  ('Riley Scott', 'RS', '5:20/km', 22, 'member'),
  ('Quinn Adams', 'QA', '4:50/km', 38, 'member'),
  ('Drew Patel', 'DP', '5:15/km', 26, 'member'),
  ('Avery Jones', 'AJ', '4:35/km', 71, 'member'),
  ('Blake Turner', 'BT', '5:25/km', 15, 'member');
