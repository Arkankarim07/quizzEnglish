import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={
    {
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: 'bold',
      },

      headerShown: true
    }
  } />;
}
