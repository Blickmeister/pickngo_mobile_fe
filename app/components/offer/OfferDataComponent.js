import React, {Component} from 'react';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import {Button, DataTable} from 'react-native-paper';
import {createBaguetteItemUrl, removeBaguetteItemUrl} from '../../constants/endpoints';

class OfferDataComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            offerAdded: false,
            isLoading: false,
            baguetteId: ''
        };
    }

    // přidání offeru do objednávky
    addOfferHandler = () => {
        this.setState({isLoading: true});
        // dle definice BE vytvoření baguetteItemu
        this.createNewBaguette();
    };

    createNewBaguette() {
        console.log(createBaguetteItemUrl + this.props.orderId + "/" + this.props.offer.id);
        fetch(createBaguetteItemUrl + this.props.orderId + "/" + this.props.offer.id, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Bageta vytvořena');
                    this.setState({offerAdded: true});
                    response.json()
                        .then((jsonResponse) => {
                            this.setState({baguetteId: jsonResponse.id, isLoading: false});
                            this.props.onOfferChange(1);
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

    // odebrání offeru z objednávky
    deleteOfferHandler = () => {
        this.setState({isLoading: true});
        // dle definice BE smazání baguetteItemu
        this.deleteBaguette();
    };

    deleteBaguette() {
        fetch(removeBaguetteItemUrl + this.state.baguetteId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Bageta úspěšně smazána');
                    this.setState({isLoading: false, offerAdded: false});
                    this.props.onOfferChange(-1);
                } else {
                    response.json()
                        .then((jsonResponse) =>
                            console.error('Bagetu se nepodařilo smazat: ' + jsonResponse.message));
                }
            })
            .catch((error) => console.error('Bagetu se nepodařilo smazat: ' + error));
    };

    render() {
        return (
            <View style={styles.offerContainer}>
                <Text style={styles.textCommonBold}>Název: {this.props.offer.name}</Text>
                <Text style={styles.textCommon}>Cena: {this.props.offer.price} Kč</Text>
                <Header/>
                {this.props.offer.items.map((item, index) => {
                    return (
                        <DataTable.Row key={index}>
                            <DataTable.Cell>{item.ingredient.name}</DataTable.Cell>
                            <DataTable.Cell>{item.amount}</DataTable.Cell>
                            <DataTable.Cell>{item.price} Kč</DataTable.Cell>
                        </DataTable.Row>
                    );
                })}
                {this.state.isLoading ? <ActivityIndicator size='large' color='green'/> :
                    <View>
                        {this.state.offerAdded ?
                            <Button style={{marginTop: 10}} contentStyle={{padding: 2}} mode="contained" color="red"
                                    onPress={this.deleteOfferHandler}>Odebrat</Button> :
                            <Button style={{marginTop: 10}} contentStyle={{padding: 2}} mode="contained" color="blue"
                                    onPress={this.addOfferHandler}>Přidat</Button>
                        }
                    </View>
                }
            </View>
        );
    }
}

const Header = () => (
    <DataTable.Header>
        <DataTable.Title>Název</DataTable.Title>
        <DataTable.Title>Počet</DataTable.Title>
        <DataTable.Title>Cena za položku</DataTable.Title>
    </DataTable.Header>
);

// stylizace
const styles = StyleSheet.create({
    offerContainer: {
        marginTop: 20,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        paddingBottom: 20
    },
    textCommon: {
        margin: 5,
    },
    textCommonBold: {
        margin: 5,
        fontWeight: 'bold',
    },
    containerRow: {
        flexDirection: 'row',
        width: 100,
    },
});

export default OfferDataComponent;
