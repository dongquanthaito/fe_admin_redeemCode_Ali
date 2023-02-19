

import '../../assets/styles/component/sidebar.css'

import logoShbet from '../../assets/images/logoSH.png'
import { useEffect } from 'react'

const Sidebar = () => {
    useEffect(() => {  
        document.getElementsByClassName('icon-collapse')[0].addEventListener('click', () => {
            if(document.getElementById('sidebar').getAttribute('state-id') == 'show') {
                document.getElementById('sidebar').classList.add('sidebar-hide')
                document.getElementsByClassName('main-container')[0].classList.add('main-wide')
                document.getElementsByClassName('icon-show-nav')[0].classList.add('icon-show-nav-opacity')
                document.getElementById('sidebar').setAttribute('state-id', 'hide')
            }
        })
        
        document.getElementsByClassName('icon-show-nav')[0].addEventListener('click', () => {
            if(document.getElementById('sidebar').getAttribute('state-id') == 'hide') {
                document.getElementById('sidebar').classList.remove('sidebar-hide')
                document.getElementsByClassName('main-container')[0].classList.remove('main-wide')
                document.getElementsByClassName('icon-show-nav')[0].classList.remove('icon-show-nav-opacity')
                document.getElementById('sidebar').setAttribute('state-id', 'show')
            }
        })
        
    })

    return(
        <div id="sidebar" state-id='show'>
            <div className='sidebar-cont'>
                <img className='logo-transfer-bank' src={logoShbet}></img>
                <i className="fa-solid fa-arrow-right-from-bracket icon-collapse"></i>
                <div className='header-sidebar'>
                    <i className="fa-solid fa-circle-user"></i>
                    <span className='user-text' title='Tài khoản xuất khoản'>BAO CÔNG</span>
                </div>
                <div className='body-sidebar'>
                    <span className='title-body-sidebar'>Menu chức năng</span>
                    <div className='menu-cont'>
                        <a href='/'>
                            <div className='menu-btn-cont'>
                                <div className='menu-btn btn-top'>
                                    <div className='title-btn'>Mã khuyến mãi</div>
                                    <i className="fa-solid fa-gift"></i>
                                </div>
                            </div>
                        </a>
                        <a href='/user-manager' className='user-manager-div'>
                            <div className='menu-btn-cont'>
                                <div className='menu-btn btn-bottom'>
                                    <div className='title-btn'>Quản lý người dùng</div>
                                    <i className="fa-solid fa-users-between-lines"></i>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
                <div className='footer-sidebar'>
                    <div className='footer-text'>SHBET Redeem Code</div>
                    <div className='footer-text'>Version 1.0.5</div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar