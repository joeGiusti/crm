import React, {useEffect} from 'react'

function Image(props) {
    useEffect(()=>{

    }, [])
    return (
        <div className={'container imageContainer '+props.borderColor+" "+props.classNames} onClick={()=>props.onClick(props.imageData)}>
            <img src={props.imageData.url}></img>
            <div className='imageName'>{props.imageData.name}</div>            
        </div>
    )
}
Image.defaultValues={
    borderColor:"Gray",
    classNames:""
}
export default Image
