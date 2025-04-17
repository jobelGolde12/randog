import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

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
    let breedUrl = breed;
    if (breed.includes('-')) {
      const [main, sub] = breed.split('-');
      breedUrl = `${main}/${sub}`;
    }

    fetch(`https://dog.ceo/api/breed/${breedUrl}/images/random/5`)
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

  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
        return;
      }

      const fileUri = FileSystem.documentDirectory + `${breed}.jpg`;
      const downloadedFile = await FileSystem.downloadAsync(url, fileUri);

      await MediaLibrary.saveToLibraryAsync(downloadedFile.uri);
      alert('Image downloaded to your gallery!');
      console.log('Image downloaded to your gallery!');
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download image.');
      console.log('Failed to download image.');
    }
  };

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
          <>
            <Image source={{ uri: url }} style={styles.mainImage} />
            <View style={styles.downloadRow}>
              <Text style={styles.breedText}>{breed}</Text>
              <TouchableOpacity onPress={handleDownload}>
                <AntDesign name="download" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {!loading && (
        <>
          {/* <Text style={styles.title}>
            {breed.charAt(0).toUpperCase() + breed.slice(1)}
          </Text> */}

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
  subTitle: { fontSize: 18, fontWeight: '800', marginVertical: 10,
  top: 30,
   },
  mainImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 250,
    marginBottom: 10,
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
  downloadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  breedText: {
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  relatedCard: {
    marginRight: 16,
    alignItems: 'center',
    flexDirection: 'column',
  },
  relatedImage: {
    width: 250,
    height: 250,
    borderRadius: 16,
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
