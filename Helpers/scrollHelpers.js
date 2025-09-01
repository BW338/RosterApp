// /Helpers/scrollHelpers.js
import { isToday } from "./today";

/**
 * Posiciona la SectionList en el día actual
 * @param {object} roster - array de secciones del roster
 * @param {object} sectionListRef - referencia al SectionList
 */
export const scrollToToday = (roster, sectionListRef) => {
  const todayIndex = roster.findIndex(d => isToday(d.date));

  if (todayIndex !== -1 && sectionListRef?.current) {
    sectionListRef.current.scrollToLocation({
      sectionIndex: todayIndex,
      itemIndex: 0,
      animated: true,
      viewPosition: 0, // 0 = arriba, 0.5 = centrado
    });
  }
};
