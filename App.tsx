// Copilot: Build a playful "Hello, world" screen.
// Requirements:
// - Fullscreen gradient background (top-left teal → bottom-right purple)
// - Centered large "Hello 👋" that gently pulses
// - A smaller subtitle that changes with the current time of day (Good morning/afternoon/evening)
// - A round button labeled "Vibe Check" that triggers a quick scale bounce and a subtle haptic (fallback no-op on web)
// - Use TypeScript, React Native Animated, and expo-linear-gradient. Keep it <100 lines.

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, Animated, Platform, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import Confetti from 'react-confetti';

export default function App() {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const [greeting, setGreeting] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: Platform.OS === 'web' ? window.innerWidth : Dimensions.get('window').width,
    height: Platform.OS === 'web' ? window.innerHeight : Dimensions.get('window').height,
  });

  useEffect(() => {
    console.log('App is mounting! Platform:', Platform.OS);
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

    // Update window dimensions on resize (web only)
    if (Platform.OS === 'web') {
      const handleResize = () => {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleVibeCheck = () => {
    // Trigger haptic if not on web
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Show confetti
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000); // Stop after 5 seconds

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

  // Use View with CSS gradient for web, LinearGradient for native
  if (Platform.OS === 'web') {
    return (
      <View style={{
        flex: 1,
        height: '100vh' as any,
        width: '100vw' as any,
        alignItems: 'center',
        justifyContent: 'center',
        // @ts-ignore - CSS gradient works on web
        background: 'linear-gradient(135deg, #14b8a6 0%, #a855f7 100%)',
      } as any}>
        {showConfetti && (
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
          />
        )}
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
      </View>
    );
  }

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
