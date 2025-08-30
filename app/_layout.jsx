import { Stack } from "expo-router";
import SafeScreen from "@/components/safeScreen.jsx";
import { ClerkProvider } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import { StatusBar } from "expo-status-bar";
import { tokenCache } from '@clerk/clerk-expo/token-cache'
export default function RootLayout() {
  //this is the reason we have the multiple page
  return(
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>
         <Slot />
      </SafeScreen>
       <StatusBar style="dark" />
    </ClerkProvider>
  );
 
   
}
