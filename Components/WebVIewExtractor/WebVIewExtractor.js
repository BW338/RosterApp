// src/Components/WebViewExtractor.js
import React from "react";
import { Alert } from "react-native";
import { WebView } from "react-native-webview";

export default function WebViewExtractor({ pdfBase64, onExtract }) {
  if (!pdfBase64) return null;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
    </head>
    <body>
      <script>
        try {
          const raw = atob("${pdfBase64}");
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
  `;

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html }}
      style={{ height: 0, width: 0 }}
      onMessage={(event) => {
        try {
          const data = event.nativeEvent.data;
          if (data.startsWith("{")) {
            const json = JSON.parse(data);
            if (json.error) {
              Alert.alert("Error", "No se pudo extraer texto del PDF.");
              return;
            }
          }
          onExtract(data);
        } catch (err) {
          console.error("WebViewExtractor error:", err);
        }
      }}
    />
  );
}
