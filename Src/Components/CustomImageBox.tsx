import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {ImageBoxProps} from '../@types/general';
import {ICONS} from '../Utilities/Icons';

export default function CustomImageBox({
  alt,
  src,
  height = 25,
  width = 25,
  ImageStyle,
  onPress = false,
  resizeMode = 'contain',
  keyData = 1,
  isProfile = false,
}: ImageBoxProps) {
  const [errorImage, setErrorImage] = useState(false);
  return onPress ? (
    <TouchableOpacity onPress={event => onPress?.(event)} key={keyData}>
      <Image
        source={errorImage ? ICONS.DummyImage : src}
        alt={alt}
        width={width}
        height={height}
        resizeMode={resizeMode}
        //@ts-ignore
        style={[styles.defaultStyle, ImageStyle]}
        onError={() => {
          setErrorImage(true);
        }}
      />
    </TouchableOpacity>
  ) : (
    <Image
      key={keyData}
      source={errorImage ? ICONS.DummyImage : src}
      alt={alt}
      width={width}
      height={height}
      resizeMode={resizeMode}
      //@ts-ignore
      style={[styles.defaultStyle, ImageStyle]}
      onError={() => {
        setErrorImage(true);
      }}
    />
  );
}

const styles = StyleSheet.create({
  defaultStyle: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
});
