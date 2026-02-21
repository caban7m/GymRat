import type { PlanAssignmentInput, TemplateSlug } from '@/types/training'

/**
 * Rule-based plan assignment.
 * Maps goal × level × days/week × session duration → best template slug.
 *
 * Priority order:
 *  1. Session duration ≤ 30 min → quick-30 (time constraint wins everything)
 *  2. Abs-focused goal → abs-focused
 *  3. Fat loss / endurance → HIIT
 *  4. Days per week determines the split:
 *     3 days → full-body
 *     4 days → upper-lower
 *     5+ days, beginner → upper-lower (PPL is too demanding)
 *     5+ days, intermediate/advanced → PPL
 */
export function selectTemplate(input: PlanAssignmentInput): TemplateSlug {
  const { goal, level, daysPerWeek, sessionDuration } = input

  // Time constraint — quick sessions always get quick-30
  if (sessionDuration <= 30) return 'quick-30'

  // Abs-focused goal
  if (goal === 'abs') return 'abs-focused'

  // Fat loss or endurance → HIIT regardless of days
  if (goal === 'fat_loss' || goal === 'endurance') return 'hiit'

  // Muscle / Strength — choose split based on days available
  if (daysPerWeek === 3) return 'full-body'

  if (daysPerWeek === 4) return 'upper-lower'

  // 5 or 6 days
  if (level === 'beginner') return 'upper-lower'
  return 'ppl'
}

/** Human-readable explanation of why a template was selected. */
export function explainAssignment(input: PlanAssignmentInput): string {
  const slug = selectTemplate(input)

  const explanations: Record<TemplateSlug, string> = {
    'quick-30':
      'You only have 30 minutes — Quick 30 keeps it efficient with zero wasted time.',
    'abs-focused':
      'Focused core work to sculpt and strengthen your midsection.',
    'hiit':
      'High-intensity circuits are the fastest route to your fat loss and endurance goals.',
    'full-body':
      'Three full-body sessions maximise frequency and are perfect for your schedule.',
    'upper-lower':
      'Four sessions split into upper and lower body strikes the ideal balance for your level.',
    'ppl':
      'Six sessions using the Push/Pull/Legs split — the standard for serious muscle and strength gains.',
  }

  return explanations[slug]
}
