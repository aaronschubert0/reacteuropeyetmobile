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
  WebSocket,
  ListView,
  Image,
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
       <SlackRTM />
      </ScrollView>
    );
  }
});

var SlackRTM = React.createClass({
    getInitialState: function () {
        return {
            dataSource: new ListView.DataSource({
             rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            users: [],
            loaded: false,
            messages: [],
        };
    },

    componentDidMount: function () {
            this.getChannelHistory(),
            console.log('Getting Channel history')
    },

    getChannelHistory: function () {
        return fetch('https://slack.com/api/channels.history?token=xoxp-4806393214-4917790761-4934962156-2d19b7&channel=C04PQBK9C')
            .then((response) => response.json())
            .then((responseData) => {
              console.log('Response'+responseData.messages);
                this.setState({
                  dataSource: this.state.dataSource.cloneWithRows(responseData.messages),
                  messages: responseData.messages,
                });
                this.getListOfUsers();
            });   
    },

    getListOfUsers: function () {
          return fetch('https://slack.com/api/users.list?token=xoxp-4806393214-4917790761-4934962156-2d19b7')
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                  users: responseData.members,
                  loaded:true,
                });
            }); 
    },

    renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading slack conversation...
        </Text>
      </View>
    );
  },
    renderMessage: function(message) {
      console.log(JSON.stringify(message, null, 4));
      var individualUser;
      var users = this.state.users;
      users.forEach((user) => {
       if (user.id === message.user) {
        console.log('Has ID')
          individualUser = user;
       };
      });
      var messageText = message.text;
      var username = '@'+individualUser.name;
      var match =  message.text.match(/<@(?:([^|]+)\|([^>]+))>/);
      if (match) {
        var mention = match[0];
        console.log('Mention '+mention);
        var mentionedUsername = '@'+match[2]; 
            console.log('MentionUsername '+mentionedUsername);
           messageText = message.text.replace(mention, mentionedUsername);
      };
      var mentionMatch = messageText.match(/<@(?:([^:]+))>:/);
      if (mentionMatch) {
        mentionMatch.forEach((mentionID) => {
          users.forEach((user) => {
           if (user.id === mentionID) {
              var name = '@'+user.name;
              messageText = messageText.replace('<@'+mentionID+'>:',name);
           };
          });
        })
      };


     var view = <View style={styles.messageContainer}>
          <Image
            source={{uri: individualUser.profile.image_72}}
            style={styles.thumbnail}
          />
          <View style={styles.messageHolder}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.message}>{messageText}</Text>
          </View>
        </View>;

      var subType = message.subtype;
      if (subType) {
        view = <View style={styles.messageContainer}>
          <Image
            source={{uri: individualUser.profile.image_72}}
            style={styles.thumbnail}
          />
          <View style={styles.messageHolder}>
            <Text style={[styles.message,{marginTop:16}]}>{messageText}</Text>
          </View>
        </View>;        
      };

     //  var individualUser = this.fetchUserWithID(message.user);


      return (
       view
      );
   },

   escapeRegExp: function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  },

   fetchUserWithID: function (userID){
    var users = this.state.users;
    users.forEach((user) => {
          if (user.id == userID) {
              return user;
          };
      });
   },
    
    render: function () {
          if (!this.state.loaded) {
      return this.renderLoadingView();
    }
        return (
            <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderMessage}
            style={styles.listView}
            />
        );
    }
});

// var SlackRTMWebSocket = React.createClass ({

//   getWebSocketUrl: function () {
//         return fetch('https://slack.com/api/rtm.start?token=xoxp-4806393214-4917790761-4934962156-2d19b7')
//             .then((response) => response.json())
//             .then((responseData) => {
//                 return responseData.url
//             });
//     },

//     connectWebSocket: function (url) {
//         var ws = new window.WebSocket(url);

//         ws.onmessage = (message) => {
//             console.log(message);
//         };
//     },
// });

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4656a0',
  },
  thumbnail: {
  width: 30,
  height: 30,
  borderRadius : 4,
  marginLeft: 10,
  marginTop: 10,
  marginBottom: 10,
  },
  messageContainer: {
    flex: 1,
    flexDirection: 'row',
        borderTopWidth: 0.5,
    borderColor: 'white',
  },
  username: {
    marginTop: 10,
    marginLeft: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  message: {
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 10,
    marginRight: 10,
    color: 'white',
  },
  messageHolder: {
    flex: 1,
    flexDirection: 'column',
  },
  listView: {
    paddingTop: 10,
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
