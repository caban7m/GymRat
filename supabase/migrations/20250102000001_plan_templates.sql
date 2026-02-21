-- ─────────────────────────────────────────────────
-- PLAN TEMPLATES — static library, publicly readable
-- ─────────────────────────────────────────────────

create table if not exists public.plan_templates (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null,
  slug                 text not null unique,
  description          text not null default '',
  days_per_week        int not null,
  session_duration_mins int not null,
  suitable_goals       text[] not null default '{}',
  suitable_levels      text[] not null default '{}',
  created_at           timestamptz not null default now()
);

create table if not exists public.plan_template_days (
  id          uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.plan_templates(id) on delete cascade,
  day_number  int not null,
  day_name    text not null,
  focus       text not null default '',
  constraint plan_template_days_template_day_unique unique (template_id, day_number)
);

create table if not exists public.plan_template_exercises (
  id               uuid primary key default gen_random_uuid(),
  template_day_id  uuid not null references public.plan_template_days(id) on delete cascade,
  exercise_id      uuid not null references public.exercises(id),
  order_index      int not null,
  sets             int not null,
  reps             text not null,
  rest_seconds     int not null
);

-- All three tables are publicly readable
alter table public.plan_templates          enable row level security;
alter table public.plan_template_days      enable row level security;
alter table public.plan_template_exercises enable row level security;

create policy "plan_templates are publicly readable"
  on public.plan_templates for select using (true);
create policy "plan_template_days are publicly readable"
  on public.plan_template_days for select using (true);
create policy "plan_template_exercises are publicly readable"
  on public.plan_template_exercises for select using (true);

-- ─────────────────────────────────────────────────
-- SEED — 6 plan templates
-- ─────────────────────────────────────────────────

insert into public.plan_templates
  (name, slug, description, days_per_week, session_duration_mins, suitable_goals, suitable_levels)
values
  ('Push / Pull / Legs', 'ppl',
   'The gold-standard split for serious lifters. Each session targets a distinct movement pattern, allowing maximum recovery while training each muscle twice a week.',
   6, 60,
   array['muscle','strength'],
   array['intermediate','advanced']),

  ('Upper / Lower Split', 'upper-lower',
   'Four focused sessions that hit your upper and lower body twice per week. Perfect for building strength and size with adequate recovery time.',
   4, 60,
   array['muscle','strength'],
   array['beginner','intermediate','advanced']),

  ('Full Body', 'full-body',
   'Three full-body workouts hit every major muscle group every session. High frequency with manageable volume — ideal for building a solid foundation.',
   3, 60,
   array['muscle','strength','fat_loss'],
   array['beginner','intermediate']),

  ('Abs & Core Intensive', 'abs-focused',
   'A dedicated core program that strengthens and sculpts your midsection. Pairs with light cardio to keep your heart rate elevated throughout.',
   3, 30,
   array['abs'],
   array['beginner','intermediate','advanced']),

  ('HIIT Program', 'hiit',
   'High-intensity interval training circuits designed to maximise calorie burn and cardiovascular fitness. Short rests, big results.',
   3, 30,
   array['fat_loss','endurance'],
   array['beginner','intermediate','advanced']),

  ('Quick 30', 'quick-30',
   'Everything you need in 30 minutes. Efficient compound movements, active rest periods, and zero fluff — for when time is your biggest obstacle.',
   4, 30,
   array['muscle','strength','fat_loss','endurance'],
   array['beginner','intermediate','advanced']);

-- ─────────────────────────────────────────────────
-- SEED — template days
-- ─────────────────────────────────────────────────

