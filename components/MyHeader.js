import React from 'react';
import { Header,Icon,Badge } from 'react-native-elements';
import { View, Text, StyeSheet ,Alert} from 'react-native';
import db from "../config";
import firebase from "firebase";

export default class MyHeader extends React.Component {
    constructor(){
        super();
        this.state = {
          value : "",
        }
    }

    render(){
        return (
          <Header
            leftComponent={<Icon name="bars" type="font-awesome" color="#696969" onPress={() => this.props.navigation.toggleDrawer()}></Icon>}
            centerComponent={{ text: this.props.title, style: { color: '#90A5A9', fontSize:20,fontWeight:"bold", } }}
            // rightComponent={<Icon name="bell" type="font-awesome" color="#696969" onPress={()=>props.navigation.navigate("Notification")}/>}
            rightComponent={<this.BellIconWithBadge {...this.props}/>}
            backgroundColor = "#eaf8fe"
          />
        )
      }

    BellIconWithBadge = () => {
        return (
          <View>
            <Icon name="bell" type="font-awesome" color="#696969" onPress={()=>this.props.navigation.navigate("Notification")}/>
            <Badge value = {this.state.value} containerStyle = {{position: "absolute", top: -4, right: -4}} />
          </View>
        )
      }

componentDidMount() {
    this.getNumberOfUnreadNotifications();
    }

    getNumberOfUnreadNotifications(){
        db.collection("all_notifications").where("notification_status","==","unread")
        .where("targeted_user_id","==",firebase.auth().currentUser.email)
        .onSnapshot((snapshot)=>{
          var unreadNotifications = snapshot.docs.map((doc)=>doc.data());
          this.setState({value: unreadNotifications.length})
        })
      }
    }    