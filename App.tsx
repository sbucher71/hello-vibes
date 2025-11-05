import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [user, setUser] = useState<{ name: string; provider: string } | null>(null);

  const handleMicrosoftLogin = async () => {
    Alert.alert('Microsoft Login', 'Microsoft OAuth integration requires Azure AD app setup. Coming soon!');
  };

  const handleAppleLogin = async () => {
    Alert.alert('Apple Login', 'Apple Sign In requires Apple Developer account setup. Coming soon!');
  };

  const handleGoogleLogin = async () => {
    Alert.alert('Google Login', 'Google OAuth integration requires Firebase/Google Cloud setup. Coming soon!');
  };

  const handleLogout = () => {
    setUser(null);
    Alert.alert('Logged Out', 'You have been logged out successfully.');
  };

  return (
    <LinearGradient
      colors={['#14b8a6', '#a855f7']}
      style={styles.container}
    >
      <Text style={styles.hello}>Hello 👋</Text>
      <Text style={styles.subtitle}>
        {user ? `Welcome, ${user.name}!` : 'Welcome to Hello Vibes'}
      </Text>

      {!user ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.microsoftButton} onPress={handleMicrosoftLogin}>
            <Text style={styles.buttonText}>🪟 Sign in with Microsoft</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.appleButton} onPress={handleAppleLogin}>
            <Text style={styles.buttonText}>🍎 Sign in with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
            <Text style={styles.buttonText}>🔍 Sign in with Google</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <Text style={styles.loggedInText}>Logged in with {user.provider}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}

      <StatusBar style="light" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hello: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '80%',
    gap: 15,
  },
  microsoftButton: {
    backgroundColor: '#0078D4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  appleButton: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loggedInText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
});
