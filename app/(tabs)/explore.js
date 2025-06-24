
import { gql, useQuery } from "@apollo/client";
import { Image } from "expo-image";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import ModalDetails2 from "../../components/ModalDetails2";


export const  GET_EPISODES = gql`
  query GetEpisodes($page: Int!) {
    episodes(page: $page) {
      info {
        next
      }
      results {
        id
        name
        air_date
        episode
        characters {
          id
          name
          species
        image
        status
        }
      }
    }
  }
`;

export default function TabTwoScreen() {
    const { loading, error, data, fetchMore, refetch } = useQuery(
      GET_EPISODES,
      {
        variables: {
          page: 1,
        },
        onCompleted: (data) => {
          setEpisodes(data.episodes.results);
        },
      }
    );
    const [page, setPage] = useState(1);
    const [episodes, setEpisodes] = useState([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [selectedepisode, setSelectedEpisode] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
  const loadMoreEpisodes = async () => {
  if (data) {
    //const nextPage = data.episodes.info.next;
  console.log(data.episodes.info)
  console.log(page)
    if (page>data.episodes.info.next || isLoadingMore) return;
const nextPage = page + 1;
      setPage(nextPage);
    setIsLoadingMore(true);
console.log(nextPage)
    try {
      const response = await fetchMore({
        variables: { page: nextPage },
      });

      setEpisodes((prev) => [...prev, ...response.data.episodes.results]);
    } catch (err) {
      console.error("Error al hacer fetchMore:", err);
    }

    setIsLoadingMore(false);
  }
};

   const header = (
        <View>
          <StatusBar backgroundColor="green"/>
          <SafeAreaView
            style={{
              flex: 0,
              backgroundColor: "green",
            }}
          />
          <ModalDetails2
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            selectedepisode={selectedepisode}
          />
          <View>
            <Image
              source={require("@/assets/images/rick-an-morty-episodes.avif")}
              style={styles.reactLogo}
            />
            <View style={styles.containerTitle}>
              <Text style={styles.title}>EPISODES LIST</Text>
            </View>
          </View>
 
        </View>
      );

      
      
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
  return (
    
     
      
        <FlatList
          ListHeaderComponent={header}
          data={episodes || []}
          keyExtractor={(item) => item.id}
          numColumns={2}
          style={{marginBottom:100}}
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
                  {episodes && episodes.length > 0 && (
                    <View style={styles.container}>
               
    
                      <Text style={{ fontSize: 18, fontWeight: "bold", paddingBottom:10 }}>
                        {item.name.toUpperCase()}
                      </Text>
                      <Text style={{ fontSize: 18,marginBottom:10 }}>{item.air_date}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedEpisode(item); // Guarda toda la data
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
          onEndReached={loadMoreEpisodes}
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
    justifyContent:"center", alignItems:"center",
    
  },
  imageCharacter: {
    width: "100%",
    aspectRatio: 1,
    contentFit: "cover",
  },
});
