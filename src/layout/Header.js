import { useEffect } from 'react'
import '../assets/styles/component/header.css'
import { checkAuth } from '../services/api.servics'

const Header = () => {
    useEffect(() => {
        document.getElementsByClassName('logout-icon')[0].addEventListener('click', () => {
            localStorage.clear()
            window.location.replace('/login')
        })
        checkAuth()
        setInterval(() => {
            checkAuth()
        }, 60000);
    })
    return(
        <div id="header">
            <i class="fa-solid fa-bars-staggered icon-show-nav"></i>
            <div className='machine-info-cont'>
                <i class="fa-solid fa-signal margin-icon-nav"></i>
                <ul class="breadcrumb">
                    <li><a href="#">Admin</a></li>
                    <li className='transfer-machine'></li>
                </ul>
            </div>
            <div className='logout-cont'>
                <div className='bell-cont margin-icon-nav'>
                    <i class="fa-regular fa-bell"></i>
                    <i class="fa-solid fa-angle-down"></i>
                </div>
                <i class="fa-solid fa-door-open margin-icon-nav logout-icon" title='Đăng xuất'></i>
            </div>
        </div>
    )
}

export default Header