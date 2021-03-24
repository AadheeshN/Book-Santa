import * as React from 'react';
import { View, KeyboardAvoidingView, Text, Image, TouchableOpacity, TextInput, StyleSheet, Alert, Modal, ScrollView } from 'react-native';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader';


export default class RequestScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            bookName: '',
            reasonToRequest: '',
            userId: firebase.auth().currentUser.email,
            isBookRequestActive: '',
            docId: '',
            userDocId: '',
            requestId: '',
            bookStatus: '',
            requestedBookName: '',
        }
    }

    componentDidMount(){
        this.getBookRequest();
        this.getIsBookRequestActive();
        console.log(this.state)
    }

    createUniqueId() {
        return Math.random().toString(36).substring(7)
    }

    getBookRequest = async() => {
        var bookRequest = await db.collection('requested_books').where('user_id', '==', this.state.userId)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                if (doc.data().book_status !== 'received') {
                    this.setState({
                        requestId : doc.data().request_id,
                        requestedBookName: doc.data().book_name,
                        bookStatus: doc.data().book_status,
                        docId: doc.id,
                    })
                    console.log(this.state)
                }
            })
        })
    }

    getIsBookRequestActive = () => {
        db.collection('users').where('email_id', '==', this.state.userId)
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {
                this.setState({
                    isBookRequestActive: doc.data().isBookRequestActive,
                    userDocId: doc.id,
                })
                console.log(this.state)
            })
        })
    }

    addRequest = async(bookName, reasonToRequest) => {
        var userId = this.state.userId;
        var randomRequestId = this.createUniqueId();
        db.collection('requested_books').add({
            user_id: userId,
            book_name: bookName,
            reason_to_request: reasonToRequest,
            request_id: randomRequestId,
            book_status: 'requested',
            date: firebase.firestore.FieldValue.serverTimestamp(),
        })
        await this.getBookRequest();
        db.collection('users').where('email_id', '==', userId).get()
        .then()
        .then(snapshot => {
            snapshot.forEach(doc => {
                db.collection('users').doc(doc.id).update({
                    isBookRequestActive: true,
                })
            })
        })
        this.setState({bookName: '', reasonToRequest: ''})
        return Alert.alert('Book Requested Successfully')
        }

    updateBookRequestStatus=()=>{
        //updating the book status after receiving the book
        db.collection('requested_books').doc(this.state.docId)
        .update({
        book_status : 'received'
        })
    
        //getting the  doc id to update the users doc
        db.collection('users').where('email_id','==',this.state.userId).get()
        .then((snapshot)=>{
        snapshot.forEach((doc) => {
            //updating the doc
            db.collection('users').doc(doc.id).update({
            isBookRequestActive: false
            })
        })
        })
    
    
    }
    receivedBooks=(bookName)=>{
        var userId = this.state.userId
        var requestId = this.state.requestId
        db.collection('received_books').add({
            "user_id": userId,
            "book_name":bookName,
            "request_id"  : requestId,
            "bookStatus"  : "received",
      
        })
      }
      sendNotification=()=>{
        //to get the first name and last name
        db.collection('users').where('email_id','==',this.state.userId).get()
        .then((snapshot)=>{
          snapshot.forEach((doc)=>{
            var name = doc.data().first_name
            var lastName = doc.data().last_name
      
            // to get the donor id and book nam
            db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
            .then((snapshot)=>{
              snapshot.forEach((doc) => {
                var donorId  = doc.data().donor_id
                var bookName =  doc.data().book_name
      
                //targert user id is the donor id to send notification to the user
                db.collection('all_notifications').add({
                  "targeted_user_id" : donorId,
                  "message" : name +" " + lastName + " received the book " + bookName ,
                  "notification_status" : "unread",
                  "book_name" : bookName
                })
              })
            })
          })
        })
      }
    render() {
        if (this.state.isBookRequestActive === true) {
            return (
                <View style = {{flex:1,justifyContent:'center'}}>
                    <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
                        <Text>Book Name</Text>
                        <Text>{this.state.requestedBookName}</Text>
                    </View>
                        <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
                        <Text> Book Status </Text>
            
                        <Text>{this.state.bookStatus}</Text>
                    </View>
        
                    <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
                    onPress={()=>{
                    this.sendNotification()
                    this.updateBookRequestStatus();
                    this.receivedBooks(this.state.requestedBookName)
                    }}>
                        <Text>I recieved the book </Text>
                    </TouchableOpacity>
              </View>
            )
        }else{
        return(
            <View style = {{flex: 1}}>
                <MyHeader title = "Request Books" navigation = {this.props.navigation}/>
                <KeyboardAvoidingView style = {styles.keyBoardStyle}>
                    <TextInput 
                    placeholder = 'Enter Book Name' 
                    style = {styles.formTextInput} 
                    value = {this.state.bookName} 
                    onChangeText = {(text) => {this.setState({bookName: text})}}/>

                   <TextInput 
                    placeholder = 'Reason for Request' 
                    style = {[styles.formTextInput, {height: 300}]} 
                    value = {this.state.reasonToRequest} 
                    onChangeText = {(text) => {this.setState({reasonToRequest: text})}}
                    multiline
                    numberOfLines = {5}
                    />

                    <TouchableOpacity style = {styles.button} onPress = {() => {this.addRequest(this.state.bookName, this.state.reasonToRequest)}}>
                        <Text>Request</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        );
        }
    }
}

const styles = StyleSheet.create({ 
    keyBoardStyle : { 
        flex:1, 
        alignItems:'center', 
        justifyContent:'center' 
    },

    formTextInput:{ 
        width:"75%", 
        height:35, 
        alignSelf:'center', 
        borderColor:'#ffab91', 
        borderRadius:10, 
        borderWidth:1, 
        marginTop:20, 
        padding:10, 
    },

    button:{ 
        width:"75%", 
        height:50, 
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:10, 
        backgroundColor:"#ff5722", 
        shadowColor: "#000",

    shadowOffset: { 
        width: 0, 
        height: 8, 
    },

    shadowOpacity: 
    0.44, 
    shadowRadius: 10.32, 
    elevation: 16, 
    marginTop:20 
}, 
} 
)