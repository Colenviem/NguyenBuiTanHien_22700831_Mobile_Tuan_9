import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function CartScreen() {
    const router = useRouter();
    const { cart } = useLocalSearchParams();
    const items = cart ? JSON.parse(cart as string) : [];

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/drink")}>
                    <Feather name="chevron-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Your Cart</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <Text style={styles.cartName}>{item.name}</Text>
                        <Text style={styles.cartQty}>x{item.quantity}</Text>
                        <Text style={styles.cartPrice}>${item.price}</Text>
                    </View>
                )}
            />

            <View style={styles.footer}>
                <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingTop: 50,
        paddingBottom: 10,
    },
    headerTitle: { fontSize: 20, fontWeight: "bold" },
    cartItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        paddingHorizontal: 15,
    },
    cartName: { fontSize: 16 },
    cartQty: { fontSize: 16 },
    cartPrice: { fontSize: 16, fontWeight: "bold" },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    totalText: { fontSize: 18, fontWeight: "bold" },
});