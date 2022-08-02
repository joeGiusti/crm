import React, {useEffect, useRef } from 'react'
import useState from 'react-usestateref'
import moment from "moment"
import CalendarDay from './CalendarDay'
import EventMenu from './EventMenu'
import { initializeApp } from 'firebase/app'
import { getDatabase, onValue, get, ref, set, push } from 'firebase/database'
import { getStorage, uploadBytes, ref as sRef, getDownloadURL } from 'firebase/storage'

function Calendar(props) {
    
    // State variables
    const [calendar, setCalendar] = useState([])
    const [events, setEvents] = useState([])
    const [eventMenu, setEventMenu] = useState(false)
    const[selectedDay, setSelectedDay] = useState({date:moment().clone(), events:[]})
    const[selectedEvent, setSelectedEvent] = useState({name:"", date:moment().clone(), notes:"", color:"", imageKey:"", key:""})    
    const[focusDay, setFocusDay, focusDayRef] = useState(false)
    const [update, setUpdate] = useState(0)
    var onValCal = false

    const stateRef = useRef();


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

    // On start
    useEffect(()=>{
        // Build an initial calendar to display before events load
        var initialCalendar = buildCalendarFromDay(moment().clone())
        setCalendar(initialCalendar)        

        // Set the today state to today
        setFocusDay(moment().clone())

        onValCal = true
        // Sets up listener for when events change
        loadEvents(initialCalendar)
        loadEventsOnce(initialCalendar)
    }, [])

    keyPress()
    function keyPress(){
        window.onkeydown = (e)=>{            
            if(e.keyCode == 32){
                
            }
        }
    }

    /*

    maybe need to send the events array to each day component
    in that component there can be a function that makes jsx out of the events with matching days
    but would taht update when state changes??

    could also restructure database so each month with an event is stored as a branch
    then all the days in the month are loaded and mapped

    this is all becasue the onValue function is ignoring the state

    state is stale if asked for in a callback**
    https://stackoverflow.com/questions/57847594/react-hooks-accessing-up-to-date-state-from-within-a-callback

    */  
    // Firebase functions
    function loadEvents() {

        onValue(ref(db, "events"), eventsSnap =>{                        
            var eventsArray = []
            eventsSnap.forEach(event=>{

                // Get the name of the image and convert it if necessary
                var imageSnapName = event.child("name").val()                        
                if(imageSnapName)
                    if(imageSnapName.includes(","))
                        imageSnapName=props.NumbersToString(imageSnapName)

                // Get the image notes and convert it if necessary
                var imageSnapNotes = event.child("notes").val()        
                if(imageSnapNotes)
                if(imageSnapNotes.includes(","))
                    imageSnapNotes=props.NumbersToString(imageSnapNotes)                    

                eventsArray.push({
                    name:imageSnapName,
                    date:moment(event.child("date").val(), "YYYY-MM-DD") ,
                    notes:imageSnapNotes,
                    color:event.child("color").val(),
                    imageKey:event.child("imageKey").val(),
                    key:event.ref.key,
                })
            })

            // if(onValCal){
                //     loadMonth(eventsArray)
                //     onValCal = false;
                // }
            setEvents(eventsArray, loadMonth(eventsArray))
                
                // Only want this to call on the first time...
            //newMonth(focusDayRef.current)
            //newMonth(moment().clone())
                return
            return;

            // Build a new calendar from the selected day (if there is none build it from today)
            if(focusDay)
                var calendar = buildCalendarFromDay(focusDay)
            else
                var calendar = buildCalendarFromDay(moment().clone())
            
            // Put the events in the event arrays
            placeEvents(calendar, eventsArray)
            
            // Save both in state
            setCalendar(calendar)
            setEvents(eventsArray)
        })        
    }
    function loadEventsOnce() {
        get(ref(db, "events")).then(eventsSnap =>{            
            var eventsArray = []
            eventsSnap.forEach(event=>{

                // Get the name of the image and convert it if necessary
                var imageSnapName = event.child("name").val()                        
                if(imageSnapName)
                    if(imageSnapName.includes(","))
                        imageSnapName=props.NumbersToString(imageSnapName)

                // Get the image notes and convert it if necessary
                var imageSnapNotes = event.child("notes").val()        
                if(imageSnapNotes)
                if(imageSnapNotes.includes(","))
                    imageSnapNotes=props.NumbersToString(imageSnapNotes)                    

                eventsArray.push({
                    name:imageSnapName,
                    date:moment(event.child("date").val(), "YYYY-MM-DD") ,
                    notes:imageSnapNotes,
                    color:event.child("color").val(),
                    imageKey:event.child("imageKey").val(),
                    key:event.ref.key,
                })
            })

            // if(onValCal){
            //     loadMonth(eventsArray)
            //     onValCal = false;
            // }
            setEvents(eventsArray)
            
            // Only want this to call on the first time...
            loadMonth(eventsArray)
            return;

            // Build a new calendar from the selected day (if there is none build it from today)
            if(focusDay)
                var calendar = buildCalendarFromDay(focusDay)
            else
                var calendar = buildCalendarFromDay(moment().clone())
            
            // Put the events in the event arrays
            placeEvents(calendar, eventsArray)
            
            // Save both in state
            setCalendar(calendar)
            setEvents(eventsArray)
        })        
    }
    function newMonth(day) {
        // Build a new calendar from the given day
        var calendar = buildCalendarFromDay(day)
        
        // Transfer events from state to the new calendar
        placeEvents(calendar, events)
        
        // Save it in state (updates dom)
        setCalendar(calendar)
    }
    function loadMonth(eventsArray){
                // Build a new calendar from the given day
                var calendar = buildCalendarFromDay(focusDayRef.current)
        
                // Transfer events from state to the new calendar
                placeEvents(calendar, eventsArray)
                
                // Save it in state (updates dom)
                setCalendar(calendar)
                setEvents(eventsArray)
    }
    function addCalendarEvent(date, name, notes, color, imageKey){
        
        push(ref(db, "events")).then(newRef=>{
            
            // Create an object with the new event data
            var newEvent = {
                date:date,
                name:props.StringToNumbers(name),
                notes:props.StringToNumbers(notes),
                color:color,
                imageKey:imageKey,
                key:newRef.key,
            }

            // Put the newEvent in the database at the new key location
            set(newRef, newEvent)

            // Event menu knows it is now in update mode if there is a key in this state
            setSelectedEvent(newEvent)
        })
    }
    function updateCalendarEvent(key, date, name, notes, color, imageKey) {
        
        // Make sure there is a valid key
        if(key == undefined || key == "")
            return

        // Create an object with the new event data
        var newEvent = {
            date:date,
            name:props.StringToNumbers(name),
            notes:props.StringToNumbers(notes),
            color:color,
            imageKey:imageKey,
            key:key,
        }

        // Update the database
        set(ref(db, "events/"+key), newEvent)

        // Save it in state idk y
        setSelectedEvent(newEvent)
    }
    function deleteCalendarEvent(key) {
        // Make sure there is a key, else could delete data
        if(key == undefined || key == "")
            return
        set(ref(db, "events/"+key), null)
        setEventMenu(false)
    }    
    
    function buildCalendarFromDay(dayToUse) {        
        if(!dayToUse)
            dayToUse = moment().clone()

        try{dayToUse.clone()
            var startDay = dayToUse.clone().startOf("month").startOf("week")
            var endDay = dayToUse.clone().endOf("month").endOf("week")
            var counterDay = startDay.clone().subtract(1, "day")
        }catch{

        return}
        var tempCalendar = []
        while(counterDay.isBefore(endDay, "day"))
            tempCalendar.push({
                date:counterDay.add(1, "day").clone(),
                events:[]
            })                
        
        return tempCalendar
    }
    function placeEvents(calendar, events) {
        events.forEach(event=>{
            placEvent(calendar, event)
        })
    }
    function placEvent(calendar, event) {
        calendar.forEach(day=>{
            if(day.date.isSame(event.date, day)){
                day.events.push(event)
                return
            }
        })
    }

    // View funcitons
    function openEventMenu(dayData, eventData) {  
        // Save dayData in state so send to event menu
        setSelectedDay(dayData)   

        // If there is event data save it in state to send to event menu
        if(eventData != undefined)
            setSelectedEvent(eventData)                    
        else
            setSelectedEvent({name:"", date:moment().clone(), notes:"", color:"", imageKey:"", key:""})                    

        // Open the event menu
        setEventMenu(true)
    }
    function closeEventMenu() {        
        setEventMenu(false)
    }
    
    function nextMonth() {

        // get a new day for the calendar to build from
        var newDay = focusDay.clone().add(1, "month")
        
        // Load a new calendar with the new month
        newMonth(newDay)
        
        // Set focus day to the new day
        setFocusDay(newDay)    
    }
    function lastMonth() {
        // get a new day for the calendar to build from
        var newDay = focusDay.clone().subtract(1, "month")
        // Load a new calendar with the new month
        newMonth(newDay)
        
        // Set focus day to the new day
        setFocusDay(newDay)
    }
    return (
        
        <div className='calendarOuter'>
            <div className='title'>{focusDay && focusDay.format("MMMM YYYY")}    </div>
            <div className='calendar'>
                <div className='month'>
                    {calendar.map((day, index)=>(
                        <CalendarDay key={"day"+index}
                            dayData={day}
                            openEventMenu={openEventMenu}
                            imageData={props.imageData}
                        >
                        </CalendarDay>
                    ))}                                                    
                    {eventMenu&&
                    <EventMenu
                        closeEventMenu={closeEventMenu}
                        imageData={props.imageData}
                        selectedDay={selectedDay}
                        selectedEvent={selectedEvent}       
                        addEvent={addCalendarEvent}    
                        deleteEvent={deleteCalendarEvent}
                        updateEvent={updateCalendarEvent}                 
                    >
                    </EventMenu>}

                </div>                
            </div>
            <div className='calendarBottomRow'>
                
                <div className='bottomButton' onClick={lastMonth}>Last</div>                    
                <div className='verticalDivider'></div>                        
                <div className='bottomButton' onClick={nextMonth}>Next</div>                                                                             
            </div>
        </div>
                
                        
    )
}

export default Calendar
