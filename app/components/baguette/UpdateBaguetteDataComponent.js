import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import {DataTable} from 'react-native-paper';
import {getBaguetteItemDetailUrl} from '../../constants/endpoints';
import UpdateItemComponent from './UpdateItemComponent';

class UpdateBaguetteDataComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            baguetteItem: {}
        };
    }

    // Handler pro změnu množství v itemu
    onItemChangeHandler = () => {
        // refresh celkové ceny aktuální bagety při změně itemu (položky)
        // kvůli zajištění konzistence s BE a DB fetch aktuálního baguette itemu
        fetch(getBaguetteItemDetailUrl + this.props.baguetteId, {
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
        // získání vybraných typů ingrediencí
        let ingredientTypes = [];
        this.props.items.forEach((item) => {
            ingredientTypes.forEach((type) => {
                if (type.id !== item.ingredient.ingredientType.id) {
                    ingredientTypes.push(item.ingredient.ingredientType);
                }
            });
        });
        // získání vybraných ingrediencí a k nim příslušných item ID
        let ingredientsWithItemIds = [];
        this.props.items.forEach((item) => {
            ingredientsWithItemIds.forEach((ingredient) => {
                if (item.ingredient.id !== ingredient.id) {
                    ingredientsWithItemIds.push({ingredient: item.ingredient, itemId: item.id});
                }
            });
        });
        return (
            <View style={styles.ingredientContainer}>
                {ingredientTypes.map((type, index) => {
                    let ingredientsOfOneType = [];
                    ingredientsWithItemIds.forEach((element) => {
                        if (element.ingredient.ingredientType.id === type.id) {
                            ingredientsOfOneType.push(element);
                        }
                    });
                    // pokud jde o počivo, tak radio buttons
                    if (type.name === 'Pečivo') {
                        // nejrpve vytažení názvů pro zobrazení
                        let pastryNamesWithPrice = [];
                        ingredientsOfOneType.forEach((pastry) => pastryNamesWithPrice.push(pastry.ingredient.name
                            + '  cena: ' + pastry.ingredient.price + ' Kč'));
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
                                {ingredientsOfOneType.map((element, index) => {
                                    return (
                                        <UpdateItemComponent key={index} ingredient={element.ingredient}
                                                             itemId={element.itemId}
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
        );
    }
}

export default UpdateBaguetteDataComponent;

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
        width: 100,
    },
    itemMargin: {
        justifyContent: 'space-between',
        paddingLeft: 25,
        paddingRight: 25,
    },
});