insert into public.plan_template_days (template_id, day_number, day_name, focus)
select pt.id, d.day_number, d.day_name, d.focus
from public.plan_templates pt
cross join (values
  -- PPL
  ('ppl', 1, 'Push Day',           'chest, shoulders, triceps'),
  ('ppl', 2, 'Pull Day',           'back, biceps, rear delts'),
  ('ppl', 3, 'Legs Day',           'quads, hamstrings, glutes, abs'),
  ('ppl', 4, 'Push Day (Volume)',  'chest, shoulders, triceps'),
  ('ppl', 5, 'Pull Day (Volume)',  'back, biceps, rear delts'),
  ('ppl', 6, 'Legs Day (Volume)',  'quads, hamstrings, glutes, abs'),
  -- Upper / Lower
  ('upper-lower', 1, 'Upper Body A', 'chest, back, shoulders, arms'),
  ('upper-lower', 2, 'Lower Body A', 'quads, hamstrings, glutes, abs'),
  ('upper-lower', 3, 'Upper Body B', 'chest, back, shoulders, arms'),
  ('upper-lower', 4, 'Lower Body B', 'quads, hamstrings, glutes, abs'),
  -- Full Body
  ('full-body', 1, 'Full Body A', 'compound strength'),
  ('full-body', 2, 'Full Body B', 'compound strength'),
  ('full-body', 3, 'Full Body C', 'compound strength + core'),
  -- Abs Focused
  ('abs-focused', 1, 'Core & Abs',    'abs, obliques, core'),
  ('abs-focused', 2, 'Core & Cardio', 'abs, obliques, cardio'),
  ('abs-focused', 3, 'Core Circuit',  'abs, obliques, core'),
  -- HIIT
  ('hiit', 1, 'HIIT Circuit A', 'full body, cardio'),
  ('hiit', 2, 'HIIT Circuit B', 'full body, cardio'),
  ('hiit', 3, 'HIIT Circuit C', 'full body, cardio'),
  -- Quick 30
  ('quick-30', 1, 'Quick Upper',      'chest, back, shoulders'),
  ('quick-30', 2, 'Quick Cardio & Abs','cardio, core'),
  ('quick-30', 3, 'Quick Lower',      'quads, hamstrings, glutes'),
  ('quick-30', 4, 'Quick HIIT',       'full body, cardio')
) as d(template_slug, day_number, day_name, focus)
where pt.slug = d.template_slug;

-- ─────────────────────────────────────────────────
-- SEED — exercises per day
-- Uses a single bulk INSERT via VALUES + JOINs
-- Columns: template_slug, day_num, exercise_name, order_index, sets, reps, rest_secs
-- ─────────────────────────────────────────────────

insert into public.plan_template_exercises
  (template_day_id, exercise_id, order_index, sets, reps, rest_seconds)
select
  ptd.id,
  e.id,
  rd.order_index::int,
  rd.sets::int,
  rd.reps,
  rd.rest_secs::int
