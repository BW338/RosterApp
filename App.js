import React, { useEffect, useState, createContext, useContext } from "react";
import { SafeAreaView, ActivityIndicator, Platform } from "react-native";
import Purchases from "react-native-purchases";
import RosterView from "./Components/Roster/RosterView";

// Contexto de suscripción
const SubscriptionContext = createContext();
export const useSubscription = () => useContext(SubscriptionContext);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [offerings, setOfferings] = useState(null);

  useEffect(() => {
    const initRevenueCat = async () => {
      try {
        await Purchases.configure({
          apiKey: Platform.select({
            ios: "appl_xxx_tuApiKeyDeRevenueCat", // 👈 reemplazar con tu API key
            android: "goog_VthLntOZIMTTEsBySxJZRsHZVco",
          }),
        });

        // Info del usuario
        const customerInfo = await Purchases.getCustomerInfo();
        setIsSubscribed(!!customerInfo.entitlements.active["Roster access"]);

        // Obtener planes disponibles
        const availableOfferings = await Purchases.getOfferings();
        setOfferings(availableOfferings.current);
      } catch (error) {
        console.log("❌ Error inicializando RevenueCat:", error);
      } finally {
        setLoading(false);
      }
    };

    initRevenueCat();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SubscriptionContext.Provider value={{ isSubscribed, setIsSubscribed, offerings }}>
      <SafeAreaView style={{ flex: 1 }}>
        <RosterView />
      </SafeAreaView>
    </SubscriptionContext.Provider>
  );
}
