import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Button, DataTable} from 'react-native-paper';

export const HistoryBaguetteDataComponent = () => (
    <View style={styles.baguetteContainer}>
        <Text style={styles.textCommon}>Bageta č.{this.props.key}</Text>
        <Text style={styles.textCommon}>Obsah bagety:</Text>
        <Header/>
        {this.props.baguette.items.map((item, index) => {
            return (
                <DataTable.Row key={index}>
                    <DataTable.Cell>{item.ingredient.name}</DataTable.Cell>
                    <DataTable.Cell>{item.amount}</DataTable.Cell>
                    <DataTable.Cell>{item.price}</DataTable.Cell>
                </DataTable.Row>
                )
        })}
        <Text style={styles.textCommon}>Cena za bagetu: {this.props.baguette.price}</Text>
        <Button contentStyle={{padding: 2}} mode="contained" color="blue"
                onPress={() => this.props.navigation.goBack()}>Zpět na přehled objednávek</Button>
    </View>
);

const Header = () => (
    <DataTable.Header>
        <DataTable.Title>Název</DataTable.Title>
        <DataTable.Title>Počet</DataTable.Title>
        <DataTable.Title>Cena za položku</DataTable.Title>
    </DataTable.Header>
);

// stylizace
const styles = StyleSheet.create({
    baguetteContainer: {
        marginTop: 20,
        paddingLeft: 5,
        paddingRight: 5
    },
    containerRow: {
        flexDirection: 'row',
        width: 100
    },
    textCommon: {
        margin: 2
    }
});
