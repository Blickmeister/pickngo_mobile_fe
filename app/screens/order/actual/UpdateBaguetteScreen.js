import React, {Component} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import UpdateBaguetteDataComponent from '../../../components/baguette/actual/UpdateBaguetteDataComponent';
import {ActivityIndicator, Button} from 'react-native-paper';
import {getIngredientsUrl} from '../../../constants/endpoints';

class UpdateBaguetteScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            ingredients: [],
        };
    }

    componentDidMount() {
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

    render() {
        let pastry = [];
        let selectedPastry = {};
        if (!this.state.isLoading) {
            pastry = this.state.ingredients.filter((ingredient) => {
                return ingredient.ingredientType.name === 'Pečivo';
            });
            this.props.route.params.baguette.items.forEach((item) => {
                for (let i = 0; i < pastry.length; i++) {
                    if (item.ingredient.id === pastry[i].id) {
                        selectedPastry = item;
                        pastry.splice(i, 1);
                    }
                }
            });
        }
        return (
            <View style={styles.container}>
                <ScrollView>
                <View style={styles.containerWelcome}>
                    <Text style={styles.welcome}>PickNGo - Úprava bagety {this.props.route.params.index}</Text>
                </View>
                {this.state.isLoading ? <ActivityIndicator/> :
                    <View>
                        <UpdateBaguetteDataComponent items={this.props.route.params.baguette.items}
                                                     baguette={this.props.route.params.baguette} pastry={pastry}
                                                     selectedPastry={selectedPastry}/>
                        <Button style={{marginTop: 15}} contentStyle={{padding: 2}} mode="contained" color="blue"
                                onPress={() => this.props.navigation.push('OrderSummary',
                                    {orderId: this.props.route.params.orderId})}>
                            Úpravy dokončeny - zpět na souhrn
                        </Button>
                    </View>
                }
                </ScrollView>
            </View>
        );
    }
}

export default UpdateBaguetteScreen;

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
});
