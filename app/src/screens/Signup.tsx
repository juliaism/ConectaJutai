import axios from "axios";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignupScreen({ navigation }: any) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const response = await axios.post("http://192.168.86.40:3000/auth/signup", {
        phone,
        password,
      });

      if (response.data?.message) {
        Alert.alert("Sucesso!", "Sua conta foi criada. Agora faça seu login.");
        navigation.navigate("Login");
      } else {
        Alert.alert("Erro", "Não foi possível criar o usuário.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha ao se cadastrar. Verifique a conexão.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.subtitle}>Junte-se aos jovens agricultores do Jutaí!</Text>

      <TextInput
        style={styles.input}
        placeholder="Seu telefone"
        placeholderTextColor="#95A5A6"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Crie uma senha"
        placeholderTextColor="#95A5A6"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.buttonContainer} onPress={handleSignup}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        Já tenho uma conta? Entrar
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    padding: 25, 
    backgroundColor: "#F4F7F6" 
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#27AE60",
  },
  subtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCDCDC",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
    color: "#2C3E50",
  },
  buttonContainer: {
    backgroundColor: "#27AE60",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  link: { 
    marginTop: 20, 
    color: "#2980B9", 
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500"
  },
});
