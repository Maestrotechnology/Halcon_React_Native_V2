import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {FONTS} from '../Utilities/Fonts';
import {COLORS, FONTSIZES} from '../Utilities/Constants';
import {StyledTextProps} from '../@types/general';

const StyledText = ({
  children,
  style,
  textProps,
  onPress,
  textMode = 'normal',
  readMoreButtonTextStyle,
  numberOfLines = 0,
}: StyledTextProps) => {
  const [lengthMore, setLengthMore] = useState<boolean>(false);
  const [isEnableFullText, setisEnableFullText] = useState<boolean>(false);
  const [textLength, settextLength] = useState<number>(1);

  const onTextLayout = useCallback((e: any) => {
    settextLength(e.nativeEvent.lines.length);
    setLengthMore(e.nativeEvent.lines.length > numberOfLines);
  }, []);

  const getStyle = () => {
    if (style) {
      if (Array.isArray(style)) {
        return [styles.defaultTextStyle, ...style];
      }
      return [styles.defaultTextStyle, style];
    }
    return styles.defaultTextStyle;
  };

  const TextComponent = () => {
    switch (textMode) {
      case 'normal':
        return renderText();
      case 'read_more':
        return renderReadMoreText();
      default:
        return;
    }
  };

  const renderText = () => {
    return (
      <Text
        {...textProps}
        style={[styles.defaultTextStyle, style]}
        onPress={onPress}>
        {children}
      </Text>
    );
  };

  const renderReadMoreText = () => {
    return (
      <View>
        {lengthMore ? (
          isEnableFullText ? (
            <Text
              textBreakStrategy="simple"
              style={[getStyle(), {height: 20.5 * textLength}]}
              onPress={onPress}>
              {children}
            </Text>
          ) : (
            <Text
              numberOfLines={numberOfLines}
              style={getStyle()}
              onPress={onPress}>
              {children}
            </Text>
          )
        ) : (
          <Text
            onTextLayout={onTextLayout}
            style={getStyle()}
            onPress={onPress}>
            {children}
          </Text>
        )}

        {lengthMore ? (
          <Text
            style={[
              styles.defaultTextStyle,
              {color: COLORS.primary, ...readMoreButtonTextStyle},
            ]}
            onPress={() => setisEnableFullText(pre => !pre)}>
            {isEnableFullText ? 'Read less' : 'Read more'}
          </Text>
        ) : null}
      </View>
    );
  };

  return TextComponent();
};

export default StyledText;

const styles = StyleSheet.create({
  defaultTextStyle: {
    fontFamily: FONTS.poppins.regular,
    color: COLORS.black,
    fontSize: FONTSIZES.small,
  },
});
