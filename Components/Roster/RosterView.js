import React, { useState } from "react";
import { View, Alert, Text } from "react-native";
import { WebView } from "react-native-webview";
import { useSubscription } from "../../App";
import Purchases from "react-native-purchases";
import { parseRosterText } from "../../Functions/parseRosterText";
import { pickPdfFile } from "../../Functions/pickPdf";
import PrimaryButton from "../Buttons/PrimaryButton";
import RosterModal from "../RosterModal/RosterModal";
import Toast from "react-native-toast-message";

export default function RosterView() {
  const [pdfData, setPdfData] = useState(null);
  const [roster, setRoster] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const { isSubscribed, setIsSubscribed, offerings } = useSubscription();

  const handlePickPdf = async () => {
    if (!isSubscribed) {
      Toast.show({
        type: "error",
        text1: "Suscripción requerida",
        text2: "Necesitas estar suscripto para usar esta función.",
      });
      return;
    }

    const base64 = await pickPdfFile();
    if (base64) setPdfData(base64);
  };

  const handleSubscribe = async () => {
    try {
      if (!offerings || !offerings.availablePackages.length) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No hay suscripciones disponibles.",
        });
        return;
      }

      const purchaseInfo = await Purchases.purchasePackage(
        offerings.availablePackages[0]
      );

      if (purchaseInfo.customerInfo.entitlements.active["Roster access"]) {
        setIsSubscribed(true);
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
                      const pageText = textContent.items.map(item => item.str).join(" ");
                      fullText += pageText + "\\n";
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
            setModalVisible(true);
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
        <PrimaryButton title="Adjuntar PDF" onPress={handlePickPdf} />
      ) : (
        <>
          <Text style={{ textAlign: "center", marginBottom: 10 }}>
            🚫 Necesitás una suscripción para usar esta función.
          </Text>
          <PrimaryButton title="Suscribirse" onPress={handleSubscribe} />
        </>
      )}

      <RosterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        roster={roster}
      />
    </View>
  );
}
