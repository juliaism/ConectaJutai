import axios from "axios";
import React, { useState, useEffect } from "react";
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ navigation }: any) {
  const [userPhone, setUserPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const phone = await AsyncStorage.getItem("userPhone");
      if (phone) {
        setUserPhone(phone);
      }
    } catch (err) {
      console.error("Erro ao carregar dados do usuário:", err);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não conferem");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.86.40:3000/auth/reset",
        {
          phone: userPhone,
          newPassword,
        }
      );

      if (response.data?.message) {
        Alert.alert("Sucesso!", "Senha redefinida com sucesso");
        setNewPassword("");
        setConfirmPassword("");
        setShowResetForm(false);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha ao redefinir senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Sair",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("userToken");
              await AsyncStorage.removeItem("userPhone");
              navigation.navigate("Login");
            } catch (err) {
              console.error("Erro ao fazer logout:", err);
              Alert.alert("Erro", "Falha ao sair da conta");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Informações da Conta</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Telefone</Text>
          <Text style={styles.infoText}>{userPhone || "Carregando..."}</Text>
        </View>
      </View>

      {!showResetForm ? (
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => setShowResetForm(true)}
        >
          <Text style={styles.buttonText}>Redefinir Senha</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.resetFormContainer}>
          <Text style={styles.sectionTitle}>Redefinir Senha</Text>

          <TextInput
            style={styles.input}
            placeholder="Nova senha"
            placeholderTextColor="#95A5A6"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirmar senha"
            placeholderTextColor="#95A5A6"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            style={[styles.buttonContainer, styles.confirmButton]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Confirmar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonContainer, styles.cancelButton]}
            onPress={() => {
              setShowResetForm(false);
              setNewPassword("");
              setConfirmPassword("");
            }}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.buttonContainer, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  profileSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 15,
  },
  infoBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCDCDC",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: "#7F8C8D",
    marginBottom: 5,
    fontWeight: "500",
  },
  infoText: {
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "600",
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
  resetFormContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DCDCDC",
  },
  buttonContainer: {
    backgroundColor: "#27AE60",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  confirmButton: {
    backgroundColor: "#27AE60",
  },
  cancelButton: {
    backgroundColor: "#95A5A6",
  },
  logoutButton: {
    backgroundColor: "#E74C3C",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});