import { useEffect } from "react";

import Sidebar from "../components/sidebar/Sidebar"
import Header from "./Header";

import '../assets/styles/layout/Main.css'

const Main = () => {
    useEffect(() => {
        if(!localStorage.getItem('username-redeem')) {
            window.location.replace('/login')
        }
    })
    useEffect(() => {  
        document.getElementsByClassName('icon-collapse')[0].addEventListener('click', () => {
            if(document.getElementById('sidebar').getAttribute('state-id') == 'show') {
                document.getElementById('sidebar').classList.add('sidebar-hide')
                document.getElementById('main').classList.add('main-wide')
                document.getElementsByClassName('icon-show-nav')[0].classList.add('icon-show-nav-opacity')
                document.getElementById('sidebar').setAttribute('state-id', 'hide')
            }
        })
        
        document.getElementsByClassName('icon-show-nav')[0].addEventListener('click', () => {
            if(document.getElementById('sidebar').getAttribute('state-id') == 'hide') {
                document.getElementById('sidebar').classList.remove('sidebar-hide')
                document.getElementById('main').classList.remove('main-wide')
                document.getElementsByClassName('icon-show-nav')[0].classList.remove('icon-show-nav-opacity')
                document.getElementById('sidebar').setAttribute('state-id', 'show')
            }
        }) 
    })
    return(
        <>
            <Sidebar />
            <div id="main">
                <Header />
            </div>
        </>
    )
}

export default Main