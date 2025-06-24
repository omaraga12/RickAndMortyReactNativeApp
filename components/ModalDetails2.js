import { Image } from "expo-image";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function ModalDetails2(props) {
  const { modalVisible, setModalVisible, selectedepisode } = props;

  const EpisodeCard = ({ character }) => (
    <View style={styles.episodeCard}>
     
      <Image
                          source={{ uri: character.image }}
                          style={styles.imageCharacter}
                        />
      <Text style={styles.episodeName}>{character.name.toUpperCase()}</Text>
      <Text style={{ fontSize: 14 }}>
              <Text style={{ fontWeight: "bold" }}> Species:</Text>{" "}
              {character?.species}
            </Text>
            <Text style={{ fontSize: 14}}>
              <Text style={{ fontWeight: "bold" }}> Status: </Text>{" "}
              {character?.status}
            </Text>
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


            <View style={{ backgroundColor: "#FFC300", borderRadius: 4 }}>
              <Text style={styles.modalName}>
                {selectedepisode?.name.toUpperCase()}
              </Text>
            </View>

            <Text style={{ fontSize: 16 }}>
              <Text style={{ fontWeight: "bold" }}> AIR DATE:</Text>{" "}
              {selectedepisode?.air_date}
            </Text>
    
          
            <Text style={{ fontSize: 16 }}>
              <Text style={{ fontWeight: "bold" }}> CODE:</Text>{" "}
              {selectedepisode?.episode}
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
                CHARACTERS
              </Text>
            </View>

            <FlatList
              data={selectedepisode?.characters}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              renderItem={({ item }) => <EpisodeCard character={item} />}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              contentContainerStyle={{ paddingVertical: 10 }}
              scrollEnabled={false} 
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
    fontSize: 14,
    textAlign: "center",
    paddingVertical:5
  },
  episodeCode: {
    fontSize: 11,
    color: "#666",
  },
  episodeDate: {
    fontSize: 10,
    color: "#999",
  },
  imageCharacter: {
    width: "100%",
    aspectRatio: 1,
    contentFit: "cover",
  },
});
