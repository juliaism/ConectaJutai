import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (phone.trim() === "" || password.trim() === "") {
      Alert.alert("Erro", "Por favor, preencha o telefone e a senha.");
      return;
    }

    try {
      setLoading(true);

      console.log("Tentando fazer login com:", { phone, password });

      // ✅ Fazer login na API
      const response = await axios.post(
        "http://192.168.86.40:3000/api/login",
        {
          phone,
          password
        },
        {
          timeout: 10000 // 10 segundos de timeout
        }
      );

      console.log("Resposta da API:", response.data);

      // ✅ Verificar se a resposta tem token
      if (!response.data.token) {
        Alert.alert("Erro", "Servidor não retornou um token válido");
        return;
      }

      const token = response.data.token;

      // ✅ Salvar o token CORRETO da API
      await AsyncStorage.setItem("token", token);

      console.log("Token salvo com sucesso:", token);

      // ✅ O Navigation vai detectar automaticamente que tem token
      // e mostrar AppTabs em vez de AuthStack

      Alert.alert("Sucesso", "Login realizado com sucesso!");

    } catch (error) {
      console.error("Erro ao fazer login:", error);

      // ✅ Mostrar erro detalhado
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Servidor respondeu com erro
          console.error("Erro da API:", error.response.data);
          Alert.alert(
            "Erro",
            error.response.data?.message || "Falha ao fazer login. Verifique suas credenciais."
          );
        } else if (error.request) {
          // Requisição foi feita mas não recebeu resposta
          console.error("Sem resposta do servidor");
          Alert.alert("Erro", "Não foi possível conectar ao servidor. Verifique sua internet.");
        } else {
          // Erro ao configurar a requisição
          console.error("Erro na requisição:", error.message);
          Alert.alert("Erro", "Erro ao processar login");
        }
      } else {
        Alert.alert("Erro", "Erro desconhecido ao fazer login");
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