from (values
  -- ── PPL Day 1 · Push ──────────────────────────
  ('ppl',1,'Barbell Bench Press',      1,4,'6-8',  180),
  ('ppl',1,'Overhead Press',           2,3,'8-10', 120),
  ('ppl',1,'Incline Dumbbell Press',   3,3,'10-12', 90),
  ('ppl',1,'Dips',                     4,3,'12',    60),
  ('ppl',1,'EZ-Bar Skull Crusher',     5,3,'12-15', 60),
  -- ── PPL Day 2 · Pull ──────────────────────────
  ('ppl',2,'Barbell Row',              1,4,'6-8',  180),
  ('ppl',2,'Pull-Up',                  2,3,'8',    120),
  ('ppl',2,'Lat Pulldown',             3,3,'10-12', 90),
  ('ppl',2,'Seated Cable Row',         4,3,'10-12', 90),
  ('ppl',2,'Dumbbell Bicep Curl',      5,3,'12-15', 60),
  -- ── PPL Day 3 · Legs ──────────────────────────
  ('ppl',3,'Barbell Back Squat',       1,4,'6-8',  180),
  ('ppl',3,'Romanian Deadlift',        2,3,'10-12',120),
  ('ppl',3,'Leg Press',                3,3,'12-15', 90),
  ('ppl',3,'Hanging Leg Raise',        4,3,'15',    60),
  ('ppl',3,'Plank',                    5,3,'45s',   45),
  -- ── PPL Day 4 · Push Volume ───────────────────
  ('ppl',4,'Incline Dumbbell Press',   1,4,'8-10', 120),
  ('ppl',4,'Barbell Bench Press',      2,3,'10-12', 90),
  ('ppl',4,'Overhead Press',           3,3,'10-12', 90),
  ('ppl',4,'EZ-Bar Skull Crusher',     4,4,'12-15', 60),
  ('ppl',4,'Dips',                     5,3,'AMRAP', 60),
  -- ── PPL Day 5 · Pull Volume ───────────────────
  ('ppl',5,'Pull-Up',                  1,4,'8',    120),
  ('ppl',5,'Seated Cable Row',         2,4,'10-12', 90),
  ('ppl',5,'Lat Pulldown',             3,3,'10-12', 90),
  ('ppl',5,'Face Pull',                4,3,'15-20', 60),
  ('ppl',5,'Dumbbell Bicep Curl',      5,4,'12-15', 60),
  -- ── PPL Day 6 · Legs Volume ───────────────────
  ('ppl',6,'Conventional Deadlift',    1,4,'4-6',  240),
  ('ppl',6,'Barbell Back Squat',       2,3,'10-12', 90),
  ('ppl',6,'Leg Press',                3,4,'12-15', 90),
  ('ppl',6,'Russian Twist',            4,3,'20',    45),
  ('ppl',6,'Bicycle Crunch',           5,3,'20',    45),
  -- ── Upper/Lower Day 1 · Upper A ───────────────
  ('upper-lower',1,'Barbell Bench Press',    1,4,'6-8', 180),
  ('upper-lower',1,'Barbell Row',            2,4,'6-8', 180),
  ('upper-lower',1,'Overhead Press',         3,3,'10-12',90),
  ('upper-lower',1,'Lat Pulldown',           4,3,'10-12',90),
  ('upper-lower',1,'Dumbbell Bicep Curl',    5,3,'12-15',60),
  ('upper-lower',1,'EZ-Bar Skull Crusher',   6,3,'12-15',60),
  -- ── Upper/Lower Day 2 · Lower A ───────────────
  ('upper-lower',2,'Barbell Back Squat',     1,4,'6-8', 180),
  ('upper-lower',2,'Romanian Deadlift',      2,3,'10-12',120),
  ('upper-lower',2,'Leg Press',              3,3,'12-15',90),
  ('upper-lower',2,'Hanging Leg Raise',      4,3,'15',   60),
  ('upper-lower',2,'Plank',                  5,3,'45s',  45),
  -- ── Upper/Lower Day 3 · Upper B ───────────────
  ('upper-lower',3,'Incline Dumbbell Press', 1,4,'8-10', 120),
  ('upper-lower',3,'Pull-Up',                2,4,'6-8',  180),
  ('upper-lower',3,'Seated Cable Row',       3,3,'10-12', 90),
  ('upper-lower',3,'Face Pull',              4,3,'15-20', 60),
  ('upper-lower',3,'Dips',                   5,3,'12',    60),
  -- ── Upper/Lower Day 4 · Lower B ───────────────
  ('upper-lower',4,'Conventional Deadlift',  1,4,'4-6',  240),
  ('upper-lower',4,'Romanian Deadlift',      2,3,'10-12',120),
  ('upper-lower',4,'Leg Press',              3,3,'12-15', 90),
  ('upper-lower',4,'Russian Twist',          4,3,'20',    45),
  ('upper-lower',4,'Bicycle Crunch',         5,3,'20',    45),
  -- ── Full Body Day 1 ───────────────────────────
  ('full-body',1,'Barbell Back Squat',       1,3,'8-10', 120),
  ('full-body',1,'Barbell Bench Press',      2,3,'8-10', 120),
  ('full-body',1,'Barbell Row',              3,3,'8-10', 120),
  ('full-body',1,'Plank',                    4,3,'45s',   45),
  -- ── Full Body Day 2 ───────────────────────────
  ('full-body',2,'Conventional Deadlift',    1,3,'6-8',  180),
  ('full-body',2,'Overhead Press',           2,3,'8-10', 120),
  ('full-body',2,'Pull-Up',                  3,3,'8',    120),
  ('full-body',2,'Russian Twist',            4,3,'20',    45),
  -- ── Full Body Day 3 ───────────────────────────
  ('full-body',3,'Leg Press',                1,3,'12-15', 90),
  ('full-body',3,'Incline Dumbbell Press',   2,3,'10-12', 90),
  ('full-body',3,'Seated Cable Row',         3,3,'10-12', 90),
  ('full-body',3,'Bicycle Crunch',           4,3,'20',    45),
  -- ── Abs Day 1 · Core & Abs ────────────────────
  ('abs-focused',1,'Plank',                  1,4,'60s',   30),
  ('abs-focused',1,'Crunches',               2,3,'20',    30),
  ('abs-focused',1,'Hanging Leg Raise',      3,3,'15',    45),
  ('abs-focused',1,'Russian Twist',          4,3,'20',    30),
  ('abs-focused',1,'Mountain Climber',       5,3,'30s',   30),
  -- ── Abs Day 2 · Core & Cardio ─────────────────
  ('abs-focused',2,'Bicycle Crunch',         1,4,'25',    30),
  ('abs-focused',2,'Hanging Leg Raise',      2,3,'15',    45),
  ('abs-focused',2,'Mountain Climber',       3,3,'40s',   30),
  ('abs-focused',2,'Plank',                  4,3,'60s',   30),
  ('abs-focused',2,'Jump Rope',              5,3,'2min',  60),
  -- ── Abs Day 3 · Core Circuit ──────────────────
  ('abs-focused',3,'Mountain Climber',       1,4,'40s',   30),
  ('abs-focused',3,'Russian Twist',          2,3,'20',    30),
  ('abs-focused',3,'Bicycle Crunch',         3,3,'25',    30),
  ('abs-focused',3,'Hanging Leg Raise',      4,3,'15',    45),
  ('abs-focused',3,'Plank',                  5,3,'60s',   30),
  -- ── HIIT Day 1 · Circuit A ────────────────────
  ('hiit',1,'Burpee',                        1,4,'10',    30),
  ('hiit',1,'Box Jump',                      2,4,'10',    30),
  ('hiit',1,'Mountain Climber',              3,4,'40s',   20),
  ('hiit',1,'Battle Ropes',                  4,4,'30s',   30),
  -- ── HIIT Day 2 · Circuit B ────────────────────
  ('hiit',2,'Kettlebell Swing',              1,4,'20',    30),
  ('hiit',2,'Jump Rope',                     2,4,'60s',   30),
  ('hiit',2,'Burpee',                        3,4,'10',    30),
  ('hiit',2,'Mountain Climber',              4,4,'30s',   20),
  -- ── HIIT Day 3 · Circuit C ────────────────────
  ('hiit',3,'Box Jump',                      1,4,'12',    30),
  ('hiit',3,'Battle Ropes',                  2,4,'30s',   30),
  ('hiit',3,'Kettlebell Swing',              3,4,'20',    30),
  ('hiit',3,'Burpee',                        4,4,'8',     30),
  -- ── Quick 30 Day 1 · Upper ────────────────────
  ('quick-30',1,'Barbell Bench Press',       1,3,'10-12', 60),
  ('quick-30',1,'Barbell Row',               2,3,'10-12', 60),
  ('quick-30',1,'Overhead Press',            3,3,'10-12', 60),
  -- ── Quick 30 Day 2 · Cardio & Abs ─────────────
  ('quick-30',2,'Jump Rope',                 1,3,'3min',  60),
  ('quick-30',2,'Plank',                     2,3,'45s',   30),
  ('quick-30',2,'Crunches',                  3,3,'20',    30),
  ('quick-30',2,'Mountain Climber',          4,3,'30s',   30),
  -- ── Quick 30 Day 3 · Lower ────────────────────
  ('quick-30',3,'Barbell Back Squat',        1,3,'10-12', 60),
  ('quick-30',3,'Romanian Deadlift',         2,3,'10-12', 60),
  ('quick-30',3,'Leg Press',                 3,3,'12-15', 60),
  -- ── Quick 30 Day 4 · HIIT ─────────────────────
  ('quick-30',4,'Burpee',                    1,3,'10',    30),
  ('quick-30',4,'Box Jump',                  2,3,'10',    30),
  ('quick-30',4,'Kettlebell Swing',          3,3,'15',    30),
  ('quick-30',4,'Mountain Climber',          4,3,'30s',   20)
) as rd(template_slug, day_num, exercise_name, order_index, sets, reps, rest_secs)
join public.plan_templates  pt  on pt.slug       = rd.template_slug
join public.plan_template_days ptd on ptd.template_id = pt.id
                                  and ptd.day_number  = rd.day_num::int
join public.exercises        e   on e.name        = rd.exercise_name;
