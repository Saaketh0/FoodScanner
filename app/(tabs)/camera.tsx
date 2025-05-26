import { BarcodeScanningResult, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useList } from './listcontext';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState<string | null>(null);
  const { addToList } = useList(); // Access the addToList function from context
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
      setBarcodeData(result.data); // Store the scanned barcode data

      try {
        // Send POST request with barcode data
        const response = await fetch('https://saakeths.app.n8n.cloud/webhook-test/459d3b39-3067-48a0-97b1-5ff6c9d3e5bb', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ barcode: result.data }),
        });

        if (!response.ok) {
          console.error('Failed to send barcode data:', response.statusText);
        } else {
          console.log('Barcode data sent successfully');


          // Retrieve and handle the response data
          const scuffedresponseData = await response.json(); // Parse JSON response
          const responseData = scuffedresponseData["output"];
          console.log('Response from webhook:', responseData);

          // Add the response data to the shared list
          addToList(JSON.stringify(responseData)); // Add the response data as a new item in the list

          router.push('./tracker');
          
        }
      } catch (error) {
        console.error('Error sending barcode data:', error);
      }
    }
  }

  function resetScanner() {
    setScanned(false);
    setBarcodeData(null);
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} // Disable scanning after a successful scan
      />
      <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
        <Text style={styles.buttonText}>Flip Camera</Text>
      </TouchableOpacity>
      {barcodeData && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Scanned Data: {barcodeData}</Text>
          <Button title="Scan Again" onPress={resetScanner} />
        </View>
      )}
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
  resultContainer: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  resultText: {
    color: '#fff',
    fontSize: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
});