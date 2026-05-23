import React from "react";
import { NavigationContainer, NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "../screens/Login";
import SignupScreen from "../screens/Signup";
import ProfileScreen from "../screens/Perfil";
import ResetPasswordScreen from "../screens/ResetPassowrd"; // Mantido conforme o seu arquivo físico atual
import JornadaScreen from "../screens/Jornada";
import GuiasScreen from "../screens/Guia";
import DownloadsScreen from "../screens/Download";
import ModuleScreen from "../screens/Modulo";

export type JornadaStackParamList = {
  JornadaHome: undefined;
  Modulo: {
    videoUrl: string;
    moduleId: string;
    userId: string;
    nextModuleId?: string;
    moduleTitle: string;
  };
};

export type AppTabsParamList = {
  Guias: undefined;
  Jornada: NavigatorScreenParams<JornadaStackParamList>;
  Download: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 🎯 CORREÇÃO: AuthStack agora recebe o controle de login e repassa para a tela de Login
function AuthStack({ setIsLoggedIn }: { setIsLoggedIn: (value: boolean) => void }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

function JornadaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JornadaHome" component={JornadaScreen} />
      <Stack.Screen name="Modulo" component={ModuleScreen} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = "help-circle";

          switch (route.name) {
            case "Guias":
              iconName = focused ? "book" : "book-outline";
              break;
            case "Jornada":
              iconName = focused ? "leaf" : "leaf-outline";
              break;
            case "Download":
              iconName = focused ? "download" : "download-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#27AE60",
        tabBarInactiveTintColor: "#95A5A6",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#DCDCDC",
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Guias"
        component={GuiasScreen}
        options={{ tabBarLabel: "Cursos" }}
      />
      <Tab.Screen
        name="Jornada"
        component={JornadaStack}
        options={{ tabBarLabel: "Jornada" }}
      />
      <Tab.Screen
        name="Download"
        component={DownloadsScreen}
        options={{ tabBarLabel: "Downloads" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Perfil" }}
      />
    </Tab.Navigator>
  );
}

type NavigationProps = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
};

export default function Navigation({ isLoggedIn, setIsLoggedIn }: NavigationProps) {
  return (
    <NavigationContainer>
      {/* 🎯 CORREÇÃO: Passando o gatilho de login para o fluxo de autenticação */}
      {isLoggedIn ? <AppTabs /> : <AuthStack setIsLoggedIn={setIsLoggedIn} />}
    </NavigationContainer>
  );
}
