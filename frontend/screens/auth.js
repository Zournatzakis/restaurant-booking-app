import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import api from "../config/api";

export default function Auth({ navigation }) {
  // Καταστάσεις για φόρμα.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  // animations.
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // εφέ fade-in στην εμφάνιση.
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // επεξεργασία υποβολής.
  const handlePress = async () => {
    try {
      if (isRegister) {
        const res = await api.post("/register", { name, email, password });
        Alert.alert("Επιτυχία", res.data.message);
        // επαναφορά πεδίων.
        setIsRegister(false);
        setPassword("");
        setEmail("");
        setName("");
      } else {
        const res = await api.post("/login", { email, password });
        const { token } = res.data;
        await AsyncStorage.setItem("token", token);
        navigation.replace("RestaurantsList");
      }
    } catch (err) {
      Alert.alert(
        "Σφάλμα",
        err.response?.data?.message || "Κάτι πήγε στραβά. Δοκίμασε ξανά!"
      );
    }
  };

  // εφέ scale κουμπιού (1).
  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  // εφέ scale κουμπιού (2).
  const onPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.background}>
      {}
      {/* φόντο εικονιδίου (1) */}
      <Ionicons
        name="restaurant-outline"
        size={200}
        color="#333"
        style={styles.bgIcon1}
      />
      {/* φόντο εικονιδίου (2) */}
      <MaterialCommunityIcons
        name="food-fork-drink"
        size={200}
        color="#333"
        style={styles.bgIcon2}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.title}>{isRegister ? "Εγγραφή" : "Σύνδεση"}</Text>

          {isRegister && (
            <TextInput
              style={styles.input}
              placeholder="Όνομα"
              placeholderTextColor="#AAA"
              value={name}
              onChangeText={setName}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#AAA"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Κωδικός"
            placeholderTextColor="#AAA"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Animated.View
            style={[
              styles.buttonWrapper,
              { transform: [{ scale: buttonScale }] },
            ]}
          >
            <TouchableOpacity
              style={styles.button}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={handlePress}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {isRegister ? "Εγγραφή" : "Σύνδεση"}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={styles.switchContainer}
            onPress={() => setIsRegister(!isRegister)}
          >
            <Text style={styles.switchText}>
              {isRegister
                ? "Έχεις ήδη λογαριασμό; Σύνδεση"
                : "Δεν έχεις λογαριασμό; Εγγραφή"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  bgIcon1: {
    position: "absolute",
    top: "8%",
    left: "-5%",
    opacity: 0.03,
  },
  bgIcon2: {
    position: "absolute",
    bottom: "8%",
    right: "-5%",
    opacity: 0.03,
  },
  container: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333333",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#333333",
  },
  buttonWrapper: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  button: {
    height: 50,
    backgroundColor: "#444444",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  switchContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  switchText: {
    color: "#555555",
    fontSize: 14,
  },
});
