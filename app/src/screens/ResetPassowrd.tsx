import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import api from "../configApi/api";

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  ResetPassword: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ResetPassword">;
};

export default function ResetPasswordScreen({ navigation }: Props) {
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async () => {
    if (!phone || !newPassword) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    if (!/^\d{9}$/.test(phone)) {
      Alert.alert("Erro", "Telefone deve ter 9 números");
      return;
    }

    if (!/^\d{8}$/.test(newPassword)) {
      Alert.alert("Erro", "Senha deve ter exatamente 8 números");
      return;
    }

    try {
      const response = await api.post("/api/auth/reset", { //ip
        phone,
        newPassword,
      });

      if (response.data?.message) {
        Alert.alert("Sucesso", "Senha redefinida com sucesso!");
        navigation.navigate("Login");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha ao redefinir senha. Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Senha</Text>

      <TextInput
        style={styles.input}
        placeholder="Seu telefone"
        placeholderTextColor="#95A5A6"
        value={phone}
        onChangeText={setPhone}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Crie uma nova senha (8 dígitos)"
        placeholderTextColor="#95A5A6"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.buttonContainer} onPress={handleReset}>
        <Text style={styles.buttonText}>Criar Nova Senha</Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        Voltar para Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#F4F7F6",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#27AE60",
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
    fontWeight: "500",
  },
});

