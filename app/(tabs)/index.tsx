import { Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80' }}
        style={styles.heroImage}
        resizeMode="cover"
      />
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>RanDog</ThemedText>
        <ThemedText style={styles.subtitle}>
          Discover the Cutest Gallery of{'\n'}Random Dog Images
        </ThemedText>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Get started</Text>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: 300,
    height: 250,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  content: {
    backgroundColor: '#fff',
    width: 300,
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#333',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
