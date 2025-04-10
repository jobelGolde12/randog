import { Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { router, useNavigation } from 'expo-router';
import { useRouter } from 'expo-router';
export default function HomeScreen() {
  const navigation = useNavigation();

  // const handleGetStarted = () => {
  //   navigation.navigate('SignUp');
  // };
  return (
    <ThemedView style={styles.container}>
      <Image
        source={require('../../assets/images/welcome_image.jpeg')}
        style={styles.heroImage}
        resizeMode="cover"
      />
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>RanDog</ThemedText>
        <ThemedText style={styles.subtitle}>
          Discover the Cutest Gallery of{'\n'}Random Dog Images
        </ThemedText>
        <TouchableOpacity style={styles.button} onPress={() => router.push('./Signup')}>
          <Text style={styles.buttonText}>Get started</Text>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    top: '-11%',
    width: '100%', 
    height: '60%',
    borderTopLeftRadius: 0, 
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 50, 
    borderBottomRightRadius: 50, 
  },
  content: {
    top: '-10%',
    backgroundColor: 'transparent',
    width: 300,
    height: 'auto',
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  title: {
    color: '#333',
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingTop: 10
  },
  subtitle: {
    textAlign: 'center',
    color: '#333',
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