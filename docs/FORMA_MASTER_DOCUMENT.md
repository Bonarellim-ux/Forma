# Forma

Evidence-based AI coaching for smarter strength training.

## Executive Summary

Forma is a workout tracking and AI coaching app that turns workout history into personalized, evidence-based recommendations.

Most fitness apps store data. Forma uses that data to explain what to do next and why. The product combines training logs, exercise history, progress analytics, in-workout recommendations, and AI coaching so users can make better decisions during and after training.

## Mission

Forma helps people train more effectively by combining evidence-based training principles, personal workout history, and AI-powered analysis to deliver actionable coaching.

Forma is designed to turn workout logs into meaningful recommendations, helping users understand not only what happened in their training, but what they should do next and why.

The goal is not to replace coaching with AI. The goal is to use AI to analyze training history, identify meaningful patterns, and explain recommendations using established strength training, hypertrophy, and exercise science principles.

Every recommendation should be supported by evidence.

If Forma recommends increasing weight, increasing reps, changing an exercise, modifying volume, holding progression, or improving recovery, the user should understand why.

> If Forma cannot explain why a recommendation was made, it should not make the recommendation.

## Problem

- Workout apps are good at logging but weak at interpretation.
- Users collect data but often do not know what to do with it.
- Generic AI fitness advice is often not grounded in the user's actual training.
- Users need coaching that is personalized, evidence-based, and explainable.

## Solution

Forma combines:

- Workout logging
- Progress tracking
- Exercise history
- In-workout recommendations
- AI coaching
- Exercise substitutions
- Stats and charts
- Import/export
- Feature tour and onboarding

## Core Differentiator

Forma is not just "an AI workout app."

Forma is an evidence-based training coach that uses personal workout history and explains why it makes recommendations.

| Differentiator | Why It Matters |
| --- | --- |
| Uses actual workout data | Recommendations are grounded in what the user has done. |
| Gives recommendations only when useful | Avoids noisy, generic nudges. |
| Explains reasoning | Users learn why a change is suggested. |
| Protects successful patterns | The app does not change what is already working. |
| Avoids weak advice | No recommendation is better than a weak recommendation. |
| Helps during and after workouts | Coaching can happen in the moment or through later analysis. |
| Matches substitutions carefully | Swaps consider muscle, movement pattern, joint function, angle, and workout role. |

## What Forma Is Not

Forma is not:

- A generic AI chatbot.
- A random workout generator.
- A calorie tracker.
- A social media platform.
- An app that gives advice without evidence.
- A replacement for medical, physical therapy, or injury diagnosis.

Forma is:

- An evidence-based training coach.
- A workout analysis platform.
- A progression assistant.
- A decision-making tool for strength and hypertrophy training.
- A system that explains why it recommends something.

## Target User

Forma is designed for:

- Beginner to intermediate gym users.
- People who track workouts but do not know how to interpret trends.
- People who want progressive overload guidance.
- People who want AI coaching without generic advice.
- Lifters who care about strength, hypertrophy, consistency, and better training decisions.

## Current Product Features

### Home

- Today's workout
- Weekly schedule
- Recent sessions
- This week count
- Streak/session stats
- Schedule preview and edit entry points

### Onboarding

- User profile setup
- Unit selection
- Goals
- Experience
- Training preferences
- Optional feature tour

### Workout Logging

- Exercise cards
- Weight/reps logging
- Warm-up sets
- Working sets
- Rest timer
- Exercise history access
- Finish workout flow

### Warm-Up Sets

- Stored with `warmup:true`.
- Must remain visible as warm-ups in history.
- Should not be used for PR/progression calculations unless specifically intended.
- Must not be converted into normal working sets during import, export, display, or recommendation logic.

### In-Workout Recommendations

- Recommendations appear while logging.
- They should not appear constantly.
- They should only appear when there is a meaningful pattern.
- They should support rep, weight, hold, or recovery recommendations.
- They should use working sets only and ignore warm-ups.

### Exercise Substitutions

- Substitutions should not be random.
- They must match primary muscle, movement pattern, joint function/angle, and workout role.
- They should explain why the substitute fits.
- Successful exercises should be protected unless there is evidence to change them.

### Ask AI Coach

- Uses workout history, schedule, PRs, warm-ups, and trends.
- Uses first person: "I'd recommend..."
- Answers with evidence and reasoning.
- Avoids unnecessary questions.
- Uses available data before asking for missing information.

### AI Action Handling

- Can help start or log workouts.
- Should never say "logged" unless app state actually changed.
- AI-created workouts must update home, calendar, stats, recent sessions, and related views.
- Action handling should be tested carefully after changes.

### Stats

- Charts
- PRs and records
- e1RM trends
- Heatmap/calendar
- Exercise history
- Strength/progress indicators
- Volume and trend calculations

### Setup

- AI connection status.
- Anthropic API key stored only as a Cloudflare Worker encrypted secret.
- No hardcoded keys.
- Replay feature tour.
- Import/export backup controls.
- Profile, unit, schedule, and exercise configuration.

### Import/Export

- JSON backups.
- Must not export API key.
- Must preserve workout data.
- Must preserve warm-up flags and existing user history.

## Product Philosophy

- No recommendation is better than a weak recommendation.
- Recommendations should be explainable.
- Protect successful training patterns.
- Use multiple signals before making strong claims.
- Do not overwhelm users.
- Use first-person AI coaching.
- AI should use data before asking questions.
- The app should feel like a coach, not a chatbot.

## Business / Commercialization Notes

- A subscription model is possible once value is validated.
- Potential paid features include AI coach, advanced analytics, cloud backup, and sync.
- An App Store path is possible, but a wrapper should be considered before a full rewrite.
- A supplement brand partnership could help distribution.
- Prefer co-branding instead of a full rebrand.
- The Forma brand should remain visible if partnered.
- Best partnership structure: Forma remains owned by the creator; partner provides marketing/distribution; subscription revenue split can be negotiated.
- Avoid giving away codebase or IP without clear ownership terms.

## Roadmap

## Current Sprint

**Goal:** Improve recommendation quality.

**Focus:**

- Rep progression logic.
- Weight progression logic.
- Hold/recovery recommendations.
- Plateau detection.
- Recommendation explanations.
- Reducing unnecessary recommendation frequency.

**Success Criteria:**

- Recommendations only appear when useful.
- Users understand why recommendations are made.
- Warm-ups are ignored.
- The app recommends reps, weight, hold, or recovery appropriately.
- No recommendation appears when evidence is weak.

### Current Priorities

1. Improve recommendation engine.
2. Improve AI coaching quality.
3. Polish feature tour.
4. Polish iPhone PWA bottom navigation/safe-area.
5. Test with real users.

### Next Stage

- Add accounts.
- Add cloud sync.
- Store workout data per user.
- Likely use Supabase or a similar backend.
- Preserve localStorage users through migration/import.

### Monetization Stage

- Free vs Pro.
- AI coach as premium.
- Advanced analytics as premium.
- Cloud backup/sync as premium.

### App Store Stage

- Consider Capacitor wrapper first.
- Avoid full rewrite until validated.
- Test with 10-50 users before App Store release.

### Growth Stage

- Supplement partnership.
- Influencers.
- Gym/community partnerships.
- Possible co-branded versions.

## Current Known Concerns

- Recommendation engine still needs refinement.
- Feature tour is still being improved.
- iPhone Home Screen PWA bottom nav gap needs polish.
- AI action handling should be tested carefully.
- Accounts/cloud sync not yet implemented.
- Cloudflare Worker proxy production URL/secret should be verified before wider testing.
