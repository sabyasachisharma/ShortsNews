import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            {/* This ensures that (tabs) is the main screen */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
        </Stack>
    );
}
