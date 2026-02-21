import { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ExerciseRow } from '@/components/training/ExerciseRow'
import type { PlanTemplateDay } from '@/types/training'
import { colors } from '@/theme/colors'

type Props = {
  day: PlanTemplateDay
  defaultExpanded?: boolean
}

export function DayCard({ day, defaultExpanded = false }: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const exerciseCount = day.plan_template_exercises.length
  const totalSets = day.plan_template_exercises.reduce((acc, ex) => acc + ex.sets, 0)

  return (
    <View className="bg-surface rounded-2xl border border-border mb-3 overflow-hidden">
      {/* Header — always visible, tappable to expand */}
      <TouchableOpacity
        className="flex-row items-center px-4 py-3"
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.7}
      >
        {/* Day number badge */}
        <View className="bg-primary rounded-lg w-8 h-8 items-center justify-center mr-3">
          <Text className="text-white font-bold text-sm">{day.day_number}</Text>
        </View>

        {/* Name + focus */}
        <View className="flex-1">
          <Text className="text-text font-bold text-sm">{day.day_name}</Text>
          <Text className="text-text-muted text-xs mt-0.5 capitalize">{day.focus}</Text>
        </View>

        {/* Stats */}
        <Text className="text-text-muted text-xs mr-3">
          {exerciseCount} ex · {totalSets} sets
        </Text>

        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textMuted}
        />
      </TouchableOpacity>

      {/* Exercise list */}
      {expanded && (
        <View className="px-4 pb-2 border-t border-border">
          {day.plan_template_exercises.map((item, idx) => (
            <ExerciseRow
              key={item.id}
              item={item}
              isLast={idx === day.plan_template_exercises.length - 1}
            />
          ))}
        </View>
      )}
    </View>
  )
}
