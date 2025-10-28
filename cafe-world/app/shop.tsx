import { useRouter } from "expo-router";
import { Text, View, TouchableOpacity, Image, StyleSheet, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import ShopCard from "./shopCard";

export default function Shop() {
    const router = useRouter();
    type ShopItem = {
        id: string;
        imgUrl: string;
        name?: string;
        address?: string;
        time?: string;
        status?: boolean;
    };

    const [data, setData] = useState<ShopItem[]>([]);

    const fetch = async () => {
        const res = await axios.get<ShopItem[]>("https://683065baf504aa3c70f7ae07.mockapi.io/CafeShop");
        setData(res.data);
    }

    useEffect(() => {
        fetch();
    }, []);

    return(
        <View style={styles.container}> 
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerIcon}>
                    <Feather name="chevron-left" size={24} color="#000" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Shops Near Me</Text>

                <TouchableOpacity style={styles.headerIcon}>
                    <Feather name="search" size={20} color="#000" />
                </TouchableOpacity>
            </View>

            <FlatList 
                keyExtractor={(item) => item.id}
                data={data}
                renderItem={({item}) => {
                    return <ShopCard key={item.id} item={item} />
                }}
            />
        </View>
    )
} 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerIcon: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    // --- List Item Style ---
    listContent: {
        padding: 10,
    },
    shopItemContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    shopImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 15,
    },
    shopInfo: {
        flex: 1,
    },
    shopName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
    },
    shopAddress: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    shopTime: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 5,
    }
});