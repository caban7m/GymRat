-- ─────────────────────────────────────────────────
-- EXERCISES — static library, publicly readable
-- ─────────────────────────────────────────────────
create table if not exists public.exercises (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  category      text not null check (category in ('strength','cardio','abs','hiit')),
  muscle_groups text[] not null default '{}',
  difficulty    text not null check (difficulty in ('beginner','intermediate','advanced')),
  instructions  text[] not null default '{}',
  image_url     text not null default '',
  equipment     text[] not null default '{}',
  created_at    timestamptz not null default now()
);

alter table public.exercises enable row level security;
create policy "exercises are publicly readable"
  on public.exercises for select using (true);

-- ─────────────────────────────────────────────────
-- SEED — 30 exercises
-- ─────────────────────────────────────────────────

-- STRENGTH (15) ───────────────────────────────────
insert into public.exercises (name, category, muscle_groups, difficulty, instructions, image_url, equipment) values

('Barbell Bench Press', 'strength',
  array['chest','triceps','shoulders'], 'intermediate',
  array[
    'Lie flat on the bench with your eyes under the bar.',
    'Grip the bar slightly wider than shoulder-width, thumbs wrapped around.',
    'Unrack and lower the bar to your mid-chest with control — 2 seconds down.',
    'Drive your feet into the floor and press the bar up forcefully to full lockout.',
    'Keep your shoulder blades pinched together throughout the set.'
  ],
  'https://gymrat.app/exercises/barbell-bench-press.jpg',
  array['barbell','bench']),

('Barbell Back Squat', 'strength',
  array['quads','glutes','hamstrings','core'], 'intermediate',
  array[
    'Place the bar across your upper traps (high bar) or rear deltoids (low bar).',
    'Stand with feet shoulder-width apart, toes pointed slightly out.',
    'Break at the hips and knees simultaneously, descending until thighs are parallel or below.',
    'Keep your chest up, core braced, and knees tracking over your toes.',
    'Drive through your heels to stand up explosively.'
  ],
  'https://gymrat.app/exercises/barbell-back-squat.jpg',
  array['barbell','squat rack']),

('Conventional Deadlift', 'strength',
  array['hamstrings','glutes','lower back','traps'], 'intermediate',
  array[
    'Stand with feet hip-width apart, bar over mid-foot.',
    'Hinge at the hips, grip the bar just outside your legs.',
    'Take a big breath, brace your core hard, and pull your hips down to create tension.',
    'Drive your feet into the floor and pull the bar up close to your body.',
    'Lock out by squeezing glutes at the top — do not hyperextend your lower back.'
  ],
  'https://gymrat.app/exercises/conventional-deadlift.jpg',
  array['barbell']),

('Overhead Press', 'strength',
  array['shoulders','triceps','upper chest'], 'intermediate',
  array[
    'Hold the bar at collarbone height with a grip slightly wider than shoulders.',
    'Brace your core and glutes to create a rigid torso.',
    'Press the bar straight up, moving your head back to let it pass.',
    'Lock out fully overhead — the bar should be over your mid-foot.',
    'Lower under control back to the starting position.'
  ],
  'https://gymrat.app/exercises/overhead-press.jpg',
  array['barbell']),

('Barbell Row', 'strength',
  array['upper back','lats','biceps','rear delts'], 'intermediate',
  array[
    'Hinge forward to roughly 45°, bar hanging at shin level.',
    'Grip the bar just outside shoulder-width, double overhand.',
    'Row the bar into your lower chest / upper stomach — lead with your elbows.',
    'Squeeze your shoulder blades together at the top for a one-second pause.',
    'Lower the bar back down with control.'
  ],
  'https://gymrat.app/exercises/barbell-row.jpg',
  array['barbell']),

('Pull-Up', 'strength',
  array['lats','biceps','upper back'], 'intermediate',
  array[
    'Hang from the bar with a pronated grip (palms facing away), hands shoulder-width apart.',
    'Initiate by depressing your shoulder blades — pull them down and back.',
    'Drive your elbows toward your hips as you pull your chin over the bar.',
    'Pause briefly at the top, then lower with control over 2–3 seconds.',
    'Fully extend your arms at the bottom before each rep.'
  ],
  'https://gymrat.app/exercises/pull-up.jpg',
  array['pull-up bar']),

