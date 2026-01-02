import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const Marker: React.FC = () => null;

export default function MapView() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map preview not available on web</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 8,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  text: {
    color: '#666',
  },
});
