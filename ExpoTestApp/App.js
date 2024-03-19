import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

export default function App() {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("...");

  // Foto’s nemen via de applicatie
  const takeImage = async () => {

    let result = await ImagePicker.launchCameraAsync({ quality: 1, });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setMessage(result.assets[0].uri);
    }
  };

  // Documenten en foto’s uploaden
  const takeDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync();

    console.log(result);

    if (!result.canceled) {
      setMessage("file: '" + result.assets[0].name + "' has been picked!");

      if (result.assets[0].mimeType.startsWith("image/")) {
        setImage(result.assets[0].uri);
      } else if (result.assets[0].mimeType == 'application/pdf') {
        // open pdf here
        // Didn't find a solution for Expo
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>{message}</Text>
      <Button title="Take an image from camera roll" onPress={takeImage} />
      <Button title="Select a file from storage" onPress={takeDocument} />
      {image && <Image source={{ uri: image }} style={{ width: 400, height: 500 }} />}
      <StatusBar style="auto" />
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
