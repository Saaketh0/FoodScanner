
import React from 'react';

import { View, ViewProps } from 'react-native';



type ThemedViewProps = ViewProps & {

  style?: ViewProps['style'];

};



export function ThemedView({ style, ...props }: ThemedViewProps) {

  return <View style={style} {...props} />;

}
