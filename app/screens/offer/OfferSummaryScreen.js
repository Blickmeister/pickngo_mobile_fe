import React, {Component} from 'react';
import {Alert, BackHandler, ScrollView, Text, View, StyleSheet} from 'react-native';
import {
    confirmBaguetteOrderUrl,
    getBaguetteOrderDetailUrl,
    removeBaguetteItemUrl,
    removeBaguetteOrderUrl,
    updateBaguetteOrderUrl,
} from '../../constants/endpoints';
import {ActivityIndicator, Button, DataTable, TextInput} from 'react-native-paper';
import dateFormat from 'dateformat';

class OfferSummaryScreen extends Component {

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
        // registrace listeneru pro event při stisknutí zpětného tlačítka
        this.backHandler = BackHandler.addEventListener(
            'hwBackPress',
            this.backAction,
        );
    }

    // handler pro stistkuní tlačítka zpět v mobil zařízení (funguje pouze pro Android)
    backAction = () => {
        this.deleteBaguetteOrder();
    };

    componentWillUnmount() {
        // odregistrování listeneru pro event při stisknutí zpětného tlačítka
        this.backHandler.remove();
    }

    getOrderById() {
        fetch(getBaguetteOrderDetailUrl + this.props.route.params.orderId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((response) => response.json())
            .then((jsonResponse) => {
                // kontrola, zda již není žádná bageta v objednávce
                if (jsonResponse.baguetteItems.length === 0) {
                    Alert.alert('Prázdná objednávka',
                        'V objednávce již není žádná bageta, budete přesměrováni na hlavní stránku');
                    this.props.navigation.navigate('Home')
                }
                this.setState({order: jsonResponse, isLoading: false});
            })
            .catch((err) => console.error('Chyba při získání detailu bagety: ' + err));
    }

    deleteBaguetteHandler(baguetteId) {
        fetch(removeBaguetteItemUrl + baguetteId, {
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
                    this.getOrderById();
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
        let dateToSend = dateFormat(actualDate, 'dd-mm-yyyy, HH:MM:ss');
        const requestParam = '?date=' + dateToSend.toString();
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
                    this.props.navigation.push('ActualOrdersState');
                } else {
                    response.json()
                        .then((jsonResponse) =>
                            console.error('Nepodařilo se potvrdit objednávku na serveru: ' + jsonResponse.message));
                }
            })
            .catch((err) => console.log('Nepodařilo se potvrdit objednávku na serveru: ' + err));
    }

    cancelOrderHandler = () => {
        this.deleteBaguetteOrder();
        this.props.navigation.push('Home');
    };

    deleteBaguetteOrder() {
        fetch(removeBaguetteOrderUrl + this.state.order.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Objednávka úspěšně smazána');
                } else {
                    response.json()
                        .then((jsonResponse) =>
                            console.error('Objednávku se nepodařilo smazat: ' + jsonResponse.message));
                }
            })
            .catch((error) => console.error('Objednávku se nepodařilo smazat: ' + error));
    }

    render() {
        const baguetteItems = this.state.order.baguetteItems;
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.containerWelcome}>
                        <Text style={styles.welcome}>PickNGo - Souhrn objednávky</Text>
                    </View>
                    {this.state.isLoading ? <ActivityIndicator size='large' color='green'/> :
                        <View style={{marginTop: 5}}>
                            {baguetteItems.map((baguette, index) => {
                                    // získání vybraných typů ingrediencí dané bagety
                                    let ingredientTypesAll = [];
                                    baguette.items.forEach((item) => {
                                        ingredientTypesAll.push(item.ingredient.ingredientType);
                                    });
                                    let ingredientTypes = Array.from(new Set(ingredientTypesAll.map(s => s.id)))
                                        .map(id => {
                                            return {
                                                id: id,
                                                name: ingredientTypesAll.find(s => s.id === id).name,
                                            };
                                        });
                                    // získání všech ingrediencí dané bagety
                                    let ingredientsWithItem = [];
                                    baguette.items.forEach((item) => {
                                        ingredientsWithItem.push({item: item, ingredient: item.ingredient});
                                        console.log(ingredientsWithItem);
                                    });
                                    return (
                                        <View key={index} style={{marginTop: 15}}>
                                            <Text>Bageta číslo {++index}</Text>
                                            {ingredientTypes.map((type, index) => {
                                                let ingredientsOfOneType = [];
                                                ingredientsWithItem.forEach((element) => {
                                                    if (element.ingredient.ingredientType.id === type.id) {
                                                        ingredientsOfOneType.push(element);
                                                    }
                                                });
                                                return (
                                                    <View key={index} style={{paddingTop: 10}}>
                                                        <Text>{type.name}:</Text>
                                                        <Header/>
                                                        {ingredientsOfOneType.map((element, index) => {
                                                            return (
                                                                <View key={index}>
                                                                    <DataTable.Row>
                                                                        <DataTable.Cell>{element.ingredient.name}</DataTable.Cell>
                                                                        <DataTable.Cell>{element.item.amount}</DataTable.Cell>
                                                                        <DataTable.Cell>
                                                                            {element.item.amount * element.ingredient.price}
                                                                        </DataTable.Cell>
                                                                    </DataTable.Row>
                                                                </View>
                                                            );
                                                        })}
                                                    </View>
                                                );
                                            })}
                                            <Text style={{marginTop: 10, textAlign: 'right'}}>
                                                Cena bagety: {baguette.price} Kč
                                            </Text>
                                            <View style={styles.containerRow}>
                                                <Button style={{marginTop: 2, marginLeft:60, marginRight: 50}} contentStyle={{padding: 2}} mode="contained"
                                                        color="red"
                                                        onPress={() => this.deleteBaguetteHandler(baguette.id)}>Smazat</Button>
                                            </View>
                                        </View>
                                    );
                                },
                            )}
                            <Text style={{marginTop: 15, fontWeight: 'bold', textAlign: 'right'}}>
                                Celková cena objednávky: {this.state.order.price} Kč
                            </Text>
                            <Text style={{marginTop: 15, textAlign: 'center'}}>
                                Do poznámky uveďte čas vyzvednutí objednávky či možnost bagetu zapéct
                            </Text>
                            <TextInput style={{marginTop: 10}} label="Vaše poznámka"
                                       value={this.state.note} onChangeText={(text) => this.setState({note: text})}/>
                            <Button style={{marginTop: 10}} contentStyle={{padding: 2}} mode="contained" color="green"
                                    onPress={this.onSubmitHandler}>Odeslat objednávku</Button>
                            <Button style={{marginTop: 5}} contentStyle={{padding: 2}} mode="contained" color="red"
                                    onPress={this.cancelOrderHandler}>Zrušit objednávku</Button>
                        </View>
                    }
                </ScrollView>
            </View>
        );
    }

}

const Header = () => (
    <DataTable.Header>
        <DataTable.Title>Ingredience</DataTable.Title>
        <DataTable.Title>Počet</DataTable.Title>
        <DataTable.Title>Cena položky</DataTable.Title>
    </DataTable.Header>
);

export default OfferSummaryScreen;

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
        paddingLeft: 60,
        paddingRight: 60,
        marginTop: 10,
    },
});
