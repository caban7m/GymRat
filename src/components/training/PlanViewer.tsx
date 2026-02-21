import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { DayCard } from '@/components/training/DayCard'
import type { UserPlan } from '@/types/training'
import { GOAL_LABELS } from '@/types/training'
import { colors } from '@/theme/colors'

type Props = {
  plan: UserPlan
  onChangePlan: () => void
}

export function PlanViewer({ plan, onChangePlan }: Props) {
  const template = plan.plan_templates

  const statsChips = [
    { icon: 'calendar-outline' as const, label: `${template.days_per_week} days/wk` },
    { icon: 'time-outline' as const, label: `${template.session_duration_mins} min` },
    { icon: 'trophy-outline' as const, label: GOAL_LABELS[plan.goal] },
  ]

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
          <Text className="text-text text-xl font-bold">My Plan</Text>
          <TouchableOpacity
            onPress={onChangePlan}
            className="flex-row items-center gap-1"
          >
            <Ionicons name="refresh-outline" size={14} color={colors.primary} />
            <Text className="text-primary text-sm font-semibold">Change</Text>
          </TouchableOpacity>
        </View>

        {/* Plan hero */}
        <View className="mx-5 bg-surface rounded-2xl border border-border p-4 mb-5">
          <Text className="text-primary text-xs font-bold tracking-widest uppercase mb-1">
            Active Programme
          </Text>
          <Text className="text-text text-2xl font-bold mb-1">{template.name}</Text>
          <Text className="text-text-muted text-sm leading-5">{template.description}</Text>

          {/* Stats chips */}
          <View className="flex-row flex-wrap gap-2 mt-4">
            {statsChips.map(({ icon, label }) => (
              <View
                key={label}
                className="flex-row items-center bg-bg rounded-full px-3 py-1.5 border border-border gap-1.5"
              >
                <Ionicons name={icon} size={13} color={colors.primary} />
                <Text className="text-text text-xs font-medium">{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly overview label */}
        <Text className="text-text-muted text-xs font-semibold tracking-widest uppercase px-5 mb-3">
          Weekly Schedule
        </Text>

        {/* Day cards */}
        <View className="px-5">
          {template.plan_template_days.map((day, idx) => (
            <DayCard key={day.id} day={day} defaultExpanded={idx === 0} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
