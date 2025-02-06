import axios from "axios";

export const API_KEY = "e22d4ab86ffe41abb9182797f8f6f648";
export const BASE_URL = "https://newsapi.org/v2";

export interface Source {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  language: string;
  country: string;
}

export interface Article {
  source: { name: string };
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}

interface NewsFilters {
  categories?: string[];
  languages?: string[];
  regions?: string[];
}

export const fetchNews = async (filters: NewsFilters): Promise<Article[]> => {
  try {
    // First get sources based on filters
    const sources = await fetchSources(filters);
    const sourceIds = sources.map(source => source.id).join(',');

    // Then fetch news from these sources
    const response = await axios.get(`${BASE_URL}/top-headlines`, {
      params: {
        sources: sourceIds,
        apiKey: API_KEY,
      },
    });
    return response.data.articles || [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

export const fetchSources = async (filters: NewsFilters): Promise<Source[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/top-headlines/sources`, {
      params: {
        category: filters.categories?.[0], // API only accepts one category
        language: filters.languages?.[0], // API only accepts one language
        country: filters.regions?.[0], // API only accepts one country
        apiKey: API_KEY,
      },
    });
    return response.data.sources || [];
  } catch (error) {
    console.error("Error fetching sources:", error);
    return [];
  }
};

export default { fetchNews, fetchSources };