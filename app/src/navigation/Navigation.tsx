import React from "react";
import { NavigationContainer, NavigatorScreenParams} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "../screens/Login";
import SignupScreen from "../screens/Signup";
import ProfileScreen from "../screens/Perfil";
import ResetPasswordScreen from "../screens/ResetPassowrd";
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
  Guia: undefined;
  Jornada: NavigatorScreenParams<JornadaStackParamList>;
  Download: undefined;
  Profile: undefined;
};


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false,}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ResetPassword" component={(ResetPasswordScreen)} />
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
          let iconName: any;

          if (route.name === "Guia") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Jornada"){
            iconName = focused ? "leaf" : "leaf-outline";
          } else if (route.name === "Downloads"){
            iconName = focused ? "download" : "download-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
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
        options={{
          tabBarLabel: "Cursos",
        }}
      />
       <Tab.Screen
        name="Jornada"
        component={JornadaStack}
        options={{
          tabBarLabel: "Jornada",
        }}
      />
      <Tab.Screen
        name="Download"
        component={DownloadsScreen}
        options={{
          tabBarLabel: "Downloads",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Perfil",
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}