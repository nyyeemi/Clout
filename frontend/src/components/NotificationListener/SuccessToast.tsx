import React from 'react';

import {BaseToastLayout} from './BaseToastLayout';

export const SuccessToast = ({text1}: {text1: string}) => {
  return <BaseToastLayout text1={text1} barColor="#28a745" emoji="✅" />;
};
