import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import UpdateBaguetteDataComponent from '../components/baguette/UpdateBaguetteDataComponent';

class UpdateBaguetteScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            baguetteToUpdate: {},
            isLoading: true
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.containerWelcome}>
                    <Text style={styles.welcome}>PickNGo - Úprava bagety {this.props.route.params.index}</Text>
                    <UpdateBaguetteDataComponent items={this.props.route.params.baguette.items}
                                                 baguetteId={this.props.route.params.baguette.id}/>
                </View>
            </View>
        )
    }
}

export default UpdateBaguetteScreen;

// stylizace
const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
    },
    containerWelcome: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -10,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: 'black',
    }
});
