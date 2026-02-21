import { View, Text } from 'react-native'
import { Link } from 'expo-router'

export default function NotFound() {
  return (
    <View className="flex-1 bg-bg items-center justify-center">
      <Text className="text-text text-xl font-bold mb-4">Page not found</Text>
      <Link href="/">
        <Text className="text-primary">Go home</Text>
      </Link>
    </View>
  )
}
