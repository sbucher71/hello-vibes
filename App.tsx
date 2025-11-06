import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import { useState, useEffect } from 'react';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

// Microsoft Azure AD configuration
const MICROSOFT_CONFIG = {
  clientId: '194d3cab-45ff-4828-9bde-a7606418bda0', // Replace with your Azure AD Application (client) ID
  tenantId: 'd92ffb5a-f94b-49fd-944d-913752d01d54', // Replace with your organization's tenant ID (found in Azure AD overview)
  scopes: ['openid', 'profile', 'email', 'User.Read'],
};

const discovery = {
  authorizationEndpoint: `https://login.microsoftonline.com/${MICROSOFT_CONFIG.tenantId}/oauth2/v2.0/authorize`,
  tokenEndpoint: `https://login.microsoftonline.com/${MICROSOFT_CONFIG.tenantId}/oauth2/v2.0/token`,
};

interface UserInfo {
  name: string;
  email: string;
  provider: string;
  id: string;
}

export default function App() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const redirectUri = makeRedirectUri({
    scheme: 'hellovibes',
    path: 'auth',
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: MICROSOFT_CONFIG.clientId,
      scopes: MICROSOFT_CONFIG.scopes,
      responseType: ResponseType.Code,
      redirectUri,
      usePKCE: true,
    },
    discovery
  );

  // Load saved user on app start
  useEffect(() => {
    loadSavedUser();
  }, []);

  // Handle OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      exchangeCodeForToken(code);
    } else if (response?.type === 'error') {
      Alert.alert('Authentication Error', response.error?.message || 'Failed to authenticate');
    }
  }, [response]);

  const loadSavedUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exchangeCodeForToken = async (code: string) => {
    try {
      // Exchange authorization code for access token
      const tokenResponse = await fetch(discovery.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: MICROSOFT_CONFIG.clientId,
          scope: MICROSOFT_CONFIG.scopes.join(' '),
          code,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
          code_verifier: request?.codeVerifier || '',
        }).toString(),
      });

      const tokens = await tokenResponse.json();

      if (tokens.access_token) {
        // Get user info from Microsoft Graph API
        const userInfoResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        });

        const userInfo = await userInfoResponse.json();

        const userData: UserInfo = {
          name: userInfo.displayName || userInfo.userPrincipalName,
          email: userInfo.mail || userInfo.userPrincipalName,
          provider: 'Microsoft',
          id: userInfo.id,
        };

        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        Alert.alert('Success', `Welcome, ${userData.name}!`);
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Token exchange error:', error);
      Alert.alert('Error', 'Failed to complete sign-in. Please try again.');
    }
  };

  const handleMicrosoftLogin = async () => {
    console.log('Microsoft Login - Client ID:', MICROSOFT_CONFIG.clientId);
    console.log('Redirect URI:', redirectUri);
    
    if (MICROSOFT_CONFIG.clientId === 'YOUR_AZURE_AD_CLIENT_ID') {
      Alert.alert(
        'Setup Required',
        'Please configure your Azure AD Client ID in App.tsx.\n\n' +
        'Steps:\n' +
        '1. Go to portal.azure.com\n' +
        '2. Register a new app in Azure AD\n' +
        '3. Add redirect URI: ' + redirectUri + '\n' +
        '4. Copy the Application (client) ID\n' +
        '5. Replace YOUR_AZURE_AD_CLIENT_ID in the code'
      );
      return;
    }
    
    console.log('Starting OAuth flow...');
    promptAsync();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      Alert.alert('Logged Out', 'You have been logged out successfully.');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#14b8a6', '#a855f7']} style={styles.container}>
        <Text style={styles.subtitle}>Loading...</Text>
        <StatusBar style="light" />
      </LinearGradient>
    );
  }

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
