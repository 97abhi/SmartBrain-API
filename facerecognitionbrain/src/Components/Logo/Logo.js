import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './brain.png';
const Logo = () =>{
    return (
        <div className='ma4 mt0'>
        <Tilt className='Tilt br2 shadow-2 w4 h4 '>
            <div>
                <img alt='logo' style={{paddingTop : '10px'}}src={brain}/>
            </div>
        </Tilt>
        </div>
    )
}

export default Logo;