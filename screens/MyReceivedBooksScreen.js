import * as React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader';
import SwipeableFlatlist from '../components/SwipeableFlatlist';

export default class ReceivedBooks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           userId : firebase.auth().currentUser.email,
           allReceivedBooks: [],
        }
        this.recievedBooksRef = null;
    } 

    getRecievedBooks = () => {
        this.recievedBooksRef = db.collection('receivedBooks').where('bookStatus', '==', 'received').where('user_id', '==', this.state.userId)
        .onSnapshot((snapshot) => {
            var allReceivedBooks = []
            snapshot.docs.map((doc) => {
                var recievedBook = doc.data()
                recievedBook['doc_id'] = doc.id
                allReceivedBooks.push(recievedBook)
            })
        this.setState({allReceivedBooks: allReceivedBooks})
        })
    }

    componentDidMount() {
        this.getRecievedBooks();
    }

    componentWillUnmount() {
        this.recievedBooksRef();
    }

    keyExtractor = (item, index) => index.toString();

    renderItem = ({item,index}) =>{
        return (
          <ListItem
            key={index}
            leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
            title={item.book_name}
            titleStyle={{ color: 'black', fontWeight: 'bold' }}
            subtitle={item.bookStatus}
            bottomDivider
          />
        )
   }

   render(){
    return(
      <View style={styles.container}>
        <View style={{flex:0.1}}>
          <MyHeader title={"Recieved Books"} navigation={this.props.navigation}/>
        </View>
        <View style={{flex:0.9}}>
          {
            this.state.allReceivedBooks.length === 0
            ?(
              <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontSize:20}}>You haven't recieved any books yet!</Text>
              </View>
            )
            :(
              <SwipeableFlatlist allReceivedBooks={this.state.allReceivedBooks}/>
            )
          }
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container : {
    flex : 1
  }
})