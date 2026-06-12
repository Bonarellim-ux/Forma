// AI-ranked, non-intrusive exercise substitutions. These are not random.
// Each option is chosen to match the same primary muscle, movement pattern, and joint angle as closely as possible.
const EX_SUBS={
  'Bench Press':[
    {name:'Dumbbell Bench Press',muscle:'mid chest',pattern:'horizontal press',reason:'Same flat press pattern and mid-chest focus, with more freedom for shoulder position.'},
    {name:'Machine Chest Press',muscle:'mid chest',pattern:'horizontal press',reason:'Same chest/triceps movement pattern with more stability if benches are taken.'},
    {name:'Push-Up',muscle:'mid chest',pattern:'horizontal press',reason:'Same horizontal pushing pattern using bodyweight, good when equipment is unavailable.'}
  ],
  'Incline Bench':[
    {name:'Incline Dumbbell Press',muscle:'upper chest',pattern:'incline press',reason:'Closest match: same incline angle and upper-chest emphasis.'},
    {name:'Machine Incline Press',muscle:'upper chest',pattern:'incline press',reason:'Same upper-chest press with a more stable machine path.'},
    {name:'Low-to-High Cable Fly',muscle:'upper chest',pattern:'low-to-high adduction',reason:'Still targets clavicular upper pec fibres from a similar upward angle.'}
  ],
  'Overhead Press':[
    {name:'Dumbbell Shoulder Press',muscle:'front/side delts',pattern:'vertical press',reason:'Same vertical press pattern and shoulder focus, easier to adjust shoulder path.'},
    {name:'Machine Shoulder Press',muscle:'front/side delts',pattern:'vertical press',reason:'Same vertical push with added stability for consistent loading.'},
    {name:'Landmine Press',muscle:'front delts/upper chest',pattern:'angled press',reason:'Closest shoulder-friendly alternative when true overhead pressing bothers the shoulder.'}
  ],
  'Squat':[
    {name:'Hack Squat',muscle:'quads',pattern:'squat pattern',reason:'Best match for a quad-dominant squat pattern with less balance demand.'},
    {name:'Leg Press',muscle:'quads/glutes',pattern:'knee-dominant press',reason:'Keeps the same lower-body press focus while reducing spinal loading.'},
    {name:'Goblet Squat',muscle:'quads/glutes',pattern:'squat pattern',reason:'Same squat pattern with lighter loading and easier setup.'}
  ],
  'Deadlift':[
    {name:'Trap Bar Deadlift',muscle:'posterior chain',pattern:'heavy hinge',reason:'Closest heavy hinge substitute with a more neutral grip and often less back stress.'},
    {name:'Romanian Deadlift',muscle:'hamstrings/glutes',pattern:'hip hinge',reason:'Keeps the hinge pattern and posterior-chain focus with less total fatigue.'},
    {name:'Back Extension',muscle:'glutes/hamstrings',pattern:'hip extension',reason:'Targets the same hip-extension muscles without needing a barbell.'}
  ],
  'Romanian Deadlift':[
    {name:'Single-Leg RDL',muscle:'hamstrings/glutes',pattern:'hip hinge',reason:'Same hinge and hamstring lengthened position, with unilateral balance work.'},
    {name:'Good Morning',muscle:'hamstrings/glutes',pattern:'hip hinge',reason:'Very similar hinge pattern and posterior-chain loading.'},
    {name:'Seated Leg Curl',muscle:'hamstrings',pattern:'knee flexion',reason:'Still trains hamstrings in a lengthened position when hinging is not available.'}
  ],
  'Barbell Row':[
    {name:'Chest-Supported Row',muscle:'mid back/lats',pattern:'horizontal pull',reason:'Same horizontal pull while removing lower-back fatigue.'},
    {name:'Seated Cable Row',muscle:'mid back/lats',pattern:'horizontal pull',reason:'Same rowing pattern with constant cable tension.'},
    {name:'Dumbbell Row',muscle:'lats/mid back',pattern:'horizontal pull',reason:'Same row pattern, with unilateral lat and upper-back work.'}
  ],
  'Pull-ups':[
    {name:'Lat Pulldown',muscle:'lats',pattern:'vertical pull',reason:'Closest match: same vertical pull and lat focus, easier to load precisely.'},
    {name:'Assisted Pull-Up',muscle:'lats',pattern:'vertical pull',reason:'Same exact movement pattern with reduced bodyweight load.'},
    {name:'Chin-Up',muscle:'lats/biceps',pattern:'vertical pull',reason:'Same vertical pull with more biceps involvement.'}
  ],
  'Pull-Up':[
    {name:'Lat Pulldown',muscle:'lats',pattern:'vertical pull',reason:'Closest match: same vertical pull and lat focus, easier to load precisely.'},
    {name:'Assisted Pull-Up',muscle:'lats',pattern:'vertical pull',reason:'Same exact movement pattern with reduced bodyweight load.'},
    {name:'Chin-Up',muscle:'lats/biceps',pattern:'vertical pull',reason:'Same vertical pull with more biceps involvement.'}
  ],
  'Lat Pulldown':[
    {name:'Pull-Up',muscle:'lats',pattern:'vertical pull',reason:'Same vertical pulling pattern and lat focus, just bodyweight-based.'},
    {name:'Assisted Pull-Up',muscle:'lats',pattern:'vertical pull',reason:'Same movement direction with adjustable assistance.'},
    {name:'Single-Arm Pulldown',muscle:'lats',pattern:'vertical pull',reason:'Same lat function, with unilateral control and range of motion.'}
  ],
  'Leg Press':[
    {name:'Hack Squat',muscle:'quads/glutes',pattern:'knee-dominant press',reason:'Very similar lower-body press with a stronger squat-like path.'},
    {name:'Squat',muscle:'quads/glutes',pattern:'squat pattern',reason:'Same knee-dominant lower-body pattern, but with more stability and core demand.'},
    {name:'Bulgarian Split Squat',muscle:'quads/glutes',pattern:'single-leg squat',reason:'Same quad/glute emphasis, unilateral and effective with less equipment.'}
  ],
  'Leg Curl':[
    {name:'Seated Leg Curl',muscle:'hamstrings',pattern:'knee flexion',reason:'Same hamstring isolation pattern, often better lengthened-position stimulus.'},
    {name:'Lying Leg Curl',muscle:'hamstrings',pattern:'knee flexion',reason:'Same knee-flexion hamstring role with a slightly different body position.'},
    {name:'Nordic Curl',muscle:'hamstrings',pattern:'knee flexion',reason:'Same hamstring function with high eccentric demand.'}
  ],
  'Leg Extension':[
    {name:'Hack Squat',muscle:'quads',pattern:'knee extension',reason:'Keeps a quad-dominant knee-extension emphasis with heavier loading.'},
    {name:'Spanish Squat',muscle:'quads',pattern:'knee extension',reason:'Very quad-focused substitute with less hip involvement.'},
    {name:'Sissy Squat',muscle:'quads',pattern:'knee extension',reason:'Closest bodyweight-style match for pure quad/knee-extension bias.'}
  ],
  'Hip Thrust':[
    {name:'Glute Bridge',muscle:'glutes',pattern:'hip extension',reason:'Closest match: same hip-extension pattern and glute bias.'},
    {name:'Cable Kickback',muscle:'glutes',pattern:'hip extension',reason:'Same glute hip-extension role with lighter isolation work.'},
    {name:'Banded Hip Thrust',muscle:'glutes',pattern:'hip extension',reason:'Same thrust pattern with accommodating band resistance.'}
  ],
  'Lateral Raise':[
    {name:'Cable Lateral Raise',muscle:'side delts',pattern:'shoulder abduction',reason:'Closest match with constant tension on the side delts.'},
    {name:'Machine Lateral Raise',muscle:'side delts',pattern:'shoulder abduction',reason:'Same side-delt isolation with more stability.'},
    {name:'Lean-Away Lateral Raise',muscle:'side delts',pattern:'shoulder abduction',reason:'Same side-delt target with a stronger stretched-position challenge.'}
  ],
  'Face Pull':[
    {name:'Cable Rear Delt Fly',muscle:'rear delts',pattern:'horizontal abduction',reason:'Keeps the rear-delt emphasis with similar shoulder movement.'},
    {name:'Reverse Fly',muscle:'rear delts',pattern:'horizontal abduction',reason:'Same rear-delt function, simpler setup.'},
    {name:'Band Pull-Apart',muscle:'rear delts/upper back',pattern:'horizontal abduction',reason:'Same rear-delt and upper-back role with minimal equipment.'}
  ],
  'Bicep Curl':[
    {name:'Cable Curl',muscle:'biceps',pattern:'elbow flexion',reason:'Same elbow-flexion pattern with more constant tension.'},
    {name:'Preacher Curl',muscle:'biceps short head',pattern:'elbow flexion',reason:'Same biceps target with more strict form and short-head bias.'},
    {name:'Incline Dumbbell Curl',muscle:'biceps long head',pattern:'elbow flexion',reason:'Same biceps role, with more long-head stretch.'}
  ],
  'Tricep Pushdown':[
    {name:'Cable Kickback',muscle:'triceps lateral head',pattern:'elbow extension',reason:'Same elbow-extension role and similar lateral-head bias.'},
    {name:'Close-Grip Bench Press',muscle:'triceps',pattern:'compound elbow extension',reason:'Keeps triceps as the main target but allows heavier loading.'},
    {name:'Skull Crusher',muscle:'triceps',pattern:'elbow extension',reason:'Same triceps extension pattern with a stronger stretched position.'}
  ],
  'Calf Raise':[
    {name:'Standing Calf Raise',muscle:'gastrocnemius',pattern:'plantar flexion',reason:'Same calf action, best match if the original was standing.'},
    {name:'Leg Press Calf Raise',muscle:'calves',pattern:'plantar flexion',reason:'Same ankle-extension movement using the leg press setup.'},
    {name:'Single-Leg Calf Raise',muscle:'calves',pattern:'plantar flexion',reason:'Same calf target with unilateral control and full range.'}
  ],
  'Plank':[
    {name:'Dead Bug',muscle:'core',pattern:'anti-extension',reason:'Same anti-extension core goal with lower back-friendly control.'},
    {name:'Pallof Press',muscle:'core',pattern:'anti-rotation',reason:'Still trains trunk stability, with more anti-rotation emphasis.'},
    {name:'Ab Wheel',muscle:'core',pattern:'anti-extension',reason:'Same anti-extension demand, more advanced and loaded.'}
  ],
  'Walking':[
    {name:'Elliptical',muscle:'cardio',pattern:'low-impact steady state',reason:'Same low-impact cardio role with slightly higher intensity.'},
    {name:'Cycling',muscle:'cardio/quads',pattern:'low-impact steady state',reason:'Same conditioning goal while reducing impact.'},
    {name:'Stair Climber',muscle:'cardio/glutes',pattern:'low-impact conditioning',reason:'Same cardio slot with more glute and quad involvement.'}
  ],
  'HIIT Session':[
    {name:'Rowing',muscle:'full-body cardio',pattern:'interval conditioning',reason:'Same HIIT slot with full-body conditioning.'},
    {name:'Cycling',muscle:'cardio/quads',pattern:'interval conditioning',reason:'Same interval goal with low impact.'},
    {name:'Jump Rope',muscle:'cardio/calves',pattern:'interval conditioning',reason:'Same high-intensity conditioning role with minimal equipment.'}
  ]
};
