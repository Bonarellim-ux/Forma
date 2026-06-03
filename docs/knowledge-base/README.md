# Forma Knowledge Base

The knowledge base is where Forma's researched coaching concepts are organized for future product use.

This folder is not the canonical data store. The canonical data lives in `/data`. This folder explains how the concepts should be interpreted and grouped.

## Intended Knowledge Areas

- Split selection
- Training frequency
- Volume and intensity
- Progressive overload
- Deloads and recovery
- Exercise selection
- Technique-sensitive recommendations
- AI coaching language

## How To Use This Layer

Future systems should pull from `/data` and use this folder as the human-readable map of the research library.

Example flow:

1. A future split engine evaluates a user's days per week, goal, experience, and recovery constraints.
2. It selects a decision rule from `decision-rules.json`.
3. That rule links to principles and evidence statements.
4. The AI coach can explain the recommendation using those principles without inventing unsupported rationale.

## Current Status

This is a scaffold. Do not treat it as a complete training knowledge base yet.
