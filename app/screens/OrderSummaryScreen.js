import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {
    confirmBaguetteOrderUrl,
    getBaguetteOrderDetailUrl,
    removeBaguetteItemUrl,
    updateBaguetteOrderUrl,
} from '../constants/endpoints';
import {ActivityIndicator, DataTable, Button, TextInput} from 'react-native-paper';

class OrderSummaryScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            order: {},
            isLoading: true,
            note: '',
        };
    }

    componentDidMount() {
        // získání objednávky
        this.getOrderById();
    }

    getOrderById() {
        fetch(getBaguetteOrderDetailUrl + this.props.route.params.orderId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then((response) => response.json())
            .then((jsonResponse) => {
                this.setState({order: jsonResponse, isLoading: false});
                console.log(jsonResponse.id);
            })
            .catch((err) => console.error('Chyba při získání typů ingrediencí: ' + err));
    }

    deleteBaguetteHandler = () => {
        fetch(removeBaguetteItemUrl + this.state.order.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Bageta úspěšně smazána');
                } else {
                    response.json()
                        .then((jsonResponse) =>
                            console.error('Bagetu se nepodařilo smazat: ' + jsonResponse.message));
                }
            })
            .catch((error) => console.error('Bagetu se nepodařilo smazat: ' + error));
    };

    onSubmitHandler = () => {
        // odeslání objednávky
        this.sendBaguetteOrder();
    };

    sendBaguetteOrder() {
        // odeslání poznámky na BE
        const requestParam = '?note=' + this.state.note;
        fetch(updateBaguetteOrderUrl + this.state.order.id + requestParam, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Úspěšný edit objednávky na serveru');
                    // odeslání (potvrzení) kompletní objednávky
                    this.confirmBaguetteOrder();
                } else {
                    response.json()
                        .then((jsonResponse) =>
                            console.error('Nepodařilo se upravit objednávku na serveru: ' + jsonResponse.message));
                }
            })
            .catch((err) => console.log('Nepodařilo se upravit objednávku na serveru: ' + err));

    }

    // potvrzení objednávky na BE
    confirmBaguetteOrder() {
        let actualDate = new Date();
        const requestParam = '?date=' + actualDate;
        fetch(confirmBaguetteOrderUrl + this.state.order.id + requestParam, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Úspěšné potvrzení objednávky na serveru');
                    // redirect
                    this.props.navigation.navigate('ActualOrderState', {orderId: this.state.order.id})
                } else {
                    response.json()
                        .then((jsonResponse) =>
                            console.error('Nepodařilo se potvrdit objednávku na serveru: ' + jsonResponse.message));
                }
            })
            .catch((err) => console.log('Nepodařilo se potvrdit objednávku na serveru: ' + err));
    }

    render() {
        const baguetteItems = this.state.order.baguetteItems;
        return (
            <View style={styles.container}>
                <View style={styles.containerWelcome}>
                    <Text style={styles.welcome}>PickNGo - Souhrn objednávky</Text>
                </View>
                {this.state.isLoading ? <ActivityIndicator size='large' color='green'/> :
                    <View style={{marginTop: 5}}>
                        {baguetteItems.map((baguette, index) => {
                            return (
                                <View>
                                    <Text>Bageta číslo {++index}</Text>
                                    {baguette.items.map((item, index) => {
                                        return (
                                            <DataTable.Row key={index}>
                                                <DataTable.Cell>{item.ingredient.name}</DataTable.Cell>
                                                <DataTable.Cell>{item.amount}</DataTable.Cell>
                                                <DataTable.Cell>{item.price} Kč</DataTable.Cell>
                                            </DataTable.Row>
                                        );
                                    })}
                                    <View style={styles.containerRow}>
                                        <Button contentStyle={{padding: 2}} mode="contained" color="blue"
                                                onPress={() => this.props.navigation
                                                    .navigate('UpdateBaguette',
                                                        {baguette: baguette, index: index})}>Upravit</Button>
                                        <Button contentStyle={{padding: 2}} mode="contained" color="red"
                                                onPress={this.deleteBaguetteHandler}>Smazat</Button>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                }
                <TextInput label="Vaše poznámka - např. čas vyzvednutí objednávky či možnost zapéct bagetu"
                           value={this.state.note} onChangeText={(text) => this.setState({note: text})}/>
                <Button contentStyle={{padding: 2}} mode="contained" color="green"
                        onPress={this.onSubmitHandler}>Odeslat objednávku</Button>
            </View>
        );
    }
}

export default OrderSummaryScreen;

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
    containerRow: {
        flexDirection: 'row',
        padding: 5,
    },
});
