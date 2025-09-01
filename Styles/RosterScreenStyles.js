import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: { flex: 1, backgroundColor: "white" },
    listContainer: { flex: 1, padding: 10 },
    emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    todaySection: {
  backgroundColor: "#FFD54F", // Amarillo suave
},

    sectionHeaderEven: { backgroundColor: "#2f285a22" },
    sectionHeaderOdd: { backgroundColor: "#00d66f22" },
    sectionHeaderText: { fontSize: 16, fontWeight: "bold", color: "#222" },
    totalsContainer: { flexDirection: "row", alignItems: "center" },
    sectionHeaderTotals: {
        marginLeft: 8,
        fontSize: 14,
        color: "#333",
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
});
