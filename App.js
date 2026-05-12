import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './frontend/screens/Login';
import Signup from './frontend/screens/Signup'

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Login/>
      <Signup/>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
