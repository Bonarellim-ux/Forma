# Exercise Database

## Purpose

Define how exercises should be classified so recommendations and substitutions are consistent.

This is a template and source-of-truth document, not a full structured database yet. Future work should convert these classifications into a real data structure that can support recommendation logic, substitutions, and AI coach reasoning.

## Required Fields

Each exercise should eventually include:

- Exercise name
- Primary muscles
- Secondary muscles
- Movement pattern
- Joint function / angle
- Equipment
- Difficulty
- Typical rep range
- Good substitutions
- Poor substitutions
- Coaching notes

## Classification Rules

- Substitutions must match the intended training role, not just the broad muscle group.
- Movement pattern matters: horizontal push, vertical pull, hip hinge, squat pattern, unilateral squat, knee extension, elbow flexion, and similar categories should not be mixed casually.
- Joint function and angle matter: incline pressing, horizontal pressing, shoulder abduction, knee flexion, hip extension, and hip hinge are different training roles.
- Poor substitutions should be documented because they help prevent misleading recommendations.
- If the database cannot explain why a substitution fits, it should not recommend that substitution.

## Example Entries

### Bench Press

| Field | Value |
| --- | --- |
| Exercise name | Bench Press |
| Primary muscles | Chest |
| Secondary muscles | Front delts, triceps |
| Movement pattern | Horizontal push |
| Joint function / angle | Shoulder horizontal adduction/flexion with elbow extension; flat horizontal press |
| Equipment | Barbell, bench, rack |
| Difficulty | Intermediate |
| Typical rep range | 5-10 for strength/hypertrophy; 8-12 for hypertrophy emphasis |
| Good substitutions | Dumbbell Bench Press, Machine Chest Press, Smith Machine Bench |
| Poor substitutions | Tricep Pushdown, Lateral Raise |
| Coaching notes | Preserve if progressing. Add reps before load unless the user has repeatedly hit the top of the target range. |

### Barbell Row

| Field | Value |
| --- | --- |
| Exercise name | Barbell Row |
| Primary muscles | Mid-back, lats |
| Secondary muscles | Rear delts, biceps |
| Movement pattern | Horizontal pull |
| Joint function / angle | Shoulder extension/scapular retraction with elbow flexion; torso-supported or hip-hinged horizontal pull |
| Equipment | Barbell |
| Difficulty | Intermediate |
| Typical rep range | 6-12 |
| Good substitutions | Chest-Supported Row, Seated Cable Row, One-Arm Dumbbell Row |
| Poor substitutions | Lat Pulldown if the goal is horizontal pulling |
| Coaching notes | Consider lower-back fatigue when evaluating performance. Chest-supported variations can preserve the horizontal pull role while reducing spinal loading. |

### Bulgarian Split Squat

| Field | Value |
| --- | --- |
| Exercise name | Bulgarian Split Squat |
| Primary muscles | Quads, glutes |
| Secondary muscles | Adductors, stabilizers |
| Movement pattern | Unilateral squat pattern |
| Joint function / angle | Single-leg knee and hip extension with rear-foot elevation |
| Equipment | Bench or elevated surface; dumbbells, barbell, or bodyweight |
| Difficulty | Intermediate to advanced |
| Typical rep range | 6-12 per side |
| Good substitutions | Reverse Lunge, Walking Lunge, Step-Up |
| Poor substitutions | Leg Extension if the goal is unilateral stability and full lower-body pattern |
| Coaching notes | Balance and setup difficulty matter. Substitute only with movements that preserve unilateral lower-body role when that role is important. |

### Romanian Deadlift

| Field | Value |
| --- | --- |
| Exercise name | Romanian Deadlift |
| Primary muscles | Hamstrings, glutes |
| Secondary muscles | Spinal erectors |
| Movement pattern | Hip hinge |
| Joint function / angle | Hip extension from a hinged position with limited knee bend |
| Equipment | Barbell, dumbbells, or machine |
| Difficulty | Intermediate |
| Typical rep range | 6-12 |
| Good substitutions | Dumbbell RDL, Good Morning, Hip Hinge Machine |
| Poor substitutions | Leg Extension, Calf Raise |
| Coaching notes | Preserve hinge mechanics and hamstring-loaded lengthened position when choosing substitutions. Do not replace with knee-extension or calf-dominant movements. |
