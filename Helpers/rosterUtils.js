// Helpers/rosterUtils.js
export const groupRosterByDay = (roster) => {
  const grouped = {};

  roster.forEach((d) => {
    const key = new Date(d.fullDate).toISOString().split("T")[0];
    if (!grouped[key]) {
      grouped[key] = {
        title: key,
        fullDate: d.fullDate,
        tv: d.tv,
        tsv: d.tsv,
        checkin: d.checkin,
        te: d.te,
        data: [],
      };
    }
    grouped[key].data.push(
      ...(d.flights.length > 0
        ? d.flights
        : [{ note: d.note, activity: d.note }])
    );
  });

  return Object.values(grouped);
};
