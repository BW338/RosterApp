import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../Styles/SubscriptionPageStyles';

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
      
      if (result.success && result.restored) {
        Alert.alert(
          'Compras restauradas',
          'Tu suscripción activa ha sido restaurada exitosamente.',
          [{ text: 'Continuar', onPress: () => navigation.goBack() }]
        );
      } else {
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
    const detailsByPackageType = {
      MONTHLY: {
        title: 'Mensual',
        period: '/mes',
        popular: false,
        savings: null,
        icon: 'calendar-outline'
      },
      SIX_MONTH: {
        title: 'Semestral',
        period: '/6 meses',
        popular: true,
        savings: 'Ahorra 11%',
        icon: 'medal-outline'
      },
      ANNUAL: {
        title: 'Anual',
        period: '/año',
        popular: false,
        savings: 'Ahorra 16%',
        icon: 'trophy-outline'
      }
    };

    const detailsByIdentifier = {
      monthly: detailsByPackageType.MONTHLY,
      six_months: detailsByPackageType.SIX_MONTH,
      annual: detailsByPackageType.ANNUAL,
    };

    const details = detailsByPackageType[packageItem.packageType] || detailsByIdentifier[packageItem.identifier];

    return details || {
      title: packageItem.product?.title || 'Plan Desconocido',
      period: '',
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

  const premiumFeatures = [
    { icon: 'airplane-outline', text: 'Tu plan de vuelo siempre disponible, incluso offline' },
    { icon: 'document-text-outline', text: 'Resumen de cada vuelo en un solo vistazo' },
    { icon: 'calendar-outline', text: 'Calendario mensual con tu actividad reflejada' },
    { icon: 'create-outline', text: 'Espacio personal para anotar tus pendientes' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="rocket-outline" size={40} color="#3983f1" />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Acceso Completo</Text>
              <Text style={styles.headerSubtitle}>
                Desbloquea todas las funcionalidades premium
              </Text>
            </View>
          </View>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {premiumFeatures.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Ionicons name={feature.icon} size={24} color="#3983f1" />
              </View>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>

        {/* Packages Title */}
        <View style={styles.packagesTitleContainer}>
          <Text style={styles.packagesTitle}>Planes disponibles</Text>
          <Text style={styles.packagesSubtitle}>Todos incluyen las mismas funciones</Text>
        </View>

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
                    <Ionicons name="star" size={12} color="#fff" />
                    <Text style={styles.popularText}>MÁS POPULAR</Text>
                  </View>
                )}
                
                <View style={styles.packageContent}>
                  <View style={styles.packageLeft}>
                    <View style={styles.packageIconCircle}>
                      <Ionicons name={details.icon} size={24} color="#3983f1" />
                    </View>
                    <View style={styles.packageInfo}>
                      <Text style={styles.packageTitle}>{details.title}</Text>
                      {details.savings && (
                        <View style={styles.savingsBadge}>
                          <Text style={styles.savingsText}>{details.savings}</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.packageRight}>
                    <Text style={styles.priceText}>
                      {packageItem.product?.priceString || 'N/A'}
                    </Text>
                    <Text style={styles.periodText}>{details.period}</Text>
                  </View>
                </View>

                {isLoading ? (
                  <ActivityIndicator size="small" color="#3983f1" style={styles.packageLoader} />
                ) : (
                  <View style={styles.selectButton}>
                    <Text style={styles.selectButtonText}>Suscribirme</Text>
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
            Renovación automática. Cancela en cualquier momento desde tu cuenta.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionPage;