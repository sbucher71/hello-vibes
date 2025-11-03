// Copilot: Build a playful "Hello, world" screen.
// Requirements:
// - Fullscreen gradient background (top-left teal → bottom-right purple)
// - Centered large "Hello 👋" that gently pulses
// - A smaller subtitle that changes with the current time of day (Good morning/afternoon/evening)
// - A round button labeled "Vibe Check" that triggers a quick scale bounce and a subtle haptic (fallback no-op on web)
// - Use TypeScript, React Native Animated, and expo-linear-gradient. Keep it <100 lines.

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';

export default function App() {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Gentle pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleVibeCheck = () => {
    // Trigger haptic if not on web
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Bounce animation
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <LinearGradient
      colors={['#14b8a6', '#a855f7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.Text style={[styles.hello, { transform: [{ scale: pulseAnim }] }]}>
        Hello 👋
      </Animated.Text>
      <Text style={styles.subtitle}>{greeting}</Text>
      <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
        <TouchableOpacity style={styles.button} onPress={handleVibeCheck}>
          <Text style={styles.buttonText}>Vibe Check</Text>
        </TouchableOpacity>
      </Animated.View>
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
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
