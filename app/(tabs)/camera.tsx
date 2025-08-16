import { BarcodeScanningResult, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useList } from './listcontext';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [barcodeNum, setBarcodeNum] = useState<string | null>(null); // renamed variable
  const { addToList } = useList();
  const router = useRouter();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function handleBarCodeScanned(result: BarcodeScanningResult) {
    if (!scanned) {
      setScanned(true);
      const barcodeData = result.data; // The scanned barcode number
      console.log("Barcode scanned:", barcodeData);
  
      // --- NEW CODE TO SEND DATA TO PYTHON ---
      try {
        // Replace 'YOUR_COMPUTER_IP_ADDRESS' with your computer's actual IP on the network
        const response = await fetch('http://10.0.0.40:5000/scan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            barcode: barcodeData, // Send the data in a JSON object
          }),
        });
  
        const responseJson = await response.json();
        console.log('Server response:', responseJson); // Log the server's reply
  
      } catch (error) {
        console.error("Error sending barcode to server:", error);
      }
      // ------------------------------------
  
      // You can still perform your original actions
      addToList(barcodeData);
      router.push('/tracker');
    }
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
        <Text style={styles.buttonText}>Flip Camera</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
});