('Dips', 'strength',
  array['chest','triceps','shoulders'], 'beginner',
  array[
    'Grip the parallel bars and jump up to the starting position, arms locked out.',
    'Lean your torso slightly forward to bias the chest.',
    'Lower yourself by bending your elbows until your upper arms are parallel to the floor.',
    'Do not let your shoulders rise toward your ears at the bottom.',
    'Press back up to the starting position without locking out aggressively.'
  ],
  'https://gymrat.app/exercises/dips.jpg',
  array['parallel bars']),

('Romanian Deadlift', 'strength',
  array['hamstrings','glutes','lower back'], 'intermediate',
  array[
    'Start standing with bar at hip level, soft bend in the knees.',
    'Push your hips back as you lower the bar along your thighs.',
    'Feel a strong stretch in your hamstrings — do not round your lower back.',
    'Lower until the bar passes your knees or you feel a full hamstring stretch.',
    'Drive your hips forward to return to the starting position.'
  ],
  'https://gymrat.app/exercises/romanian-deadlift.jpg',
  array['barbell']),

('Leg Press', 'strength',
  array['quads','glutes','hamstrings'], 'beginner',
  array[
    'Sit in the leg press machine with your back flat against the pad.',
    'Place feet shoulder-width apart, toes slightly out on the platform.',
    'Release the safety and lower the platform until your knees reach 90°.',
    'Do not let your lower back lift off the pad at the bottom.',
    'Press the platform back up powerfully, stopping just short of locking out.'
  ],
  'https://gymrat.app/exercises/leg-press.jpg',
  array['leg press machine']),

('Incline Dumbbell Press', 'strength',
  array['upper chest','shoulders','triceps'], 'intermediate',
  array[
    'Set a bench to 30–45° incline. Sit with dumbbells on your thighs.',
    'Kick the dumbbells up as you lie back, starting at shoulder level.',
    'Press up and slightly inward — bring the dumbbells close at the top without touching.',
    'Lower the dumbbells with control, elbows at roughly 75° from your torso.',
    'Feel a full stretch at the bottom before pressing back up.'
  ],
  'https://gymrat.app/exercises/incline-dumbbell-press.jpg',
  array['dumbbells','incline bench']),

('Lat Pulldown', 'strength',
  array['lats','biceps','upper back'], 'beginner',
  array[
    'Sit at the cable station, thighs secured under the pad.',
    'Grip the bar slightly wider than shoulders, palms facing away.',
    'Lean back slightly and pull the bar to your upper chest.',
    'Lead with your elbows, squeezing your lats at the bottom.',
    'Allow the bar to rise back up slowly, fully extending your arms.'
  ],
  'https://gymrat.app/exercises/lat-pulldown.jpg',
  array['cable machine','lat pulldown bar']),

('Seated Cable Row', 'strength',
  array['upper back','lats','rear delts','biceps'], 'beginner',
  array[
    'Sit upright with a slight lean forward, feet braced on the platform.',
    'Grip the handle with both hands and sit tall before pulling.',
    'Row the handle to your lower sternum, driving elbows behind your torso.',
    'Squeeze your shoulder blades together hard at full contraction.',
    'Slowly extend your arms back to the start — do not let momentum take over.'
  ],
  'https://gymrat.app/exercises/seated-cable-row.jpg',
  array['cable machine','row handle']),

('Dumbbell Bicep Curl', 'strength',
  array['biceps','forearms'], 'beginner',
  array[
    'Stand with a dumbbell in each hand, palms facing forward.',
    'Brace your core and pin your elbows to your sides.',
    'Curl the dumbbells up, rotating your wrists so pinkies face up at the top.',
    'Squeeze the biceps hard at the peak for one second.',
    'Lower under control over 2 seconds — do not swing the weight.'
  ],
  'https://gymrat.app/exercises/dumbbell-bicep-curl.jpg',
  array['dumbbells']),

('EZ-Bar Skull Crusher', 'strength',
  array['triceps'], 'intermediate',
  array[
    'Lie flat on a bench, holding an EZ-bar above your chest, arms locked out.',
    'Keeping your upper arms vertical and stationary, bend your elbows.',
    'Lower the bar toward your forehead (or just above) in a controlled arc.',
    'At the bottom, do not let your elbows flare out excessively.',
    'Extend your arms back to the start by squeezing your triceps.'
  ],
  'https://gymrat.app/exercises/ez-bar-skull-crusher.jpg',
  array['EZ-bar','bench']),

