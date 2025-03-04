import React, {useEffect, useCallback, useState} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {FONTS} from '../Utilities/Fonts';
import {ICONS} from '../Utilities/Icons';
import {WINDOW_WIDTH} from '../Utilities/Constants';

type SegmentedControlProps = {
  tabs: {name: string; icon?: string}[];
  onChange: (index: number) => void;
  currentIndex: number | null;
  segmentedControlBackgroundColor?: string;
  activeSegmentBackgroundColor?: string;
  textColor?: string;
  activeTextColor?: string;
  paddingVertical?: number;
};

const segmentWidth = WINDOW_WIDTH - 32;
const shadow = {
  shadowColor: '#000',
  shadowOffset: {width: 0, height: 2},
  shadowOpacity: 0.15,
  shadowRadius: 3,
  elevation: 4,
};

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  tabs,
  onChange,
  currentIndex,
  segmentedControlBackgroundColor = '#E5E5EA',
  activeSegmentBackgroundColor = 'white',
  textColor = 'black',
  activeTextColor = 'black',
  paddingVertical = 8,
}) => {
  const segmentItemWidth = segmentWidth / tabs.length;
  const [tabTranslate] = useState(new Animated.Value(0));

  const handleTabPress = useCallback(
    (index: number) => onChange(index),
    [onChange],
  );

  useEffect(() => {
    if (currentIndex !== null) {
      Animated.spring(tabTranslate, {
        toValue: currentIndex * segmentItemWidth,
        stiffness: 180,
        damping: 20,
        mass: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [currentIndex]);

  return (
    <View
      style={[
        styles.wrapper,
        {backgroundColor: segmentedControlBackgroundColor, paddingVertical},
      ]}>
      {currentIndex !== null && (
        <Animated.View
          style={[
            styles.activeSegment,
            {
              width: segmentItemWidth,
              backgroundColor: activeSegmentBackgroundColor,
              transform: [{translateX: tabTranslate}],
            },
            shadow,
          ]}
        />
      )}
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={styles.PaymentBox}
          onPress={() => handleTabPress(index)}
          activeOpacity={0.7}>
          {tab.icon && (
            <Image
              source={
                // @ts-ignore
                ICONS?.[tab.icon] ?? require('../Assets/Images/dummyImage.png')
              }
              style={styles.PayIcon}
              resizeMode="contain"
            />
          )}
          <Text
            style={[
              styles.text,
              {color: currentIndex === index ? activeTextColor : textColor},
            ]}>
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    width: segmentWidth,
    height: 40,
    gap: 5,
    ...shadow,
  },
  activeSegment: {
    position: 'absolute',
    borderRadius: 8,
    height: 40,
  },
  PaymentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 40,
    gap: 5,
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: FONTS.poppins.regular,
  },
  PayIcon: {
    width: 18,
    height: 18,
  },
});

export default SegmentedControl;
