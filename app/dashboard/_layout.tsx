import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';
import Colors from '../../constants/colors';

function TabBarIcon({ name, color }: { name: string; color: string }) {
  // 这里只是简单地使用文本，在实际应用中应该使用图标库如 @expo/vector-icons
  const getIconText = () => {
    switch (name) {
      case 'home':
        return '🏠';
      case 'capture':
        return '📷';
      case 'learn':
        return '📚';
      case 'profile':
        return '👤';
      default:
        return '📱';
    }
  };

  return (
    <Text style={{ fontSize: 20, color }}>{getIconText()}</Text>
  );
}

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="capture"
        options={{
          title: '拍照识题',
          tabBarIcon: ({ color }) => <TabBarIcon name="capture" color={color} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: '学习',
          tabBarIcon: ({ color }) => <TabBarIcon name="learn" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ color }) => <TabBarIcon name="profile" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: 'white',
  },
  tabBarLabel: {
    fontSize: 12,
  },
});
