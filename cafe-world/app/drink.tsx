import { useRouter } from "expo-router";
import { Text, View, TouchableOpacity, Image, StyleSheet, FlatList, TextInput, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import axios from "axios";

const API_URL = "https://683065baf504aa3c70f7ae07.mockapi.io/Menus"; 

type MenuItem = {
    id: string;
    imgUrl?: string;
    name: string;
    price: number | string;
};

type DrinkItemProps = {
    item: MenuItem;
    onQuantityChange: (id: string, qty: number) => void;
};

const DrinkItem: React.FC<DrinkItemProps> = ({ item, onQuantityChange }) => {
    const [value, setValue] = useState<number>(0); 

    const handleDecrease = () => {
        const newValue = Math.max(0, value - 1);
        setValue(newValue);
        onQuantityChange(item.id, newValue);
    };

    const handleIncrease = () => {
        const newValue = value + 1;
        setValue(newValue);
        onQuantityChange(item.id, newValue);
    };

    const handleManualChange = (text: string) => {
        const num = Math.max(0, parseInt(text) || 0);
        setValue(num);
        onQuantityChange(item.id, num);
    };

    return (
        <View style={styles.drinkItemContainer}>
            <View style={styles.drinkInfoArea}>
                <View style={styles.drinkImagePlaceholder}>
                    {(item.id === '2' || item.id === '8') ? (
                        <Image source={{ uri: item.imgUrl }} style={styles.drinkImage} />
                    ) : null}
                </View>

                <View style={styles.drinkText}>
                    <Text style={styles.drinkName}>{item.name}</Text>
                    <View style={styles.priceContainer}>
                        <Feather name="play" size={10} color="#888" style={{ marginRight: 3 }} />
                        <Text style={styles.drinkPrice}>${item.price}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.quantityControl}>
                <TouchableOpacity style={styles.quantityButton} onPress={handleDecrease}>
                    <Feather name="minus" size={18} color={value === 0 ? "#ccc" : "#34C759"} />
                </TouchableOpacity>

                <TextInput
                    style={styles.quantityInput}
                    value={String(value)}
                    keyboardType="numeric"
                    onChangeText={handleManualChange}
                />

                <TouchableOpacity style={styles.quantityButton} onPress={handleIncrease}>
                    <Feather name="plus" size={18} color="#34C759" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default function DrinksScreen() {
    const router = useRouter();
    const [data, setData] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState<{ [id: string]: number }>({});

    const fetchData = async () => {
        try {
            const res = await axios.get(API_URL);
            setData(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleQuantityChange = (id: string, qty: number) => {
        setQuantities(prev => ({ ...prev, [id]: qty }));
    };

    const handleGoToCart = () => {
        const cartItems = data
            .filter(item => (quantities[item.id] || 0) > 0)
            .map(item => ({
                ...item,
                quantity: quantities[item.id],
            }));

        router.push({
            pathname: "/cart",
            params: { cart: JSON.stringify(cartItems) },
        });
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#FFC041" />
                <Text style={{ marginTop: 10 }}>Đang tải Menu...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerIcon} onPress={() => router.push("/shop")}>
                    <Feather name="chevron-left" size={24} color="#000" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Drinks</Text>

                <TouchableOpacity style={styles.headerIcon}>
                    <Feather name="search" size={20} color="#000" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <DrinkItem item={item} onQuantityChange={handleQuantityChange} />
                )}
                contentContainerStyle={styles.listContent}
            />

            <TouchableOpacity style={styles.footerButton} onPress={handleGoToCart}>
                <Text style={styles.footerButtonText}>GO TO CART</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
    },
    headerIcon: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
    drinkItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    drinkInfoArea: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    drinkImagePlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 5,
        backgroundColor: '#eee',
        marginRight: 15,
        overflow: 'hidden',
    },
    drinkImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    drinkText: {
        flex: 1,
    },
    drinkName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    drinkPrice: {
        fontSize: 14,
        color: '#888',
        fontWeight: 'bold',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 17.5,
        borderWidth: 1,
        borderColor: '#34C759',
        marginHorizontal: 5,
    },
    quantityInput: {
        width: 30,
        textAlign: 'center',
        fontSize: 16,
        color: '#333',
    },
    footerButton: {
        backgroundColor: '#FFC041',
        paddingVertical: 15,
        marginHorizontal: 15,
        marginBottom: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    footerButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});