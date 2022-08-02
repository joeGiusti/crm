import React from 'react'
import './StyleSheets/Calendar.css';
import Image from './Image.js'

function CalendarDay(props) {
    function openEvent(e, event) {
        e.stopPropagation()
        props.openEventMenu(props.dayData, event)
    }
    function eventName(event) {    
        // If the event has no name but does have a contact, display the contact nane            
        if(event.name === "")
            if(event.imageKey != "")
                return contactKeyToData(event.imageKey).name
        
        // Else display the event name
        return event.name
    }

    // Get contact data from the contacts key
    function contactKeyToData(key) {    
        var tempContact = {name:""}
        props.imageData.forEach(contact=>{
            if(contact.key === key)
                tempContact = contact
        })
        
        return tempContact
    }
    function hoverFunction(e) {
        
        //console.log(e.target.offsetTop)
        //console.log(e.target.offsetRight)
                
    }
    return (
        <div className='calendarDay' onClick={()=>props.openEventMenu(props.dayData)}>
            <div className='dayDisplay'>
                {props.dayData.date.format("DD")}
                <br></br>
                {props.dayData.events.map((event, index)=>(
                    <div className={'event '+event.color} key={"event"+index} onClick={(e)=>openEvent(e, event)} onMouseEnter={(e)=>hoverFunction(e)}>
                        {eventName(event)}
                        <Image
                            classNames={" hoverMenu"}
                            imageData={contactKeyToData(event.imageKey)}
                        ></Image>
                    </div>
                    ))}
            </div>
        </div>
    )
}

export default CalendarDay
