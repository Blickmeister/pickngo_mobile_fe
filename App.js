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
import {AppMainNavigator} from './app/components/navigation/AppNavigator';

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
        <ActualOrderStack.Screen name="ActualOrderState" component={ActualOrdersStateScreen} options={{
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
export default function App() {
    return (
        <NavigationContainer>
            <AppMainNavigator/>
        </NavigationContainer>
    );
}



