import { isTodayStrict } from "./today";

/**
 * Posiciona la SectionList en el día actual (día, mes y año)
 * @param {object} roster - array de secciones del roster
 * @param {object} sectionListRef - referencia al SectionList
 */
export const scrollToToday = (roster, sectionListRef) => {
  // 🔹 Busca el índice de la sección que corresponde a HOY
  const todayIndex = roster.findIndex(d => isTodayStrict(d.fullDate));

  if (todayIndex !== -1 && sectionListRef?.current) {
    sectionListRef.current.scrollToLocation({
      sectionIndex: todayIndex,
      itemIndex: 0,
      animated: true,
      viewPosition: 0, // 0 = arriba, 0.5 = centrado
    });
  }
};
