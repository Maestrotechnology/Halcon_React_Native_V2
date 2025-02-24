import React, {useEffect, useCallback, useState} from 'react';
import {
  Animated,
  Dimensions,
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
  tabs: {name: string}[];
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
  shadowOpacity: 0.23,
  shadowRadius: 2.62,
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
  paddingVertical = 12,
}) => {
  const translateValue = (segmentWidth - 4) / tabs.length;
  const [tabTranslate] = useState(new Animated.Value(0));

  const handleTabPress = useCallback(
    (index: number) => onChange(index),
    [onChange],
  );

  useEffect(() => {
    if (currentIndex !== null) {
      Animated.spring(tabTranslate, {
        toValue: currentIndex * translateValue,
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
        {backgroundColor: segmentedControlBackgroundColor},
      ]}>
      {currentIndex !== null && (
        <Animated.View
          style={[
            styles.activeSegment,
            {
              width: translateValue,
              backgroundColor: activeSegmentBackgroundColor,
              transform: [{translateX: tabTranslate}],
            },
            shadow,
          ]}
        />
      )}
      {tabs.map((tab, index) => {
        return (
          <TouchableOpacity
            key={index}
            style={styles.PaymentBox}
            onPress={() => {
              handleTabPress(index);
            }}
            activeOpacity={0.7}>
            <Image
              // @ts-ignore
              source={ICONS?.[tab?.icon]}
              style={styles.PayIcon}
              alt="Product"
              resizeMode="contain"
            />
            <Text
              style={[
                styles.text,
                {color: currentIndex === index ? activeTextColor : textColor},
              ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    width: '100%',
    height: 40,
    gap: 5,
    ...shadow,
  },
  activeSegment: {
    position: 'absolute',
    height: '100%',
    borderRadius: 8,
  },
  PaymentBox: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 40,
  },
  text: {
    fontSize: 10,
    textAlign: 'center',
    fontFamily: FONTS.poppins.regular,
    verticalAlign: 'middle',
  },
  PayIcon: {
    width: 15,
    height: 15,
  },
});

export default SegmentedControl;
