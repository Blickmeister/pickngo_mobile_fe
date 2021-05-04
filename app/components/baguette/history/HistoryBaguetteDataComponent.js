import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Button, DataTable} from 'react-native-paper';

class HistoryBaguetteDataComponent extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.baguetteContainer}>
                <Text style={styles.textCommonBold}>Bageta č.{this.props.index}:</Text>
                <Header/>
                {this.props.baguette.items.map((item, index) => {
                    return (
                        <DataTable.Row key={index}>
                            <DataTable.Cell>{item.ingredient.name}</DataTable.Cell>
                            <DataTable.Cell>{item.amount}</DataTable.Cell>
                            <DataTable.Cell>{item.price} Kč</DataTable.Cell>
                        </DataTable.Row>
                    )
                })}
                <Text style={styles.textCommon}>Cena za bagetu: {this.props.baguette.price} Kč</Text>
                <Button style={{marginTop: 15}} contentStyle={{padding: 2}} mode="contained" color="blue"
                        onPress={() => {this.props.navigation.goBack()}}>Zpět na přehled objednávek</Button>
            </View>
        )
    }
}

const Header = () => (
    <DataTable.Header>
        <DataTable.Title>Název</DataTable.Title>
        <DataTable.Title>Počet</DataTable.Title>
        <DataTable.Title>Cena za položku</DataTable.Title>
    </DataTable.Header>
);

export default HistoryBaguetteDataComponent;

// stylizace
const styles = StyleSheet.create({
    baguetteContainer: {
        marginTop: 20,
        paddingLeft: 5,
        paddingRight: 5
    },
    textCommon: {
        margin: 5
    },
    textCommonBold: {
        margin: 5,
        fontWeight: 'bold'
    }
});
