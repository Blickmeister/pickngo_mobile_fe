import * as React from 'react';
import HomeScreen from '../../screens/HomeScreen';
import ActualOrdersStateScreen from '../../screens/order/actual/ActualOrdersStateScreen';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../../screens/LoginScreen';
import CreateBaguetteScreen from '../../screens/order/actual/CreateBaguetteScreen';
import OrderSummaryScreen from '../../screens/order/actual/OrderSummaryScreen';
import UpdateBaguetteScreen from '../../screens/order/actual/UpdateBaguetteScreen';
import HistoryOrdersScreen from '../../screens/order/history/HistoryOrdersScreen';
import HistoryOrderDetailScreen from '../../screens/order/history/HistoryOrderDetailScreen';

const Stack = createStackNavigator();

export const AppMainNavigator = () => (
    <Stack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: '#009387'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                alignSelf: 'center'
            }
        }}
        initialRouteName="Login">
        <Stack.Screen options={{title:"Přihlášení"}} name="Login" component={LoginScreen}/>
        <Stack.Screen options={{title:"Domovská stránka", headerLeft: null}} name="Home" component={HomeScreen}/>
        <Stack.Screen options={{title:"Vytvořit bagetu"}} name="CreateBaguette" component={CreateBaguetteScreen} />
        <Stack.Screen options={{title:"Souhrn objednávky"}} name="OrderSummary" component={OrderSummaryScreen}/>
        <Stack.Screen options={{title:"Úprava objednávky"}} name="UpdateBaguette" component={UpdateBaguetteScreen}/>
        <Stack.Screen options={{title:"Aktivní objednávky"}} name="ActualOrdersState" component={ActualOrdersStateScreen}/>
        <Stack.Screen options={{title:"Historie objednávek"}} name="HistoryOrders" component={HistoryOrdersScreen}/>
        <Stack.Screen options={{title:"Detail objednávky"}} name="HistoryOrderDetail" component={HistoryOrderDetailScreen}/>
    </Stack.Navigator>
);
