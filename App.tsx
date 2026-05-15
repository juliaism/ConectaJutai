import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import JornadaScreen from './app/src/screens/jornada';

export default function App(): React.ReactElement {
  return React.createElement(
    View,
    { style: styles.container },
    React.createElement(StatusBar, { style: "auto" }),
    <JornadaScreen />
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

