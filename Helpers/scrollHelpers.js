import { isTodayStrict } from "./today";

/**
 * Posiciona la SectionList en el día actual (día, mes y año)
 * @param {object} roster - array de secciones del roster
 * @param {object} sectionListRef - referencia al SectionList
 */
export const scrollToToday = (roster, sectionListRef) => {
  const todayIndex = roster.findIndex(
    d => d.fullDate && isTodayStrict(new Date(d.fullDate))
  );

  if (todayIndex !== -1 && sectionListRef?.current) {
    sectionListRef.current.scrollToLocation({
      sectionIndex: todayIndex,
      itemIndex: 0,
      animated: true,
      viewPosition: 0,
    });
  } else {
    console.warn("⚠️ No se encontró la sección de hoy");
  }
};
