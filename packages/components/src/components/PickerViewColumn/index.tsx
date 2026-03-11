import * as React from 'react';

import { View } from 'react-native';

const PickerViewColumn = (props: Record<string, unknown>): JSX.Element => {
  return <View {...props} />;
};

PickerViewColumn.defaultProps = {
  mode: 'selector',
};

export default PickerViewColumn;
