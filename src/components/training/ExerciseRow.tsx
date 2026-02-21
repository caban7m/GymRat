import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { PlanTemplateExercise } from '@/types/training'
import { CATEGORY_ICONS } from '@/types/training'
import { colors } from '@/theme/colors'

type Props = {
  item: PlanTemplateExercise
  isLast: boolean
}

export function ExerciseRow({ item, isLast }: Props) {
  const ex = item.exercises
  const iconName = CATEGORY_ICONS[ex.category] as React.ComponentProps<typeof Ionicons>['name']

  const restLabel =
    item.rest_seconds >= 60
      ? `${item.rest_seconds / 60}min rest`
      : `${item.rest_seconds}s rest`

  return (
    <View className={`flex-row items-start py-3 ${!isLast ? 'border-b border-border' : ''}`}>
      {/* Category icon */}
      <View className="bg-primary/10 rounded-lg w-9 h-9 items-center justify-center mr-3 mt-0.5">
        <Ionicons name={iconName} size={16} color={colors.primary} />
      </View>

      {/* Main content */}
      <View className="flex-1">
        <Text className="text-text font-semibold text-sm" numberOfLines={1}>
          {ex.name}
        </Text>

        {/* Volume */}
        <Text className="text-primary text-xs font-medium mt-0.5">
          {item.sets} sets × {item.reps}
          <Text className="text-text-muted"> · {restLabel}</Text>
        </Text>

        {/* Muscle groups */}
        <View className="flex-row flex-wrap gap-1 mt-1.5">
          {ex.muscle_groups.slice(0, 3).map((m) => (
            <View key={m} className="bg-surface border border-border rounded px-1.5 py-0.5">
              <Text className="text-text-muted text-xs capitalize">{m}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}
