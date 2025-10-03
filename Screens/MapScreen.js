import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { airportCoordinates } from '../Helpers/airportCoordinates';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MapScreen = ({ route }) => {
  const mapRef = useRef(null);
  const [roster, setRoster] = useState(route.params?.roster || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRosterFromStorage = async () => {
      // Si ya tenemos un roster de los params, no es necesario cargar de nuevo.
      if (roster.length > 0) {
        setLoading(false);
        return;
      }
      try {
        const savedRoster = await AsyncStorage.getItem('roster');
        if (savedRoster) {
          setRoster(JSON.parse(savedRoster));
        }
      } catch (error) {
        console.error("Error cargando roster en el mapa:", error);
      } finally {
        setLoading(false);
      }
    };
    loadRosterFromStorage();
  }, []);

  // 1. Extraemos los códigos de aeropuerto únicos de todo el roster
  const markers = useMemo(() => {
    if (!roster || roster.length === 0) return [];

    const airportCodes = new Set();
    roster.forEach(day => {
      day.flights?.forEach(flight => {
        if (flight.origin) airportCodes.add(flight.origin);
        if (flight.destination) airportCodes.add(flight.destination);
      });
    });

    // 2. Buscamos las coordenadas y creamos los marcadores
    return Array.from(airportCodes)
      .map(code => {
        const airport = airportCoordinates[code];
        if (airport) {
          return {
            code: code,
            coordinate: { latitude: airport.latitude, longitude: airport.longitude },
            title: code,
            description: airport.city,
          };
        }
        return null;
      })
      .filter(Boolean); // Filtramos los aeropuertos que no encontramos
  }, [roster]);

  // 3. Hacemos que el mapa se ajuste para mostrar todos los marcadores
  useEffect(() => {
    if (mapRef.current && markers.length > 1) {
      const coordinates = markers.map(marker => marker.coordinate);
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [markers]);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
      <MapView ref={mapRef} style={styles.map} initialRegion={{ latitude: -34.6, longitude: -58.4, latitudeDelta: 40, longitudeDelta: 40 }}>
        {markers.map(marker => (
          <Marker
            key={marker.code}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  map: { ...StyleSheet.absoluteFillObject },
});

export default MapScreen;