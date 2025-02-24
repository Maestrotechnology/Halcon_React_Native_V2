import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import StyledText from './StyledText';
import {FONTSIZES} from '../Utilities/Constants';

const InfiniteBorderAlert = () => {
  const borderAnim = useRef(new Animated.Value(1)).current; // Border width animation

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderAnim, {
          toValue: 4, // Bold border
          duration: 500,
          useNativeDriver: false, // ❌ Cannot use native driver for borderWidth
        }),
        Animated.timing(borderAnim, {
          toValue: 1, // Thin border
          duration: 500,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.alertBox, {borderWidth: borderAnim}]}>
        <StyledText style={{fontSize: FONTSIZES.tiny}}>
          Change Request status to Ongoing for Update this request
        </StyledText>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#fffbe6',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: '#ffe58f',
    marginBottom: 5,
  },
});

export default InfiniteBorderAlert;
