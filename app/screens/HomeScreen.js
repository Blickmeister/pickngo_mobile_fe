import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_USER_KEY} from './LoginScreen';

class HomeScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            actualOrderId: '',
            user: ''
        }
    }

    componentDidMount() {
        (async () => {
            await this.retrieveData();
        })();
        if (this.props.route.params !== undefined) {
            this.setState({actualOrderId: this.props.route.params.orderId})
        }
    }

    retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem(ASYNC_STORAGE_USER_KEY);
            if (value !== null) {
                console.log('VALUE: ' + value);
                this.setState(() => ({user: value}));
            }
        } catch (e) {
            // error reading value
            console.log('READ ERROR: ' + e);
        }
    };

    render() {
        let definedUser = this.state.user !== undefined;
        return (
            <ImageBackground source={require('../resources/bc_menu.jpg')} style={styles.image}>
            <View style={styles.container}>
                <Text style={styles.welcome}>Vítejte v aplikaci PickNGo</Text>
                {definedUser && <Text style={styles.textCenter}>Přihlášený uživatel: {this.state.user}</Text>}
                <View style={styles.optionsContainer}>
                    <View style={styles.optionButton}>
                        <Button title="Objednat bagetu" color='#009387' onPress={() => this.props.navigation.push('CreateBaguette')}/>
                    </View>
                    <View style={styles.optionButton}>
                        <Button title="Akční nabídka" color='#009387' onPress={() => this.props.navigation.push('SpecialOffers')}/>
                    </View>
                </View>
                <View style={styles.optionsContainer}>
                    <View style={styles.optionButton}>
                        <Button title="Aktivní objednávky" color='#009387' onPress={() => this.props.navigation
                            .push('ActualOrdersState')}/>
                    </View>
                    <View style={styles.optionButton}>
                        <Button title="Historie objednávek" color='#009387' onPress={() => this.props.navigation
                            .push('HistoryOrders')}/>
                    </View>
                </View>
                <View style={styles.optionsContainer}>
                    <View style={styles.lastOptionButton}>
                        <Button title="Slevové kupóny" color='#009387'/>
                    </View>
                </View>

            </View>
            </ImageBackground>
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
        fontSize: 25,
        textAlign: 'center',
        margin: 10,
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: -2, height: 2},
        textShadowRadius: 40,
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
        marginBottom: 60,
    },
    optionsContainer: {
        flexDirection: "row"
    },
    textCenter: {
        fontSize: 15,
        textAlign: 'center',
        color: 'white',
        marginBottom: 50,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: -2, height: 2},
        textShadowRadius: 40,
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
});
