import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';

type ShopItem = {
    id: string;
    imgUrl: string;
    name?: string;
    address?: string;
    time?: string;
    status?: boolean;
};

export default function ShopCard({ item }: { item: ShopItem }) {
    const router = useRouter();

    const statusText = item.status ? "Accepting Orders" : "Closed";

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={() => router.push("/drink")}>
            <View style={styles.imagePlaceholder}>
                {item.imgUrl && !item.imgUrl.includes('placeholder') && (
                    <Image source={{ uri: item.imgUrl }} style={styles.image} />
                )}
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.topRow}>
                    <View style={styles.statusTags}>
                        <View style={[styles.tag, item.status ? styles.acceptingTag : styles.closedTag]}>
                            <MaterialCommunityIcons 
                                name={item.status ? "check-circle" : "alert-circle"} 
                                size={14} 
                                color={item.status ? "#34C759" : "#FF3B30"} 
                                style={styles.tagIcon} 
                            />
                            <Text style={item.status ? styles.acceptingText : styles.closedText}>
                                {statusText}
                            </Text>
                        </View>
                        <View style={[styles.tag, styles.timeTag]}>
                            <MaterialCommunityIcons name="timer-outline" size={14} color="#FF3B30" style={styles.tagIcon} />
                            <Text style={styles.timeText}>{item.time}</Text>
                        </View>
                    </View>
                    <MaterialCommunityIcons name="map-marker" size={24} color="#666" />
                </View>
                <Text style={styles.shopName}>{item.name}</Text>

                <Text style={styles.shopAddress}>{item.address}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 15,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    imagePlaceholder: {
        width: '100%',
        height: 150,
        backgroundColor: '#DCDCDC',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    infoContainer: {
        padding: 15,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    statusTags: {
        flexDirection: 'row',
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderRadius: 5,
        marginRight: 8,
    },
    tagIcon: {
        marginRight: 4,
    },
    acceptingTag: {
        backgroundColor: '#E6FFE6',
    },
    acceptingText: {
        color: '#34C759',
        fontWeight: '600',
        fontSize: 12,
    },
    closedTag: {
        backgroundColor: '#FFEEEE',
    },
    closedText: {
        color: '#FF3B30',
        fontWeight: '600',
        fontSize: 12,
    },
    timeTag: {
        backgroundColor: '#F0F0F0',
    },
    timeText: {
        color: '#666',
        fontWeight: '600',
        fontSize: 12,
    },
    shopName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    shopAddress: {
        fontSize: 14,
        color: '#666',
    },
});