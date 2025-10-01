import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, StatusBar } from 'react-native';
import styles from '../Styles/WelcomeScreenStyles';

const WelcomeScreen = ({ onFinish }) => {
  // Valores para las animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current; // Opacidad de todo
  const slideAnim = useRef(new Animated.Value(30)).current; // Posición del texto

  useEffect(() => {
    // Inicia las animaciones en paralelo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200, // Hacemos la entrada un poco más rápida
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Inicia el temporizador para la animación de salida
    const exitTimer = setTimeout(() => {
      // Animación de fade-out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600, // Duración del fade-out
        useNativeDriver: true,
      }).start(() => onFinish()); // Llama a onFinish solo cuando la animación termina
    }, 3300); // Tiempo total en pantalla: 2400ms (visible) + 600ms (fade-out) = 3s

    return () => clearTimeout(exitTimer);
  }, [fadeAnim, slideAnim, onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1c1c1e" />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Contenedor para el logo con sombra y bordes */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/icon.png')} 
            style={styles.logo}
          />
        </View>
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.title}>Bienvenido a TimePicker</Text>
          <Text style={styles.subtitle}>Tu asistente de vuelo personal. V19</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default WelcomeScreen;