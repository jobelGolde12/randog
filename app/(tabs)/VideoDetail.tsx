import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { Video } from 'expo-av';

export default function DogDetailScreen() {
  const router = useRouter();
  const { dog } = useLocalSearchParams();
  const [suggestedVideos, setSuggestedVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  if (!dog) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No video data passed.</Text>
      </View>
    );
  }

  let dogData;
  try {
    dogData = JSON.parse(dog as string);
  } catch (e) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Invalid video data.</Text>
      </View>
    );
  }

  const { breed, url, title = 'Bulldog Moment' } = dogData;

  useEffect(() => {
    let breedUrl = breed.includes('-') ? breed.replace('-', '/') : breed;

    // Fetch breed-specific images as placeholders for "suggested videos"
    fetch(`https://dog.ceo/api/breed/${breedUrl}/images/random/5`)
      .then(res => res.json())
      .then(data => {
        setSuggestedVideos(data.message || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching suggestions:', err);
        setLoading(false);
      });
  }, [breed]);

  const handleDownload = () => {
    Alert.alert('Download', 'Simulate download of this video...');
  };

  const back = () => {
    router.push('./Gallery');
  };

  const handleVideoSelect = (videoUrl: string) => {
    router.push({
      pathname: './DogDetailScreen',
      params: {
        dog: JSON.stringify({ breed, url: videoUrl, title }),
      },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={back}>
        <Text style={styles.backText}>&lt; Back</Text>
      </TouchableOpacity>

      {/* Main Video */}
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: url }}
          useNativeControls
        //   resizeMode="contain"
          isLooping
          style={styles.video}
        />
        <View style={styles.videoMeta}>
          <View>
            <Text style={styles.videoTitle}>{title}</Text>
            <Text style={styles.videoCategory}>Category: {breed}</Text>
          </View>
          <TouchableOpacity onPress={handleDownload}>
            <AntDesign name="download" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Suggestions */}
      <Text style={styles.suggestionTitle}>More {breed} Moments</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={suggestedVideos}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionCard}
              onPress={() => handleVideoSelect(item)}
            >
              <Video
                source={{ uri: item }}
                // resizeMode="cover"
                isMuted
                shouldPlay
                isLooping
                style={styles.thumbnail}
              />
              <Text style={styles.caption}>{breed}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  backText: { fontSize: 18, color: '#333', marginBottom: 10 },
  videoContainer: {
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  videoCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginVertical: 10,
    marginTop: 30,
  },
  suggestionCard: {
    marginRight: 16,
    width: 200,
  },
  thumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    backgroundColor: '#ccc',
  },
  caption: {
    marginTop: 6,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
