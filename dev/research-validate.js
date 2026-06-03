// Validate Forma research JSON against docs/research/CONTRACT.md.
// This is intentionally dependency-free so it works in the static repo.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RESEARCH = path.join(ROOT, 'docs', 'research');

const PHASE_IDS = new Set([
  'phase1a.volume',
  'phase1b.frequency',
  'phase1c.progressive_overload',
  'phase1d.intensity_rir_failure',
  'phase1e.rest_intervals',
  'phase1f.training_age',
  'phase1g.recovery_fatigue',
  'phase1h.adherence'
]);

const DOMAINS = new Set(['volume','frequency','progression','intensity','rest','training_age','recovery','adherence']);
const GOALS = new Set(['hypertrophy','strength','endurance','general_fitness','any']);
const POPULATIONS = new Set(['novice','intermediate','advanced','any']);
const MUSCLES = new Set(['biceps','triceps','forearms','chest','upper_back','lats','traps','front_delts','side_delts','rear_delts','quads','hamstrings','glutes','calves','abs','obliques','full_body',null]);
const STUDY_TYPES = new Set(['meta_analysis','systematic_review','position_stand','consensus_statement','rct','expert_opinion']);
const UNITS = new Set(['sets_per_week','sets_per_session','reps','percent_1rm','rir','seconds','minutes','hours','days_per_week','sessions_per_week']);
const OPS = new Set(['==','!=','<','<=','>','>=','in']);
const ACTION_TYPES = new Set(['increase_volume','decrease_volume','change_frequency','change_split','adjust_intensity','add_rest','deload','hold','flag_for_review']);
const USER_FIELDS = [
  /^weekly_sets\.<muscle>$/,
  /^sessions_per_week\.<muscle>$/,
  /^training_age$/,
  /^goal$/,
  /^recovery_status$/,
  /^avg_rir_last_session$/,
  /^performance_trend$/,
  /^adherence_rate$/,
  /^landmark\.(mev|mav|mrv)\.<muscle>$/,
  /^evidence_range\.(hypertrophy|strength|endurance|general_fitness|any)\.(low|high)$/,
  /^sleep_hours$/
];

function readJson(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error(`${file} must contain a JSON array`);
  return parsed;
}

function listJson(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(name => name.endsWith('.json'))
    .map(name => path.join(dir, name));
}

function assert(cond, msg, errors) {
  if (!cond) errors.push(msg);
}

function validUserField(field) {
  return USER_FIELDS.some(re => re.test(field));
}

const errors = [];
const sourcesFile = path.join(RESEARCH, 'sources', 'sources.json');
const sources = fs.existsSync(sourcesFile) ? readJson(sourcesFile) : [];
const sourceIds = new Set();

for (const s of sources) {
  assert(/^S\d{4}$/.test(s.source_id || ''), `Invalid source_id: ${s.source_id}`, errors);
  assert(!sourceIds.has(s.source_id), `Duplicate source_id: ${s.source_id}`, errors);
  sourceIds.add(s.source_id);
  assert(typeof s.title === 'string' && s.title, `Source ${s.source_id} missing title`, errors);
  assert(typeof s.authors === 'string' && s.authors, `Source ${s.source_id} missing authors`, errors);
  assert(Number.isInteger(s.year), `Source ${s.source_id} missing integer year`, errors);
  assert(typeof s.journal === 'string' && s.journal, `Source ${s.source_id} missing journal`, errors);
  assert(STUDY_TYPES.has(s.study_type), `Source ${s.source_id} invalid study_type`, errors);
  assert(s.verified === true, `Source ${s.source_id} must be verified true`, errors);
}

