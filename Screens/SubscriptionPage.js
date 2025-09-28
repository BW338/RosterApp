import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SubscriptionPage = ({ navigation, offerings, purchasePackage, restorePurchases }) => {
  const [loading, setLoading] = useState(false);
  const [purchasingPackage, setPurchasingPackage] = useState(null);

  const handlePurchase = async (packageItem) => {
    setLoading(true);
    setPurchasingPackage(packageItem.identifier);
    
    try {
      const result = await purchasePackage(packageItem);
      
      if (result.success) {
        Alert.alert(
          'Suscripción exitosa',
          'Ya tienes acceso completo a todas las funciones de la aplicación.',
          [{ text: 'Continuar', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert(
          'Error en la compra',
          'No se pudo completar la suscripción. Intenta de nuevo.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Ocurrió un problema inesperado. Intenta de nuevo.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setPurchasingPackage(null);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    
    try {
      const result = await restorePurchases();
      
      // Verificamos si la API tuvo éxito Y si se encontró una suscripción activa.
      if (result.success && result.restored) {
        Alert.alert(
          'Compras restauradas',
          'Tu suscripción activa ha sido restaurada exitosamente.',
          [{ text: 'Continuar', onPress: () => navigation.goBack() }]
        );
      } else {
        // Esto cubre el caso donde la API funciona pero no hay compras activas,
        // o si la API falló por alguna razón.
        Alert.alert(
          'Sin compras activas',
          'No se encontró una suscripción activa para restaurar en tu cuenta.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron restaurar las compras.', [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  const getPackageDetails = (packageItem) => {
    // Mapeo de detalles por TIPO de paquete (MONTHLY, ANNUAL, etc.)
    const detailsByPackageType = {
      MONTHLY: {
        title: 'Plan Mensual',
        description: 'Acceso completo por 1 mes',
        popular: false,
        savings: null,
        icon: 'calendar-outline'
      },
      SIX_MONTH: {
        title: 'Plan Semestral',
        description: 'Acceso completo por 6 meses',
        popular: true,
        savings: 'Ahorra 11%',
        icon: 'medal-outline'
      },
      ANNUAL: {
        title: 'Plan Anual',
        description: 'Acceso completo por 1 año',
        popular: false,
        savings: 'Ahorra 16%',
        icon: 'trophy-outline'
      }
    };

    // Mapeo para modo DEBUG que usa 'identifier' en lugar de 'packageType'
    const detailsByIdentifier = {
      monthly: detailsByPackageType.MONTHLY,
      six_months: detailsByPackageType.SIX_MONTH,
      annual: detailsByPackageType.ANNUAL,
    };

    // Se prioriza 'packageType' (producción) y se usa 'identifier' como fallback (debug)
    const details = detailsByPackageType[packageItem.packageType] || detailsByIdentifier[packageItem.identifier];

    return details || { // Fallback final si no se encuentra por ninguno de los dos métodos
      title: packageItem.product?.title || 'Plan Desconocido',
      description: 'Acceso completo',
      popular: false,
      savings: null,
      icon: 'star-outline'
    };
  };

  if (!offerings || !offerings.availablePackages) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3983f1" />
          <Text style={styles.loadingText}>Cargando planes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Elegí tu plan</Text>
          
          {/* <Text style={styles.headerSubtitle}>
            Desbloquea todas las funciones premium de RosterApp
          </Text> */}
        </View>

        {/* Features */}
        {/* <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Incluye:</Text>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.featureText}>Acceso completo al calendario</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.featureText}>Calculadora de viáticos</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.featureText}>Gestión de horarios flex</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.featureText}>Sincronización en la nube</Text>
          </View>
        </View> */}

        {/* Packages */}
        <View style={styles.packagesContainer}>
          {offerings.availablePackages.map((packageItem) => {
            const details = getPackageDetails(packageItem);
            const isLoading = purchasingPackage === packageItem.identifier;

            return (
              <TouchableOpacity
                key={packageItem.identifier}
                style={[
                  styles.packageCard,
                  details.popular && styles.popularPackage,
                  isLoading && styles.loadingPackage
                ]}
                onPress={() => handlePurchase(packageItem)}
                disabled={loading}
              >
                {details.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>MÁS POPULAR</Text>
                  </View>
                )}
                
                <View style={styles.packageHeader}>
                  <Ionicons name={details.icon} size={32} color="#3983f1" />
                  <View style={styles.packageTitleContainer}>
                    <Text style={styles.packageTitle}>{details.title}</Text>
                    <Text style={styles.packageDescription}>{details.description}</Text>
                  </View>
                  {details.savings && (
                    <View style={styles.savingsBadge}>
                      <Text style={styles.savingsText}>{details.savings}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.packagePrice}>
                  <Text style={styles.priceText}>
                    {packageItem.product?.priceString || 'Precio no disponible'}
                  </Text>
                </View>

                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" style={styles.packageLoader} />
                ) : (
                  <View style={styles.selectButton}>
                    <Text style={styles.selectButtonText}>Seleccionar</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Restore Button */}
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={loading}
        >
          <Ionicons name="refresh-outline" size={20} color="#666" />
          <Text style={styles.restoreText}>Restaurar compras</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Las suscripciones se renuevan automáticamente. Puedes cancelar en cualquier momento
            desde la configuración de tu cuenta.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    margin: 24,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#555',
  },
  packagesContainer: {
    paddingHorizontal: 24,
  },
  packageCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  popularPackage: {
    borderColor: '#3983f1',
    transform: [{ scale: 1.02 }],
  },
  loadingPackage: {
    opacity: 0.7,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    backgroundColor: '#3983f1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  packageTitleContainer: {
    flex: 1,
    marginLeft: 16,
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  packageDescription: {
    fontSize: 14,
    color: '#666',
  },
  savingsBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  savingsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  packagePrice: {
    marginBottom: 16,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  packageLoader: {
    paddingVertical: 12,
  },
  selectButton: {
    backgroundColor: '#3983f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  restoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 24,
    padding: 16,
  },
  restoreText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  footer: {
    padding: 24,
    paddingTop: 0,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default SubscriptionPage