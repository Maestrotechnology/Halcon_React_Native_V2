import {ActivityIndicator, StyleSheet, View} from 'react-native';
import React from 'react';
import {COLORS, FONTSIZES} from '../Utilities/Constants';
import {LoaderProps} from './types';
import StyledText from './StyledText';

const Loader = ({
  isVisible = false,
  text = '',
  color = COLORS.primary,
  backgroundColor = 'rgba(0,0,0,0.3)',
}: LoaderProps) => {
  return isVisible ? (
    <View style={[styles.container, {backgroundColor}]}>
      <ActivityIndicator size={'large'} color={color} />
      {text && (
        <StyledText style={{color: COLORS.white, fontSize: FONTSIZES.small}}>
          {text}
        </StyledText>
      )}
    </View>
  ) : null;
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 10000,
  },
});
