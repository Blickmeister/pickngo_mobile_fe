import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

export const CircleButton = props => (
    <TouchableOpacity
        style={{
            marginLeft: props.marginLeft,
            marginRight: props.marginRight,
            height: props.size,
            width: props.size,
            backgroundColor: props.color,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: props.size * 2,
        }}
        disabled = {props.disable}
        onPress = {props.onPress}>
        <Text style={{color: props.textColor, fontSize: props.fontSize}}>
            {props.text}
        </Text>
    </TouchableOpacity>
);
