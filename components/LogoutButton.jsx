import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useClerk } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';

export default function LogoutButton() {
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Ionicons name="log-out-outline" size={24} color="#d9534f" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d9534f',
    marginLeft: 8,
  },
});
