import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {getBaguetteOrderDetailUrl, removeBaguetteItemUrl, confirmBaguetteOrderUrl} from '../constants/endpoints';
import {ActivityIndicator, DataTable, Button} from 'react-native-paper';

class OrderSummaryPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            order: {},
            isLoading: true
        };
    }

    componentDidMount() {
        // získání objednávky
        this.getOrderById();
    }

    getOrderById() {
        fetch(getBaguetteOrderDetailUrl + this.props.state.params.orderId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((response) => response.json())
            .then((jsonResponse) => {
                this.setState({order: jsonResponse, isLoading: false});
                this.getIngredients();
            })
            .catch((err) => console.error('Chyba při získání typů ingrediencí: ' + err));
    }

    deleteBaguetteHandler = () => {
        fetch(removeBaguetteItemUrl + this.state.order.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*'
            }
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

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.containerWelcome}>
                    <Text style={styles.welcome}>PickNGo - Souhrn objednávky</Text>
                </View>
                {this.state.isLoading ? <ActivityIndicator size='large' color='green'/> :
                    <View style={{marginTop: 5}}>
                        {this.state.order.baguetteItems.map((baguette, index) => {
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
                                                        {baguetteId: baguette.id})}>Upravit</Button>
                                        <Button contentStyle={{padding: 2}} mode="contained" color="red"
                                                onPress={this.deleteBaguetteHandler}>Smazat</Button>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                }
                <Text>// formular</Text>
                <Button>Odeslat objednávku</Button>
            </View>
        );
    }
}

export default OrderSummaryPage;

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
