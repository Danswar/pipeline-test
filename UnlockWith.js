import React, { useContext, useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator, useColorScheme, LayoutAnimation } from 'react-native';
import { Icon } from 'react-native-elements';
import Biometric from './class/biometrics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation, useRoute } from '@react-navigation/native';
import { BlueStorageContext } from './blue_modules/storage-context';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  biometric: {
    paddingTop: 30,
  },
  biometricRow: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  icon: {
    width: 64,
    height: 64,
  },
  splashContainer: {
    flex: 0,
  },
});

const UnlockWith = () => {
  const { setWalletsInitialized, isStorageEncrypted, startAndDecrypt } = useContext(BlueStorageContext);
  const { dispatch } = useNavigation();
  const { unlockOnComponentMount } = useRoute().params;
  const [biometricType, setBiometricType] = useState(false);
  const [isStorageEncryptedEnabled, setIsStorageEncryptedEnabled] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [animationDidFinish, setAnimationDidFinish] = useState(false);
  const colorScheme = useColorScheme();

  const splash = require('./img/dfx/splash.png');

  const initialRender = async () => {
    let bt = false;
    if (await Biometric.isBiometricUseCapableAndEnabled()) {
      bt = await Biometric.biometricType();
    }

    setBiometricType(bt);

    onAnimationFinish();
  };

  useEffect(() => {
    initialRender();
  }, []);

  const successfullyAuthenticated = () => {
    setWalletsInitialized(true);
    dispatch(StackActions.replace('Navigation'));
  };

  const unlockWithBiometrics = async () => {
    if (await isStorageEncrypted()) {
      unlockWithKey();
    }
    setIsAuthenticating(true);

    if (await Biometric.unlockWithBiometrics()) {
      setIsAuthenticating(false);
      await startAndDecrypt();
      return successfullyAuthenticated();
    }
    setIsAuthenticating(false);
  };

  const unlockWithKey = async () => {
    setIsAuthenticating(true);
    if (await startAndDecrypt()) {
      ReactNativeHapticFeedback.trigger('notificationSuccess', { ignoreAndroidSystemSettings: false });
      successfullyAuthenticated();
    } else {
      setIsAuthenticating(false);
    }
  };

  const renderUnlockOptions = () => {
    if (isAuthenticating) {
      return <ActivityIndicator />;
    } else {
      const color = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
      if ((biometricType === Biometric.TouchID || biometricType === Biometric.Biometrics) && !isStorageEncryptedEnabled) {
        return (
          <TouchableOpacity accessibilityRole="button" disabled={isAuthenticating} onPress={unlockWithBiometrics}>
            <Icon name="fingerprint" size={64} type="font-awesome5" color={color} />
          </TouchableOpacity>
        );
      } else if (biometricType === Biometric.FaceID && !isStorageEncryptedEnabled) {
        return (
          <TouchableOpacity accessibilityRole="button" disabled={isAuthenticating} onPress={unlockWithBiometrics}>
            <Image
              source={colorScheme === 'dark' ? require('./img/faceid-default.png') : require('./img/faceid-dark.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        );
      } else if (isStorageEncryptedEnabled) {
        return (
          <TouchableOpacity accessibilityRole="button" disabled={isAuthenticating} onPress={unlockWithKey}>
            <Icon name="lock" size={64} type="font-awesome5" color={color} />
          </TouchableOpacity>
        );
      }
    }
  };

  const onAnimationFinish = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (unlockOnComponentMount) {
      const storageIsEncrypted = await isStorageEncrypted();
      setIsStorageEncryptedEnabled(storageIsEncrypted);
      if (!biometricType || storageIsEncrypted) {
        unlockWithKey();
      } else if (typeof biometricType === 'string') unlockWithBiometrics();
    }
    setAnimationDidFinish(true);
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.container}>
        <View style={styles.splashContainer}>
          <Image style={styles.splash} source={splash} />
          <View style={styles.biometric}>{animationDidFinish && <View style={styles.biometricRow}>{renderUnlockOptions()}</View>}</View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UnlockWith;
