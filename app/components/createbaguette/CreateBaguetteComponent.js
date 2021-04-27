import React, {Component} from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import {createBaguetteItemUrl, getIngredientsUrl, getIngredientTypeUrl} from '../../constants/endpoints';
import ItemComponent from './ItemComponent';
import {DataTable} from 'react-native-paper';

class CreateBaguetteComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: {
                customer: {},
                date: '',
                state: '',
                itemBaguettes: [],
            },
            ingredients: [],
            ingredientTypes: [],
            baguetteId: '',
            isLoading: true,
        };
        //const {cookies} = props;
        //this.state.csrfToken = cookies.get('XSRF-TOKEN');
    }


    componentDidMount() {
        // vytvoření nové bagety
        this.createNewBaguette();
        // získání typů ingrediencí
        this.getIngredientTypes();
        // získání ingrediencí
        this.getIngredients();
    }

    createNewBaguette() {
        fetch(createBaguetteItemUrl + this.props.orderId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then((response) => response.json())
            .then((jsonResponse) => {
                this.setState({baguetteId: jsonResponse.id});
                console.log(jsonResponse);
            })
            .catch((error) => console.log('Chyba při vytvoření bagety: ' + error));
    }

    getIngredientTypes() {
        fetch(getIngredientTypeUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then((response) => response.json())
            .then((jsonResponse) => this.setState({ingredientTypes: jsonResponse}),
            ).catch((err) => console.error('Chyba při získání typů ingrediencí: ' + err));
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
            .then((jsonResponse) => this.setState({ingredients: jsonResponse, isLoading: false}),
            ).catch((err) => console.error('Chyba při získání ingrediencí: ' + err));
    }

    render() {
        return (
            <View style={styles.ingredientContainer}>
                {this.state.isLoading ? <ActivityIndicator size="large" color="green"/> :
                    <View>
                        {this.state.ingredientTypes.map((type, index) => {
                            // dělení ingrediencí dle jejich typu
                            let ingredientsOfOneType = [];
                            this.state.ingredients.forEach((element) => {
                                if (element.ingredientType.id === type.id) {
                                    ingredientsOfOneType.push(element);
                                    console.log(element);
                                }
                            });
                            // pokud jde o počivo, tak radio buttons
                            if (type.name === 'Pečivo') {
                                // nejrpve vytažení názvů pro zobrazení
                                let pastryNames = [];
                                ingredientsOfOneType.forEach((pastry) => pastryNames.push(pastry.name));
                                // vytvoření Radio Button labelů
                                let radioButtonsInputData = [];
                                pastryNames.forEach((name) => radioButtonsInputData.push({label: name}));
                                return (
                                    <View key={index} style={styles.typeContainer}>
                                        <Text style={{fontWeight: 'bold'}}>Typ bagety:</Text>
                                        <RadioButtonRN
                                            data={radioButtonsInputData}
                                            selectedBtn={(e) => console.log(e)}
                                        />
                                    </View>
                                );
                            } else {
                                // jinak výběr počtu
                                return (
                                    <View key={index} style={{paddingTop: 10}}>
                                        <Text style={{fontWeight: 'bold'}}>Co dovnitř:</Text>
                                        <Text>Vyberte {type.name}:</Text>
                                        <Header/>
                                        {ingredientsOfOneType.map((ingredient, index) => {
                                            return (
                                                <ItemComponent key={index} ingredient={ingredient}
                                                               baguetteId={this.state.baguetteId}/>
                                            );
                                        })}
                                    </View>
                                );
                            }
                        })}
                    </View>
                }
            </View>
        );
    }
}

const Header = () => (
    <DataTable.Header>
        <DataTable.Title>Název</DataTable.Title>
        <DataTable.Title>Cena/kus</DataTable.Title>
        <DataTable.Title>Počet</DataTable.Title>
        <DataTable.Title>Cena celkově</DataTable.Title>
    </DataTable.Header>
);

// stylizace
const styles = StyleSheet.create({
    typeContainer: {
        marginTop: 20,
    },
    ingredientContainer: {
        marginTop: 10,
    },
    containerRow: {
        flexDirection: 'row',
    },
    itemMargin: {
        justifyContent: 'space-between',
        paddingLeft: 25,
        paddingRight: 25,
    },
});

export default CreateBaguetteComponent;
