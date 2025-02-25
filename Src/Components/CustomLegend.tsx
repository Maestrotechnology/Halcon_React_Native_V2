import React from 'react';
import {Text, View} from 'react-native';
import {DotProps, LegendItemProps} from '../@types/general';
import {COLORS, FONTSIZES} from '../Utilities/Constants';
import {FONTS} from '../Utilities/Fonts';

export default function CustomLegend({legendList}: {legendList: any[]}) {
  const Dot: React.FC<DotProps> = ({color}) => (
    <View
      style={{
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: color,
        marginRight: 10,
      }}
    />
  );

  const LegendItem: React.FC<LegendItemProps> = ({color, label}) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
      }}>
      <Dot color={color} />
      <Text
        style={{
          color: COLORS.darkBlue,
          fontFamily: FONTS.poppins.regular,
          fontSize: FONTSIZES.tiny,
        }}>
        {label}
      </Text>
    </View>
  );
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
        marginTop: 10,
        flexWrap: 'wrap',
      }}>
      {legendList?.map(item => {
        return <LegendItem color={item.color} label={item.label} />;
      })}
    </View>
  );
}
