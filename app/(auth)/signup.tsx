import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native'
import { router } from 'expo-router'
import { supabase } from '@/services/supabase/client'
import { colors } from '@/theme/colors'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [pendingConfirmation, setPendingConfirmation] = useState(false)

  const handleSignup = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setError(null)
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    // Email confirmation required — session will be null
    if (!data.session) {
      setPendingConfirmation(true)
      return
    }

    // Email confirmation disabled — session returned immediately
    router.replace('/(app)/(tabs)/home')
  }

  if (pendingConfirmation) {
    return (
      <View className="flex-1 bg-bg items-center justify-center px-6">
        <Text className="text-primary text-5xl mb-6">✉️</Text>
        <Text className="text-text text-2xl font-bold mb-3 text-center">
          Check your email
        </Text>
        <Text className="text-text-muted text-base text-center mb-8">
          We sent a confirmation link to{'\n'}
          <Text className="text-text font-medium">{email}</Text>
        </Text>
        <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
          <Text className="text-primary font-semibold text-base">
            Back to Sign In
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-bg"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 pt-16">
          <TouchableOpacity onPress={() => router.back()} className="mb-8">
            <Text className="text-primary text-base">← Back</Text>
          </TouchableOpacity>

          <Text className="text-text text-3xl font-bold mb-2">Create account</Text>
          <Text className="text-text-muted text-base mb-8">Start your fitness journey</Text>

          <TextInput
            className="bg-surface rounded-xl px-4 py-4 text-text text-base border border-border mb-4"
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            returnKeyType="next"
          />

          <TextInput
            className="bg-surface rounded-xl px-4 py-4 text-text text-base border border-border mb-6"
            placeholder="Password (min 6 characters)"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
            returnKeyType="done"
            onSubmitEditing={handleSignup}
          />

          {error ? (
            <Text className="text-red-500 text-sm mb-4">{error}</Text>
          ) : null}

          <TouchableOpacity
            className="w-full bg-primary rounded-xl py-4 items-center"
            style={{ opacity: loading ? 0.6 : 1 }}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-white font-semibold text-base">Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-6 items-center"
            onPress={() => router.push('/(auth)/login')}
          >
            <Text className="text-text-muted text-sm">
              Already have an account?{' '}
              <Text className="text-primary font-semibold">Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
