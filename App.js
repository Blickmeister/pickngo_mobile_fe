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
import {CookiesProvider} from 'react-cookie';

import {MakeOrderNestedNavigator} from './app/components/navigation/MakeOrderNestedNavigator';

const HomeStack = createStackNavigator();
const MakeOrderStack = createStackNavigator();
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

const MakeOrderScreen = ({navigation}) => (
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

export default function App() {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={HomeStackScreen} />
                <Drawer.Screen title="Vytvořit bagetu " name="MakeOrder" component={MakeOrderScreen}/>
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

