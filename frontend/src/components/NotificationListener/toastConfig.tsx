import React from 'react';

import {ErrorToast} from './ErrorToast';
import {SuccessToast} from './SuccessToast';

export const toastConfig = {
  success: props => <SuccessToast {...props} />,
  error: props => <ErrorToast {...props} />,
};
