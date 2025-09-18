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
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
    },
    todaySection: {
  backgroundColor: "#FFD54F", // Amarillo suave
},
   noteText: {
    fontSize: 14,
    fontWeight: "500",
  },
  noteTextLight: {
    color: "#333",
  },
  noteTextDark: {
    color: "#FFFFFF", // más contraste que #D3D3D3
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
     sectionHeaderCheckin: {
  textAlign: "center",    // centra horizontalmente el texto
        marginLeft: 8,
        fontSize: 14,
        color: "#333",
        fontWeight: 'bold',
        fontStyle: 'italic',
        alignItems: "center"

    },
    todayButton: {
  position: "absolute",
  bottom: 20,
  right: 20,
  backgroundColor: "rgba(50,150,250,0.7)",
  borderRadius: 30,
  width: 60,
  height: 60,
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  elevation: 5,
},
todayButtonText: {
  color: "white",
  fontWeight: "bold",
},

});
