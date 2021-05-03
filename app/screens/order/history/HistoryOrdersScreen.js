import React, {Component} from 'react';
import {getOrdersUrl, homeUrl} from '../../../constants/endpoints';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {ActivityIndicator, Button, DataTable} from 'react-native-paper';

class HistoryOrdersScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            orders: [],
            isLoading: true,
        };
    }

    componentDidMount() {
       this.getUserDetail();
    }

    getUserDetail() {
        // získání jména přihlášeného uživatele
        fetch(homeUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((response) => response.json())
            .then((jsonResponse) => {
                const userName = jsonResponse.full_name;
                if (userName !== undefined) {
                    // získání objednávek
                    this.getOrders();
                } else {
                    // načtení Loginu
                    this.props.navigation.push('Login')
                }
            }).catch(() => {
            console.log('Uživatel není přihlášený');
            // načtení Loginu
            this.props.navigation.push('Login')
        });
    }

    getOrders() {
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
            })
            .catch((err) => console.error('Chyba při získání objednávek: ' + err));
    }

    render() {
        let noOrderRender = false;
        let historyOrders = [];
        if (!this.state.isLoading) {
            if (this.state.orders.length === 0) {
                noOrderRender = true;
            }
            historyOrders = this.state.orders.filter((order) => {
                return order.state === 4;
            });

        }
        return (
            <View style={styles.container}>
                <ScrollView>
                <View style={styles.containerWelcome}>
                    <Text style={styles.welcome}>PickNGo - Vaše objednávky</Text>
                </View>
                {this.state.isLoading ? <ActivityIndicator size='large' color='green'/> :
                    <View>
                        {noOrderRender ?
                            <Text style={styles.textInfoLarge}>Nemáte žádnou historii objednávek</Text> :
                            <View>
                                {historyOrders.map((order, index) => {
                                    return (
                                        <View key={index} style={styles.orderContainer}>
                                            <Header/>
                                            <DataTable.Row>
                                                <View style={{width: 100}}><Text>{order.date}</Text></View>
                                                <DataTable.Cell>{order.price} Kč</DataTable.Cell>

                                                    <Button style={{margin: 5}} contentStyle={{padding: 2}} mode="contained" color="blue"
                                                            onPress={() => this.props.navigation
                                                                .navigate('HistoryOrderDetail',
                                                                    {orderId: order.id})}>Náhled</Button>
                                            </DataTable.Row>
                                        </View>
                                    );
                                })}
                            </View>
                        }
                        <Button style={{margin: 2}} contentStyle={{padding: 2}} mode="contained"
                                color="blue"
                                onPress={() => this.props.navigation.navigate('Home')}>Návrat do menu</Button>
                    </View>
                }
                </ScrollView>
            </View>
        );
    }
}

const Header = () => (
    <DataTable.Header>
        <DataTable.Title style={{width: 200}}>Datum</DataTable.Title>
        <DataTable.Title>Cena</DataTable.Title>
        <DataTable.Title>Detail</DataTable.Title>
    </DataTable.Header>
);

export default HistoryOrdersScreen;

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
    orderContainer: {
        marginTop: 5,
        paddingBottom: 15
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
        margin: 20,
        fontWeight: 'bold',
        color: 'black',
    },
});
