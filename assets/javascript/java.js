//Initialize firebase
var config = {
    apiKey: "AIzaSyBwzLeSQNeYrlw1S_y1_GxjSNiBV1Jtz0Q",
    authDomain: "whatever-you-like-68e6e.firebaseapp.com",
    databaseURL: "https://whatever-you-like-68e6e.firebaseio.com",
    projectId: "whatever-you-like-68e6e",
    storageBucket: "whatever-you-like-68e6e.appspot.com",
    messagingSenderId: "161490624988"
    };
firebase.initializeApp(config);
  
// Create a variable to reference the database.
var database = firebase.database();

//Button for adding Employees
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    var firstTimeConverted = $("#first-train-input").val().trim();
    //moment($("#first-train-input").val().trim(), "HH:mm").subtract(1, "years");
    var trainFrequency = $("#frequency-input").val().trim();

    console.log("name: " + trainName);
    console.log("dest: " + trainDest);
    console.log("firstTimeConverted: " + firstTimeConverted);
    console.log("train frequency: " + trainFrequency);
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
    //pushes these values into the database
    database.ref().push({
        name: trainName,
        destination: trainDest,
        frequency: trainFrequency,
        firstTime: firstTimeConverted,
    });
});

function firebaseTable(){

    $("#train-table > tbody").html("");

    database.ref().on("child_added", function(ChildSnapshot) {
        var trainFrequency = ChildSnapshot.val().frequency;
        var firstTimeConverted = moment(ChildSnapshot.val().firstTime, "HH:mm").subtract(1, "years");
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        var tRemainder = diffTime % trainFrequency;
        var trMinutesAway = trainFrequency - tRemainder;
        var nextTrain = moment().add(trMinutesAway, "minutes").format("hh:mm");
        $("#train-table > tbody").append("<tr><td>" + ChildSnapshot.val().name + "</td><td>" + ChildSnapshot.val().destination + "</td><td>" +
        ChildSnapshot.val().frequency + "</td><td>" + nextTrain + "</td><td>" + trMinutesAway + "</td></tr>");
    }, function(errorObject){
        console.log("Errors handled: " + errorObject.code)
    });
};
firebaseTable();
setInterval(firebaseTable, 60*1000);
