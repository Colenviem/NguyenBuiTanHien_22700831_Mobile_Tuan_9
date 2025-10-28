import { useRouter } from "expo-router";
import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Welcome to Cafe world</Text>
      <Image
        source={{ uri: "https://res.cloudinary.com/dixzxzdrd/image/upload/v1761619843/Image_m5hnkw.png" }}
        style={{ width: 200, height:62 }}
      />
      <Image
        source={{ uri: "https://res.cloudinary.com/dixzxzdrd/image/upload/v1761619843/Image_m5hnkw.png" }}
        style={{ width: 200, height:62 }}
      />
      <Image
        source={{ uri: "https://res.cloudinary.com/dixzxzdrd/image/upload/v1761619843/Image_m5hnkw.png" }}
        style={{ width: 200, height:62 }}
      />
      <TouchableOpacity 
        style={{ backgroundColor: "#00BDD6", borderRadius: 10, alignItems: "center", justifyContent: "center", paddingHorizontal: 10, paddingVertical: 16, width: "100%" }}
        onPress={() => router.push("/shop")}
      >
        <Text style={{ color: "#fff" }}>GET STARTED</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: "space-between",
    alignItems: "center"
  },

});