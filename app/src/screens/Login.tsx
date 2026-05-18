import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Courses: undefined;
  ResetPassword: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

export default function LoginScreen({ navigation }: Props) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (phone.trim() === "" || password.trim() === "") {
      Alert.alert("Erro", "Por favor, preencha o telefone e a senha.");
      return;
    }

    // Abre o grupo de abas direto com foco nos Guias
    navigation.navigate("(tabs)" as any, { screen: "guias" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ConectaJutaí</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Telefone de 9 dígitos"
        placeholderTextColor="#95A5A6" 
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha de 8 dígitos"
        placeholderTextColor="#95A5A6" 
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate("ResetPassword")}>
        Esqueci minha senha
      </Text>

      <Text style={styles.link} onPress={() => navigation.navigate("Signup")}>
        Cadastrar-se
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 25, backgroundColor: "#F4F7F6" },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 30, textAlign: "center", color: "#27AE60" },
  input: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#DCDCDC", padding: 15, marginBottom: 15, borderRadius: 10, fontSize: 16, color: "#2C3E50" },
  buttonContainer: { backgroundColor: "#27AE60", padding: 15, borderRadius: 10, marginTop: 10 },
  buttonText: { color: "white", fontWeight: "bold", textAlign: "center", fontSize: 18 },
  link: { marginTop: 20, color: "#2980B9", textAlign: "center", fontSize: 16, fontWeight: "500" },
});

