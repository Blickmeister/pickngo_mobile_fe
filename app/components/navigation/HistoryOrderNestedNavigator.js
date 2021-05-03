import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../../screens/LoginScreen';
import HistoryOrdersScreen from '../../screens/order/history/HistoryOrdersScreen';
import HistoryOrderDetailScreen from '../../screens/order/history/HistoryOrderDetailScreen';

const Stack = createStackNavigator();
export const HistoryOrderNestedNavigator = () => (
    <Stack.Navigator screenOptions={{
        headerShown: false
    }}>
        <Stack.Screen name="Login" component={LoginScreen} initialParams={{forwardPage: 'HistoryOrders'}} />
        <Stack.Screen name="HistoryOrders" component={HistoryOrdersScreen} />
        <Stack.Screen name="HistoryOrderDetail" component={HistoryOrderDetailScreen}/>
    </Stack.Navigator>
);
