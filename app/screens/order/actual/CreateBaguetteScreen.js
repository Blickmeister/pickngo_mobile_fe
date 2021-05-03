import React, {Component} from 'react';
import {StyleSheet, Text, View, BackHandler, ScrollView} from 'react-native';
import CreateBaguetteDataComponent from '../../../components/baguette/actual/CreateBaguetteDataComponent';
import {
    createBaguetteOrderUrl, getActualBaguetteOrderUrl,
    getIngredientsUrl,
    getIngredientTypeUrl, homeUrl,
    removeBaguetteOrderUrl,
} from '../../../constants/endpoints';
import {ActivityIndicator, Button} from 'react-native-paper';

class CreateBaguetteScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderId: '',
            ingredients: [],
            ingredientTypes: [],
            keyForRemount: 1,
            isLoading: true,
            baguetteOrderCreated: false,
        };
        //const {cookies} = props;
        //this.state.csrfToken = cookies.get('XSRF-TOKEN');
        //this.login = this.login.bind(this);
        //this.logout = this.logout.bind(this);
    }

    /*getItem = () => {
        return AsyncStorage.getItem(ASYNC_STORAGE_USER_KEY);
    };*/

    componentDidMount() {
        // při každém načtení stránky (komponenty)
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            // ověření, zda je uživatel lognutý -> jinak nejde žádný HTTP req
            this.getUserDetail();
        });
        /* (() => {
             let user = AsyncStorage.getItem(ASYNC_STORAGE_USER_KEY);
             if (user !== null && user !== undefined && user !== '') {
                 // We have data!!
                 this.setState({user: user, isAuthenticated: true});
                 console.log("USEROS:" + user);
             } else {
                 this.setState({isAuthenticated: false});
             }
         })
         ();*/
        //console.log('orderId: ' + this.props.orderId);
        //if (this.props.orderId === undefined) {
        // nemáme ještě orderId -> nová objednávka
        // vytvoření nové objednávky
        //this.createBaguetteOrder();
        //  } else {
        // předání orderId pro vytvoření další bagety
        //  this.setState({orderId: this.props.orderId});
        //  }
        // registrace listeneru pro event při stisknutí zpětného tlačítka
        this.backHandler = BackHandler.addEventListener(
            'hwBackPress',
            this.backAction,
        );
        // získání typů ingrediencí a ingrediencí
        //this.getIngredientTypesAndIngredients();
    }

    /*refresh = () => {
        this.createBaguetteOrder();
        this.getIngredientTypesAndIngredients();
    };*/

    componentWillUnmount() {
        // odregistrování listeneru pro event při stisknutí zpětného tlačítka
        this.backHandler.remove();
        this._unsubscribe();
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
                    this.createBaguetteOrder();
                    this.getIngredientTypesAndIngredients();
                } else {
                    // načtení Loginu
                    this.props.navigation.navigate('Login')
                }
            }).catch(() => {
            console.log('Uživatel není přihlášený');
            // načtení Loginu
            //this.props.navigation.push('Login')
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
                //this.setState({baguetteOrderCreated: true}); // TODO pak pryc
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

    getIngredientTypesAndIngredients() {
        fetch(getIngredientTypeUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then((response) => response.json())
            .then((jsonResponse) => {
                this.setState({ingredientTypes: jsonResponse});
                this.getIngredients();
            })
            .catch((err) => console.error('Chyba při získání typů ingrediencí: ' + err));
    }

    getIngredients() {
        fetch(getIngredientsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then((response) => response.json())
            .then((jsonResponse) => this.setState({ingredients: jsonResponse, isLoading: false}))
            .catch((err) => console.error('Chyba při získání ingrediencí: ' + err));
    }

    addNextBaguetteHandler = () => {
        this.setState(({keyForRemount}) => ({
            keyForRemount: keyForRemount + 1,
        }));
    };

    // handler pro zrušení objednávky bagety
    cancelBaguetteOrderHandler = () => {
        // smazání baguetteOrder
        this.deleteBaguetteOrder();
        // redirect to Home
        this.props.navigation.navigate('Home');
    };

    // handler pro přechod k souhrnu objednávky
    goToOrderSummaryHandler = () => {
        this.props.navigation.push('OrderSummary', {orderId: this.state.orderId});
    };

    // handler pro stistkuní tlačítka zpět v mobil zařízení (funguje pouze pro Android)
    backAction = () => {
        this.deleteBaguetteOrder();
    };

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

    render() {
        let renderBaguetteComponent = false;
        if (!this.state.isLoading && this.state.baguetteOrderCreated) {
            renderBaguetteComponent = true;
            console.log('render? ' + renderBaguetteComponent + ' ID ' + this.state.orderId);
        }
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.containerWelcome}>
                        <Text style={styles.welcome}>PickNGo - Návrh bagety</Text>
                    </View>
                    {!renderBaguetteComponent ?
                        <ActivityIndicator size='large' color='green'/> :
                        <View>
                            <CreateBaguetteDataComponent key={this.state.keyForRemount} orderId={this.state.orderId}
                                                         ingredients={this.state.ingredients}
                                                         ingredientTypes={this.state.ingredientTypes}/>
                            <View style={{padding: 10}}>
                                <Button contentStyle={{padding: 2}} mode="contained" color="blue"
                                        onPress={this.addNextBaguetteHandler}
                                        style={{margin: 5}}>Přidat další bagetu</Button>
                                <Button contentStyle={{padding: 2}} mode="contained" color="green"
                                        onPress={this.goToOrderSummaryHandler}
                                        style={{margin: 5}}>Souhrn objednávky</Button>
                                <Button contentStyle={{padding: 2}} mode="contained" color="red"
                                        onPress={this.cancelBaguetteOrderHandler}
                                        style={{margin: 5}}>Zrušit</Button>
                            </View>
                        </View>
                    }
                </ScrollView>
            </View>
        );
    }
}

export default CreateBaguetteScreen;

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
    contentContainer: {
        borderWidth: 5,
        borderColor: 'black',
        flex: 1,
        width: 330,
        height: 420,
    },
    typeContainer: {
        marginTop: 60,
    },
    ingredientContainer: {
        marginTop: 10,
    },
    textCenter: {
        textAlign: 'center',
    },
    textBig: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    marginAll: {
        margin: 2,
    },
    containerRow: {
        flexDirection: 'row',
        padding: 5,
    },
    flexContainer: {},
});
