import { useClerk } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

export default function SignOutButton() {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to home page
      Linking.openURL(Linking.createURL("/"));
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  // return (
  //   <TouchableOpacity style={styles.button} onPress={handleSignOut}>
  //     <Text style={styles.text}>Sign out</Text>
  //   </TouchableOpacity>
  // );
}