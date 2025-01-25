import {TouchableOpacity} from 'react-native';
import React from 'react';
import {SVGIconProps} from '../@types/general';
import {ICONS} from '../Utilities/Icons';

const SVGIcon = ({
  height = 25,
  width = 25,
  icon,
  marginLeft = 0,
  isButton = false,
  onPress,
  marginBottom,
  fill = 'none',
  padding = 5,
  paddingRight,
  marginTop,
  marginRight,
}: SVGIconProps) => {
  const Icon = icon ? ICONS[icon] : false;
  return Icon ? (
    <TouchableOpacity
      //@ts-ignore
      style={{
        marginLeft,
        marginBottom,
        padding,
        paddingRight,
        marginTop,
        marginRight,
      }}
      disabled={!isButton}
      activeOpacity={0.7}
      onPress={onPress}>
      <Icon height={height} width={width} fill={fill} />
    </TouchableOpacity>
  ) : (
    <></>
  );
};

export default SVGIcon;
