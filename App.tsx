import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import formatTime from 'minutes-seconds-milliseconds';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface AppState {
  running: boolean;
  startTime: Date | null;
  laps: number[]; // Replace 'any[]' with the appropriate type for laps
  timeElapsed: number | null; // Replace 'any[]' with the appropriate type for laps
}

export default class App extends Component {
  state: AppState = {
    running: false,
    startTime: null,
    laps: [],
    timeElapsed: null,
  };

  interval: NodeJS.Timeout | undefined;
  constructor(props: {}) {
    super(props);
    this.state = {
      timeElapsed: null,
      running: false,
      startTime: null,
      laps: [],
    };
    this.handleStartPress = this.handleStartPress.bind(this);
    this.startStopButton = this.startStopButton.bind(this);
    this.handleLapPress = this.handleLapPress.bind(this);
  }

  handleStartPress() {
    this.setState({ running: !this.state.running });
    if (this.state.running) {
      clearInterval(this.interval);
      this.setState({
        running: false,
      });
    }
    else {
      this.setState({ startTime: new Date(), timeElapsed: 0, running: true });
      this.interval = setInterval(() => {
        const timeElapsed = new Date().getTime() - this.state.startTime!.getTime();
        this.setState({ timeElapsed });
      }, 30);
    }
  }

  handleLapPress() {
    if (this.state.running) {
      const lap = this.state.timeElapsed;
      this.setState({ laps: [...this.state.laps, lap] });
    } else {
      this.setState({ laps: [], timeElapsed: null }); // Reset functionality
    }
  }

  startStopButton() {
    var style = this.state.running ? styles.stopButton : styles.startButton;
    var textStyle = this.state.running ? styles.StopbuttonText : styles.StartbuttonText;
    return <TouchableHighlight underlayColor="gray" onPress={this.handleStartPress} style={[style, styles.button]}>
      <Text style={textStyle}>
        {this.state.running ? 'Stop' : 'Start'}
      </Text>
    </TouchableHighlight>;
  }

  lapButton() {
    const buttonText = this.state.running ? 'Lap' : 'Reset';
    return <TouchableHighlight style={styles.button}
      underlayColor="gray" onPress={this.handleLapPress}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>
        {buttonText}
      </Text>
    </TouchableHighlight>;
  }

  laps() {
    return this.state.laps.map(function (time, index) {
      return <View key={index} style={styles.lap}>
        <Text style={styles.lapText}>
          Lap {index + 1}
        </Text>
        <Text style={styles.lapText}>
          {time ? formatTime(time) : '00:00,00'}
        </Text>
      </View>;
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <View style={styles.timeWrapper}>
              <Text style={styles.timer}>
                {this.state.timeElapsed ? formatTime(this.state.timeElapsed) : '00:00,00'}
              </Text>
            </View>

            <View style={styles.buttonWrapper}>
              {this.lapButton()}
              {this.startStopButton()}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          {this.laps()}
        </View>
      </View>
    );
  }

}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flex: 1,
  },
  footer: {
    flex: 1,
  },
  timeWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 70,
  },
  buttonWrapper: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    color: 'white',
  },
  lap: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 10,
    marginTop: 10,
    color: 'white',
  },

  button: {
    borderWidth: 2,
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'grey',
  },
  timer: {
    fontSize: 80,
    color: 'white',
  },
  lapText: {
    fontSize: 20,
    color: 'white',
  },

  stopButton: {
    borderColor: 'red',
    backgroundColor: '#dbbcbc',
  },
  startButton: {
    borderColor: 'green',
    backgroundColor: '#80b28d',
  },

  StopbuttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'red',
  },
  StartbuttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'green',
  },
});