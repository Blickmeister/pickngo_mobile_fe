import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CreateBaguetteScreen from '../../screens/CreateBaguetteScreen';
import LoginScreen from '../../screens/LoginScreen';

const Stack = createStackNavigator();
export const MakeOrderNestedNavigator = () => (
    <Stack.Navigator screenOptions={{
        headerShown: false
    }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateBaguette" component={CreateBaguetteScreen} />
    </Stack.Navigator>
);