const evidenceIds = new Set();
for (const file of listJson(path.join(RESEARCH, 'evidence'))) {
  const phaseId = path.basename(file, '.json');
  assert(PHASE_IDS.has(phaseId), `Invalid evidence phase file: ${phaseId}`, errors);
  for (const ev of readJson(file)) {
    assert(ev.phase_id === phaseId, `Evidence ${ev.id} phase_id mismatch`, errors);
    assert(new RegExp(`^${phaseId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.E\\d{4}$`).test(ev.id || ''), `Invalid evidence id: ${ev.id}`, errors);
    assert(!evidenceIds.has(ev.id), `Duplicate evidence id: ${ev.id}`, errors);
    evidenceIds.add(ev.id);
    assert(DOMAINS.has(ev.domain), `Evidence ${ev.id} invalid domain`, errors);
    assert(GOALS.has(ev.goal), `Evidence ${ev.id} invalid goal`, errors);
    assert(POPULATIONS.has(ev.population), `Evidence ${ev.id} invalid population`, errors);
    assert(MUSCLES.has(ev.muscle_group), `Evidence ${ev.id} invalid muscle_group`, errors);
    assert(typeof ev.statement === 'string' && ev.statement, `Evidence ${ev.id} missing statement`, errors);
    assert([1,2,3,4].includes(ev.tier), `Evidence ${ev.id} invalid tier`, errors);
    assert(typeof ev.confidence === 'number' && ev.confidence >= 0 && ev.confidence <= 1, `Evidence ${ev.id} invalid confidence`, errors);
    assert(Number.isInteger(ev.version), `Evidence ${ev.id} missing integer version`, errors);
    assert(typeof ev.date === 'string' && ev.date, `Evidence ${ev.id} missing date`, errors);
    if (ev.parameters !== null) {
      assert(typeof ev.parameters === 'object', `Evidence ${ev.id} parameters must be object or null`, errors);
      assert(typeof ev.parameters.value_min === 'number', `Evidence ${ev.id} missing value_min`, errors);
      assert(typeof ev.parameters.value_max === 'number', `Evidence ${ev.id} missing value_max`, errors);
      assert(UNITS.has(ev.parameters.unit), `Evidence ${ev.id} invalid parameter unit`, errors);
    }
    assert(Array.isArray(ev.source_ids), `Evidence ${ev.id} source_ids must be array`, errors);
    if (ev.source_ids.length === 0) {
      assert(ev.tier === 4 && typeof ev.evidence_note === 'string' && ev.evidence_note, `Evidence ${ev.id} source-free only allowed for tier 4 with note`, errors);
    }
    for (const sid of ev.source_ids) assert(sourceIds.has(sid), `Evidence ${ev.id} references missing source ${sid}`, errors);
  }
}

for (const file of listJson(path.join(RESEARCH, 'rules'))) {
  const phaseId = path.basename(file, '.json');
  assert(PHASE_IDS.has(phaseId), `Invalid rules phase file: ${phaseId}`, errors);
  const ruleIds = new Set();
  for (const rule of readJson(file)) {
    assert(rule.phase_id === phaseId, `Rule ${rule.id} phase_id mismatch`, errors);
    assert(new RegExp(`^${phaseId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.R\\d{4}$`).test(rule.id || ''), `Invalid rule id: ${rule.id}`, errors);
    assert(!ruleIds.has(rule.id), `Duplicate rule id: ${rule.id}`, errors);
    ruleIds.add(rule.id);
    assert(DOMAINS.has(rule.domain), `Rule ${rule.id} invalid domain`, errors);
    assert(GOALS.has(rule.goal), `Rule ${rule.id} invalid goal`, errors);
    assert(POPULATIONS.has(rule.population), `Rule ${rule.id} invalid population`, errors);
    assert(Array.isArray(rule.conditions) && rule.conditions.length, `Rule ${rule.id} needs conditions`, errors);
    for (const c of rule.conditions || []) {
      assert(typeof c.field === 'string' && validUserField(c.field), `Rule ${rule.id} invalid condition field ${c.field}`, errors);
      assert(OPS.has(c.op), `Rule ${rule.id} invalid op ${c.op}`, errors);
      assert(('value' in c) !== ('ref' in c), `Rule ${rule.id} condition must have exactly one of value/ref`, errors);
      if ('ref' in c) assert(typeof c.ref === 'string' && validUserField(c.ref), `Rule ${rule.id} invalid ref ${c.ref}`, errors);
    }
    assert(typeof rule.condition_label === 'string' && rule.condition_label, `Rule ${rule.id} missing condition_label`, errors);
    assert(rule.action && ACTION_TYPES.has(rule.action.type), `Rule ${rule.id} invalid action.type`, errors);
    assert(typeof rule.action_label === 'string' && rule.action_label, `Rule ${rule.id} missing action_label`, errors);
    assert(Number.isInteger(rule.priority), `Rule ${rule.id} priority must be integer`, errors);
    assert(Array.isArray(rule.evidence_ids) && rule.evidence_ids.length, `Rule ${rule.id} must cite evidence`, errors);
    for (const eid of rule.evidence_ids) assert(evidenceIds.has(eid), `Rule ${rule.id} references missing evidence ${eid}`, errors);
    assert(Number.isInteger(rule.version), `Rule ${rule.id} missing integer version`, errors);
    assert(typeof rule.date === 'string' && rule.date, `Rule ${rule.id} missing date`, errors);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Research data valid: ${sources.length} sources, ${evidenceIds.size} evidence statements.`);
