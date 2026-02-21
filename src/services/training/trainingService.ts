import { supabase } from '@/services/supabase/client'
import { selectTemplate } from '@/services/training/planAssignment'
import type { UserPlan, PlanAssignmentInput } from '@/types/training'

const PLAN_SELECT = `
  id,
  goal,
  level,
  days_per_week,
  session_duration,
  assigned_at,
  plan_templates!inner (
    id,
    name,
    slug,
    description,
    days_per_week,
    session_duration_mins,
    plan_template_days (
      id,
      day_number,
      day_name,
      focus,
      plan_template_exercises (
        id,
        order_index,
        sets,
        reps,
        rest_seconds,
        exercises!inner (
          id,
          name,
          category,
          muscle_groups,
          difficulty,
          instructions,
          image_url,
          equipment
        )
      )
    )
  )
` as const

/** Fetch the current user's assigned plan with all nested data. */
export async function getUserPlan(userId: string): Promise<UserPlan | null> {
  const { data, error } = await supabase
    .from('user_plans')
    .select(PLAN_SELECT)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('[trainingService] getUserPlan error', error.message)
    return null
  }

  if (!data) return null

  return sortPlanData(data as unknown as UserPlan)
}

/** Assign (or replace) the best template for a user based on their preferences. */
export async function assignPlan(
  userId: string,
  input: PlanAssignmentInput,
): Promise<UserPlan | null> {
  const slug = selectTemplate(input)

  // Resolve the template UUID from its slug
  const { data: templateRow, error: tErr } = await supabase
    .from('plan_templates')
    .select('id')
    .eq('slug', slug)
    .single()

  if (tErr || !templateRow) {
    console.error('[trainingService] template not found for slug', slug, tErr?.message)
    return null
  }

  // Upsert — replaces any existing plan for this user
  const { error: upsertErr } = await supabase
    .from('user_plans')
    .upsert(
      {
        user_id: userId,
        template_id: templateRow.id,
        goal: input.goal,
        level: input.level,
        days_per_week: input.daysPerWeek,
        session_duration: input.sessionDuration,
        assigned_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )

  if (upsertErr) {
    console.error('[trainingService] upsert error', upsertErr.message)
    return null
  }

  return getUserPlan(userId)
}

/** Delete the user's active plan (allows re-assignment). */
export async function resetPlan(userId: string): Promise<void> {
  await supabase.from('user_plans').delete().eq('user_id', userId)
}

// ─── Helpers ─────────────────────────────────────

function sortPlanData(plan: UserPlan): UserPlan {
  const template = plan.plan_templates
  if (!template?.plan_template_days) return plan

  const sortedDays = [...template.plan_template_days].sort(
    (a, b) => a.day_number - b.day_number,
  )

  sortedDays.forEach((day) => {
    if (day.plan_template_exercises) {
      day.plan_template_exercises = [...day.plan_template_exercises].sort(
        (a, b) => a.order_index - b.order_index,
      )
    }
  })

  return {
    ...plan,
    plan_templates: { ...template, plan_template_days: sortedDays },
  }
}
