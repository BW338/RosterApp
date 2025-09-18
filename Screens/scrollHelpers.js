import { isTodayStrict } from "./today";

/**
 * Posiciona la SectionList en el día actual.
 * @param {Array} sections - El array de secciones que se pasa a la SectionList.
 * @param {object} sectionListRef - referencia al SectionList
 */
import { Platform } from 'react-native';

/**
 * Scroll robusto que funciona en iOS y Android
 */
export const scrollToToday = (roster, sectionListRef) => {
  const todayIndex = roster.findIndex(
    d => d.fullDate && isTodayStrict(new Date(d.fullDate))
  );

  if (todayIndex === -1) {
    console.warn("⚠️ No se encontró la sección de hoy");
    return;
  }

  if (!sectionListRef?.current) {
    console.warn("⚠️ Referencia del SectionList no disponible");
    return;
  }

  console.log(`📍 Scrolling to section ${todayIndex} on ${Platform.OS}`);

  if (Platform.OS === 'ios') {
    // SOLUCIÓN 1: scrollToOffset (más confiable en iOS)
    try {
      // Calculamos el offset aproximado basado en la altura estimada de cada sección
      const estimatedHeaderHeight = 60; // altura del header
      const estimatedItemHeight = 80;   // altura promedio de cada item
      
      let totalOffset = 0;
      
      for (let i = 0; i < todayIndex; i++) {
        totalOffset += estimatedHeaderHeight;
        const sectionData = roster[i]?.flights || roster[i]?.data || [{}];
        totalOffset += sectionData.length * estimatedItemHeight;
      }

      sectionListRef.current.scrollToOffset({
        offset: totalOffset,
        animated: true,
      });
      
      console.log(`✅ iOS scrollToOffset ejecutado: ${totalOffset}px`);
      
    } catch (error) {
      console.warn("⚠️ scrollToOffset falló, intentando scrollToLocation:", error);
      
      // SOLUCIÓN 2: Fallback a scrollToLocation con parámetros específicos para iOS
      try {
        sectionListRef.current.scrollToLocation({
          sectionIndex: todayIndex,
          itemIndex: 0,
          animated: true,
          viewPosition: 0.1, // Importante para iOS
          viewOffset: 50,    // Offset adicional para iOS
        });
        console.log("✅ iOS scrollToLocation fallback ejecutado");
      } catch (fallbackError) {
        console.warn("❌ Ambos métodos fallaron en iOS:", fallbackError);
      }
    }
    
  } else {
    // Android: usar scrollToLocation normal
    try {
      sectionListRef.current.scrollToLocation({
        sectionIndex: todayIndex,
        itemIndex: 0,
        animated: true,
        viewPosition: 0,
      });
      console.log("✅ Android scrollToLocation ejecutado");
    } catch (error) {
      console.warn("⚠️ scrollToLocation falló en Android:", error);
    }
  }
};
