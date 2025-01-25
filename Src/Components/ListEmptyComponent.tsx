import {StyleSheet, View} from 'react-native';
import React from 'react';
import StyledText from './StyledText';
import {COLORS} from '../Utilities/Constants';
import {ListEmptyComponentProps} from './types';

const ListEmptyComponent = ({
  errorText = 'No data found',
  alignItems = 'center',
}: ListEmptyComponentProps) => {
  return (
    <View style={[styles.container, {alignItems: alignItems}]}>
      <StyledText style={{color: COLORS.hashColor, fontSize: 13}}>
        {errorText}
      </StyledText>
    </View>
  );
};

export default ListEmptyComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
});
