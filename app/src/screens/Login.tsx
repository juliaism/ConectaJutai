import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../configApi/api";

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Courses: undefined;
  ResetPassword: undefined;
};

type Props = {
  navigation: any;
  setIsLoggedIn: (value: boolean) => void; 
};

export default function LoginScreen({ navigation, setIsLoggedIn }: Props) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (phone.trim() === "" || password.trim() === "") {
      Alert.alert("Erro", "Por favor, preencha o telefone e a senha.");
      return;
    }

    try {
      setLoading(true);

      console.log("Iniciando login...");
      console.log("Telefone:", phone);
      console.log("Senha:", password);

      const response = await api.post(
        "/api/auth/login",
        { phone, password },
        { timeout: 10000 }
      );

      console.log("Resposta da API:", response.data);

      if (!response.data.token) {
        console.log("Token não encontrado na resposta");
        Alert.alert("Erro", "Servidor não retornou um token válido");
        return;
      }

      const token = response.data.token;
      console.log("Token recebido:", token);

      await AsyncStorage.setItem("token", token);
      console.log("Token salvo no AsyncStorage");

      Alert.alert("Sucesso", "Login realizado com sucesso");
      setIsLoggedIn(true);

    } catch (error: any) {
      console.log("ERRO CAPTURADO:", error);
      console.log("Tipo de erro:", error?.constructor?.name);
      console.log("Mensagem:", error?.message);

      if (axios.isAxiosError(error)) {
        console.log("É um erro Axios");
        
        if (error.response) {
          console.log("Status:", error.response.status);
          console.log("Dados:", error.response.data);
          Alert.alert("Erro", error.response.data?.error || "Credenciais inválidas");
        } else if (error.request) {
          console.log("Nenhuma resposta do servidor");
          Alert.alert("Erro", "Servidor não respondeu. Verifique sua internet.");
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
      <Text style={styles.title}>ConectaJutaí</Text>

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

      <TouchableOpacity
        style={[styles.buttonContainer, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <Text
        style={styles.link}
        onPress={() => !loading && navigation.navigate("ResetPassword")}
      >
        Esqueci minha senha
      </Text>

      <Text
        style={styles.link}
        onPress={() => !loading && navigation.navigate("Signup")}
      >
        Cadastrar-se
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
    marginBottom: 30,
    textAlign: "center",
    color: "#27AE60"
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCDCDC",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
    color: "#2C3E50"
  },
  buttonContainer: {
    backgroundColor: "#27AE60",
    padding: 15,
    borderRadius: 10,
    marginTop: 10
  },
  buttonDisabled: {
    backgroundColor: "#BDC3C7",
    opacity: 0.6
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18
  },
  link: {
    marginTop: 20,
    color: "#2980B9",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500"
  }
});

