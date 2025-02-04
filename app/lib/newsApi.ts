import axios from "axios";

// API Config
export const API_KEY = "e22d4ab86ffe41abb9182797f8f6f648"; // Replace with your API key
export const BASE_URL = "https://newsapi.org/v2";

// Define TypeScript Interface for News Articles
export interface Article {
    source: { name: string };
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
}

// Fetch News Function
export const fetchNews = async (): Promise<Article[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/top-headlines`, {
            params: {
                country: "us", // Change country as needed
                category: "general",
                apiKey: API_KEY,
            },
        });
        return response.data.articles || [];
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
};
