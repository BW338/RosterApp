import { useState, useEffect } from "react";
import Purchases from "react-native-purchases";
import { Platform } from "react-native";

// Switch para activar/desactivar la implementación de IAP.
// true:  Modo debug, siempre suscrito. Ideal para emuladores y desarrollo.
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
      setOfferings({ current: { identifier: "mock_offering" } });
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
        if (fetchedOfferings.current) {
          setOfferings(fetchedOfferings.current);
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

  // Devolvemos el estado de carga junto con los otros datos.
  return { isSubscribed, offerings, loading };
}
