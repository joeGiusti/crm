import { parseZone } from 'moment'
import React, { useState, useEffect } from 'react'

function EventMenu(props) {
    const [selectedContact, setSelectedContact] = useState({name:"name", contes:"notes", color:"color", url:"url", key:"key"})

    useEffect(()=>{
        contactSelected()
        setName()
    },[])

    function contactSelected() {
        var contactKey = document.getElementById("contactSelector").value
        setSelectedContact(contactKeyToData(contactKey))
        console.log(selectedContact)
    }
    function contactKeyToData(key) {
        var tempContact = selectedContact;
        props.imageData.forEach(contact=>{
            if(contact.key === key)
                tempContact=contact
        })
        
        return tempContact
    }
    function saveEvent() {        
        // Gather data
        var date = document.getElementById("eventDateInput").value
        var name = document.getElementById("eventNameInput").value
        var notes = document.getElementById("eventNotesInput").value
        var imageKey = document.getElementById("contactSelector").value
        var color = document.getElementById("eventColorInput").value

        // Sent to calendar to be saved
        if(props.selectedEvent.key === ""){
            // Add a new event, save its values in selectedEvent
            props.addEvent(date, name, notes, color, imageKey)
        }
        else{
            // Update the event based on the key
            props.updateEvent(props.selectedEvent.key, date, name, notes, color, imageKey)
        }

        // if imageKey === "New" create a new one and put its key in the proper places
        
    }    
    function deleteEvent() {
        props.deleteEvent(props.selectedEvent.key)
    }
    function setName() {
        if(props.selectedEvent != undefined)
            if(props.selectedEvent.name === "" && props.selectedContact != undefined)
                document.getElementById("eventNameInput").defaultValue = props.selectedContact.name
    }
    function choseColor() {
        
    }
    return (
        <div className={'container eventMenu'}>
            <div className='closeButton' onClick={props.closeEventMenu}>x</div>
            <div className={'contactDiv '+selectedContact.color}>
                <img id='eventContactImage' className='eventContactImg' src={selectedContact.url}></img>
                <select id='contactSelector' className='inputField' onChange={contactSelected} defaultValue={props.selectedEvent.imageKey}>
                    <option>None</option>
                    <option value={"New"}>New</option>
                    {props.imageData.map(contact => (
                        <option value={contact.key}>{contact.name}</option>
                    ))}
                </select>           
                <select id='contactColorSelect' className='inputField' defaultValue={selectedContact.color} key={selectedContact.color} onChange={choseColor}>
                    <option value={"Gray"}>Gray</option>
                    <option value={"Red"}>Red</option>
                    <option value={"Orange"}>Orange</option>
                    <option value={"Yellow"}>Yellow</option>
                    <option value={"Green"}>Green</option>
                    <option value={"Blue"}>Blue</option>
                    <option value={"Purple"}>Purple</option>  
                    <option value={"LightBlue"}>LightBlue</option>                                                            
                </select>     
                <textarea id='eventContactNotes' className='inputField' key={selectedContact.notes} defaultValue={selectedContact.notes}></textarea>                                
            </div>
            <div className='eventMenuData'>
                <input id='eventDateInput' className='inputField width90' type={"date"} defaultValue={props.selectedDay.date.format("YYYY-MM-DD")}></input>
                <br></br>
                <input id='eventNameInput' className='inputField' placeholder='event name' defaultValue={props.selectedEvent.name}></input>
                <br></br>
                <select id='eventColorInput' className='inputField' defaultValue={props.selectedEvent.color}>
                    <option value="eventBlue">Blue</option>
                    <option value="eventGray">Gray</option>
                    <option value="eventRed">Red</option>
                    <option value="eventOrange">Orange</option>
                    <option value="eventYellow">Yellow</option>
                    <option value="eventLightGreen">Light Green</option>
                    <option value="eventGreen">Green</option>
                    <option value="eventDarkGreen">Dark Green</option>
                    <option value="eventBlue">Blue</option>
                    <option value="eventPurple">Purple</option>
                    <option value={"eventLightBlue"}>LightBlue</option>  
                    <option value={"eventClear"}>Clear</option>  
                </select>
                <br></br>
                <textarea id='eventNotesInput' className='inputField' placeholder='event notes' defaultValue={props.selectedEvent.notes}></textarea>
            </div>
            <div className='bottomRow'>
                    <div className='pageRangeButton' onClick={deleteEvent}>Delete</div>
                    <div className='pageRangeButton' onClick={saveEvent}>Save</div>
                <div className='bottomRowInner'>
                </div> 
            </div>
        </div>
    )
}

export default EventMenu
