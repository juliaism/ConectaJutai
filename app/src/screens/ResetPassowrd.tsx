import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { resetPassword } from "../service/authService";

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
    try {
      const data = await resetPassword(phone, newPassword);
      Alert.alert(data.message || "Senha redefinida com sucesso!");
      navigation.navigate("Login");
    } catch {
      Alert.alert("Erro ao redefinir senha");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resetar Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Telefone cadastrado"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Nova senha"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Button title="Redefinir" onPress={handleReset} />
      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        Voltar ao Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  link: { marginTop: 15, color: "blue", textAlign: "center" },
});

