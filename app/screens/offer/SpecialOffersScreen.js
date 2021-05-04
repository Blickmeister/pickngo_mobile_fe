import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, ActivityIndicator, ImageBackground} from 'react-native';
import {
    createBaguetteOrderUrl,
    getActualBaguetteOrderUrl,
    getSpecialOffersUrl,
    homeUrl, removeBaguetteOrderUrl,
} from '../../constants/endpoints';
import {Button} from 'react-native-paper';
import OfferDataComponent from '../../components/offer/OfferDataComponent';

class SpecialOffersScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            offers: [],
            orderId: '',
            counter: 0,
        };
    }

    componentDidMount() {
        // ověření, zda je uživatel lognutý -> jinak nejde žádný HTTP req
        this.getUserDetail();
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
                    // vytvoření objednávky
                    this.createBaguetteOrder();
                    // získání nabídek
                    this.getOffers();
                } else {
                    // načtení Loginu
                    this.props.navigation.push('Login');
                }
            }).catch(() => {
            console.log('Uživatel není přihlášený');
            // načtení Loginu
            this.props.navigation.push('Login');
        });
    }

    createBaguetteOrder() {
        // kontrola pokud existuje nedokončená objednávka
        fetch(getActualBaguetteOrderUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then((response) => response.json())
            .then((jsonResponse) => {
                console.log(jsonResponse.id);
                if (jsonResponse.id !== undefined) {
                    this.setState({orderId: jsonResponse.id});
                    // smazání
                    this.deleteBaguetteOrder(true);
                } else {
                    this.createNewOrder();
                }
            })
            .catch((err) => console.error('Chyba při získání typů ingrediencí: ' + err));

    }

    createNewOrder() {
        // vytvoření nové objednávky
        fetch(createBaguetteOrderUrl, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Objednávka vytvořena');
                    response.json()
                        .then((jsonResponse) => {
                            this.setState({orderId: jsonResponse.id, baguetteOrderCreated: true});
                            console.log('Create order response ID: ' + jsonResponse.id);
                        });
                } else {
                    response.json()
                        .then((jsonResponse) =>
                            console.error('Objednávku se nepodařilo vytvořit: ' + jsonResponse.message));
                }
            })
            .catch((error) => console.log('Chyba při vytváření objednávky: ' + error));
    }

    deleteBaguetteOrder(createNew) {
        fetch(removeBaguetteOrderUrl + this.state.orderId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Objednávka úspěšně smazána');
                    if (createNew) {
                        this.createNewOrder();
                    }
                } else {
                    response.json()
                        .then((jsonResponse) =>
                            console.error('Objednávku se nepodařilo smazat: ' + jsonResponse.message));
                }
            })
            .catch((error) => console.error('Objednávku se nepodařilo smazat: ' + error));
    }

    getOffers() {
        fetch(getSpecialOffersUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then((response) => response.json())
            .then((jsonResponse) => {
                this.setState({offers: jsonResponse, isLoading: false});
            })
            .catch((err) => console.error('Chyba při získání nabídek: ' + err));
    }

    // Handler pro změnu počtu vybraných offerů
    onAddedOffersChangeHandler = (countDifference) => {
        this.setState(({counter}) => ({
            counter: counter + countDifference,
        }));
    };

    // handler pro přechod k souhrnu objednávky
    goToOrderSummaryHandler = () => {
        this.props.navigation.push('SpecialOffersSummary', {orderId: this.state.orderId});
    };

    // handler pro zrušení objednávky bagety
    cancelBaguetteOrderHandler = () => {
        // smazání baguetteOrder
        this.deleteBaguetteOrder();
        // redirect to Home
        this.props.navigation.navigate('Home');
    };

    render() {
        let renderOfferComponent = false;
        if (!this.state.isLoading && this.state.baguetteOrderCreated) {
            renderOfferComponent = true;
        }
        let goToSummaryEnabled = this.state.counter !== 0;
        const image = { uri: "https://image.freepik.com/free-vector/white-abstract-background-theme_23-2148830884.jpg" };
        return (
            <ImageBackground source={image} style={styles.image}>
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.containerWelcome}>
                        <Text style={styles.welcome}>PickNGo - Speciální nabídky</Text>
                    </View>
                    {!renderOfferComponent ?
                        <ActivityIndicator size='large' color='green'/> :
                        <View>
                            {this.state.offers.map((offer, index) => {
                                return (
                                    <OfferDataComponent key={index} offer={offer} orderId={this.state.orderId}
                                                        onOfferChange={this.onAddedOffersChangeHandler}/>
                                );
                            })}
                            <View style={{padding: 10}}>
                                {goToSummaryEnabled ?
                                    <Button contentStyle={{padding: 2}} mode="contained" color="green"
                                            onPress={this.goToOrderSummaryHandler}
                                            style={{margin: 5}}>Souhrn objednávky</Button> :
                                    <Button contentStyle={{padding: 2}} mode="contained" color="green"
                                            disabled='true' style={{margin: 5}}>Souhrn objednávky</Button>
                                }
                                <Button contentStyle={{padding: 2}} mode="contained" color="red"
                                        onPress={this.cancelBaguetteOrderHandler}
                                        style={{margin: 5}}>Zrušit</Button>
                            </View>
                        </View>
                    }
                </ScrollView>
            </View>
            </ImageBackground>
        );
    }
}

export default SpecialOffersScreen;

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
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    }
});
