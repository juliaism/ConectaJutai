import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../configApi/api";

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  ResetPassword: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Signup">;
};

export default function SignupScreen({ navigation }: Props) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (phone === "" || password === "" || confirmPassword === "") {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (!/^\d{9}$/.test(phone)) {
      Alert.alert("Erro", "Telefone deve ter 9 números");
      return;
    }

    if (!/^\d{8}$/.test(password)) {
      Alert.alert("Erro", "Senha deve ter 8 números");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/api/auth/signup",
        { phone, password },
        { timeout: 10000 }
      );

      console.log("Resposta da API:", response.data);

      if (!response.data.user) {
        console.log("Usuário não encontrado na resposta");
        Alert.alert("Erro", "Servidor não retornou os dados do usuário");
        return;
      }

      console.log("Cadastro realizado com sucesso!");
      Alert.alert("Sucesso!", "Sua conta foi criada. Faça login para continuar.");

      setPhone("");
      setPassword("");
      setConfirmPassword("");
      
      // 🎯 Manda o usuário para a tela de Login em vez de tentar abrir a tela antiga
      navigation.navigate("Login");

    } catch (error: any) {
      console.log("ERRO CAPTURADO:", error);
      console.log("Tipo de erro:", error?.constructor?.name);
      console.log("Mensagem:", error?.message);

      if (axios.isAxiosError(error)) {
        console.log("É um erro Axios");
        if (error.response) {
          console.log("Status:", error.response.status);
          console.log("Dados:", error.response.data);
          Alert.alert(
            "Erro",
            error.response.data?.error || "Erro ao cadastrar"
          );
        } else if (error.request) {
          console.log("Nenhuma resposta do servidor");
          Alert.alert(
            "Erro",
            "Servidor não respondeu. Verifique sua internet."
          );
        } else {
          console.log("Erro na configuração:", error.message);
          Alert.alert("Erro", error.message);
        }
      } else {
        console.log("Erro desconhecido:", error);
        Alert.alert("Erro", "Erro desconhecido");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Telefone de 9 dígitos"
        placeholderTextColor="#95A5A6"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha de 8 dígitos"
        placeholderTextColor="#95A5A6"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        placeholderTextColor="#95A5A6"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.buttonContainer, loading && styles.buttonDisabled]}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>

      <Text
        style={styles.link}
        onPress={() => !loading && navigation.navigate("Login")}
      >
        Já tenho uma conta. Entrar
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
  },
  buttonDisabled: {
    backgroundColor: "#BDC3C7",
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  link: {
    marginTop: 25,
    color: "#2980B9",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
});
