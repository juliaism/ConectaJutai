import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerRootComponent } from "expo";
import Navigation from "./app/src/navigation/Navigation";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("🔑 Token encontrado:", !!token);
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error("❌ Erro ao verificar token:", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#27AE60" />
      </View>
    );
  }

  return <Navigation isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />;
}

registerRootComponent(App);

