import React, {useState, useEffect}  from 'react'
import Image from './Image'
import ImageMenu from './ImageMenu'
import { initializeApp } from 'firebase/app'
import { getDatabase, onValue, ref, set, push } from 'firebase/database'
import { getStorage, uploadBytes, ref as sRef, getDownloadURL, deleteObject } from 'firebase/storage'

function Contacts(props) {
    // State variables
    const [menu, setMenu] = useState(false)
    const [selectedImage, setSelectedImage] = useState({name:"", notes:"",url:"", key:""})
    const [pageRange, setPageRange] = useState({start:0, end:40})
    const [filteredContacts, setFilteredContacts] = useState([])
    var pageRangeSize = 40

    useEffect(()=>{
        //setFilteredContacts(props.imageData)
        filterContacts()
    }, [props.imageData])

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
    function addImage(name, notes, color, file){        

        // Get a unique key
        var newRef = push(ref(db, "images2"))    

        // Store the image file in storage
        uploadBytes(sRef(storage, "images2/"+newRef.key), file).then(imageUpload=>{
        
            // Get a url for the newly stored image
            getDownloadURL(imageUpload.ref).then(imageUrl=>{                

                // Put the info in state so menu knows its now in update mode 
                setSelectedImage({
                    name:name,
                    notes:notes,
                    color:color,
                    url:imageUrl,
                    key:newRef.key,
                })                

                // Put it in the db with the other info
                updateImageData2(
                    name,
                    notes,
                    color,
                    imageUrl,
                    newRef.key,
                )                               
            })                        
        })
    }    
    // Upload a new image file to an existing image
    function updateImage(name, notes, color, file, key){
        var key = selectedImage.key                

        // Make sure there is a valid key
        var keyModLen = key.replaceAll(" ","").length
        if(key == undefined || keyModLen == 0)
            return

        uploadBytes(sRef(storage, "images2/"+key), file).then(imageUpload=>{
            getDownloadURL(imageUpload.ref).then(imageUrl=>{
                updateImageData2(
                    name,
                    notes,
                    color,
                    imageUrl,
                    key,
                )
                // updateImageData({
                //     name:name,
                //     notes:notes,
                //     color:color,
                //     url:imageUrl,
                //     key:key,
                // }, key)

            })
        })
    }
    // Update image data text in the database
    function updateImageData(data, key){            

        // Make sure there is a valid key
        var keyModLen = key.replaceAll(" ","").length
        if(key == undefined || keyModLen == 0)
            return        

        // put the data in the database
        set(ref(db, "images2/"+key), data)     
                
    }
    function updateImageData2(name, notes, color, imageUrl, key){                    

        // Make sure there is a valid key
        var keyModLen = key.replaceAll(" ","").length
        if(key == undefined || keyModLen == 0)
            return        

        // put the data in the database
        set(ref(db, "images2/"+key),{
            name:props.StringToNumbers(name),
            notes:props.StringToNumbers(notes), 
            color:color, 
            url:imageUrl,
        })     
                
    }
    
    // Deletes an entire image
    function deleteImage(key) {
        if(key.replaceAll(" ","").legth==0)
            return
        deleteObject(sRef(storage, "images2/"+key))
        set(ref(db, "images2/"+key), null)
        setMenu(false)
    }
    // Deletes a file from an image
    function deleteFile(keyToDelete) {
        deleteObject(sRef(storage, "images2/"+keyToDelete))        
        set(ref(db, "images2/"+keyToDelete+"/url"), null)        
    }

    // View functions    
    function openImage(image){
        setSelectedImage(image)
        setMenu(true)
    }    
    function closeMenu(){
        setMenu(false)
    }
    function nextPage() {
        setPageRange({start: pageRange.start+pageRangeSize, end:pageRange.end+pageRangeSize})
    }
    
    function lastPage() {
        setPageRange({start: pageRange.start-pageRangeSize, end:pageRange.end-pageRangeSize})
    }
    function  filterContacts() {
        var contactSearch = document.getElementById("contactSearchField")
                
        var searchValue = contactSearch.value        

        var tempFilteredContacts = []
        props.imageData.forEach(contact => {

            if(!contact.name)
                return

            if(contact.name.includes(searchValue))
                tempFilteredContacts.push(contact)
            
        })        
        setFilteredContacts(tempFilteredContacts)
    }

    return (
        <div className='container mainContainer'>
            <div className='topBar'>
                Contacts 
                <input id='contactSearchField' className='inputField searchField' onChange={filterContacts}></input>
            </div>
            <div className='container imageContainer addImageButton' onClick={()=>openImage({name:"", notes:"",color:"", key:""})}>
                +                        
            </div>
            {filteredContacts.map((image, index)=>(                
                (index >= pageRange.start && index <= pageRange.end) &&
                <Image
                    imageData={image}
                    onClick={openImage}
                    borderColor={image.color}
                ></Image>
            ))}
            {menu && 
            <ImageMenu                
                close={closeMenu}
                selectedImage={selectedImage}                   
                addImage={addImage}
                updateImage={updateImage}
                deleteImage={deleteImage}
                deleteFile={deleteFile}
                updateImageData={updateImageData}    
                updateImageData2={updateImageData2}        
            >
            </ImageMenu>}     
            <div className='pageRangeButtonHolder'>
                <div className='pageRangeButtons'>
                    <div className='pageRangeButton' onClick={lastPage}>Last</div>
                    <div>{pageRange.start} to {pageRange.end} of {props.imageData.length}</div>
                    <div className='pageRangeButton' onClick={nextPage}>Next</div>
                </div>       
            </div>
        </div>
    )
}

export default Contacts
