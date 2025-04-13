import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

export default function DogDetailScreen({ route, navigation }: any) {
  const { breed } = route.params;
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>&lt; Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{breed.charAt(0).toUpperCase() + breed.slice(1)}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <>
          <Image source={{ uri: images[0] }} style={styles.mainImage} />
          <Text style={styles.subTitle}>Related Breeds</Text>
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
  back: { fontSize: 16, color: '#007bff', marginBottom: 10 },
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
});
