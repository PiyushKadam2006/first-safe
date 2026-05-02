import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  Vibration,
  Platform,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';

import { 
  useFonts, 
  PublicSans_900Black,
  PublicSans_700Bold,
  PublicSans_800ExtraBold 
} from '@expo-google-fonts/public-sans';
import { 
  Inter_400Regular, 
  Inter_600SemiBold, 
  Inter_700Bold 
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { BACKEND_URL } from './config';

SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get('window');
// const BACKEND_URL = 'http://10.202.36.1:5000/api/sos/trigger'; // Moved to config.js
const CRASH_THRESHOLD = 2.5; // G-Force threshold

export default function App() {
  const [fontsLoaded] = useFonts({
    PublicSans_900Black,
    PublicSans_700Bold,
    PublicSans_800ExtraBold,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('NOMINAL'); // NOMINAL, ALERT, DISPATCHED
  const [gForce, setGForce] = useState(1.0);

  const countdownInterval = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const gForceRef = useRef("1.00");
  const stateRef = useRef({ isAlertActive: false, status: 'NOMINAL' });

  // Update refs so accelerometer callback always has latest state
  useEffect(() => {
    stateRef.current = { isAlertActive, status };
  }, [isAlertActive, status]);

  // Request Permissions
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }
    })();
    _subscribe();
    return () => _unsubscribe();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Animation for Emergency Pulse
  useEffect(() => {
    if (isAlertActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isAlertActive]);

  const _subscribe = () => {
    Accelerometer.setUpdateInterval(100);
    setSubscription(
      Accelerometer.addListener(accelerometerData => {
        setData(accelerometerData);
        const { x, y, z } = accelerometerData;
        const totalG = Math.sqrt(x * x + y * y + z * z);
        const latestGForce = totalG.toFixed(2);
        setGForce(latestGForce);
        gForceRef.current = latestGForce;

        const { isAlertActive: currentAlert, status: currentStatus } = stateRef.current;

        if (totalG > CRASH_THRESHOLD && !currentAlert && currentStatus !== 'DISPATCHED') {
          triggerAlert();
        }
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const triggerAlert = () => {
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    
    setIsAlertActive(true);
    setStatus('ALERT');
    setCountdown(5);
    Vibration.vibrate([0, 500, 200, 500], true);

    countdownInterval.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current);
          handleSOS();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSOS = async () => {
    try {
      Vibration.cancel();
      Vibration.vibrate(1000);
      
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      const payload = {
        location: {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        },
        impactForce: parseFloat(gForceRef.current),
        status: 'CRITICAL',
      };

      await axios.post(BACKEND_URL, payload);
      setStatus('DISPATCHED');
      setIsAlertActive(false);
    } catch (error) {
      console.error('SOS Failed:', error);
      setStatus('NOMINAL');
      setIsAlertActive(false);
      clearInterval(countdownInterval.current);
    }
  };

  const cancelSOS = () => {
    clearInterval(countdownInterval.current);
    Vibration.cancel();
    setIsAlertActive(false);
    setStatus('NOMINAL');
  };



  // UI Components
  if (isAlertActive || status === 'DISPATCHED') {
    return (
      <View style={styles.alertContainer}>
        <StatusBar style="light" />
        <Animated.View pointerEvents="none" style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />
        
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>RoadSoS</Text>
            <Text style={styles.subBrand}>{status === 'ALERT' ? 'CRITICAL EVENT DETECTED' : 'DISPATCH CONFIRMED'}</Text>
          </View>
          <View style={styles.statusBadge}>
            <MaterialIcons name="emergency" size={14} color="#ff5451" />
            <Text style={styles.statusBadgeText}>{status === 'ALERT' ? 'DISPATCH PENDING' : 'HELP IS ON THE WAY'}</Text>
          </View>
        </View>

        <View style={styles.centerpiece}>
          {status === 'ALERT' ? (
            <View style={styles.countdownContainer}>
               <Text style={styles.countdownNumber}>{countdown}</Text>
               <Text style={styles.countdownLabel}>Seconds Remaining</Text>
            </View>
          ) : (
            <MaterialIcons name="check-circle" size={120} color="#00a572" />
          )}
          
          <Text style={styles.alertTitle}>{status === 'ALERT' ? 'CRASH DETECTED' : 'SOS SENT'}</Text>
          <Text style={styles.alertDesc}>
            {status === 'ALERT' 
              ? 'Automatic Emergency Services dispatch in progress. Stay where you are.' 
              : 'Emergency units have been notified of your location. Please stay calm.'}
          </Text>
        </View>

        <View style={styles.telemetryGrid}>
          <View style={styles.telemetryCard}>
            <View style={styles.telemetryHeader}>
              <Text style={styles.telemetryLabel}>IMPACT</Text>
              <MaterialIcons name="sensors" size={16} color="#ff5451" />
            </View>
            <Text style={styles.telemetryValue}>{gForce}<Text style={styles.telemetryUnit}> G</Text></Text>
          </View>

          <View style={styles.telemetryCard}>
            <View style={styles.telemetryHeader}>
              <Text style={[styles.telemetryLabel, { color: '#69d8d4' }]}>LOCATION</Text>
              <MaterialIcons name="location-on" size={16} color="#69d8d4" />
            </View>
            <Text style={styles.telemetryValueSmall}>40.71° N</Text>
            <Text style={styles.telemetryValueSmall}>74.00° W</Text>
          </View>

          <View style={styles.telemetryCard}>
            <View style={styles.telemetryHeader}>
              <Text style={[styles.telemetryLabel, { color: '#4edea3' }]}>STATUS</Text>
              <MaterialIcons name="speed" size={16} color="#4edea3" />
            </View>
            <Text style={styles.telemetryValueSmall}>{status}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.safeButton, status === 'DISPATCHED' && { backgroundColor: '#31394d' }]} 
          onPress={status === 'ALERT' ? cancelSOS : () => setStatus('NOMINAL')}
        >
          <MaterialIcons name={status === 'ALERT' ? "check-circle" : "close"} size={32} color={status === 'ALERT' ? "#002113" : "#fff"} />
          <Text style={[styles.safeButtonText, status === 'DISPATCHED' && { color: '#fff' }]}>
            {status === 'ALERT' ? 'I AM SAFE' : 'DISMISS ALERT'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.brandLarge}>RoadSoS</Text>
      <Text style={styles.systemStatus}>System: <Text style={{color: '#4edea3'}}>NOMINAL</Text></Text>
      
      <View style={styles.monitor}>
         <Text style={styles.monitorLabel}>REAL-TIME G-FORCE</Text>
         <Text style={styles.monitorValue}>{gForce}<Text style={styles.monitorUnit}> G</Text></Text>
      </View>



      <Text style={styles.footerNote}>Active crash detection monitoring in background.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1326',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  alertContainer: {
    flex: 1,
    backgroundColor: '#0b1326',
    padding: 24,
    justifyContent: 'space-between',
  },
  pulseCircle: {
      position: 'absolute',
      width: width * 1.5,
      height: width * 1.5,
      borderRadius: width,
      backgroundColor: 'rgba(255, 84, 81, 0.05)',
      top: height / 2 - (width * 0.75),
      left: width / 2 - (width * 0.75),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  brand: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'PublicSans_900Black',
    letterSpacing: -1,
    textTransform: 'uppercase',
  },
  brandLarge: {
    color: '#fff',
    fontSize: 48,
    fontFamily: 'PublicSans_900Black',
    letterSpacing: -2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  subBrand: {
    color: '#ff5451',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d3449',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  centerpiece: {
    alignItems: 'center',
  },
  countdownContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 250,
      height: 250,
      borderWidth: 8,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 125,
  },
  countdownNumber: {
    color: '#fff',
    fontSize: 120,
    fontFamily: 'PublicSans_900Black',
  },
  countdownLabel: {
    color: '#ffb3ad',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: -10,
  },
  alertTitle: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'PublicSans_900Black',
    textTransform: 'uppercase',
    marginTop: 30,
  },
  alertDesc: {
    color: '#dae2fd',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  telemetryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  telemetryCard: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: 'rgba(45, 52, 73, 0.6)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'space-between',
  },
  telemetryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  telemetryLabel: {
    color: '#ff5451',
    fontSize: 8,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  telemetryValue: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'PublicSans_900Black',
  },
  telemetryValueSmall: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  telemetryUnit: {
    fontSize: 10,
    color: '#ffb3ad',
  },
  safeButton: {
    backgroundColor: '#00a572',
    height: 80,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  safeButtonText: {
    color: '#002113',
    fontSize: 24,
    fontFamily: 'PublicSans_900Black',
    textTransform: 'uppercase',
  },
  systemStatus: {
      color: '#dae2fd',
      fontSize: 12,
      fontFamily: 'Inter_700Bold',
      letterSpacing: 2,
      marginBottom: 40,
  },
  monitor: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      padding: 40,
      borderRadius: 100,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      marginBottom: 40,
  },
  monitorLabel: {
      color: '#dae2fd',
      fontSize: 10,
      fontFamily: 'Inter_700Bold',
      letterSpacing: 2,
      marginBottom: 10,
  },
  monitorValue: {
      color: '#fff',
      fontSize: 48,
      fontFamily: 'PublicSans_900Black',
  },
  monitorUnit: {
      fontSize: 18,
      color: '#dae2fd',
  },
  testButton: {
      backgroundColor: '#ff5451',
      paddingHorizontal: 30,
      paddingVertical: 15,
      borderRadius: 30,
  },
  testButtonText: {
      color: '#fff',
      fontFamily: 'Inter_700Bold',
      fontSize: 12,
      letterSpacing: 1,
  },
  footerNote: {
      color: '#dae2fd',
      fontSize: 10,
      fontFamily: 'Inter_400Regular',
      marginTop: 20,
      opacity: 0.6,
  }
});
