import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function DogDetailScreen() {
  const router = useRouter();
  const { dog } = useLocalSearchParams();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  if (!dog) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No dog data passed.</Text>
      </View>
    );
  }

  let dogData;
  try {
    dogData = JSON.parse(dog as string);
  } catch (e) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Invalid dog data.</Text>
      </View>
    );
  }

  const breed = dogData.breed;

  useEffect(() => {
    fetch(`https://dog.ceo/api/breed/${breed}/images/random/5`)
      .then(res => res.json())
      .then(data => {
        setImages(data.message || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch breed data:', err);
        setLoading(false);
      });
  }, [breed]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>&lt; Back</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <>
          <Image source={{ uri: images[0] }} style={styles.mainImage} />
            <View >
            <Text style={styles.title}>
                {breed.charAt(0).toUpperCase() + breed.slice(1)}
            </Text>
            </View>

          <Text style={styles.subTitle}>More {breed} photos</Text>
          <FlatList
            horizontal
            data={images.slice(1)}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <View style={styles.relatedCard}>
                <Image source={{ uri: item }} style={styles.relatedImage} />
                <Text style={styles.caption}>{breed}</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  back: { fontSize: 20, color: '#333', marginBottom: 10,
    paddingTop: 20,
   },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subTitle: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  mainImage: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    marginBottom: 20,
  },
  relatedCard: {
    marginRight: 10,
    alignItems: 'center',
  },
  relatedImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  caption: {
    marginTop: 6,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
