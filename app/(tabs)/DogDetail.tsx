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

  const { breed, url } = dogData;
  useEffect(() => {
    fetch(`https://dog.ceo/api/breed/${breed}/images/random/5`)
      .then(res => res.json())
      .then(data => {
        setImages(data.message || []);
        setLoading(false);
        console.log("the data is => " , data)
      })
      .catch(err => {
        console.error('Failed to fetch breed data:', err);
        setLoading(false);
      });
  }, [breed]);

  const back = () => {
    router.push('./Gallery');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={back}>
        <Text style={styles.back}>&lt; Back</Text>
      </TouchableOpacity>

      {/* Main Image from the passed dog data */}
      <View style={styles.mainImageWrapper}>
        {loading ? (
          <>
            <View style={styles.imagePlaceholder} />
            <ActivityIndicator style={styles.spinnerOverlay} size="large" color="#000" />
          </>
        ) : (
          <Image source={{ uri: url }} style={styles.mainImage} />
        )}
      </View>

      {!loading && (
        <>
          <Text style={styles.title}>
            {breed.charAt(0).toUpperCase() + breed.slice(1)}
          </Text>

          <Text style={styles.subTitle}>More {breed} photos</Text>
          <FlatList
  horizontal
  data={images}
  keyExtractor={(item, index) => item + index}
  renderItem={({ item, index }) => (
    <View style={styles.relatedCard}>
      <Image source={{ uri: item }} style={styles.relatedImage} />
      <Text style={styles.caption}>#{index + 1} {breed}</Text>
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
  back: { fontSize: 20, color: '#333', marginBottom: 10, paddingTop: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subTitle: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  mainImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 250,
    marginBottom: 20,
  },
  imagePlaceholder: {
    backgroundColor: '#ccc',
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  spinnerOverlay: {
    position: 'absolute',
    top: '45%',
    left: '45%',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  relatedCard: {
    marginRight: 10,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
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
