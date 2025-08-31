import { useClerk } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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

  return (
    <TouchableOpacity style={styles.button} onPress={handleSignOut}>
      <Ionicons name="log-out-outline" size={20} color="#d9534f" />
      <Text style={styles.text}>Logout</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d9534f',
    marginLeft: 8,
  },
  text: {
    color: '#d9534f',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
});
