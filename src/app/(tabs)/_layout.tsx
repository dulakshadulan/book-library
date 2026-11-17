import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              color={color as string}
              name={focused ? 'library' : 'library-outline'}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              color={color as string}
              name={focused ? 'cloud-upload' : 'cloud-upload-outline'}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              color={color as string}
              name={focused ? 'settings' : 'settings-outline'}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
