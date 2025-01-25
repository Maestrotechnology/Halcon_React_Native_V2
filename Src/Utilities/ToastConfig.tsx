import {Text, View} from 'react-native';
import {BOX_SHADOW, COLORS} from './Constants';
import {CustomToastProps, TomatoToastprops} from './Types';
import {ICONS} from './Icons';
import StyledText from '../Components/StyledText';

const CustomToast = ({text = '', toastType}: CustomToastProps) => {
  const Icon = toastType === 'success' ? ICONS.successIcon : ICONS.failureIcon;
  return (
    <View
      style={{
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          borderRadius: 15,
          backgroundColor: COLORS.white,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 15,
          paddingVertical: 8,

          ...BOX_SHADOW,
        }}>
        {(toastType === 'success' || toastType === 'error') && (
          <View
            style={{
              backgroundColor:
                toastType === 'success' ? COLORS.green : COLORS.red,
              height: 20,
              width: 20,
              borderRadius: 10,
              alignItems: 'center',
              marginRight: 5,
              padding: 5,
              justifyContent: 'center',
            }}>
            <Icon
              height={toastType === 'success' ? 20 : 10}
              width={toastType === 'success' ? 20 : 10}
              fill={COLORS.white}
            />
          </View>
        )}
        <StyledText>{text}</StyledText>
      </View>
    </View>
  );
};

const ToastConfig = {
  tomatoToast: ({text1, props}: TomatoToastprops) => (
    <CustomToast text={text1} toastType={props.toastType} />
  ),
};

export default ToastConfig;
