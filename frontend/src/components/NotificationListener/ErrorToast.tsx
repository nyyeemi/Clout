import React from 'react';

import {BaseToastLayout} from './BaseToastLayout';

export const ErrorToast = ({text1}: {text1: string}) => {
  return <BaseToastLayout text1={text1} barColor="#dc3545" emoji="❌" />;
};