('Face Pull', 'strength',
  array['rear delts','upper back','rotator cuff'], 'beginner',
  array[
    'Set a cable at forehead height with a rope attachment.',
    'Grip the rope with both hands, palms facing in, and step back.',
    'Pull the rope toward your face, splitting the rope apart at the end.',
    'Aim to bring your hands beside your ears — elbows flare out to the sides.',
    'Pause for a second, then return slowly. Keep tension on the rope throughout.'
  ],
  'https://gymrat.app/exercises/face-pull.jpg',
  array['cable machine','rope attachment']);

-- CARDIO (5) ──────────────────────────────────────
insert into public.exercises (name, category, muscle_groups, difficulty, instructions, image_url, equipment) values

('Treadmill Run', 'cardio',
  array['legs','cardiovascular system'], 'beginner',
  array[
    'Set treadmill to a comfortable jogging pace (6–9 km/h to start).',
    'Stand tall with a slight forward lean from the ankles — not the waist.',
    'Land with a mid-foot strike beneath your hips, not in front.',
    'Keep arms at 90° and drive them forward and back, not across your body.',
    'Breathe rhythmically — exhale every 2–3 strides.'
  ],
  'https://gymrat.app/exercises/treadmill-run.jpg',
  array['treadmill']),

('Stationary Bike', 'cardio',
  array['quads','hamstrings','glutes','cardiovascular system'], 'beginner',
  array[
    'Adjust the seat so your knee has a slight bend at the bottom of the pedal stroke.',
    'Set resistance to a level that makes conversation slightly challenging.',
    'Pedal at 80–100 RPM for steady-state cardio.',
    'Keep your back upright — do not hunch over the handles.',
    'Maintain consistent pressure through the full pedal stroke.'
  ],
  'https://gymrat.app/exercises/stationary-bike.jpg',
  array['stationary bike']),

('Jump Rope', 'cardio',
  array['calves','shoulders','cardiovascular system'], 'beginner',
  array[
    'Hold handles at hip level, rope behind you on the ground.',
    'Swing the rope overhead and jump just high enough to clear it — 2–5 cm.',
    'Land softly on the balls of your feet with knees slightly bent.',
    'Keep elbows close to your torso and rotate from the wrists, not the shoulders.',
    'Aim for a steady, consistent rhythm before adding speed.'
  ],
  'https://gymrat.app/exercises/jump-rope.jpg',
  array['jump rope']),

('Rowing Machine', 'cardio',
  array['back','legs','arms','cardiovascular system'], 'intermediate',
  array[
    'Sit on the seat, strap your feet in, and hinge forward from the hips.',
    'The drive starts with your legs — push your feet against the footplate.',
    'Once your legs are nearly straight, lean back slightly and pull the handle to your lower chest.',
    'Return by extending your arms first, then hinging forward, then bending your knees.',
    'Maintain a smooth 1:2 drive-to-recovery ratio.'
  ],
  'https://gymrat.app/exercises/rowing-machine.jpg',
  array['rowing machine']),

('Stair Climber', 'cardio',
  array['glutes','quads','calves','cardiovascular system'], 'beginner',
  array[
    'Step onto the machine and set a moderate pace.',
    'Keep your torso upright — avoid leaning on the handrails for support.',
    'Take full steps, pressing through the whole foot to engage your glutes.',
    'Maintain a steady pace that allows controlled breathing.',
    'Look straight ahead to keep your posture neutral.'
  ],
  'https://gymrat.app/exercises/stair-climber.jpg',
  array['stair climber']);

-- ABS (5) ─────────────────────────────────────────
insert into public.exercises (name, category, muscle_groups, difficulty, instructions, image_url, equipment) values

('Plank', 'abs',
  array['core','shoulders','glutes'], 'beginner',
  array[
    'Place forearms on the floor, elbows directly under your shoulders.',
    'Extend your legs behind you, resting on your toes.',
    'Create a straight line from head to heels — do not let your hips sag or pike.',
    'Squeeze your glutes and brace your core as if bracing for a punch.',
    'Hold the position while breathing steadily.'
  ],
  'https://gymrat.app/exercises/plank.jpg',
  array[]),

('Crunches', 'abs',
  array['upper abs'], 'beginner',
  array[
    'Lie on your back with knees bent, feet flat, hands lightly behind your head.',
    'Brace your core and curl your shoulder blades off the floor.',
    'Focus on shortening the distance between your ribs and pelvis.',
    'Do not pull on your neck — your hands are just a guide.',
    'Lower slowly back to the floor without fully relaxing between reps.'
  ],
  'https://gymrat.app/exercises/crunches.jpg',
  array[]),

