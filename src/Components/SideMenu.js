import React from 'react'

function SideMenu(props) {
    return (
        <div className='container sideMenu'>
            {props.children}
        </div>
    )
}

export default SideMenu
