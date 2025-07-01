import {useState} from 'react';
import {
  Appearance,
  StyleSheet,
  Switch,
  View,
  useColorScheme,
} from 'react-native';

import {useTheme} from '../../hooks/useTheme';

export const DarkmodeToggle = () => {
  const {colors} = useTheme();
  const scheme = useColorScheme();
  const [isEnabled, setIsEnabled] = useState(scheme === 'dark');
  const toggleSwitch = () => {
    scheme === 'dark'
      ? Appearance.setColorScheme('light')
      : Appearance.setColorScheme('dark');
    setIsEnabled(!isEnabled);
  };

  return (
    <Switch
      trackColor={{false: '#767577', true: colors.primary}}
      //thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
      ios_backgroundColor="#3e3e3e"
      onValueChange={toggleSwitch}
      value={isEnabled}
      style={styles.switch}
    />
  );
};

const styles = StyleSheet.create({
  switch: {
    transform: [{scaleX: 0.8}, {scaleY: 0.8}],
  },
});
