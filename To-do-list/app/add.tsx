import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { useSQLiteContext, type SQLiteDatabase } from "expo-sqlite";

interface Todo {
  id: number;
  content: string;
  status: boolean;
}

export default function Add() {
    const db = useSQLiteContext(); 
    const { name, id, oldContent } = useLocalSearchParams();
    const [content, setContent] = useState(Array.isArray(oldContent) ? oldContent[0] : oldContent || "");
    const router = useRouter();

    const saveJob = async () => {
        if (!content.trim()) return; 

        if (id) {
            await db.runAsync(
                "UPDATE todos SET content = ? WHERE id = ?",
            content,
            Number(id)
            );
        } else {
            await db.runAsync(
                "INSERT INTO todos (content, status) VALUES (?, ?)",
                content,
                0 
            );
        }

        router.push("/toDoList"); 
    };
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: "https://res.cloudinary.com/dixzxzdrd/image/upload/v1761045396/Rectangle_sokxf7.png" }} style={styles.img} />
                <View>
                    <Text style={styles.textHello}>Hi {name}</Text>
                    <Text style={styles.textSub}>Have a great day ahead</Text>
                </View>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/toDoList")}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>{id ? "EDIT YOUR JOB" : "ADD YOUR JOB"}</Text>

            <View style={styles.inputBox}>
                <Ionicons name="create-outline" size={20} color="#555" style={{ marginRight: 8 }} />
                <TextInput
                    value={content}
                    onChangeText={setContent}
                    placeholder="Input your job"
                    style={{ flex: 1 }}
                />
            </View>

            <TouchableOpacity style={styles.addButton} onPress={saveJob}>
                <Text style={styles.addButtonText}>{id ? "Update" : "Finish"}</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>

            <Image
                source={{ uri: "https://res.cloudinary.com/dixzxzdrd/image/upload/v1761048062/Image_96_cdnnwe.png" }}
                style={styles.imgBottom}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingVertical: 50,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    img: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    textHello: {
        fontSize: 20,
        fontWeight: "bold",
    },
    textSub: {
        fontSize: 14,
        color: "#666",
    },
    backBtn: {
        marginLeft: "auto",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
    },
    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#8353E2",
        padding: 12,
        borderRadius: 10,
        marginBottom: 20,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 5,
    },
    imgBottom: {
        width: "100%",
        height: 200,
        resizeMode: "contain",
        marginTop: "auto",
    },
});