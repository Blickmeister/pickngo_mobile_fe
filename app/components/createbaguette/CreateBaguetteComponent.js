import React, {Component} from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import {createBaguetteItemUrl,getBaguetteItemDetailUrl} from '../../constants/endpoints';
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
            baguetteItem: {},
            isLoading: true,
        };
        //const {cookies} = props;
        //this.state.csrfToken = cookies.get('XSRF-TOKEN');
    }


    componentDidMount() {
        // vytvoření nové bagety
        this.createNewBaguette();
    }

    createNewBaguette() {
        console.log("BAAAF: " + this.props.orderId);
        fetch(createBaguetteItemUrl + this.props.orderId, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
            }
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Bageta vytvořena');
                    response.json()
                        .then((jsonResponse) => {
                            this.setState({baguetteItem: jsonResponse, isLoading: false});
                            console.log('create baguette item ID: ' + jsonResponse.id);
                        });
                } else {
                    response.json()
                        .then((jsonResponse) =>
                            console.error('Bagetu se nepodařilo vytvořit: ' + jsonResponse.message));
                }
            })
            .catch((error) => console.log('Chyba při vytváření bagety: ' + error));
    }

    // Handler pro změnu množství v itemu
    onItemChangeHandler = () => {
        // refresh celkové ceny aktuální bagety při změně itemu (položky)
        // kvůli zajištění konzistence s BE a DB fetch aktuálního baguette itemu
        fetch(getBaguetteItemDetailUrl + this.state.baguetteItem.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then((response) => response.json())
            .then((jsonResponse) => {
                this.setState({baguetteItem: jsonResponse});
                console.log("cena změna: " + jsonResponse.price)
                },
            ).catch((err) => console.error('Chyba při získání baguetteItem: ' + err));
    };

    render() {
        return (
            <View>
                {this.state.isLoading ? <ActivityIndicator size="large" color="green"/> :
                    <View style={styles.ingredientContainer}>
                        {this.props.ingredientTypes.map((type, index) => {
                            // dělení ingrediencí dle jejich typu
                            let ingredientsOfOneType = [];
                            this.props.ingredients.forEach((element) => {
                                if (element.ingredientType.id === type.id) {
                                    ingredientsOfOneType.push(element);
                                    console.log("render-oneTypeIng: " + element);
                                }
                            });
                            // pokud jde o počivo, tak radio buttons
                            if (type.name === 'Pečivo') {
                                // nejrpve vytažení názvů pro zobrazení
                                let pastryNamesWithPrice = [];
                                ingredientsOfOneType.forEach((pastry) => pastryNamesWithPrice.push(pastry.name
                                    + "  cena: " + pastry.price + " Kč"));
                                // vytvoření Radio Button labelů
                                let radioButtonsInputData = [];
                                pastryNamesWithPrice.forEach((name) => radioButtonsInputData.push({label: name}));
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
                                                               baguetteId={this.state.baguetteItem.id}
                                                               onItemChange={this.onItemChangeHandler}/>
                                            );
                                        })}
                                        <Text style={{textAlign: 'right'}}>Celková cena
                                            bagety: {this.state.baguetteItem.price} Kč</Text>
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
        width: 100
    },
    itemMargin: {
        justifyContent: 'space-between',
        paddingLeft: 25,
        paddingRight: 25,
    },
});

export default CreateBaguetteComponent;
