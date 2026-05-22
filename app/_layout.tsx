import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#27AE60', // Verde do Agro para o botão ativo
        tabBarInactiveTintColor: '#7F8C8D', // Cinza para os inativos
        headerStyle: {
          backgroundColor: '#27AE60', // Cabeçalho verde
        },
        headerTintColor: '#fff', // Texto do cabeçalho branco
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
      }}>
      
      {/* Aba 1: Início */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* Aba 2: Guias */}
      <Tabs.Screen
        name="guias"
        options={{
          title: 'Guias',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* Aba 3: Jornada Gamificada */}
      <Tabs.Screen
        name="jornada"
        options={{
          title: 'Jornada',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'leaf' : 'leaf-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}