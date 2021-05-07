import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  ToastAndroid
} from "react-native";
import db from "../config";
import firebase from "firebase";

export default class SearchScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      word: "",
      bookTransaction: [],
      letter: "",
    };
  }
  checkID = async () => {
    var input = this.state.word.toUpperCase().trim();

    var letter = input.charAt(0);
    this.setState({
      letter: letter,
    });
    if (letter == "B") {
      await this.fetchBook(input);
    } else if (letter == "S") {
      await this.fetchTransaction(input);
    } else {
      Alert.alert("There is no book or student with this ID");
    }
  };
  fetchBook = async (w) => {
    var validBookID = true;
    var message = "";
    var bref = await db.collection("Books").where("BookID", "==", w).get();
    if (bref.docs.length == 0) {
      message = "book ID is wrong";
      Alert.alert(message);
      validBookID = false;
    } else {
      validBookID = true;
      var array = [];
      bref.docs.map((docs) => {
        var data = docs.data();
        array.push(data);
      });
      ToastAndroid.show("Fetched Successfully",ToastAndroid.SHORT)
      
      await this.setState({
        bookTransaction: array,
      });
    }
    console.log(this.state.bookTransaction);
  };
  fetchTransaction = async (w) => {
    var validStudentID = true;
    var message = "";
    var sref = await db
      .collection("Transactions")
      .where("StudentID", "==", w)
      .get();
    if (sref.docs.length == 0) {
      message = "student ID is wrong";
      Alert.alert(message);
      validStudentID = false;
    } else {
      validStudentID = true;
      var array = [];
      sref.docs.map((docs) => {
        var data = docs.data();
        array.push(data);
      });
      ToastAndroid.show("Fetched Successfully",ToastAndroid.SHORT)
      this.setState({
        bookTransaction: array,
      });
    }
  };
  showData = () => {
    if (this.state.letter == 'B') {
      return (
        <View>
          <FlatList
            data={this.state.bookTransaction}
            renderItem={({ item }) => (
              <View style={{ borderBottomWidth: 3 }}>
                <Text>{"Author :" + item.Author}</Text>
                <Text>{"Price:" + item.Price}</Text>
                <Text>{"Pages:" + item.Pages}</Text>
                <Text>{"Pages:" + item.Name}</Text>
                <Text>{"BookID:" + item.BookID}</Text>
              </View>
            )}
          ></FlatList>
         
        </View>
      );
    } else {
      return (
        <View>
          <FlatList
            data={this.state.bookTransaction}
            renderItem={({ item }) => (
              <View style={{ borderBottomWidth: 3 }}>
                <Text>{"Transaction Type:" + item.transactionType}</Text>
                <Text>{"StudentID:" + item.StudentID}</Text>
                <Text>{"BookID:" + item.BookID}</Text>
                <Text>{"Date:"+item.date.toDate()}</Text>
              </View>
            )}
          ></FlatList>
        </View>
      );
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputBox}
          onChangeText={(para) => {
            this.setState({
              word: para,
            });
          }}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.checkID();
          }}
        />
        {this.showData()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputBox: {
    width: "80%",
    height: 40,
    marginTop: 50,
    borderWidth: 5,
    marginLeft: 50,
    textAlign: "center",
  },
  button: {
    marginLeft: 150,
    marginTop: 20,
    borderRadius: 15,
    borderWidth: 3,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    borderColor: "white",
    height: 40,
  },
});
