import React, {Component} from 'react';
import {StyleSheet, Text, View, BackHandler} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_USER_KEY} from '../screens/LoginScreen';
import CreateBaguetteComponent from '../components/createbaguette/CreateBaguetteComponent';
import {
    createBaguetteOrderUrl,
    getIngredientsUrl,
    getIngredientTypeUrl,
    removeBaguetteOrderUrl,
} from '../constants/endpoints';
import {ActivityIndicator, Button} from 'react-native-paper';

class CreateBaguetteScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
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

    getItem = () => {
        return AsyncStorage.getItem(ASYNC_STORAGE_USER_KEY);
    };

    componentDidMount() {
        // při každém načtení stránky (komponenty)
       this._unsubscribe = this.props.navigation.addListener('focus', () => {
           this.createBaguetteOrder();
           this.getIngredientTypesAndIngredients();
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
        (async () => {
            await this.retrieveData();
        })();
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

    retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem(ASYNC_STORAGE_USER_KEY);
            if (value !== null) {
                console.log('VALUE: ' + value);
                this.setState(() => ({user: value}));
                // value previously stored
            }
        } catch (e) {
            // error reading value
            console.log('READ ERROR: ' + e);
        }
    };

    componentWillUnmount() {
        // odregistrování listeneru pro event při stisknutí zpětného tlačítka
        this.backHandler.remove();
        this._unsubscribe();
    }

    createBaguetteOrder() {
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
                'Access-Control-Allow-Origin': '*'
            }
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
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((response) => response.json())
            .then((jsonResponse) => this.setState({ingredients: jsonResponse, isLoading: false}))
            .catch((err) => console.error('Chyba při získání ingrediencí: ' + err));
    }

    logout() {
        /* fetch('http://192.168.100.12:8080/api/logout', {
             method: 'POST',
             credentials: 'include',
             headers: {
                 'X-XSRF-TOKEN': this.state.csrfToken
             }
         })
             .then(res => res.json())
             .then(jsonResponse => {
                 window.location.href = jsonResponse.logoutUrl + "?id_token_hint=" +
                     jsonResponse.idToken + "&post_logout_redirect_uri=" + window.location.origin;
             }).catch((err) => console.error(err));*/
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
        this.props.navigation.navigate('OrderSummary', {orderId: this.state.orderId});
    };

    // handler pro stistkuní tlačítka zpět v mobil zařízení (funguje pouze pro Android)
    backAction = () => {
        this.deleteBaguetteOrder();
    };

    deleteBaguetteOrder() {
        fetch(removeBaguetteOrderUrl + this.state.orderId, {
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
        let definedUser = this.state.user !== undefined;
        let renderBaguetteComponent = false;
        if (!this.state.isLoading && this.state.baguetteOrderCreated) {
            renderBaguetteComponent = true;
            console.log("render? " + renderBaguetteComponent + " ID " + this.state.orderId);
        }
        return (
            <View style={styles.container}>
                <View style={styles.containerWelcome}>
                    <Text style={styles.welcome}>PickNGo - Návrh bagety</Text>
                </View>
                {!renderBaguetteComponent ?
                    <ActivityIndicator size='large' color='green'/> :
                    <View>
                        {definedUser && <Text style={styles.textCenter}>Přihlášený uživatel: {this.state.user}</Text>}
                        <CreateBaguetteComponent key={this.state.keyForRemount} orderId={this.state.orderId}
                                                 ingredients={this.state.ingredients}
                                                 ingredientTypes={this.state.ingredientTypes}/>
                        <View style={{padding: 10}}>
                            <Button contentStyle={{padding: 2}} mode="contained" color="blue" onPress={this.addNextBaguetteHandler}
                                    style={{margin: 5}}>Přidat další bagetu</Button>
                            <Button contentStyle={{padding: 2}} mode="contained" color="green" onPress={this.goToOrderSummaryHandler}
                                    style={{margin: 5}}>Souhrn objednávky</Button>
                            <Button contentStyle={{padding: 2}} mode="contained" color="red" onPress={this.cancelBaguetteOrderHandler}
                                    style={{margin: 5}}>Zrušit</Button>
                        </View>
                    </View>
                }
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
    flexContainer: {
    }
});
