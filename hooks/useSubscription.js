import { useState, useEffect, useCallback } from 'react';
import Purchases from "react-native-purchases";
import { Platform, AppState } from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Switch para activar/desactivar la implementación de IAP.
// true:  Modo debug, siempre suscrito. Para desarrollo.
// false: Modo producción, usa RevenueCat para verificar suscripciones reales.
//MODO DE PRUEBA
const DEBUG_SUBSCRIPTION = true;
const SHOW_DEBUG_BANNER = true; // Forzar a que el banner se muestre siempre para depuración.

export function useSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [offerings, setOfferings] = useState(null);
  const [loading, setLoading] = useState(true); // Añadimos estado de carga
  // Nuevo estado para guardar los detalles de la suscripción activa
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [appUserID, setAppUserID] = useState(null);

  const checkSubscription = useCallback(async (source = 'manual') => {
    try {
      await Purchases.syncPurchases();
      console.log(`[${source}] 🔄 Verificando estado de la suscripción...`);

      const customerInfo = await Purchases.getCustomerInfo();
      const activeEntitlement = customerInfo.entitlements.active["Roster access"];
      const isActive = !!activeEntitlement;

      setIsSubscribed(prevState => {
        if (prevState !== isActive) {
          console.log(`[${source}] ✅ Estado cambió: ${prevState} -> ${isActive}`);
          Toast.show({ type: 'info', text1: 'RC Status', text2: `Suscripción: ${isActive ? 'Activa' : 'Inactiva'}` });
        }
        return isActive;
      });
      setActiveSubscription(activeEntitlement || null);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'RC Check Error', text2: `Fallo en ${source}` });
      console.error("Error al verificar la suscripción:", e);
      setIsSubscribed(false);
    }
  }, []);

  useEffect(() => {
    // Si estamos en modo debug, simulamos la suscripción y terminamos.
    if (DEBUG_SUBSCRIPTION) {
      setIsSubscribed(true);
      // Mock con los 3 packages para testing (precios reales)
      setOfferings({
        identifier: "roster_mensual",
        availablePackages: [
          { identifier: "monthly", product: { title: "Plan Mensual", priceString: "USD$1.50" } },
          { identifier: "six_months", product: { title: "Plan Semestral", priceString: "USD$8.00" } },
          { identifier: "annual", product: { title: "Plan Anual", priceString: "USD$15.00" } }
        ],
        activeSubscription: { productIdentifier: 'debug_plan', periodType: 'DEBUG' }
      });
      setLoading(false);
      return;
    }

    // Lógica de producción con RevenueCat
    const init = async () => {
      try {
        Toast.show({ type: 'info', text1: 'RC Init', text2: 'Configurando SDK...' });

        // 1. CONFIGURAR PRIMERO
        await Purchases.configure({
          apiKey: Platform.select({
            ios: "appl_xxx_tuApiKeyRevenueCat", // Reemplazar con tu clave de iOS
            android: "goog_VthLntOZIMTTEsBySxJZRsHZVco",
            default: "rc_xxx_tuApiKeyPublica", // Reemplazar con tu Public API Key
          }),
        });
        console.log("✅ RevenueCat configurado.");

        // 2. IDENTIFICAR USUARIO
        let currentUserID = await AsyncStorage.getItem('appUserID');
        if (!currentUserID) {
          currentUserID = `roster_user_${Date.now()}`;
          await AsyncStorage.setItem('appUserID', currentUserID);
          console.log(`👤 Nuevo App User ID creado: ${currentUserID}`);
        } else {
          console.log(`👤 App User ID cargado: ${currentUserID}`);
        }
        await Purchases.logIn(currentUserID);
        setAppUserID(currentUserID); // Guardamos el ID en el estado
        console.log("✅ Usuario identificado en RevenueCat.");
        
        // 3. VERIFICACIÓN INICIAL
        await checkSubscription('app-init');

        const fetchedOfferings = await Purchases.getOfferings();
        // Usamos el "offering" actual, que es la forma recomendada y más robusta.
        if (fetchedOfferings.current && fetchedOfferings.current.availablePackages.length > 0) {
          Toast.show({ type: 'success', text1: 'RC Offerings', text2: `${fetchedOfferings.current.availablePackages.length} planes cargados` });
          setOfferings(fetchedOfferings.current);
        } else {
          Toast.show({ type: 'error', text1: 'RC Offerings', text2: 'No se encontraron planes disponibles.' });
          console.warn("⚠️ No se encontraron 'offerings' o paquetes disponibles desde RevenueCat.");
        }
      } catch (e) {
        Toast.show({ type: 'error', text1: 'RC Error', text2: 'Fallo en la inicialización' });
        console.log("Error RevenueCat:", e);
        setIsSubscribed(false);
      } finally {
        // Marcamos que la carga ha terminado, haya sido exitosa o no.
        setLoading(false);
      }
    };

    init();

    // --- LISTENERS ---
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        console.log("App ha vuelto al primer plano. Verificando suscripción...");
        checkSubscription('app-foreground');
      }
    };
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    const customerInfoUpdateHandler = (customerInfo) => {
      console.log("ℹ️ Listener de RevenueCat: Información de cliente actualizada.");
      Toast.show({ type: 'info', text1: 'RC Listener', text2: 'Estado de suscripción actualizado' });
      const activeEntitlement = customerInfo.entitlements.active["Roster access"];
      setIsSubscribed(!!activeEntitlement);
      setActiveSubscription(activeEntitlement || null);
    };

    Purchases.addCustomerInfoUpdateListener(customerInfoUpdateHandler);

    // Limpiar el listener cuando el componente se desmonte para evitar fugas de memoria.
    return () => {
      appStateSubscription.remove();
      Purchases.removeCustomerInfoUpdateListener(customerInfoUpdateHandler);
    };
  }, [checkSubscription]);

  // Función para comprar un package específico
  const purchasePackage = async (packageToPurchase) => {
    if (DEBUG_SUBSCRIPTION) {
      // En modo debug, simula compra exitosa
      setIsSubscribed(true);
      return { success: true };
    }

    try {
      Toast.show({ type: 'info', text1: 'RC Compra', text2: 'Iniciando compra...' });
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      const activeEntitlement = customerInfo.entitlements.active["Roster access"];
      setIsSubscribed(!!activeEntitlement);
      setActiveSubscription(activeEntitlement || null);
      Toast.show({ type: 'success', text1: 'RC Compra', text2: '¡Compra exitosa!' });
      return { success: true };
    } catch (e) {
      console.log("Error en compra:", e);
      if (!e.userCancelled) {
        Toast.show({ type: 'error', text1: 'RC Compra', text2: 'Error durante la compra' });
      }
      return { success: false, error: e };
    }
  };

  // Función para restaurar compras
  const restorePurchases = async () => {
    if (DEBUG_SUBSCRIPTION) {
      setIsSubscribed(true);
      return { success: true };
    }

    try {
      Toast.show({ type: 'info', text1: 'RC Restore', text2: 'Restaurando compras...' });
      const customerInfo = await Purchases.restorePurchases();
      const activeEntitlement = customerInfo.entitlements.active["Roster access"];
      setIsSubscribed(!!activeEntitlement);
      setActiveSubscription(activeEntitlement || null);
      Toast.show({ type: 'success', text1: 'RC Restore', text2: activeEntitlement ? 'Suscripción restaurada' : 'No se encontraron compras' });
      return { success: true, restored: !!activeEntitlement };
    } catch (e) {
      console.log("Error restaurando compras:", e);
      Toast.show({ type: 'error', text1: 'RC Restore', text2: 'Error al restaurar' });
      return { success: false, error: e };
    }
  };

  // Devolvemos el estado de carga junto con los otros datos.
  return { 
    isSubscribed, 
    offerings, 
    loading, 
    purchasePackage, 
    restorePurchases,
    showDebugBanner: SHOW_DEBUG_BANNER,
    activeSubscription,
    appUserID, // Exponemos el ID de usuario
  };
}