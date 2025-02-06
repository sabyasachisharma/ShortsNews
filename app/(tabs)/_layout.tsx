import { Tabs } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import { Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
    console.log('TabLayout: Rendering...');
  const { colorScheme } = useTheme();
  const defaultScheme = colorScheme ?? 'dark'; // Default to dark if not set
  console.log('defaultScheme:', defaultScheme);
  return (
    <Tabs
      screenOptions={{
        // Default dark/gray background until updated
        tabBarStyle: {
          backgroundColor: Colors[defaultScheme].background,
          height: 60,
          paddingBottom: 5,
        },
        // Active/inactive colors
        tabBarActiveTintColor: Colors[defaultScheme].tint,
        tabBarInactiveTintColor: 'gray',
        // Header styling
        headerStyle: {
          backgroundColor: Colors[defaultScheme].background,
        },
        headerTintColor: Colors[defaultScheme].text,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: '',
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Entypo 
              name="home" 
              size={24} 
              color={focused ? Colors[defaultScheme].tint : color}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ 
              color: focused ? Colors[defaultScheme].tint : 'dark',
              fontSize: 12 
            }}>
              Home
            </Text>
          ),
        }}
      />

      {/* ... other existing tabs ... */}

      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, focused }) => (
            <Entypo 
              name="dots-three-horizontal" 
              size={24} 
              color={focused ? Colors[defaultScheme].tint : color} 
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ 
              color: focused ? Colors[defaultScheme].tint : 'dark',
              fontSize: 12 
            }}>
              More
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
