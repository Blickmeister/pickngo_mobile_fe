import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import {DataTable} from 'react-native-paper';
import {createItemUrl, getBaguetteItemDetailUrl, removeItemUrl} from '../../../constants/endpoints';
import UpdateItemComponent from './UpdateItemComponent';

class UpdateBaguetteDataComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            baguetteItem: this.props.baguette,
            pastryId: '',
            forFirst: true
        };
    }

    // Handler pro změnu množství v itemu
    onItemChangeHandler = () => {
        // refresh celkové ceny aktuální bagety při změně itemu (položky)
        // kvůli zajištění konzistence s BE a DB fetch aktuálního baguette itemu
        this.getBaguette();
    };

    getBaguette() {
        fetch(getBaguetteItemDetailUrl + this.props.baguette.id, {
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
    }

    pastryChangeHandler = (ingredient) => {
        // dle definice BE smazat a vytvořit nový
        if (this.state.forFirst) {
            if (this.props.selectedPastry.ingredient.id === ingredient.id) {
                // přichod
                this.setState({forFirst: false});
                this.setState({itemId: this.props.selectedPastry.id})
            }
        } else {
            this.deletePastry(ingredient);
        }
    };

    createNewPastry(ingredient) {
        console.log("url: " + createItemUrl + this.state.baguetteItem.id);
        fetch(createItemUrl + this.state.baguetteItem.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                amount: 1,
                price: ingredient.price,
                ingredient: ingredient
            })
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Úspěšné vytvoření itemu na serveru');
                    response.json().then((item) => this.setState({itemId: item.id}))
                } else {
                    response.json()
                        .then((jsonResponse) =>
                            console.error('Nepodařilo se vytvořit item na serveru: ' + jsonResponse.message));
                }
                // update ceny bagety
                this.getBaguette();
            })
            .catch((err) => console.log('Nepodařilo se vytvořit item na serveru: ' + err));
    }

    deletePastry(ingredient) {
        fetch(removeItemUrl + this.state.itemId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Item úspěšně smazán');
                    this.createNewPastry(ingredient);
                } else {
                    response.json()
                        .then((jsonResponse) =>
                            console.error('Item se nepodařilo smazat: ' + jsonResponse.message));
                }
            })
            .catch((error) => console.error('Item se nepodařilo smazat: ' + error));
    }

    render() {
        // získání vybraných typů ingrediencí
        let ingredientTypesAll = [];
        this.props.items.forEach((item) => {
            ingredientTypesAll.push(item.ingredient.ingredientType);
        });
        let ingredientTypes = Array.from(new Set(ingredientTypesAll.map(s => s.id)))
            .map(id => {
                return {
                    id: id,
                    name: ingredientTypesAll.find(s => s.id === id).name,
                };
            });
        // získání vybraných ingrediencí a k nim příslušných itemů
        let ingredientsWithItem = [];
        this.props.items.forEach((item) => {
            ingredientsWithItem.push({ingredient: item.ingredient, item: item});

        });
        let renderLabel = true;
        return (
            <View style={styles.ingredientContainer}>
                {ingredientTypes.map((type, index) => {
                    let ingredientsOfOneType = [];
                    ingredientsWithItem.forEach((element) => {
                        if (element.ingredient.ingredientType.id === type.id) {
                            ingredientsOfOneType.push(element);
                        }
                    });
                    // pokud jde o počivo, tak radio buttons
                    if (type.name === 'Pečivo') {
                        // nejrpve vytažení názvů pro zobrazení
                        let pastryNamesWithPrice = [];
                        ingredientsOfOneType.forEach((element) => pastryNamesWithPrice.push({name: element.ingredient.name
                            + '  cena: ' + element.ingredient.price + ' Kč', pastry: element.item.ingredient}));
                        // vytvoření Radio Button labelů
                        // vybraný button
                        let radioButtonsInputData = [];
                        pastryNamesWithPrice.forEach((element) =>
                            radioButtonsInputData.push({label: element.name, pastry: element.pastry}));
                        // ostatní
                        this.props.pastry.forEach((pastry) => {
                           radioButtonsInputData.push({label: pastry.name + '  cena: ' + pastry.price + ' Kč', pastry: pastry})
                        });
                        return (
                            <View key={index} style={styles.typeContainer}>
                                <Text style={{fontWeight: 'bold'}}>Typ bagety:</Text>
                                <RadioButtonRN
                                    data={radioButtonsInputData}
                                    initial={1}
                                    selectedBtn={(e) => this.pastryChangeHandler(e.pastry)}
                                />
                            </View>
                        );
                    } else {
                        // jinak výběr počtu
                        return (
                            <View key={index} style={{paddingTop: 10}}>
                                {renderLabel && <Text style={{fontWeight: 'bold'}}>Co dovnitř:</Text>}
                                {renderLabel = false}
                                <Text>{type.name}:</Text>
                                <Header/>
                                {ingredientsOfOneType.map((element, index) => {
                                    return (
                                        <UpdateItemComponent key={index} ingredient={element.ingredient}
                                                             item={element.item}
                                                             onItemChange={this.onItemChangeHandler}/>
                                    );
                                })}
                            </View>
                        );
                    }
                })}
                <Text style={{textAlign: 'right'}}>Celková cena
                    bagety: {this.state.baguetteItem.price} Kč</Text>
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
    }
});
