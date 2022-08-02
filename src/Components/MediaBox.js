import React, { useEffect, useRef, useState } from 'react'

function MediaBox(props) {
    
    const intensity = useRef(0)
    const link = useRef(null)
    const [refresh, setRefresh] = useState(0)

    useEffect(()=>{                
        // Do this on a variable time so the links are different
        setTimeout(()=>newLink(), Math.floor(Math.random()*1000))         
    },[])

    function newLink(){
        // Get a video link from the list
        link.current = props.getVideo(intensity.current++)
        
        console.log("intensity.current "+intensity.current)

        // Refresh the dom so it shows
        setRefresh(Math.random())

        // Call the function again in a variable amount of time
        console.log("interval part: "+Math.random() * 25000)
        console.log("interval:"+(Math.floor(Math.random() * 25000)) + 15000)
        setTimeout(()=>newLink(), Math.floor(Math.random() * 25000) + 15000)

    }

    return (
        <div className='videoDiv' key={refresh}>
            <iframe src={link.current}/>
        </div>
  )
}

export default MediaBox