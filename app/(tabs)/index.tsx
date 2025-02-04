import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Linking, StyleSheet } from "react-native";
import { fetchNews, Article } from "../lib/newsApi";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PagerView from "react-native-pager-view";

const NewsScreen: React.FC = () => {
    const [news, setNews] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getNews = async () => {
            const fetchedNews = await fetchNews();
            setNews(fetchedNews);
            setLoading(false);
        };
        getNews();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Fetching News...</Text>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <PagerView style={{ flex: 1 }} orientation="vertical">
                {news.map((article, index) => (
                    <View key={index} style={styles.page}>
                        {/* News Image (Top 1/3) */}
                        {article.urlToImage ? (
                            <Image
                                source={{ uri: article.urlToImage }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Text style={styles.noImageText}>No Image Available</Text>
                            </View>
                        )}

                        {/* News Content (Bottom 2/3 in a Card) */}
                        <View style={styles.card}>
                            <Text style={styles.title}>{article.title}</Text>
                            <Text style={styles.description}>
                                {article.description ? article.description : "No description available."}
                            </Text>

                            {/* Source */}
                            <Text style={styles.source}>Source: {article.source.name}</Text>

                            {/* Read More Button */}
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => Linking.openURL(article.url)}
                            >
                                <Text style={styles.buttonText}>Read More</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </PagerView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
    loadingText: {
        color: "#fff",
        marginTop: 10,
        fontSize: 16,
    },
    page: {
        flex: 1,
        backgroundColor: "#000",
    },
    image: {
        width: "100%",
        height: "33%",
    },
    imagePlaceholder: {
        width: "100%",
        height: "33%",
        backgroundColor: "#444",
        justifyContent: "center",
        alignItems: "center",
    },
    noImageText: {
        color: "#fff",
        fontSize: 16,
    },
    card: {
        flex: 1,
        backgroundColor: "#222",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
    },
    description: {
        fontSize: 16,
        color: "#ccc",
        marginTop: 10,
    },
    source: {
        fontSize: 12,
        color: "#888",
        marginTop: 15,
    },
    button: {
        marginTop: 20,
        backgroundColor: "#007bff",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default NewsScreen;
