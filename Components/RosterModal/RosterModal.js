import React from "react";
import { Modal, View, Text, SectionList, TouchableOpacity, SafeAreaView } from "react-native";
import styles from "../../Styles/RosterModalStyles";

export default function RosterModal({ visible, onClose, roster }) {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.type ? (
        <>
          <Text style={styles.flightNumber}>
            {item.type} {item.flightNumber || ""}
          </Text>
          <Text style={styles.route}>
            {item.origin} ➡ {item.destination}
          </Text>
          <Text style={styles.time}>
            {item.depTime} - {item.arrTime}
          </Text>
          {item.aircraft && <Text style={styles.aircraft}>Equipo: {item.aircraft}</Text>}
        </>
      ) : (
        <Text style={styles.note}>{item.note}</Text>
      )}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      {/* 👇 SafeAreaView se encarga de evitar que el contenido se meta en el notch */}
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flex: 1, padding: 10 }}>
          <TouchableOpacity
            onPress={onClose}
            style={{ alignSelf: "flex-end", marginBottom: 10 }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>✕ Cerrar</Text>
          </TouchableOpacity>

          <SectionList
            sections={roster.map((d) => ({
              title: d.date,
              data: d.flights.length > 0 ? d.flights : [{ note: d.note }],
            }))}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            renderSectionHeader={({ section: { title }, index }) => (
              <View
                style={[
                  styles.sectionHeader,
                  index % 2 === 0
                    ? { backgroundColor: "#2f285a22" } // violeta muy suave
                    : { backgroundColor: "#00d66f22" }, // verde muy suave
                ]}
              >
                <Text style={styles.sectionHeaderText}>{title}</Text>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
