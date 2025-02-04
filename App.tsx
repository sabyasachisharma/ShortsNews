import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import NewsScreen from "@/app/(tabs)";

const App: React.FC = () => {
    return (
        <SafeAreaView className="flex-1">
            <NewsScreen />
        </SafeAreaView>
    );
};

export default App;
