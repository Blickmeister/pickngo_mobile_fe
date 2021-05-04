import React, {Component} from 'react';
import {getBaguetteOrderDetailUrl} from '../../../constants/endpoints';
import {Text, View, StyleSheet, ImageBackground} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import HistoryBaguetteDataComponent from '../../../components/baguette/history/HistoryBaguetteDataComponent';

class HistoryOrderDetailScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            order: {},
            isLoading: true,
        };
    }

    componentDidMount() {
        // získání dané objednávky
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
            })
            .catch((err) => console.error('Chyba při získání detailu objednávky: ' + err));
    }

    render() {
        const image = {uri: 'https://image.freepik.com/free-vector/white-abstract-background-theme_23-2148830884.jpg'};
        return (
            <ImageBackground source={image} style={styles.image}>
                <View style={styles.container}>
                    <View style={styles.containerWelcome}>
                        <Text style={styles.welcome}>PickNGo - Detail objednávky
                            č.{this.props.route.params.orderId}</Text>
                    </View>
                    {this.state.isLoading ? <ActivityIndicator size='large' color='green'/> :
                        <View>
                            {this.state.order.baguetteItems.map((baguette, index) => {
                                return (
                                    <HistoryBaguetteDataComponent navigation={this.props.navigation} key={index}
                                                                  index={++index} baguette={baguette}/>
                                );
                            })}
                        </View>
                    }
                </View>
            </ImageBackground>
        );
    }

}

export default HistoryOrderDetailScreen;

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
        resizeMode: 'cover',
        justifyContent: 'center',
    },
});
