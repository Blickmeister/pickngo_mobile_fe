import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {homeUrl} from '../constants/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StyleSheet, View, Text} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

export const ASYNC_STORAGE_USER_KEY = 'UserAsyncStorage:user';

class LoginScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
        };
    }

    componentDidMount() {
        // při každém načtení stránky (komponenty)
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            // zjistí jestli je uživatel lognutý
            // -> podle toho bud redirect na createBaguetteScreen nebo načtení WebView a login
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
                console.log('USERNAME: ' + userName);
                if (userName !== undefined) {
                    // redirect to createBaguette
                    this.props.navigation.navigate('CreateBaguette');
                } else {
                    // načtení WebView a Login
                    this.setState({isLoading: false});
                }
            }).catch(() => {
            // načtení WebView a Login
            // zpoždění, aby si uživatelé mohli přečíst, že se musí přihlásit :)
            setTimeout( () => this.setState({isLoading: false}), 2000);
            console.log('Uživatel není přihlášený');
        });
    }

    componentWillUnmount() {
        // odregistrování listeneru pro event při stisknutí zpětného tlačítka
        this._unsubscribe();
    }

    webview = null;
    handleWebViewNavigationStateChange = newNavState => {
        const {url} = newNavState;
        if (!url) {
            return;
        }

        // login byl úspěšný
        if (url.includes('/afterLogin')) {
            console.log('úspěšné přihlášení....');
            this.webview.stopLoading();
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
                    console.log(jsonResponse.full_name);
                    (() => {
                        AsyncStorage.setItem(ASYNC_STORAGE_USER_KEY, jsonResponse.full_name);
                    })();
                    // redirect to createBaguette
                    this.props.navigation.navigate('CreateBaguette');
                    /*(async () => {
                        await this.storeData(jsonResponse.full_name);
                    })()*/
                }).catch((err) => {
                console.error('Chyba při přihlášení: ' + err);
                alert('Přihlášení se nezdařilo');
            });
        }
    };

    render() {
        if (this.state.isLoading) {
            return (
                <View style={[styles.flexContainer, styles.container]}>
                    <Text style={{paddingLeft: 5}}>Pro pokračování je nutné přihlášení skrze Váš UHK účet</Text>
                    <ActivityIndicator size='large' color='green' style={styles.flexContainer}/>
                </View>

            );
        } else {
            return (
                <WebView
                    ref={ref => (this.webview = ref)}
                    source={{uri: homeUrl}}
                    style={{margin: 20}}
                    onNavigationStateChange={this.handleWebViewNavigationStateChange}
                    startInLoadingState={true}
                    renderLoading={() => (
                        <ActivityIndicator
                            color='green'
                            size='large'
                            style={styles.flexContainer}
                        />
                    )}
                />
            );
        }
    }
}

// stylizace
const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        textAlign: 'center',
        justifyContent: 'center'
    },
    flexContainer: {
        flex: 1,
    },
});

export default LoginScreen;
