import {useTheme as useNavTheme} from '@react-navigation/native';

import {ExtendedTheme} from '../components/ui/themes';

export const useTheme = () => useNavTheme() as ExtendedTheme;
