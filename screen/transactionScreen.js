import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as Permission from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import DropDownPicker from "react-native-dropdown-picker";
import db from "../config";
import firebase from "firebase";

export default class TransactionScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      studentDetail: "",
      bookDetail: "",
      buttonPressed: "normal",
      permissionGranted: null,
      qrCodeScanned: false,
      dropDownValue: "",
    };
  }
  cameraPermission = async (scan) => {
    const { status } = await Permission.askAsync(Permission.CAMERA);
    this.setState({
      permissionGranted: status == "granted" ? true : false,
      buttonPressed: scan,
      qrCodeScanned: false,
    });
  };
  fetchData = async ({ type, data }) => {
    console.log("fetch data");
    if (this.state.buttonPressed === "bookID") {
      console.log("book");
      this.setState({
        bookDetail: data,
        qrCodeScanned: true,
        buttonPressed: "normal",
      });
    } else if (this.state.buttonPressed === "studentID") {
      this.setState({
        studentDetail: data,
        qrCodeScanned: true,
        buttonPressed: "normal",
      });
      console.log(this.state.bookDetail);
    }
  };
  doTransaction = async () => {
    if (this.state.dropDownValue == "issue") {
      await this.issueTheBook();
    }
    if (this.state.dropDownValue == "return") {
      await this.returnTheBook();
    }
  };
  issueTheBook = async () => {
    console.log("studentId  " + this.state.studentDetail);
    console.log("book id " + this.state.bookDetail);
    var message = "";
    var bookAvailable = false;
    var studentEligible = false;
    var bref = await db
      .collection("Books")
      .where("BookID", "==", this.state.bookDetail)
      .get();
    if (bref.docs.length == 0) {
      message = "BookID is wrong";
    } else {
      bref.docs.map((doc) => {
        var data = doc.data();
        if (data.Avialable === true) {
          bookAvailable = true;
        } else {
          bookAvailable = false;
          message = "Book is not available";
        }
      });
    }
    var sref = await db
      .collection("Students")
      .where("StudentID", "==", this.state.studentDetail)
      .get();
    if (sref.docs.length == 0) {
      console.log(sref.docs.length + " length");

      message = "student ID is wrong";
    } else {
      sref.docs.map((doc) => {
        var data = doc.data();
        if (data.BookIssued == false) {
          studentEligible = true;
        } else {
          studentEligible = false;
          message = "student is not eligible";
        }
      });
    }
    if (studentEligible == true && bookAvailable == true) {
      db.collection("Books").doc(this.state.bookDetail).update({
        Avialable: false,
      });
      db.collection("Students").doc(this.state.studentDetail).update({
        BookIssued: true,
      });
      console.log("avikshit");
      db.collection("Transactions").add({
        StudentID: this.state.studentDetail,
        BookID: this.state.bookDetail,
        date: firebase.firestore.Timestamp.now().toDate(),
        transactionType: "issue",
      });
      console.log("hiavikshit");

      message = "book is issued";
    }
    Alert.alert(message);
  };
  returnTheBook = async () => {
    var message = "";
    var eligibleForReturn = false;
    var validStudentID = true;
    var validBookID = true;
    var bref = await db
      .collection("Books")
      .where("BookID", "==", this.state.bookDetail)
      .get();
      if(bref.docs.length==0){
        validBookID=false
        message="wrong book ID"
      }
      else{
        validBookID=true
      }
      var sref = await db
      .collection("Students")
      .where("StudentID", "==", this.state.studentDetail)
      .get();
      if(sref.docs.length==0){
        validStudentID=false
        message="wrong student ID"
      }
      else{
        validStudentID=true
      }
     if(validStudentID==true && validBookID==true){ 
    var ref = await db
      .collection("Transactions")
      .where("StudentID", "==", this.state.studentDetail)
      .where("BookID", "==", this.state.bookDetail)
      .where("transactionType", "==", "issue")
      .get();
    if (ref.docs.length == 0) {
      message = "No book issued with this ID";
      eligibleForReturn = false;
    } else {
      eligibleForReturn = true;
    }
  }
    if (eligibleForReturn == true) {
      db.collection("Books").doc(this.state.bookDetail).update({
        Avialable: true,
      });
      db.collection("Students").doc(this.state.studentDetail).update({
        BookIssued: false,
      });
      db.collection("Transactions").add({
        StudentID: this.state.studentDetail,
        BookID: this.state.bookDetail,
        date: firebase.firestore.Timestamp.now().toDate(),
        transactionType: "return",
      });

      message = "book is returned";
    }
    Alert.alert(message);
  };
  render() {
    if (this.state.buttonPressed === "normal") {
      return (
        <View style={styles.container}>
          <TextInput
            style={styles.inputBox}
            onChangeText={(para) => {
              this.setState({
                bookDetail: para,
              });
            }}
            placeholder="Enter the book ID"
            value={this.state.bookDetail}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.cameraPermission("bookID");
            }}
          >
            <Text style={{ color: "white" }}>Scan Book ID</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.inputBox}
            onChangeText={(para) => {
              this.setState({
                studentDetail: para,
              });
            }}
            placeholder="Enter student ID"
            value={this.state.studentDetail}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.cameraPermission("studentID");
            }}
          >
            <Text style={{ color: "white" }}>Scan Student ID</Text>
          </TouchableOpacity>
          <DropDownPicker
            items={[
              { label: "Issue the book", value: "issue" },
              { label: "return the book", value: "return" },
            ]}
            containerStyle={{ height: 40, width: 150 }}
            itemStyle={{ justifyContent: "flex-start" }}
            defaultValue={"issue the book"}
            onChangeItem={async (item) => {
              await this.setState({
                dropDownValue: item.value,
              });
              this.doTransaction();
            }}
          ></DropDownPicker>
        </View>
      );
    } else if (
      this.state.buttonPressed === "studentID" ||
      this.state.buttonPressed === "bookID"
    ) {
      return (
        <BarCodeScanner
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={
            this.state.qrCodeScanned == false ? this.fetchData : undefined
          }
        ></BarCodeScanner>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  inputBox: {
    width: "80%",
    height: 40,
    marginTop: 50,
    borderWidth: 5,
    marginLeft: 50,
    textAlign: "center",
  },
  button: {
    marginLeft: 50,
    marginTop: 50,
    borderRadius: 15,
    borderWidth: 3,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    borderColor: "white",
    height: 40,
  },
});
