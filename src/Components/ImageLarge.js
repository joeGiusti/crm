import React from 'react';

function ImageLarge(props) {
  return (
    <div className='container imageLarge'>
        <div className='closeButton' onClick={props.close}>x</div>
        <img src={props.url}></img>
    </div>
  )
}

export default ImageLarge;
