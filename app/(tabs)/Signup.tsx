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
export default function SignUpScreen() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    const { username, email, password, confirmPassword } = form;

    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match!');
      return;
    }

    try {
      await AsyncStorage.setItem('userData', JSON.stringify(form));
      Alert.alert('Sign Up Successful!');
      setForm({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (error) {
      Alert.alert('Error saving data');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Decorative Circles with Icon */}
      <View style={styles.circles}>
        <View style={styles.circleDark} />
        <View style={styles.circleLight}>
          <FontAwesome name="user-plus" size={24} color="#fff" style={styles.iconInCircle} />
        </View>
      </View>

      <Text style={styles.heading}>Sign Up</Text>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <FontAwesome name="user" size={18} color="#000" style={styles.icon} />
          <TextInput
            placeholder="Username"
            style={styles.input}
            value={form.username}
            onChangeText={(text) => handleChange('username', text)}
          />
        </View>

        <View style={styles.inputWrapper}>
          <FontAwesome name="envelope" size={18} color="#000" style={styles.icon} />
          <TextInput
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
            value={form.email}
            onChangeText={(text) => handleChange('email', text)}
          />
        </View>

        <View style={styles.inputWrapper}>
          <FontAwesome name="lock" size={18} color="#000" style={styles.icon} />
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            value={form.password}
            onChangeText={(text) => handleChange('password', text)}
          />
        </View>

        <View style={styles.inputWrapper}>
          <FontAwesome name="lock" size={18} color="#000" style={styles.icon} />
          <TextInput
            placeholder="Confirm Password"
            style={styles.input}
            secureTextEntry
            value={form.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account? <Text style={styles.link} onPress={() => router.push('./Login')}>Sign In</Text>
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
    marginTop: 60,
    color: '#000',
  },
  inputContainer: {
    backgroundColor: '#fff',
    width: 320,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
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
    textAlign: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  footerText: {
    marginTop: 16,
    color: '#444',
  },
  link: {
    fontWeight: 'bold',
    color: '#000',
  },
  circles: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    paddingTop: 40,
    paddingRight: 20,
    zIndex: -1,
  },
  circleDark: {
    width: 150,
    height: 150,
    backgroundColor: '#4B0082',
    borderRadius: 30,
  },
  circleLight: {
    width: 60,
    height: 60,
    backgroundColor: '#9370DB',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInCircle: {
    position: 'absolute',
  },
});
