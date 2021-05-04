import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {CircleButton} from '../../elements/CircleButton';
import {DataTable} from 'react-native-paper';
import {createItemUrl, updateItemUrl} from '../../../constants/endpoints';

class CreateItemComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            number: 0,
            itemId: ''
        };
    }

    incrementNumber = () => {
        let createNewItem = false;
        if (this.state.number === 0) createNewItem = true;
        this.setState({number: this.state.number + 1});
        let number = this.state.number + 1;
        this.changeItemState(number, createNewItem);
    };

    decrementNumber = () => {
        this.setState({number: this.state.number - 1});
        let number = this.state.number - 1;
        this.changeItemState(number);
    };

    changeItemState(number, createNewItem) {
        // pokud se poprvé mění stav itemu
        const ingredient = this.props.ingredient;
        if (this.state.itemId === '' || createNewItem) {
            // vytvoření itemu
            console.log("url: " + createItemUrl + this.props.baguetteId);
            fetch(createItemUrl + this.props.baguetteId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    amount: number,
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
                    this.props.onItemChange();
                })
                .catch((err) => console.log('Nepodařilo se vytvořit item na serveru: ' + err));
        } else {
            // pokud již byl item vytvořen -> update
            console.log("URL: " + updateItemUrl + this.state.itemId + "?amount=" + number);
            fetch(updateItemUrl + this.state.itemId + "?amount=" + number, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Allow-Origin': '*'
                },
            })
                .then((response) => {
                    if (response.ok) {
                        console.log('Úspěšná úprava itemu na serveru');
                    } else {
                        response.json()
                            .then((jsonResponse) =>
                                console.error('Nepodařilo se upravit item na serveru: ' + jsonResponse.message));
                    }
                    // update ceny bagety
                    this.props.onItemChange();
                })
                .catch((err) => console.log('Nepodařilo se upravit item na serveru: ' + err));
        }
    }

    render() {
        let disablePlusButton = false;
        let disableMinusButton = false;
        if (this.state.number >= 5) {
            disablePlusButton = true;
        }
        if (this.state.number <= 0) {
            disableMinusButton = true;
        }

        return (
            <DataTable.Row>
                <DataTable.Cell>{this.props.ingredient.name}</DataTable.Cell>
                <DataTable.Cell>{this.props.ingredient.price}</DataTable.Cell>
                <DataTable.Cell>
                    <View style={styles.cellCountElement}>
                        <CircleButton size={15} marginRight={4} color="red" textColor="black" fontSize={12} text="-"
                                      onPress={this.decrementNumber} disable={disableMinusButton}/>
                        <Text>{this.state.number}</Text>
                        <CircleButton size={15} marginLeft={4} color="green" textColor="black" fontSize={12} text="+"
                                      onPress={this.incrementNumber} disable={disablePlusButton}/>
                    </View>
                </DataTable.Cell>
                <DataTable.Cell>{this.state.number * this.props.ingredient.price} Kč</DataTable.Cell>
            </DataTable.Row>
        );
    }
}

// stylizace
const styles = StyleSheet.create({
    cellCountElement: {
        flexDirection: 'row',
    }
});

export default CreateItemComponent;
