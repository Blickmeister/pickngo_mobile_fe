import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CreateBaguetteScreen from '../../screens/order/actual/CreateBaguetteScreen';
import LoginScreen from '../../screens/LoginScreen';
import OrderSummaryScreen from '../../screens/order/actual/OrderSummaryScreen';
import UpdateBaguetteScreen from '../../screens/order/actual/UpdateBaguetteScreen';

const Stack = createStackNavigator();
export const MakeOrderNestedNavigator = () => (
    <Stack.Navigator screenOptions={{
        headerShown: false
    }}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="CreateBaguette" component={CreateBaguetteScreen} />
        <Stack.Screen name="OrderSummary" component={OrderSummaryScreen}/>
        <Stack.Screen name="UpdateBaguette" component={UpdateBaguetteScreen}/>
    </Stack.Navigator>
);

