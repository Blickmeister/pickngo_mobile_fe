import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';

class HomeScreen extends Component {

    login() {
        fetch('https:/pickngo-be.azurewebsites.net/detail', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then((response) => response.json())
            .then((jsonResponse) => {
                console.log(jsonResponse.full_name);
                console.log('response: ' + jsonResponse);
            }).catch((err) => console.error(err));
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Vítejte v aplikaci PickNGo</Text>
                <View style={styles.optionsContainer}>
                    <View style={styles.optionButton}>
                        <Button title="Objednat bagetu" color='#009387' onPress={() => this.props.navigation.navigate('MakeOrder')}/>
                    </View>
                    <View style={styles.optionButton}>
                        <Button title="Akční nabídka" color='#009387' onPress={() => this.login()}/>
                    </View>
                </View>
                <View style={styles.optionsContainer}>
                    <View style={styles.optionButton}>
                        <Button title="Slevové kupóny" color='#009387' onPress={() => this.props.navigation.navigate('#')}/>
                    </View>
                    <View style={styles.optionButton}>
                        <Button title="Moje objednávky" color='#009387' onPress={() => this.login()}/>
                    </View>
                </View>
                <View style={styles.optionsContainer}>
                    <View style={styles.lastOptionButton}>
                        <Button title="Odhlásit se" color='#009387' onPress={() => this.props.navigation.navigate('#')}/>
                    </View>
                </View>

            </View>
        );
    }
}

export default HomeScreen;

// stylizace
const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: 'black',
    },
    contentContainer: {
        borderWidth: 5,
        borderColor: 'black',
        flex: 1,
        width: 330,
        height: 420,
    },
    optionButton: {
        width: 110,
        height: 60,
        margin: 10,
    },
    lastOptionButton: {
      width: 240,
    },
    optionsContainer: {
        flexDirection: "row"
    }
});
