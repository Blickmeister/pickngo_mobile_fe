import React, {Component} from 'react';
import {updateItemUrl} from '../../../constants/endpoints';
import {DataTable} from 'react-native-paper';
import {Text, View, StyleSheet} from 'react-native';
import {CircleButton} from '../../elements/CircleButton';

class UpdateItemComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            number: this.props.item.amount
        };
    }

    incrementNumber = () => {
        this.setState({number: this.state.number + 1});
        let number = this.state.number + 1;
        this.changeItemState(number);
    };

    decrementNumber = () => {
        this.setState({number: this.state.number - 1});
        let number = this.state.number - 1;
        this.changeItemState(number);
    };

    changeItemState(number) {
        console.log("" + updateItemUrl + this.props.item.id + '?amount=' + number);
        fetch(updateItemUrl + this.props.item.id + '?amount=' + number, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
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

    render() {
        let disablePlusButton = false;
        let disableMinusButton = false;
        if (this.state.number >= 5) {
            disablePlusButton = true;
        }
        if (this.state.number <= 0) {
            disableMinusButton = true;
        }
        console.log(this.state.number);
        return (
            <DataTable.Row>
                <DataTable.Cell>{this.props.ingredient.name}</DataTable.Cell>
                <DataTable.Cell>{this.props.ingredient.price}</DataTable.Cell>
                <DataTable.Cell>
                    <View style={styles.cellCountElement}>
                        <CircleButton size={18} marginRight={4} color="red" textColor="black" fontSize={15} text="-"
                                      onPress={this.decrementNumber} disable={disableMinusButton}/>
                        <Text>{this.state.number}</Text>
                        <CircleButton size={18} marginLeft={4} color="green" textColor="black" fontSize={15} text="+"
                                      onPress={this.incrementNumber} disable={disablePlusButton}/>
                    </View>
                </DataTable.Cell>
                <DataTable.Cell>{this.state.number * this.props.ingredient.price} Kč</DataTable.Cell>
            </DataTable.Row>
        );
    }
}

export default UpdateItemComponent;

// stylizace
const styles = StyleSheet.create({
    cellCountElement: {
        flexDirection: 'row',
    }
});
