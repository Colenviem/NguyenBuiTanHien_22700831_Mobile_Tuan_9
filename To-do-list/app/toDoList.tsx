import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';

interface Todo {
  id: number;
  content: string;
  status: boolean;
}

export default function ToDoList() {
    const db = useSQLiteContext();
    const router = useRouter();
    const params = useLocalSearchParams() || {};
    const name = params.name || "TwinKle";
    const [todos, setTodos] = useState<Todo[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function setup() {
        const result = await db.getAllAsync<Todo>(
                        `SELECT id, content, status FROM todos`
                        );
        setTodos(result);
        }
        setup();
    }, []);

    const display = todos.filter((todo) => todo.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()));

    return (
        <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.iconContainer} onPress={() => router.push("/")}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <View style={styles.content}>
            <Image
                source={{
                uri: "https://res.cloudinary.com/dixzxzdrd/image/upload/v1761045396/Rectangle_sokxf7.png",
                }}
                style={styles.image}
            />
            <View>
                <Text style={styles.greeting}>Hi {name}</Text>
                <Text style={styles.subtext}>Have a great day ahead</Text>
            </View>
            </View>
        </View>

        <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#888" style={styles.icon} />
            <TextInput
            style={styles.input}
            placeholder="Search"
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
            />
        </View>

        <View style={{ width: "100%", height: 200 }}>
            <FlatList
            data={display}
            renderItem={({ item }) => (
                <TouchableOpacity
                onPress={() => router.push({ pathname: "/add", params: { id: item.id ,oldContent: item.content, name } })}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 12,
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    marginBottom: 10,
                }}
                >
                <Text style={{ fontSize: 16, color: "#333" }}>{item.content}</Text>
                    <Ionicons
                    name={item.status ? "checkmark-circle" : "ellipse-outline"}
                    size={24}
                    color={item.status ? "green" : "gray"}
                    />
                </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            />
        </View>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => router.push({ pathname: "/add", params: { name }})}>
            <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: "#f5f5f5",
        gap: 20,
        alignItems: "center"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 80
    },
    iconContainer: {
        paddingRight: 10,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    textWrapper: {
        flexShrink: 1,
    },
    greeting: {
        fontSize: 20,
        fontWeight: "bold",
    },
    subtext: {
        fontSize: 14,
        color: "gray",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#eaeaea",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginVertical: 10,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    buttonContainer: {
        width: 69,
        height: 69,
        backgroundColor: "#00BDD6",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50
    },
});