import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';

class ActualOrdersDataComponent extends Component {

    render() {
        let stateText = '';
        // převod state number na text
        let state = this.props.orderState;
        if (state === 1) {
            stateText = 'Objednávka čeká na potvrzení';
        } else if (state === 2) {
            stateText = 'Objednávka je potvrzena a připravuje se';
        } else if (state === 3) {
            stateText = 'Objednávka je dokončena a čeká na vyzvednutí';
        }
        return (
            <View style={styles.mainContainer}>
                <View style={styles.containerStateCenter}>
                    <Text style={styles.textCommon}>Číslo Vaši objednávky</Text>
                    <Text style={styles.textOrderId}>{this.props.orderId}</Text>
                </View>

                <View style={styles.containerStateCenter}>
                    <Text style={styles.textCommon}>Stav Vaši objednávky</Text>
                    <Text style={styles.textOrderId}>{stateText}</Text>
                </View>
            </View>
        );
    }

}

export default ActualOrdersDataComponent;

// stylizace
const styles = StyleSheet.create({
    mainContainer: {
      marginTop: 15,
      borderBottomColor: 'black',
      borderBottomWidth: 1
    },
    containerStateCenter: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    textOrderId: {
        fontSize: 30,
        textAlign: 'center',
        margin: 5,
        color: 'black',
        fontWeight: 'bold',
    },
    textCommon: {
        textAlign: 'center',
        margin: 2,
    }
});
