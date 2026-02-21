export type ExerciseCategory = 'strength' | 'cardio' | 'abs' | 'hiit'
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type GoalType = 'muscle' | 'strength' | 'fat_loss' | 'endurance' | 'abs'
export type TemplateSlug = 'ppl' | 'upper-lower' | 'full-body' | 'abs-focused' | 'hiit' | 'quick-30'

export type Exercise = {
  id: string
  name: string
  category: ExerciseCategory
  muscle_groups: string[]
  difficulty: DifficultyLevel
  instructions: string[]
  image_url: string
  equipment: string[]
}

export type PlanTemplateExercise = {
  id: string
  order_index: number
  sets: number
  reps: string
  rest_seconds: number
  exercises: Exercise
}

export type PlanTemplateDay = {
  id: string
  day_number: number
  day_name: string
  focus: string
  plan_template_exercises: PlanTemplateExercise[]
}

export type PlanTemplate = {
  id: string
  name: string
  slug: string
  description: string
  days_per_week: number
  session_duration_mins: number
  plan_template_days: PlanTemplateDay[]
}

export type UserPlan = {
  id: string
  goal: GoalType
  level: DifficultyLevel
  days_per_week: number
  session_duration: number
  assigned_at: string
  plan_templates: PlanTemplate
}

export type PlanAssignmentInput = {
  goal: GoalType
  level: DifficultyLevel
  daysPerWeek: 3 | 4 | 5 | 6
  sessionDuration: 30 | 45 | 60
}

export const GOAL_LABELS: Record<GoalType, string> = {
  muscle:     'Build Muscle',
  strength:   'Get Stronger',
  fat_loss:   'Burn Fat',
  endurance:  'Improve Endurance',
  abs:        'Tone My Core',
}

export const GOAL_ICONS: Record<GoalType, string> = {
  muscle:    'barbell',
  strength:  'fitness',
  fat_loss:  'flame',
  endurance: 'bicycle',
  abs:       'body',
}

export const CATEGORY_ICONS: Record<ExerciseCategory, string> = {
  strength: 'barbell',
  cardio:   'bicycle',
  abs:      'body',
  hiit:     'flash',
}
