import React, {Component} from 'react';
import {Text, View, StyleSheet, ActivityIndicator, ScrollView, ImageBackground} from 'react-native';
import {homeUrl, getOrdersUrl} from '../../../constants/endpoints';
import ActualOrdersDataComponent from '../../../components/baguette/actual/ActualOrdersDataComponent';
import {Button} from 'react-native-paper';
let intervalId;

class ActualOrdersStateScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            orders: [],
        };
    }

    componentDidMount() {
        // při každém načtení stránky (komponenty)
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            // ověření, zda je uživatel lognutý -> jinak nejde žádný HTTP req
            this.getUserDetail();
        });
    }

    getUserDetail() {
        // získání jména přihlášeného uživatele
        fetch(homeUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then((response) => response.json())
            .then((jsonResponse) => {
                const userName = jsonResponse.full_name;
                if (userName !== undefined) {
                    this.getData();
                    // získání dat ze serveru každých 10 vteřin
                    intervalId = setInterval(this.getData, 10000);

                } else {
                    // načtení Loginu
                    this.props.navigation.navigate('Login');
                }
            }).catch((err) => {
            console.log('Uživatel není přihlášený: ' + err);
            // načtení Loginu
            this.props.navigation.navigate('Login');
        });
    }

    getData = () => {
        fetch(getOrdersUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then((response) => response.json())
            .then((jsonResponse) => {
                this.setState({orders: jsonResponse, isLoading: false});
                console.log('tik');
            })
            .catch((err) => console.error('Chyba při získání objednávek: ' + err));
    };

    componentWillUnmount() {
        // odregistrování listeneru pro event při stisknutí zpětného tlačítka
        this._unsubscribe();
        console.log('int id: ' + intervalId);
        clearInterval(intervalId);
    }

    goHome = () => {
        clearInterval(intervalId);
        this.props.navigation.push('Home');
    };

    render() {
        let activeOrders = [];
        const image = { uri: "https://image.freepik.com/free-vector/white-abstract-background-theme_23-2148830884.jpg" };
        if (!this.state.isLoading) {
            activeOrders = this.state.orders.filter((order) => {
                return order.state === 1 || order.state === 2 || order.state === 3;
            });
        }
        if (activeOrders.length === 0) {
            return (
                <View style={styles.container}>
                    <ImageBackground source={image} style={styles.image}>
                    <View style={styles.containerWelcome}>
                        <Text style={styles.welcome}>PickNGo</Text>
                        {this.state.isLoading ? <ActivityIndicator size='large' color='green'/> :
                            <View>
                                <Text style={styles.textInfoLarge}>Momentálně nemáte aktivní žádnou objednávku</Text>
                                <Button style={{marginTop: 20}} contentStyle={{padding: 2}} mode="contained"
                                        color="blue"
                                        onPress={() => this.props.navigation.navigate('Home')}>Návrat do menu</Button>
                            </View>
                        }
                    </View>
                    </ImageBackground>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
            <ImageBackground source={image} style={styles.image}>
                    <ScrollView>
                        <View style={styles.containerWelcome}>
                            <Text style={styles.welcome}>PickNGo - Vaše aktuální objednávky</Text>
                        </View>
                        {this.state.isLoading ? <ActivityIndicator size='large' color='green'/> :
                            <View>
                                {activeOrders.map((order, index) => {
                                    return (
                                        <ActualOrdersDataComponent key={index} orderId={order.id}
                                                                   orderState={order.state}/>
                                    );
                                })}
                                <Button style={{marginTop: 20}} contentStyle={{padding: 2}} mode="contained" color="blue"
                                        onPress={this.goHome}>Zpět na hlavní stránku</Button>
                            </View>
                        }
                    </ScrollView>
            </ImageBackground>
                </View>
            );
        }
    }
}

export default ActualOrdersStateScreen;

// stylizace
const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        backgroundColor: "#eaeaea"
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
    textInfoLarge: {
        fontSize: 20,
        textAlign: 'center',
        margin: 15,
        fontWeight: 'bold',
        color: 'black',
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
});
