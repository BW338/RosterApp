import { useState, useEffect } from "react";
import Purchases from "react-native-purchases";
import { Platform } from "react-native";

// Switch para activar/desactivar la implementación de IAP.
// true:  Modo debug, siempre suscrito. Para desarrollo.
// false: Modo producción, usa RevenueCat para verificar suscripciones reales.
const DEBUG_SUBSCRIPTION = true;

export function useSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [offerings, setOfferings] = useState(null);
  const [loading, setLoading] = useState(true); // Añadimos estado de carga

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
        ]
      });
      setLoading(false);
      return;
    }

    // Lógica de producción con RevenueCat
    const init = async () => {
      try {
        await Purchases.configure({
          apiKey: Platform.select({
            ios: "appl_xxx_tuApiKeyRevenueCat", // Reemplazar con tu clave de iOS
            android: "goog_VthLntOZIMTTEsBySxJZRsHZVco",
          }),
        });

        const customerInfo = await Purchases.getCustomerInfo();
        // Verificamos si el usuario tiene el entitlement "Roster access" activo.
        setIsSubscribed(!!customerInfo.entitlements.active["Roster access"]);

        const fetchedOfferings = await Purchases.getOfferings();
        // Busca tu offering específico "roster_mensual"
        const rosterOffering = fetchedOfferings.all["roster_mensual"];
        if (rosterOffering) {
          setOfferings(rosterOffering);
        }
      } catch (e) {
        console.log("Error RevenueCat:", e);
        // En caso de error, podríamos decidir no bloquear al usuario.
        // Por ahora, lo dejamos como no suscrito.
        setIsSubscribed(false);
      } finally {
        // Marcamos que la carga ha terminado, haya sido exitosa o no.
        setLoading(false);
      }
    };

    init();
  }, []);

  // Función para comprar un package específico
  const purchasePackage = async (packageToPurchase) => {
    if (DEBUG_SUBSCRIPTION) {
      // En modo debug, simula compra exitosa
      setIsSubscribed(true);
      return { success: true };
    }

    try {
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      setIsSubscribed(!!customerInfo.entitlements.active["Roster access"]);
      return { success: true };
    } catch (e) {
      console.log("Error en compra:", e);
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
      const customerInfo = await Purchases.restorePurchases();
      setIsSubscribed(!!customerInfo.entitlements.active["Roster access"]);
      return { success: true };
    } catch (e) {
      console.log("Error restaurando compras:", e);
      return { success: false, error: e };
    }
  };

  // Devolvemos el estado de carga junto con los otros datos.
  return { 
    isSubscribed, 
    offerings, 
    loading, 
    purchasePackage, 
    restorePurchases 
  };
}