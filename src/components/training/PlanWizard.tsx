import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { explainAssignment } from '@/services/training/planAssignment'
import type { PlanAssignmentInput, GoalType, DifficultyLevel } from '@/types/training'
import { GOAL_LABELS, GOAL_ICONS } from '@/types/training'
import { colors } from '@/theme/colors'

type Props = {
  onAssign: (input: PlanAssignmentInput) => Promise<void>
  assigning: boolean
  error: string | null
}

type OptionChipProps = {
  label: string
  selected: boolean
  onPress: () => void
}

function OptionChip({ label, selected, onPress }: OptionChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-xl px-4 py-2.5 border mr-2 mb-2 ${
        selected ? 'bg-primary/15 border-primary' : 'bg-surface border-border'
      }`}
    >
      <Text
        className={`text-sm font-semibold ${selected ? 'text-primary' : 'text-text-muted'}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const GOALS = Object.entries(GOAL_LABELS) as [GoalType, string][]
const LEVELS: { value: DifficultyLevel; label: string; sub: string }[] = [
  { value: 'beginner', label: 'Beginner', sub: 'Under 1 year' },
  { value: 'intermediate', label: 'Intermediate', sub: '1–3 years' },
  { value: 'advanced', label: 'Advanced', sub: '3+ years' },
]
const DAYS = [3, 4, 5, 6] as const
const DURATIONS = [30, 45, 60] as const

export function PlanWizard({ onAssign, assigning, error }: Props) {
  const [goal, setGoal] = useState<GoalType | null>(null)
  const [level, setLevel] = useState<DifficultyLevel | null>(null)
  const [days, setDays] = useState<3 | 4 | 5 | 6 | null>(null)
  const [duration, setDuration] = useState<30 | 45 | 60 | null>(null)

  const canBuild = goal && level && days && duration

  const preview =
    canBuild
      ? explainAssignment({
          goal,
          level,
          daysPerWeek: days,
          sessionDuration: duration,
        })
      : null

  const handleBuild = async () => {
    if (!canBuild) return
    await onAssign({ goal, level, daysPerWeek: days, sessionDuration: duration })
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View className="px-5 pt-6 pb-4">
          <Text className="text-primary text-xs font-bold tracking-widest uppercase mb-2">
            Training
          </Text>
          <Text className="text-text text-2xl font-bold mb-1">Build Your Plan</Text>
          <Text className="text-text-muted text-sm leading-5">
            Answer four questions and we'll build a personalised programme from our expert templates.
          </Text>
        </View>

        {/* Goal */}
        <View className="px-5 mb-6">
          <Text className="text-text font-semibold text-base mb-3">What's your goal?</Text>
          <View className="flex-row flex-wrap">
            {GOALS.map(([value, label]) => {
              const iconName = GOAL_ICONS[value] as React.ComponentProps<typeof Ionicons>['name']
              const selected = goal === value
              return (
                <TouchableOpacity
                  key={value}
                  onPress={() => setGoal(value)}
                  className={`w-[47%] mr-2 mb-3 rounded-2xl border p-4 ${
                    selected ? 'bg-primary/10 border-primary' : 'bg-surface border-border'
                  }`}
                >
                  <Ionicons
                    name={iconName}
                    size={22}
                    color={selected ? colors.primary : colors.textMuted}
                  />
                  <Text
                    className={`text-sm font-semibold mt-2 ${
                      selected ? 'text-primary' : 'text-text'
                    }`}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Level */}
        <View className="px-5 mb-6">
          <Text className="text-text font-semibold text-base mb-3">Your experience level?</Text>
          {LEVELS.map(({ value, label, sub }) => {
            const selected = level === value
            return (
              <TouchableOpacity
                key={value}
                onPress={() => setLevel(value)}
                className={`flex-row items-center rounded-xl border p-3.5 mb-2 ${
                  selected ? 'bg-primary/10 border-primary' : 'bg-surface border-border'
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                    selected ? 'border-primary' : 'border-border'
                  }`}
                >
                  {selected && <View className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </View>
                <View>
                  <Text className={`text-sm font-semibold ${selected ? 'text-primary' : 'text-text'}`}>
                    {label}
                  </Text>
                  <Text className="text-text-muted text-xs">{sub}</Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Days per week */}
        <View className="px-5 mb-6">
          <Text className="text-text font-semibold text-base mb-3">
            Days per week?
          </Text>
          <View className="flex-row flex-wrap">
            {DAYS.map((d) => (
              <OptionChip
                key={d}
                label={`${d} days`}
                selected={days === d}
                onPress={() => setDays(d)}
              />
            ))}
          </View>
        </View>

        {/* Session duration */}
        <View className="px-5 mb-6">
          <Text className="text-text font-semibold text-base mb-3">
            Session length?
          </Text>
          <View className="flex-row flex-wrap">
            {DURATIONS.map((d) => (
              <OptionChip
                key={d}
                label={`${d} min`}
                selected={duration === d}
                onPress={() => setDuration(d)}
              />
            ))}
          </View>
        </View>

        {/* Preview card */}
        {preview && (
          <View className="mx-5 bg-surface rounded-2xl border border-primary/30 p-4 mb-6">
            <Text className="text-primary text-xs font-bold tracking-widest uppercase mb-1">
              Your Match
            </Text>
            <Text className="text-text text-sm leading-5">{preview}</Text>
          </View>
        )}

        {/* Error */}
        {error && (
          <Text className="text-red-500 text-sm px-5 mb-4">{error}</Text>
        )}

        {/* CTA */}
        <View className="px-5">
          <TouchableOpacity
            className="w-full bg-primary rounded-xl py-4 items-center"
            style={{ opacity: (!canBuild || assigning) ? 0.5 : 1 }}
            onPress={handleBuild}
            disabled={!canBuild || assigning}
          >
            {assigning ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <View className="flex-row items-center gap-2">
                <Text className="text-white font-bold text-base">Build My Plan</Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
