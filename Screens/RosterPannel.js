import React, { useState, useEffect } from "react";
import { View, Button, Alert } from "react-native";
import { WebView } from "react-native-webview";
import Purchases from "react-native-purchases";
import { parseRosterText } from "../Functions/parseRosterText";
import { pickPdfFile } from "../Functions/pickPdf";
import PrimaryButton from "../Components/Buttons/PrimaryButton";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RosterPannelScreen({ isSubscribed, offerings, navigation, route }) {
  const [pdfData, setPdfData] = useState(null);
  const [roster, setRoster] = useState([]);
  const [isPicking, setIsPicking] = useState(false);

   // 🔹 Al iniciar, intentar recuperar el roster guardado
  useEffect(() => {
    const loadRoster = async () => {
      try {
        const saved = await AsyncStorage.getItem("roster");
        if (saved) setRoster(JSON.parse(saved));
      } catch (err) {
        console.error("Error cargando roster guardado:", err);
      }
    };
    loadRoster();
  }, []);

  // 🔹 Guardar roster cada vez que cambie
  useEffect(() => {
    const saveRoster = async () => {
      try {
        if (roster && roster.length > 0) {
          await AsyncStorage.setItem("roster", JSON.stringify(roster));
        }
      } catch (err) {
        console.error("Error guardando roster:", err);
      }
    };
    saveRoster();
  }, [roster]);

  // 🔹 Si se navega con `autoPick`, iniciar el selector de archivos
  useEffect(() => {
    if (route.params?.autoPick) {
      handlePickPdf(true);
    }
  }, [route.params?.autoPick]);

   // 📌 Borrar roster del storage
const handleClearStorage = async () => {
  try {
    await AsyncStorage.removeItem("roster");
    setRoster([]); // limpiamos el estado también
//    Alert.alert("✅ Storage borrado", "Los datos se eliminaron correctamente.");
  } catch (error) {
    console.error("Error borrando storage:", error);
    Alert.alert("❌ Error", "No se pudo borrar el storage.");
  }
};
  // Abrir selector de PDF
  const handlePickPdf = async (isAutoPicking = false) => {
    if (isPicking) return;
    if (!isSubscribed) return; // Seguridad extra
    setIsPicking(true);
    const base64 = await pickPdfFile();
    if (base64) {
      setPdfData(base64);
    } else if (isAutoPicking) {
      // Si el usuario cancela el picker en modo automático, volvemos a la pantalla anterior.
      navigation.goBack();
    }
    setIsPicking(false);
  };

  // Suscribirse
  const handleSubscribe = async () => {
    if (!offerings || !offerings.availablePackages.length) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No hay suscripciones disponibles.",
      });
      return;
    }

    try {
      const purchaseInfo = await Purchases.purchasePackage(
        offerings.availablePackages[0]
      );

      if (purchaseInfo.customerInfo.entitlements.active["Roster access"]) {
        Toast.show({ type: "success", text1: "¡Suscripción activa!" });
      }
    } catch (e) {
      if (!e.userCancelled) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No se pudo completar la compra.",
        });
      }
    }
  };

  // Mostrar PDF si ya fue seleccionado
  if (pdfData) {
    return (
      <WebView
        originWhitelist={["*"]}
        source={{
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
            </head>
            <body>
              <script>
                try {
                  const raw = atob("${pdfData}");
                  const uint8Array = new Uint8Array(raw.length);
                  for (let i = 0; i < raw.length; i++) {
                    uint8Array[i] = raw.charCodeAt(i);
                  }
                  const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
                  loadingTask.promise.then(async function(pdf) {
                    let fullText = "";
                    for (let i = 1; i <= pdf.numPages; i++) {
                      const page = await pdf.getPage(i);
                      const textContent = await page.getTextContent();
                      fullText += textContent.items.map(item => item.str).join(" ") + "\\n";
                    }
                    window.ReactNativeWebView.postMessage(fullText);
                  }).catch(err => {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ error: err.message }));
                  });
                } catch (error) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ error: error.message }));
                }
              </script>
            </body>
            </html>
          `,
        }}
        onMessage={(event) => {
          try {
            const data = event.nativeEvent.data;
            if (data.startsWith("{")) {
              const json = JSON.parse(data);
              if (json.error) {
                Toast.show({
                  type: "error",
                  text1: "Error",
                  text2: "No se pudo extraer texto del PDF.",
                });
                setPdfData(null);
                return;
              }
            }
            const parsed = parseRosterText(data);
            setRoster(parsed);
            setPdfData(null);
            navigation.navigate("RosterScreen", { roster: parsed });
          } catch (err) {
            console.error("Error procesando mensaje WebView:", err);
            Toast.show({
              type: "error",
              text1: "Error interno",
              text2: err.message,
            });
          }
        }}
      />
    );
  }

  return (
    <View style={{ flex: 1, padding: 10, marginTop: 50 }}>
      {isSubscribed ? (
        <PrimaryButton title="Cargar PDF" onPress={handlePickPdf} disabled={isPicking} />
      ) : (
        <PrimaryButton title="Suscribirse" onPress={handleSubscribe} />
      )}
     <View style={{ marginTop: 20 }}>
  <View style={{ marginTop: 20 }}>
  <PrimaryButton
    title="Ver Roster"
    onPress={() => navigation.navigate("RosterScreen", { roster })}
    disabled={roster.length === 0} // 👈 si no hay datos, se bloquea
  />
</View>

</View>

      
    <Button title="Borrar Storage" onPress={handleClearStorage} />

    </View>
  );
}
