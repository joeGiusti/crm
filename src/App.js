import logo from './logo.svg';
import './App.css';
import Contacts from './Components/Contacts';
import SideMenu from './Components/SideMenu';
import Notes from './Components/Notes';
import Calendar from './Components/Calendar';
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app'
import { getDatabase, onValue, ref, set, push } from 'firebase/database'
import { getStorage, uploadBytes, ref as sRef, getDownloadURL } from 'firebase/storage'
import Gallery from './Components/Gallery';

function App() {
  
  // State variables
  const[tab, setTab] = useState("calendar")  
  const[imageData, setImageData] = useState([])    
  const[fire, setFire] = useState({db:null, storage:null})    
  
  // On start
  useEffect(()=>{
    loadImageData()
    
  },[])

  // Firebase setup
  var app, db, storage
  firebaseSetup()
  function  firebaseSetup() {
    app = initializeApp({
      apiKey: "AIzaSyDCrQSCE91lh7GYlr7eTFbX--e1NnvF7Uw",
      authDomain: "practice-79227.firebaseapp.com",
      databaseURL: "https://practice-79227-default-rtdb.firebaseio.com",
      projectId: "practice-79227",
      storageBucket: "practice-79227.appspot.com",
      messagingSenderId: "283438782315",
      appId: "1:283438782315:web:d913f1ed9d87b5401a1e2e"
    })  
    db = getDatabase(app)
    storage = getStorage(app)
  }

  // Firebase functions
  function loadImageData(){
    onValue(ref(db, "images2"), imagesSnap => {
      var images = []
      imagesSnap.forEach(imageSnap => {

        // Get the name of the image and convert it if necessary
        var imageSnapName = imageSnap.child("name").val()        
        if(imageSnapName)
          if(imageSnapName.includes(","))
            imageSnapName=NumbersToString(imageSnapName)

        // Get the image notes and convert it if necessary
        var imageSnapNotes = imageSnap.child("notes").val()        
        if(imageSnapNotes)
          if(imageSnapNotes.includes(","))
            imageSnapNotes=NumbersToString(imageSnapNotes)
            
        // Put the values in an object and push it in a temp array which will be added to state
        images.push({
          name:imageSnapName,
          notes:imageSnapNotes,
          color:imageSnap.child("color").val(),
          url:imageSnap.child("url").val(),
          key:imageSnap.key,
        })
      })

      // Add the temp array to state
      setImageData(images)
    })
  }    

  // View functions
  function showContacts(){
    setTab("contacts")
  }
  function showCalendar(){
    setTab("calendar")
  }
  function showNotes(){
    setTab("notes")
  }
  var word = "theWord24&B"
  function NumbersToString(string){    
    
    // If there is no string just return
    if(!string)
      return ""

    // Initial values
    var c = 0
    var returnString =""    

    // Make a list of char codes from the string
    var charCodes = string.split(',')

    c=0
    // Convert and place each character
    for(var i = 0; i<charCodes.length; i++){
        returnString += String.fromCharCode(parseInt(charCodes[i])-word.charCodeAt(c++))            
        c = c%word.length
    }                                    
    // Return
    return returnString
}

function StringToNumbers(string){    
  
  // If there is no string just return
    if(!string)
      return ""

    // Initial values
    var c = 0
    var returnString = ""

    // Go through each one
    for(var i = 0; i<string.length; i++){
         returnString += string.charCodeAt(i)+word.charCodeAt(c++)+","
         c = c%word.length
    }
    returnString = returnString.slice(0, returnString.length-1)        

    // Return the result
    return returnString;
}

  function displayTab(){
    if (tab==="contacts")
      return(      
        <Contacts
          imageData={imageData}
          NumbersToString={NumbersToString}
          StringToNumbers={StringToNumbers}
        >
        </Contacts>
      )
    else if (tab==="calendar")
      return(
        <Calendar
          imageData={imageData}
          NumbersToString={NumbersToString}
          StringToNumbers={StringToNumbers}
        >
        </Calendar>
      )
    else if (tab==="notes")
      return(
        <Notes></Notes>
      )
    else if (tab==="gallery")
      return(
        <Gallery></Gallery>
      )

  }

  return (
    <div className="App">
      <div className='background'></div>
      <SideMenu>
        <div className='sideMenuButton' onClick={showContacts}>Contacts</div>
        <div className='sideMenuButton' onClick={showCalendar}>Calendar</div>
        <div className='sideMenuButton' onClick={showNotes}>Notes</div>
        <div className='sideMenuButton' onClick={()=>setTab("gallery")}>Gallery</div>
      </SideMenu>
      {displayTab()}
      {/* {tab === "contacts" && 
      <Contacts
        imageData={imageData}
        NumbersToString={NumbersToString}
        StringToNumbers={StringToNumbers}
      >
      </Contacts>}
      {tab === "calendar" && 
      <Calendar
        imageData={imageData}
        NumbersToString={NumbersToString}
        StringToNumbers={StringToNumbers}
      >
      </Calendar>}
      {tab === "notes" && <Notes></Notes>} */}
    </div>
  );
}

export default App;
