import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Habilitar LayoutAnimation en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * Un banner de depuración FLOTANTE y COLAPSABLE que muestra el estado de la suscripción y los offerings.
 * Se muestra solo si `showDebugBanner` es true en el hook `useSubscription`.
 */
const DebugBanner = ({ isSubscribed, offerings, show, activeSubscription, appUserID }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!show) {
    return null;
  }

  const toggleExpand = () => {
    // Anima suavemente el cambio de tamaño
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  // Texto mejorado para la suscripción
  let isSubscribedText = '❌ No Suscrito';
  if (isSubscribed && activeSubscription) {
    // Extraemos el tipo de plan del identificador del producto
    const planType = activeSubscription.productIdentifier.split('_').pop(); // ej: '1m', '6m', '1y'
    isSubscribedText = `✅ Suscrito (${planType})`;
  }
  const offeringsText = offerings ? `✅ ${offerings.availablePackages.length} Planes Cargados` : '❌ Sin Planes';
  const bannerColor = isSubscribed && offerings ? '#28a745' : '#dc3545'; // Verde si todo OK, Rojo si algo falla

  return (
    <View style={styles.floatingContainer}>
      <TouchableOpacity
        style={[
          styles.banner,
          { backgroundColor: bannerColor },
          isExpanded ? styles.bannerExpanded : styles.bannerCollapsed,
        ]}
        onPress={toggleExpand}
        activeOpacity={0.8}
      >
        {isExpanded ? (
          // --- Vista Expandida ---
          <View style={styles.contentContainer}>
            <View>
              <Text style={styles.bannerText}>{`[DEBUG] | ${isSubscribedText}`}</Text>
              <Text style={styles.bannerSubText}>{offerings ? `Offering: '${offerings.identifier}' (${offerings.availablePackages.length} paquetes)` : 'Offering: No cargado'}</Text>
              <Text style={styles.bannerSubText} numberOfLines={1} ellipsizeMode="middle">{`ID: ${appUserID || '...'}`}</Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="white" style={styles.icon} />
          </View>
        ) : (
          // --- Vista Colapsada ---
          <View style={styles.contentContainer}>
            <Ionicons name="bug" size={20} color="white" style={styles.icon} />
            <Ionicons name="chevron-up" size={20} color="white" style={styles.icon} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 80, // Lo posicionamos arriba de la barra de navegación inferior
    right: 15,
    zIndex: 1000, // Asegura que esté por encima de todo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  banner: {
    borderRadius: 30, // Bordes redondeados
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Importante para que el contenido no se salga al animar
  },
  bannerCollapsed: {
    width: 80,
    height: 45,
  },
  bannerExpanded: {
    width: 'auto', // Se ajusta al contenido
    height: 45,
    paddingHorizontal: 15,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  bannerSubText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  icon: {
    marginHorizontal: 5,
  },
});

export default DebugBanner;