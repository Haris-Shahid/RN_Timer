import React from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Dimensions, Picker, Platform } from 'react-native';

const formatNumber = number => `0${number}`.slice(-2);

const getRemaining = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60
    return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
}

const createArray = length => {
    const arr = [];
    let i = 0;
    while (i < length) {
        arr.push(i.toString())
        i += 1;
    }
    return arr;
}

const AVAILABLE_MINUTES = createArray(10);
const AVAILABLE_SECONDS = createArray(60);

export default class App extends React.Component {
    state = {
        remainingSeconds: 5,
        isRunning: false,
        selectedMinutes: "0",
        selectedSeconds: "5",
    }

    interval = null

    componentWillUpdate(prevProps, prevState) {
        if (this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0) {
            this.stop();
        }
    }


    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    start = () => {
        this.setState(state => ({
            remainingSeconds: parseInt(state.selectedMinutes, 10) * 60 + parseInt(state.selectedSeconds, 10),
            isRunning: true
        }))
        this.interval = setInterval(() => {
            this.setState(state => ({
                remainingSeconds: state.remainingSeconds - 1,
            }))
        }, 1000)
    }

    stop = () => {
        clearInterval(this.interval);
        this.interval = null;
        this.setState({
            remainingSeconds: 5,
            isRunning: false
        });
    }

    renderPickers = () => {
        return (
            <View style={styles.pickerContainer} >
                <Picker
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                    selectedValue={this.state.selectedMinutes}
                    onValueChange={itemvalue => {
                        this.setState({ selectedMinutes: itemvalue })
                    }}
                    mode="dropdown" >
                    {
                        AVAILABLE_MINUTES.map(v => (
                            <Picker.Item key={v} label={v} value={v} />
                        ))
                    }
                </Picker>
                <Text style={styles.pickerItem} >minutes</Text>
                <Picker
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                    selectedValue={this.state.selectedSeconds}
                    onValueChange={itemvalue => {
                        this.setState({ selectedSeconds: itemvalue })
                    }}
                    mode="dropdown" >
                    {
                        AVAILABLE_SECONDS.map(v => (
                            <Picker.Item key={v} label={v} value={v} />
                        ))
                    }
                </Picker>
                <Text style={styles.pickerItem} >seconds</Text>
            </View>
        )
    }

    render() {
        const { minutes, seconds } = getRemaining(this.state.remainingSeconds);
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                {
                    this.state.isRunning ?
                        <Text style={styles.timerText} >{`${minutes}:${seconds}`}</Text>
                        : this.renderPickers()
                }
                {
                    this.state.isRunning ?
                        <TouchableOpacity style={[styles.button, styles.buttonStop]} onPress={this.stop} >
                            <Text style={[styles.buttonText, styles.buttonTextStop]} >Stop</Text>
                        </TouchableOpacity> :
                        <TouchableOpacity style={styles.button} onPress={this.start} >
                            <Text style={styles.buttonText} >Start</Text>
                        </TouchableOpacity>
                }
            </View>
        );
    }
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#07121B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        borderColor: '#89AAFF',
        borderWidth: 10,
        width: width / 2,
        height: width / 2,
        borderRadius: width / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
    buttonStop: {
        borderColor: '#FF8518'
    },
    buttonTextStop: {
        color: '#FF8518'
    },
    buttonText: {
        fontSize: 45,
        color: '#89AAFF'
    },
    timerText: {
        color: '#fff',
        fontSize: 90
    },
    picker: {
        width: 50,
        ...Platform.select({
            android: {
                color: '#fff',
                backgroundColor: '#07121B',
                marginLeft: 10
            }
        })
    },
    pickerItem: {
        color: '#fff',
        fontSize: 20
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});
