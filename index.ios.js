/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var bem = require('bem-class');
var moment = require('moment');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
} = React;

var reacteuropeyetmobile = React.createClass({

  getInitialState: function() {
            setInterval(() => {
            this.setState({
                currentDate: moment()
            })
        }, 1000);
    return {
            currentDate: moment(),
            countdownEnd: moment.parseZone('2015-07-01T08:30:00+02:00')
    };
  },

  render: function() {
       var countdown = bem.block('countdown-timer');
        var title     = countdown.element('title');
        var timer     = countdown.element('timer');
        var days      = countdown.element('time-unit').modifier('days');
        var hours     = countdown.element('time-unit').modifier('hours');
        var minutes   = countdown.element('time-unit').modifier('minutes');
        var seconds   = countdown.element('time-unit').modifier('seconds');

        // Calculate time remaining
       var diff = this.state.countdownEnd.diff(this.state.currentDate);
        var duration = moment.duration(diff);
    return (
      <ScrollView horizontal={false} style={styles.scrollView}>
        <View style={styles.container}>
         <View>
           <Text style={styles.welcome}>
            React Europe
           </Text>
        </View>
        <View style = {styles.countdown}>
           <Text style={styles.days}>
            {Math.floor(duration.asDays())}
          </Text>
          <Text style={styles.appends}>
          days
          </Text>
         <Text style={styles.hours}>
          {duration.hours()}
         </Text>
          <Text style={styles.appends}>
          hours
          </Text>
        <Text style={styles.minutes}>
        {duration.minutes()}
        </Text>
                  <Text style={styles.appends}>
          minutes
          </Text>
          <Text  style={styles.seconds}>
        {duration.seconds()}
        </Text>
          <Text style={styles.appends}>
          seconds
          </Text>
          </View>
       </View>
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4656a0',
  },
  scrollView: {
        backgroundColor: '#4656a0',
  },
  welcome: {
    fontSize: 65,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    color: 'white',
    fontFamily: "Avenir Next",
    fontWeight: "500",
  },
  countdown : {
    flex: 1,
    flexDirection: 'column',
    padding: 20,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    fontSize: 50,
    marginBottom: 5,
    fontFamily: "Avenir Next",
  },
    days : {
    textAlign: 'center',
    color: 'rgba(255,255,255,1.0)',
    fontSize: 50,
    fontFamily: "Avenir Next",
  },
  hours : {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.85)',
    fontSize: 50,
    fontFamily: "Avenir Next",
  },
    minutes : {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 50,
    fontFamily: "Avenir Next",
  },
    seconds : {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.55)',
    fontSize: 50,
    fontFamily: "Avenir Next",
  },
  appends : {
    textAlign: 'center',
    color: '#333333',
    fontSize: 20,
    fontFamily: "Avenir Next",
    marginBottom: 10,
  }
});

AppRegistry.registerComponent('reacteuropeyetmobile', () => reacteuropeyetmobile);
