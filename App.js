/**
 * React Native PickNGo App
 * MOIS FIM UHK Project
 * https://github.com/facebook/react-native
 * @author Bc. Ondřej Schneider
 * @author design: Bc. Matěj Vítek
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {AppMainNavigator} from './app/components/navigation/AppNavigator';

export default function App() {
    return (
        <NavigationContainer>
            <AppMainNavigator/>
        </NavigationContainer>
    );
}



