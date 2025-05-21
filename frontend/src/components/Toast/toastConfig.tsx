import React from 'react';

import {BaseToastProps} from 'react-native-toast-message';

import {ErrorToast} from './ErrorToast';
import {SuccessToast} from './SuccessToast';

export const toastConfig = {
  success: (props: BaseToastProps) => <SuccessToast {...props} />,
  error: (props: BaseToastProps) => <ErrorToast {...props} />,
};
