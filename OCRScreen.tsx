import React, { useRef, useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { NativeModules } from 'react-native';

const { MLKitOCR } = NativeModules;

export default function OCRCameraScreen() {
    const camera = useRef<Camera>(null);
    const devices = useCameraDevices();
    const device = devices.find((d) => d.position === 'back');
    const [hasPermission, setHasPermission] = useState(false);
    const [detectedText, setDetectedText] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const cameraPermission = await Camera.requestCameraPermission();
            if (cameraPermission === 'granted') {
                setHasPermission(true);
            } else {
                console.error('Camera permission denied');
            }

            if (Platform.OS === 'android') {
                const storagePermission = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                );
                if (storagePermission !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.warn('Storage permission not granted');
                }
            }
        })();
    }, []);

    const captureAndScan = async () => {
        try {
            if (!camera.current) {
                console.error('Camera not ready');
                return;
            }

            const photo = await camera.current.takePhoto({

                //qualityPrioritization: 'quality',
                flash: 'off',
            });

            const result = await MLKitOCR.recognizeText(photo.path);
            
            console.log('Texto detectado:', result);
            setDetectedText(result);
        } catch (err) {
            console.error('Error en OCR:', err);
        }
    };

    if (!device || !hasPermission) return <Text>Cargando cámara...</Text>;

    return (
        <View style={{ flex: 1 }}>
            <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
            />

            <View style={styles.overlay}>
                <Text style={styles.overlayText}>Apunta a la tarjeta</Text>
                <Button title="Escanear tarjeta" onPress={captureAndScan} />
            </View>

            {detectedText && (
                <View style={styles.resultBox}>
                    <Text style={styles.resultText}>Texto detectado:</Text>
                    <Text>{detectedText}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        bottom: 60,
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 10,
    },
    overlayText: {
        color: 'white',
        marginBottom: 10,
        fontSize: 16,
    },
    resultBox: {
        position: 'absolute',
        top: 50,
        backgroundColor: 'white',
        marginHorizontal: 20,
        padding: 10,
        borderRadius: 6,
    },
    resultText: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
});
