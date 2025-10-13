import Constants from 'expo-constants';

/**
 * =================================================================
 *              ARCHIVO CENTRAL DE CONFIGURACIÓN DE DEBUG
 * =================================================================
 *
 * Modifica los valores en el objeto `DebugSettings` para activar
 * o desactivar individualmente las funciones de desarrollo.
 */

const DebugSettings = {
  // Simula que el usuario está suscrito (evita usar RevenueCat).
  // NOTA: Se fuerza a `true` si la app corre en Expo Go.
  DEBUG_SUBSCRIPTION: false,

  // Muestra el banner flotante con info de la suscripción.
  SHOW_DEBUG_BANNER: true,

  // Desplaza la fecha "hoy" N días. (0 = normal)
  DATE_OFFSET: 0,

  // Muestra la pantalla de bienvenida siempre.
  ALWAYS_SHOW_WELCOME: false,

  // Muestra el disclaimer legal siempre.
  ALWAYS_SHOW_DISCLAIMER: false,
};

// --- Lógica de exportación (No modificar) ---
const isExpoGo = Constants.appOwnership === 'expo';

export const AppConfig = {
  ...DebugSettings,
  // Forzamos la simulación de suscripción en Expo Go para evitar errores.
  DEBUG_SUBSCRIPTION: isExpoGo ? true : DebugSettings.DEBUG_SUBSCRIPTION,
  // Un flag general para saber si estamos en un entorno de desarrollo.
  IS_DEV: isExpoGo || DebugSettings.SHOW_DEBUG_BANNER || DebugSettings.DATE_OFFSET > 0,
};