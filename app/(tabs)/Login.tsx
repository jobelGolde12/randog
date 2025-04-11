import React, { useState } from 'react';
import { router, useNavigation } from 'expo-router';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Please enter both email and password.');
      return;
    }

    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (!storedData) {
        Alert.alert('No user found. Please sign up first.');
        return;
      }

      const userData = JSON.parse(storedData);
      if (userData.email === email && userData.password === password) {
        router.push('./Gallery');
      } else {
        Alert.alert('Invalid credentials.');
      }
    } catch (error) {
      Alert.alert('Login failed. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <FontAwesome name="envelope" size={18} color="#000" style={styles.icon} />
          <TextInput
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputWrapper}>
          <FontAwesome name="lock" size={18} color="#000" style={styles.icon} />
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Didn't have an account? <Text style={styles.link} onPress={() => router.push('./Signup')}>Sign Up</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingTop: 40,
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#000',
  },
  inputContainer: {
    backgroundColor: '#fff',
    width: 320,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: '#333',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 50,
    marginTop: 10,
    width: '100%',
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerText: {
    marginTop: 16,
    color: '#444',
  },
  link: {
    fontWeight: 'bold',
    color: '#000',
  },
});
