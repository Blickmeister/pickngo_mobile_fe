/**
 * React Native PickNGo App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './app/screens/HomeScreen';

import Icon from 'react-native-vector-icons/Ionicons';
import {MakeOrderNestedNavigator} from './app/components/navigation/MakeOrderNestedNavigator';
import ActualOrderStateScreen from './app/screens/ActualOrderStateScreen';
import LoginScreen from './app/screens/LoginScreen';
import CreateBaguetteScreen from './app/screens/CreateBaguetteScreen';
import OrderSummaryScreen from './app/screens/OrderSummaryScreen';
import UpdateBaguetteScreen from './app/screens/UpdateBaguetteScreen';

/*const HomeStack = createStackNavigator();
const MakeOrderStack = createStackNavigator();
const ActualOrderStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStackScreen = ({navigation}) => (
    <HomeStack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: '#009387'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold'
        }
    }}>
    <HomeStack.Screen name="Home" component={HomeScreen} options={{
        title: 'Domovská stránka',
        headerLeft: () => (
            <Icon.Button name="md-bulb" size={25} backgroundColor='#009387' onPress={() => navigation.openDrawer()}/>
        )
    }} />
    </HomeStack.Navigator>
);

const MakeOrderStackScreen = ({navigation}) => (
    <MakeOrderStack.Navigator screenOptions={{
        headerStyle: {
            backgroundColor: '#009387'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold'
        }
    }}>
        <MakeOrderStack.Screen name="MakeOrder" component={MakeOrderNestedNavigator} options={{
            title: 'Objednávka bagety',
            headerLeft: () => (
                <Icon.Button name="md-bulb" size={25} backgroundColor='#009387' onPress={() => navigation.openDrawer()}/>
            )
        }} />
    </MakeOrderStack.Navigator>
);

const ActualOrderStackScreen = ({navigation}) => (
    <ActualOrderStack.Navigator screenOptions={{
        headerStyle: {
            backgroundColor: '#009387'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold'
        }
    }}>
        <ActualOrderStack.Screen name="ActualOrderState" component={ActualOrderStateScreen} options={{
            title: 'Aktivní objednávka',
            headerLeft: () => (
                <Icon.Button name="md-bulb" size={25} backgroundColor='#009387' onPress={() => navigation.openDrawer()}/>
            )
        }} />
    </ActualOrderStack.Navigator>
);

export default function App() {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen title="Domovská stránka" name="Home" component={HomeStackScreen} />
                <Drawer.Screen title="Vytvořit bagetu" name="MakeOrder" component={MakeOrderStackScreen}/>
                <Drawer.Screen title="Aktivní objednávka" name="ActualOrderState" component={ActualOrderStackScreen}/>
            </Drawer.Navigator>
        </NavigationContainer>
    );
}*/
const Stack = createStackNavigator();
export default function App() {
    return (
        <NavigationContainer>
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
                initialRouteName="Home">
                <Stack.Screen options={{title:"Domovská stránka"}} name="Home" component={HomeScreen} />
                <Stack.Screen options={{title:"Vytvořit bagetu"}} name="MakeOrder" component={MakeOrderNestedNavigator} />
                <Stack.Screen options={{title:"Aktivní objednávka"}} name="ActualOrderState" component={ActualOrderStateScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}



