import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
    TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";

type CartItem = {
    id: string;
    imgUrl: string;
    name: string;
    price: number;
    quantity: number;
};

export default function CartScreen() {
    const db = useSQLiteContext(); 
    const router = useRouter();
    const { cart } = useLocalSearchParams();
    const [rows, setRows] = useState([]);

    const [items, setItems] = useState<CartItem[]>(
        cart ? (JSON.parse(cart as string) as CartItem[]) : []
    );

    const total = items.reduce(
        (sum: number, item: CartItem) => sum + item.price * item.quantity,
        0
    );

    const handleQuantityChange = (id: string, delta: number) => {
        setItems((prev) =>
        prev.map((item) =>
            item.id === id
            ? {
                ...item,
                quantity: Math.max(1, item.quantity + delta), 
                }
            : item
        )
        );
    };

    const handlePayNow = async () => {
        try {
            const result = await db.runAsync(
                "INSERT INTO orders (total, created_at) VALUES (?, ?)",
                [total, new Date().toISOString()]
            );

            const orderId = result.lastInsertRowId;

            for (const item of items) {
                await db.runAsync(
                    "INSERT INTO order_details (order_id, name, price, imgUrl, quantity) VALUES (?, ?, ?, ?, ?)",
                    [orderId, item.name, item.price, item.imgUrl, item.quantity]
                );
            }
            setItems([]); 
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/drink")}>
                    <Feather name="chevron-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Your orders</Text>
                <Feather name="search" size={20} color="#000" />
            </View>

            <View style={[styles.orderCard, { backgroundColor: "#00BCD4" }]}>
                <Text style={styles.orderTitle}>CAFE DELIVERY</Text>
                <Text style={styles.orderPrice}>$5</Text>
                <Text style={styles.orderSubtitle}>Order #18</Text>
            </View>

            <View style={[styles.orderCard, { backgroundColor: "#9C27B0" }]}>
                <Text style={styles.orderTitle}>CAFE</Text>
                <Text style={styles.orderPrice}>${total.toFixed(2)}</Text>
                <Text style={styles.orderSubtitle}>Order #18</Text>
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        {item.imgUrl && (
                            <Image source={{ uri: item.imgUrl }} style={styles.itemImage} />
                        )}
                        <View style={{ flex: 1 }}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemPrice}>${item.price}</Text>
                        </View>
                        <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            style={styles.qtyButton}
                            onPress={() => handleQuantityChange(item.id, -1)}
                        >
                            <Feather name="minus" size={16} color="#000" />
                        </TouchableOpacity>

                        <TextInput
                            value={item.quantity.toString()}
                            editable={false}
                            style={styles.qtyInput}
                        />

                        <TouchableOpacity
                            style={styles.qtyButton}
                            onPress={() => handleQuantityChange(item.id, +1)}
                        >
                            <Feather name="plus" size={16} color="#000" />
                        </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
                <Text style={styles.payText}>PAY NOW</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9F9F9" },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingTop: 50,
        paddingBottom: 10,
    },
    headerTitle: { fontSize: 20, fontWeight: "bold" },

    orderCard: {
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 15,
        marginBottom: 10,
    },
    orderTitle: { fontSize: 14, fontWeight: "bold", color: "#fff" },
    orderSubtitle: { fontSize: 12, color: "#fff", marginTop: 2 },
    orderPrice: {
        position: "absolute",
        right: 15,
        top: 15,
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },

    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
        elevation: 1,
    },
    itemImage: {
        width: 45,
        height: 45,
        borderRadius: 8,
        marginRight: 10,
    },
    itemName: { fontSize: 15, fontWeight: "500" },
    itemPrice: { fontSize: 13, color: "#555" },

    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    qtyButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 4,
    },
    qtyInput: {
        width: 30,
        textAlign: "center",
        fontSize: 14,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },

    payButton: {
        backgroundColor: "#FBC02D",
        borderRadius: 6,
        margin: 20,
        paddingVertical: 15,
        alignItems: "center",
    },
    payText: { fontSize: 16, fontWeight: "bold", color: "#fff" },
});