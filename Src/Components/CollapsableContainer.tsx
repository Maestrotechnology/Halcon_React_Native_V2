import React, {useState, useEffect, memo} from 'react';
import {LayoutChangeEvent, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface CollapsableContainerProps {
  children: React.ReactNode;
  expanded: boolean;
}

const CollapsableContainer = memo(
  ({children, expanded}: CollapsableContainerProps) => {
    const [measuredHeight, setMeasuredHeight] = useState(0);
    const animatedHeight = useSharedValue(0);

    useEffect(() => {
      animatedHeight.value = withTiming(expanded ? measuredHeight : 0, {
        duration: 300,
      });
    }, [expanded, measuredHeight]);

    const onLayout = (event: LayoutChangeEvent) => {
      const newHeight = event.nativeEvent.layout.height;
      if (newHeight > 0 && measuredHeight !== newHeight) {
        setMeasuredHeight(newHeight);
      }
    };

    const collapsableStyle = useAnimatedStyle(() => ({
      height: animatedHeight.value,
    }));

    return (
      <Animated.View style={[collapsableStyle, {overflow: 'hidden'}]}>
        <View style={{position: 'absolute', width: '100%'}} onLayout={onLayout}>
          {children}
        </View>
      </Animated.View>
    );
  },
  (prevProps, nextProps) => prevProps.expanded === nextProps.expanded,
);

export default CollapsableContainer;
