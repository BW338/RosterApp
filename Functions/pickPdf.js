import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { Alert } from "react-native";

/**
 * pickPdfFile: abre el selector de PDF, lee el archivo y devuelve Base64
 * @returns {Promise<string|null>} Base64 del PDF o null si no seleccionó nada
 */
export async function pickPdfFile() {
  try {
  //  console.log("LOG: Abriendo selector de PDF");
    const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
//      console.log("LOG: Leyendo PDF como Base64...");
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });
      console.log("LOG: Base64 length:", base64.length);
      return base64;
    } else {
      console.log("LOG: No se seleccionó archivo");
      return null;
    }
  } catch (error) {
    console.error("LOG Error al seleccionar PDF:", error);
    Alert.alert("Error", "No se pudo procesar el PDF.");
    return null;
  }
}
