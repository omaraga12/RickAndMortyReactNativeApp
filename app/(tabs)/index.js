import { gql, useQuery } from "@apollo/client";
import { Picker } from "@react-native-picker/picker";
import { Image } from "expo-image";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ModalDetails from "../../components/ModalDetails";

const GET_CHARACTERS = gql`
  query GetCharacters($page: Int!, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        next
      }
      results {
        id
        name
        species
        image
        status
        gender
        location {
          name
        }
        episode {
          name
          episode
          air_date
        }
      }
    }
  }
`;
export default function HomeScreen() {
  const [filter, setFilter] = useState({
    name: "",
    species: "",
    status: "",
  });
  const { loading, error, data, fetchMore, refetch } = useQuery(
    GET_CHARACTERS,
    {
      variables: {
        page: 1,
        filter: {
          name: filter.name || undefined,
          species: filter.species || undefined,
          status: filter.status || undefined,
        },
      },
      onCompleted: (data) => {
        let combinedCharacters = data.characters.results;
        // Si hay orden, aplicar
        if (order !== "NONE") {
          combinedCharacters = sortAlphabetic(combinedCharacters, order);
        }

        setCharacters(combinedCharacters);

        //setCharacters(data.characters.results);
      },
    }
  );
  const [page, setPage] = useState(1);
  const [characters, setCharacters] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [order, setOrder] = useState("NONE");
  const loadMoreCharacters = async () => {
    if (data) {
      if (!data.characters.info.next || isLoadingMore) return;
      setIsLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);

      const response = await fetchMore({
        variables: {
          page: nextPage,
          filter: {
            name: filter.name || undefined,
            species: filter.species || undefined,
            status: filter.status || undefined,
          },
        },
      });

      // Agrega los nuevos personajes
      //setCharacters((prev) => [...prev, ...response.data.characters.results]);

      let combinedCharacters = [
        ...characters,
        ...response.data.characters.results,
      ];
      // Si hay orden, aplicar
      if (order !== "NONE") {
        combinedCharacters = sortAlphabetic(combinedCharacters, order);
      }

      setCharacters(combinedCharacters);
      setIsLoadingMore(false);
    }
  };
  const applyFilter = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
    refetch({
      page: 1,
      filter: {
        name: newFilter.name || undefined,
        species: newFilter.species || undefined,
        status: newFilter.status || undefined,
      },
    });
  };

  const sortAlphabetic = (data, order) => {
    if (data && data.length > 0) {
      return [...data].sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return order === "ASC" ? comparison : -comparison;
      });
    }
  };
  if (error)
    return (
      <View
        style={{
          padding: 40,
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Text style={{ color: "red", fontWeight: "bold" }}>
          Error: {error.message}
        </Text>
      </View>
    );
  const header = (
    <View>
      <ModalDetails
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedCharacter={selectedCharacter}
      />
      <View>
        <Image
          source={require("@/assets/images/background.jpg")}
          style={styles.reactLogo}
        />
        <View style={styles.containerTitle}>
          <Text style={styles.title}>CHARACTERS LIST</Text>
        </View>
      </View>
      <View
        style={{
          padding: 10,
          paddingHorizontal: 30,
          backgroundColor: "#fff",
          margin: 7,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextInput
            placeholder="Search by name"
            value={filter.name}
            onChangeText={(text) => {
              const updatedFilter = { ...filter, name: text };

              applyFilter(updatedFilter);
            }}
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 3,
              marginVertical: 7,
            }}
          />
          <Picker
            selectedValue={order}
            onValueChange={(value) => setOrder(value)}
            style={{
              height: 40,
              width: 100,
              borderColor: "gray",
              borderWidth: 3,
              fontSize: 16,
            }}
          >
            <Picker.Item label="NONE" value="NONE" />
            <Picker.Item label="ASC" value="ASC" />
            <Picker.Item label="DESC" value="DESC" />
          </Picker>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ fontWeight: "bold", fontSize: 18, paddingHorizontal: 8 }}
          >
            Specie:{" "}
          </Text>
          <Picker
            selectedValue={filter.species}
            onValueChange={(value) =>
              applyFilter({ ...filter, species: value })
            }
            style={{
              height: 40,
              width: 100,
              borderColor: "gray",
              borderWidth: 3,
              fontSize: 16,
            }}
          >
            <Picker.Item label="All" value="" />
            <Picker.Item label="Human" value="Human" />
            <Picker.Item label="Alien" value="Alien" />
            <Picker.Item label="Humanoid" value="Humanoid" />
            <Picker.Item label="Poopybutthole" value="Poopybutthole" />
            <Picker.Item
              label="Mythological Creature"
              value="Mythological Creature"
            />
            <Picker.Item label="Animal" value="Animal" />
          </Picker>
          <Text
            style={{ fontWeight: "bold", fontSize: 18, paddingHorizontal: 8 }}
          >
            Status:{" "}
          </Text>
          <Picker
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 3,
              fontSize: 16,
            }}
            selectedValue={filter.status}
            onValueChange={(value) => applyFilter({ ...filter, status: value })}
          >
            <Picker.Item label="All" value="" />
            <Picker.Item label="Alive" value="Alive" />
            <Picker.Item label="Dead" value="Dead" />
            <Picker.Item label="unknown" value="unknown" />
          </Picker>
        </View>
      </View>
    </View>
  );
  return (
    <FlatList
      ListHeaderComponent={header}
      data={characters || []}
      keyExtractor={(item) => item.id}
      numColumns={2}
      renderItem={({ item }) => (
        <>
          {loading ? (
            <View
              style={{
                padding: 40,
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <ActivityIndicator size="large" color="#000" />
              <Text>Loading...</Text>
            </View>
          ) : (
            <>
              {characters && characters.length > 0 && (
                <View style={styles.container}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.imageCharacter}
                  />

                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 20 }}>{item.species}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCharacter(item); // Guarda toda la data
                      setModalVisible(true); // Muestra el modal
                    }}
                    style={{
                      padding: 10,
                      backgroundColor: "orange",
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 17,
                      }}
                    >
                      Learn more
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </>
      )}
      onEndReached={loadMoreCharacters}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        <>{isLoadingMore && <ActivityIndicator size="large" color="#000" />}</>
      }
    />
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 100,
    width: "100%",
    bottom: 0,
    left: 0,
    position: "relative",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
  },
  containerTitle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -100 }, { translateY: -25 }],

    backgroundColor: "rgba(128, 128, 128, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 5,
  },

  container: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  imageCharacter: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "cover",
  },
});
