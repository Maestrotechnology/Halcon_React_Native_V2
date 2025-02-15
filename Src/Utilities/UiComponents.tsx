import {View} from 'react-native';
import StyledText from '../Components/StyledText';
import {COLORS} from './Constants';
import {FONTS} from './Fonts';

export const renderTitleText = (title: string) => {
  return (
    <View style={{marginBottom: 7}}>
      <StyledText
        style={{
          fontFamily: FONTS.poppins.semibold,
        }}>
        {title}
      </StyledText>
      <View
        style={{
          width: title.length * 5,
          height: 3,
          backgroundColor: COLORS.primary,
        }}></View>
    </View>
  );
};
