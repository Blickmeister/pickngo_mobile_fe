import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {getBaguetteOrderDetailUrl} from '../constants/endpoints';
import {ActivityIndicator, Button} from 'react-native-paper';

class ActualOrderStateScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            orderStateFromServer: '',
            orderStateForView: '',
            isLoading: true,
            beforeFirstOrder: false
        };
    }

    componentDidMount() {
        // při každém načtení stránky (komponenty)
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            // z menu před 1. objednávkou
            console.log(this.props.route.params);
            if (this.props.route.params.orderId === 'nic') {
                this.setState({beforeFirstOrder: true})
            } else {
                this.getData();
                // získání dat ze serveru každých 10 vteřin
                setInterval(this.getData, 10000);
            }
        });
    }

    getData = () => {
        fetch(getBaguetteOrderDetailUrl + this.props.state.params.orderId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then((response) => response.json())
            .then((jsonResponse) => {
                this.setState({orderStateFromServer: jsonResponse.state, isLoading: false});
                console.log('orderStateFromServer: ' + jsonResponse.state);
            }).catch((err) => console.error(err));
    };

    componentWillUnmount() {
        // odregistrování listeneru pro event při stisknutí zpětného tlačítka
        this._unsubscribe();
    }

    render() {
        if (this.state.beforeFirstOrder) {
            return (
                <View style={styles.container}>
                    <View style={styles.containerWelcome}>
                        <Text style={styles.welcome}>PickNGo</Text>
                        <Text style={styles.textInfoLarge}>Ještě jste si neobjednali žádnou objednávku</Text>
                    </View>
                </View>
            )
        } else {
            let stateText = '';
            let renderId = true;
            if (!this.state.isLoading) {
                // převod state number na text
                let state = this.state.orderStateFromServer;
                if (state === 1) {
                    stateText = 'Objednávka čeká na potvrzení';
                } else if (state === 2) {
                    stateText = 'Objednávka je potvrzena a připravuje se';
                } else if (state === 3) {
                    stateText = 'Objednávka je dokončena a čeká na vyzvednutí';
                } else if (state === 4) {
                    renderId = false;
                    stateText = 'Nemáte žádnou akutální objednávku';
                }
            }
            return (
                <View style={styles.container}>
                    <View style={styles.containerWelcome}>
                        <Text style={styles.welcome}>PickNGo - Vaše aktuální objednávka</Text>
                    </View>
                    {this.state.isLoading ? <ActivityIndicator size='large' color='green'/> :
                        <View>
                            {renderId &&
                            <View style={styles.containerStateCenter}>
                                <Text style={styles.textCommon}>Číslo Vaši objednávky</Text>
                                <Text style={styles.textOrderId}>{this.props.state.params.orderId}</Text>
                            </View>
                            }
                            <View style={styles.containerStateCenter}>
                                <Text style={styles.textCommon}>Stav Vaši objednávky</Text>
                                <Text style={styles.textOrderId}>{stateText}</Text>
                            </View>
                            <Button contentStyle={{padding: 2}} mode="contained" color="blue"
                                    onPress={() => this.props.navigation
                                        .navigate('Home',
                                            {orderId: this.props.state.params.orderId})}>Zpět na hlavní stránku</Button>
                        </View>
                    }
                </View>
            );
        }
    }

}

export default ActualOrderStateScreen;

// stylizace
const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
    },
    containerWelcome: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -10,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: 'black',
    },
    containerStateCenter: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    textOrderId: {
        fontSize: 30,
        textAlign: 'center',
        margin: 5,
        color: 'black',
        fontWeight: 'bold',
    },
    textCommon: {
        textAlign: 'center',
        margin: 2,
    },
    textInfoLarge: {
        textAlign: 'center',
        margin: 20,
        fontWeight: 'bold',
        fontSize: 20
    }
});
