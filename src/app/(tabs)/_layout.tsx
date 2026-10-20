import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const icon =
  (active: IconName, inactive: IconName) =>
  ({ color, focused }: { color: ColorValue; focused: boolean }) => <Ionicons name={focused ? active : inactive} size={24} color={color as string} />;

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#8A94A6',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          paddingTop: 6,
          height: 60 + insets.bottom,
          borderTopColor: colors.border,
          backgroundColor: colors.white,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('home', 'home-outline') }} />
      <Tabs.Screen name="orders" options={{ title: 'Orders', tabBarIcon: icon('receipt', 'receipt-outline') }} />
      <Tabs.Screen name="service" options={{ title: 'Service', tabBarIcon: icon('construct', 'construct-outline') }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat', tabBarIcon: icon('chatbubbles', 'chatbubbles-outline') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('person', 'person-outline') }} />
    </Tabs>
  );
}
