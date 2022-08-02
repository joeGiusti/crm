import React, { useState, useEffect } from 'react'
import ImageLarge from './ImageLarge'

function ImageMenu(props) {

    const [ file, setFile ] =  useState(null)
    const [ color, setColor ] =  useState("")
    const [showLargeImage, setShowLargeImage] = useState(false)

    useEffect(()=>{
        setColor(props.selectedImage.color)
    }, [])
    
    // Image database functions
    function saveImage(){                      

        // gather data
        var name = document.getElementById("imageNameInput").value
        var notes = document.getElementById("imageNotesInput").value
        var color = document.getElementById("imageColorSelect").value

        // If there is no key push new image and save key (it saves in Contacts.js state)
        if(props.selectedImage.key === "" || props.selectedImage.key == undefined)
            props.addImage(name, notes, color, file)
        // Sending a new file for an existing image (the one that is being edited)
        else if(file)
            props.updateImage(name, notes, color, file)
        // Updating text in the database (already have image url and key)
        else
            props.updateImageData2(name, notes, color, props.selectedImage.url, props.selectedImage.key)
            //props.updateImageData({name:name, notes:notes, color:color, key:props.selectedImage.key, url:props.selectedImage.url}, props.selectedImage.key)
                
    }    

    // Deletes image and all data
    function deleteImage(){
        // delete from storage
        props.deleteImage(props.selectedImage.key)   
        document.getElementById("imageDisplay").src = ""
    }
    // Keeps image in db but deletes the picture in storage
    function deleteImageFile(){
        props.deleteFile(props.selectedImage.key)
        document.getElementById("imageDisplay").src = ""
    }

    // Selection functions
    function addImage(e){

        // Get the file from the event
        var file = e.target.files[0]

        // Create a local url and display the image 
        var fileUrl = URL.createObjectURL(file)
        document.getElementById("imageDisplay").src = fileUrl

        // Put the file in state for the save function
        setFile(file)
    }
    function imageDragOver(e){
        e.preventDefault()
    }
    function imageDrop(e){
        e.preventDefault()
        
        // Get the file
        var file = e.dataTransfer.files[0]
        
        // Get the url and display it
        var fileUrl = URL.createObjectURL(file)
        document.getElementById("imageDisplay").src = fileUrl

        // Save it in state
        setFile(file)
    }
    function choseColor() {
        var newC = document.getElementById("imageColorSelect").value
        console.log("newC: "+newC)
        setColor(newC)
    }

    function openLargeImage() {
        setShowLargeImage(true)
    }
    function closeLargeImage(){
        setShowLargeImage(false)
    }

    return (
        <div className='container imageMenu'>
            <div className='closeButton' onClick={props.close}>x</div>
            <div className={'imageDiv '+color} onDragOver={(e)=>imageDragOver(e)} onDrop={(e)=>imageDrop(e)}  onClick={openLargeImage}>
                <img id='imageDisplay' src={props.selectedImage.url}></img>         
                <input id={"imageInput"} className='hidden' type={"file"} onChange={(e)=>addImage(e)}></input>   
                <label htmlFor={"imageInput"} className='circleButton addButton'>+</label>
                <div className='circleButton deleteButton' onClick={deleteImageFile}>-</div>
            </div>
            <div className='imageMenuInputDiv'>
                <input id='imageNameInput' className='inputField' defaultValue={props.selectedImage.name}></input>
                <select id='imageColorSelect' className='inputField' defaultValue={props.selectedImage.color} onChange={choseColor}>
                    <option value={"Gray"}>Gray</option>
                    <option value={"Red"}>Red</option>
                    <option value={"Orange"}>Orange</option>
                    <option value={"Yellow"}>Yellow</option>
                    <option value={"Green"}>Green</option>
                    <option value={"Blue"}>Blue</option>
                    <option value={"LightBlue"}>LightBlue</option>
                    <option value={"Purple"}>Purple</option>                                        
                </select>
                <textarea id='imageNotesInput' className='inputField imageNotesInput' defaultValue={props.selectedImage.notes}></textarea>
                <div className='menuButtonHolder'>
                    <div className='flexDIvSB'>
                        <div className='menuButton' onClick={deleteImage}>Delete</div>
                        <div className='menuButton' onClick={saveImage}>Save</div>
                    </div>
                </div>
                {showLargeImage && <ImageLarge url={props.selectedImage.url} close={closeLargeImage}></ImageLarge>}
            </div>
        </div>
    )
}

export default ImageMenu
