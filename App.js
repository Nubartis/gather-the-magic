import React from 'react';
import MainView from './src/views/main-view.js'
import { View, StyleSheet } from 'react-native'

export default function App() {
  return (
    <View style={styles.container}>
        <MainView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
