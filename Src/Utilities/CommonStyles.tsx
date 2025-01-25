import {StyleSheet} from 'react-native';
import {COLORS} from './Constants';
import {FONTS} from './Fonts';

export const CommonStyles = StyleSheet.create({
  headerText: {
    fontSize: 19,
    fontWeight: '600',
    color: COLORS.white,
    fontFamily: FONTS.poppins.medium,
  },
  loginHeader: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: FONTS.poppins.semibold,
    color: 'rgba(0, 0, 0, 0.85)',
    textAlign: 'left',
    paddingBottom: 20,
  },
  w100: {
    width: '100%',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
