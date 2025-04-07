import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import React from 'react';

export const Backdrop = (backdropProps: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop
    {...backdropProps}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
    pressBehavior="close"
  />
);
