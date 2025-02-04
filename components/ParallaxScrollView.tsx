import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import {Article, fetchNews} from "@/app/lib/newsApi";
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
        <View className="flex-1 items-center justify-center bg-gray-900">
          <ActivityIndicator size="large" color="#fff" />
          <Text className="text-white mt-4">Fetching News...</Text>
        </View>
    );
  }

  return (
      <GestureHandlerRootView className="flex-1">
        <PagerView style={{ flex: 1 }} orientation="vertical">
          {news.map((article, index) => (
              <View key={index} className="flex-1 bg-gray-900">
                {/* News Image */}
                {article.urlToImage ? (
                    <Image
                        source={{ uri: article.urlToImage }}
                        className="w-full h-1/2"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="w-full h-1/2 bg-gray-700 items-center justify-center">
                      <Text className="text-white">No Image Available</Text>
                    </View>
                )}

                {/* News Content */}
                <View className="absolute top-0 left-0 p-3">
                  <TouchableOpacity className="bg-blue-600 px-3 py-1 rounded-lg">
                    <Text className="text-white font-bold">NewsShort</Text>
                  </TouchableOpacity>
                </View>

                <View className="h-1/2 bg-white rounded-t-3xl px-5 py-6 shadow-lg">
                  <Text className="text-xl font-bold text-gray-900">{article.title}</Text>
                  <Text className="text-gray-600 text-sm mt-2">
                    {article.description ? article.description : "No description available."}
                  </Text>

                  {/* Source Credit */}
                  <Text className="text-sm text-gray-500 mt-4">Source: {article.source.name}</Text>
                </View>
              </View>
          ))}
        </PagerView>
      </GestureHandlerRootView>
  );
};

export default NewsScreen;
