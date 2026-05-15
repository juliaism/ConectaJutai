import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { login } from "../service/authService";
import { AuthContext } from "../../../App";

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  ResetPassword: undefined;
  Courses: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

export default function LoginScreen({ navigation }: Props) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { setIsLoggedIn } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const data = await login(phone, password);
      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
        Alert.alert("Login realizado com sucesso!");
        setIsLoggedIn(true);
      } else {
        Alert.alert(data.error || "Erro ao fazer login");
      }
    } catch {
      Alert.alert("Erro de conexão com servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
       style={styles.input} 
       placeholder="Telefone"
       keyboardType="numeric" 
       value={phone} 
       onChangeText={setPhone}
       maxLength={9}
     />
      <TextInput 
       style={styles.input} 
       placeholder="Senha"
       secureTextEntry 
       value={password} 
       onChangeText={setPassword} 
       />
      <Button title="Entrar" onPress={handleLogin} />
      <Text style={styles.link} onPress={() => navigation.navigate("Signup")}>
        Criar conta
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 5 },
  link: { marginTop: 15, color: "blue", textAlign: "center" },
});

