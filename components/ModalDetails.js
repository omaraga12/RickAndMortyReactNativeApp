import { Image } from "expo-image";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function ModalDetails(props) {
  const { modalVisible, setModalVisible, selectedCharacter } = props;

  const EpisodeCard = ({ episode }) => (
    <View style={styles.episodeCard}>
      <Text style={styles.episodeName}>{episode.name}</Text>
      <Text style={styles.episodeCode}>{episode.episode}</Text>
      <Text style={styles.episodeDate}>{episode.air_date}</Text>
    </View>
  );
  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <Pressable
          onPress={() => setModalVisible(false)}
          style={styles.modalCloseButton}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Close
          </Text>
        </Pressable>
        <View style={styles.modalContent}>
          <ScrollView>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Image
                source={{ uri: selectedCharacter?.image }}
                style={styles.modalImage}
              />
            </View>

            <View style={{ backgroundColor: "#FFC300", borderRadius: 4 }}>
              <Text style={styles.modalName}>
                {selectedCharacter?.name.toUpperCase()}
              </Text>
            </View>

            <Text style={{ fontSize: 16 }}>
              <Text style={{ fontWeight: "bold" }}> Species:</Text>{" "}
              {selectedCharacter?.species}
            </Text>
            <Text style={{ fontSize: 16 }}>
              <Text style={{ fontWeight: "bold" }}> Status: </Text>{" "}
              {selectedCharacter?.status}
            </Text>
            <Text style={{ fontSize: 16 }}>
              <Text style={{ fontWeight: "bold" }}> Gender:</Text>{" "}
              {selectedCharacter?.gender}
            </Text>
            <Text style={{ fontSize: 16 }}>
              <Text style={{ fontWeight: "bold" }}> Location:</Text>{" "}
              {selectedCharacter?.location.name}
            </Text>
            <View
              style={{
                backgroundColor: "#FFC300",
                borderRadius: 4,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 4,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
                Episodes
              </Text>
            </View>

            <FlatList
              data={selectedCharacter?.episode}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              renderItem={({ item }) => <EpisodeCard episode={item} />}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              contentContainerStyle={{ paddingVertical: 10 }}
              scrollEnabled={false} // importante si ya estás dentro de un ScrollView o modal alto
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Fondo oscuro semi-transparente
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxHeight: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10, // Para Android
  },
  modalImage: {
    width: "70%",
    aspectRatio: 1,
    resizeMode: "cover",
  },
  modalName: {
    fontSize: 24,
    fontWeight: "bold",
    //marginBottom: 8,
    textAlign: "center",
    color: "#fff",
  },
  modalCloseButton: {
    // marginTop: 20,
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 10,

    alignSelf: "flex-end",
  },
  episodeCard: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100, // para asegurar tamaño mínimo
  },
  episodeName: {
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  episodeCode: {
    fontSize: 11,
    color: "#666",
  },
  episodeDate: {
    fontSize: 10,
    color: "#999",
  },
});
