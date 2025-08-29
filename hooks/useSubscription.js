//********
// ESTA VERSION ESTA ADAPTADA PARA DAR aCCESO AL EMULADOR */
/// SI QUEREMOS URILIZAR LA DEFINITIVA DEBEMOS TOMAR LA VERSION DE COMMIT |7   **///////
    
import { useState, useEffect } from "react";
import Purchases from "react-native-purchases";
import { Platform } from "react-native";

const DEBUG_SUBSCRIPTION = true; // 👈

export function useSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(DEBUG_SUBSCRIPTION);
  const [offerings, setOfferings] = useState(
    DEBUG_SUBSCRIPTION
      ? { current: { identifier: "mock_offering" } } // 👈 mock offerings
      : null
  );

  useEffect(() => {
    if (DEBUG_SUBSCRIPTION) return;

    const init = async () => {
      try {
        await Purchases.configure({
          apiKey: Platform.select({
            ios: "appl_xxx_tuApiKeyRevenueCat",
            android: "goog_VthLntOZIMTTEsBySxJZRsHZVco",
          }),
        });

        const customerInfo = await Purchases.getCustomerInfo();
        setIsSubscribed(!!customerInfo.entitlements.active["Roster access"]);

        const fetchedOfferings = await Purchases.getOfferings();
        if (fetchedOfferings.current) {
          setOfferings(fetchedOfferings.current);
        }
      } catch (e) {
        console.log("Error RevenueCat:", e);
      }
    };

    init();
  }, []);

  return { isSubscribed, offerings };
}