('Hanging Leg Raise', 'abs',
  array['lower abs','hip flexors'], 'intermediate',
  array[
    'Hang from a pull-up bar with a shoulder-width overhand grip.',
    'Brace your core and prevent your body from swinging.',
    'Raise your legs to 90° (or higher for advanced) while keeping them straight.',
    'Avoid using momentum — the movement should be slow and controlled.',
    'Lower your legs under control back to the hanging position.'
  ],
  'https://gymrat.app/exercises/hanging-leg-raise.jpg',
  array['pull-up bar']),

('Russian Twist', 'abs',
  array['obliques','core'], 'beginner',
  array[
    'Sit on the floor with knees bent at 90°, feet flat or slightly elevated.',
    'Lean back slightly so your torso is at 45° — keep your spine neutral.',
    'Hold your hands together or grip a weight at chest level.',
    'Rotate your torso to the right, pause, then rotate to the left for one rep.',
    'Keep the movement controlled — your lower body should stay still.'
  ],
  'https://gymrat.app/exercises/russian-twist.jpg',
  array[]),

('Bicycle Crunch', 'abs',
  array['obliques','upper abs','lower abs'], 'beginner',
  array[
    'Lie on your back, hands behind your head, legs lifted with knees at 90°.',
    'Simultaneously bring your right elbow and left knee toward each other.',
    'Extend your right leg straight as you rotate, then alternate sides.',
    'Keep the movement slow and deliberate — quality over speed.',
    'Focus on rotation from your core, not just moving your head.'
  ],
  'https://gymrat.app/exercises/bicycle-crunch.jpg',
  array[]);

-- HIIT (5) ────────────────────────────────────────
insert into public.exercises (name, category, muscle_groups, difficulty, instructions, image_url, equipment) values

('Burpee', 'hiit',
  array['full body','cardiovascular system'], 'intermediate',
  array[
    'Stand with feet shoulder-width apart.',
    'Drop your hands to the floor and jump or step your feet back to a push-up position.',
    'Perform a push-up (optional, but recommended).',
    'Jump or step your feet back to your hands.',
    'Explode up with a jump, reaching your arms overhead — land softly.'
  ],
  'https://gymrat.app/exercises/burpee.jpg',
  array[]),

('Box Jump', 'hiit',
  array['quads','glutes','calves','power'], 'intermediate',
  array[
    'Stand in front of a sturdy box or platform at knee-to-hip height.',
    'Swing your arms back and dip your hips slightly.',
    'Explode upward, swinging your arms forward and jumping onto the box.',
    'Land softly with both feet flat, knees slightly bent — absorb the impact.',
    'Step down carefully rather than jumping down to protect your joints.'
  ],
  'https://gymrat.app/exercises/box-jump.jpg',
  array['plyo box']),

('Kettlebell Swing', 'hiit',
  array['glutes','hamstrings','core','back'], 'intermediate',
  array[
    'Stand with feet slightly wider than shoulder-width, kettlebell on the floor ahead.',
    'Hinge at the hips to pick up the bell, hiking it back between your legs.',
    'Drive your hips forward explosively — the kettlebell floats up to chest level.',
    'The power comes from your hips, not your arms. Your arms just guide the bell.',
    'Let the bell swing back down and immediately hinge for the next rep.'
  ],
  'https://gymrat.app/exercises/kettlebell-swing.jpg',
  array['kettlebell']),

('Battle Ropes', 'hiit',
  array['shoulders','core','cardiovascular system'], 'intermediate',
  array[
    'Stand with feet shoulder-width apart, knees slightly bent, facing the rope anchor.',
    'Hold one rope end in each hand with a firm grip.',
    'Alternate raising and slamming each arm down to create waves — keep them continuous.',
    'Maintain a slight forward lean and engaged core throughout.',
    'Vary the pattern: alternating waves, simultaneous slams, or lateral waves.'
  ],
  'https://gymrat.app/exercises/battle-ropes.jpg',
  array['battle ropes']),

('Mountain Climber', 'hiit',
  array['core','shoulders','hip flexors','cardiovascular system'], 'beginner',
  array[
    'Start in a push-up position, hands under shoulders, body in a straight line.',
    'Drive your right knee toward your chest, then quickly switch legs.',
    'Alternate as fast as you can while keeping your hips level — do not let them rise.',
    'Keep your core braced and shoulders stable throughout.',
    'For a harder variation, cross your knee toward the opposite elbow.'
  ],
  'https://gymrat.app/exercises/mountain-climber.jpg',
  array[]);
