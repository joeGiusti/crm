import React, { useState, useRef, useEffect } from 'react'
import "../Styles/Gallery.css"
import MediaBox from './MediaBox'

function Gallery() {
  
    var videoLinksString=`
        https://redgifs.com/ifr/darlingsweetmammoth,
        https://redgifs.com/ifr/grubbycomplicatedgreatargus,
        https://redgifs.com/ifr/femininespottedgrison,
        https://redgifs.com/ifr/luminoustintedturtle,
        https://redgifs.com/ifr/jovialquixoticturtledove,
        https://redgifs.com/ifr/eagergorgeousatlasmoth,
        https://redgifs.com/ifr/papayawhipgoldenrodacornbarnacle,              
        https://www.pornhub.com/embed/ph5b16dc57e3b73,       
        https://redgifs.com/ifr/fondfrugalriograndeescuerzo,       
        https://redgifs.com/ifr/livefickleamericankestrel,       
        https://redgifs.com/ifr/burdensomewretchedimago,       
        https://redgifs.com/ifr/menacingunhappymallard,       
        https://redgifs.com/ifr/sameanimatedurchin, 
        https://redgifs.com/ifr/qualifiedmutedbighornsheep,       
        https://redgifs.com/ifr/wealthyinsubstantialamericancurl,       
        https://redgifs.com/ifr/shadyproudmarmot,       
        https://redgifs.com/ifr/temptingeasygoingeyra,       
        https://redgifs.com/ifr/simplisticwhiteflies,        
        https://redgifs.com/ifr/equatorialhumiliatingoropendula,
        https://redgifs.com/ifr/monthlyreadyratfish 
    `
    // Public
    const [array0, setArray0] = useState([])
    // Mild
    const [array1, setArray1] = useState([])
    // On Off
    const [array2, setArray2] = useState([])
    // Off
    const [array3, setArray3] = useState([])
    // Doing stuff || c
    const [array4, setArray4] = useState([])

    const [videoLinks, setVideoLinks] = useState([])
    const [imageLinks, setImageLinks] = useState([])
    const [counter, setCounter] = useState(0)
    const [anArray, setAnArray] = useState([])
    const counterRef = useRef(0)
    var blurLevel = useRef(30)



    useEffect(()=>{
        createVideoArray()    
        setAnArray(Array.apply(null, Array(15)))
    },[])


    function createVideoArray(){        
        setVideoLinks(videoLinksString.split(','))
      }

    function imageDragOver(e){
        e.preventDefault()
    }
    function imageDrop(e){
        e.preventDefault()
        
        // Get the file
        var files = e.dataTransfer.files

        console.log(files)

        var tempFileArray = []

        console.log("loggin files")
        var length = files.length
        console.log("length: "+files.length)
        var counter = 0
        for (var fileId in files){
            if(counter++ < (length))
                tempFileArray.push(URL.createObjectURL(files[fileId]))
        }
        console.log(tempFileArray)
        //setFileArray(tempFileArray)

            
        
        // // Get the url and display it
        // var fileUrl = URL.createObjectURL(files[0])
        // document.getElementById("imageDisplay").src = fileUrl

        // Save it in state
        // setFile(file)
    }

    function blurDown(){
        console.log("bluring down")
        console.log(blurLevel)
        var videoElements = document.getElementsByClassName("blured")
        console.log(videoElements)
        for(var videoElementId in videoElements)
          if(videoElements[videoElementId].style)
            videoElements[videoElementId].style.filter = "blur("+blurLevel.current+"px)"
    
        //setBlurLevel(blurLevel-1)
        blurLevel.current = blurLevel.current-1
    
        console.log(blurLevel)
        if(blurLevel.current > 0){
          console.log("setting timeout")
          setTimeout(()=>blurDown(), 400)      
        }
    
    }

    function getVideo(intensity){
        console.log("gettig array")
        return getArrayElement(videoLinks)
        if(intensity == 0)
            return getArrayElement(array0)
        if(intensity == 1)
            return getArrayElement(array1)
        if(intensity == 2)
            return getArrayElement(array2)
        if(intensity == 3)
            return getArrayElement(array3)
        if(intensity > 3)
            return getElementFromArrays(array3, array4)
    }
    function getArrayElement(array){
        return array[random(array.length)]
    }
    function getElementFromArrays(array1, array2){
        if((Math.random()*2)%2 == 0)
            return getArrayElement(array1)
        else
            return getArrayElement(array2)
    }
    function random(max){
        return Math.floor(Math.random()*max)
    }

    return (
        <div>                    
            {/* <div>
                <input type={"file"} id='imageDrop' onDragOver={()=>imageDragOver()} onDrop={(e)=>addImages(e)} onChange={(e)=>addImages(e)}/>
                <div onDrop={(e)=>addImages(e)}>Drop Images Here</div>
                <div className={'imageDropZone'}  onDrop={(e)=>imageDrop(e)} onDragOver={(e)=>imageDragOver(e)}>
                    Drop Images Here
                </div>
            </div> */}
            <div>
                <div className='button' onClick={blurDown}>Remove Blur</div>
            </div>
            <div className='blured'>
                {anArray.map(element=>(
                    <MediaBox
                        getVideo={getVideo}
                    ></MediaBox>
                ))}
            </div>


        </div>
    )
  // image display component
  //  could pick video or image 
  // 2 links (vertical stack), or could be double size with one link
  // changes link afer every so many seconds (user ref for the array index)
  // have different galleries, one local for when no internet
  // can click one to make it larger
}

export default Gallery