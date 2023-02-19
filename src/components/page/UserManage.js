import { useEffect } from "react";
import Header from "../../layout/Header";
import Sidebar from "../sidebar/Sidebar";

import Swal from 'sweetalert2'

import '../../assets/styles/component/userManager.css'
import { getAccCtrl, registerAccCtrl } from "../../controllers/register.controller";

const UserManage = () => {
    useEffect(() => {
        if(!localStorage.getItem('username-redeem')) {
            window.location.replace('/login')
        }
        if(localStorage.getItem('role-redeem') == 'user') {
            window.location.replace('/404')
        }
        document.getElementsByClassName('user-text')[0].innerHTML = localStorage.getItem('username-redeem').toUpperCase()
        document.getElementsByClassName('transfer-machine')[0].innerHTML = "Quản lý người dùng"        
    })

    //Sidebar
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

    //Register Account
    useEffect(() => {
        document.getElementById('register-btn').addEventListener('click', () => {
            if(document.getElementById('register-btn').getAttribute('click-id') == 'false') {
                document.getElementById('register-btn').setAttribute('click-id', 'true')
                let username = document.getElementById('username-register').value
                let pass = document.getElementById('pass-register').value
                let role = document.getElementById('role-register').value
                if(username == "" || pass == "" || role == "default") {
                    Swal.fire('Thao tác thất bại!', "Vui lòng nhập đầy đủ thông tin.", 'error')
                } else {
                    Swal.fire({
                        text: 'Đang tạo tài khoản ...',
                        width: 250,
                        didOpen: () => {
                            Swal.showLoading()
                        }
                    })
                    registerAccCtrl(username, pass, role)
                }
            }
        })
    })

    //Set show-hide password
    useEffect(() => {
        let state = false
        document.getElementsByClassName('toggle-pass-regis')[0].addEventListener('click', () => {
            if(state == false) {
                document.getElementsByClassName('toggle-pass-regis')[0].classList.remove('fa-eye')
                document.getElementsByClassName('toggle-pass-regis')[0].classList.add('fa-eye-slash')
                document.getElementById('pass-register').setAttribute('type', 'text')
                state = true
            } else {
                document.getElementsByClassName('toggle-pass-regis')[0].classList.remove('fa-eye-slash')
                document.getElementsByClassName('toggle-pass-regis')[0].classList.add('fa-eye')
                document.getElementById('pass-register').setAttribute('type', 'password')
                state = false
            }
        })
    })

    useEffect(() => {
        getAccCtrl()
    })
    return(
        <>
            <Sidebar />
            <div id="main">
                <Header />
                <div className="body-user-manage">
                    <div className="register-cont">
                        <div className="title-register-table title-find-code-table">
                            <div className="mark"></div>
                            <p className="title-text-table">Tạo tài khoản</p>
                        </div>
                        <div className="register-form-cont">
                            <div className="input-form-wrapper">
                                <div className="row-input">
                                    <input id="username-register" type='text' placeholder="Tên tài khoản" autoComplete="off"></input>
                                </div>
                                <div className="row-input row-register">
                                    <input id="pass-register" type='password' placeholder="Mật khẩu" autoComplete="off"></input>
                                    <i className="toggle-pass-regis fa-regular fa-eye"></i>
                                </div>
                                <div className="row-input">
                                    <select id="role-register">
                                        <option value='default'>- Phân quyền -</option>
                                        <option value='admin'>Admin</option>
                                        <option value='user'>User</option>
                                    </select>
                                </div>
                                <div id="register-btn" className="search-icon" title="Tạo tài khoản" click-id='false'>
                                    <i className="fa-solid fa-user-plus"></i>
                                    Tạo tài khoản
                                </div>        
                            </div>
                        </div>
                    </div>
                    <div className="list-user-cont">
                        <div className="title-register-table title-find-code-table">
                            <div className="mark"></div>
                            <p className="title-text-table">Danh sách người dùng</p>
                        </div>
                        <div className="find-list-user">
                            <div className="row-title-find-user">
                                <div className="td-item-title-find username-row">Tên tài khoản</div>
                                <div className="td-item-title-find role-row">Phân quyền</div>
                                <div className="td-item-title-find config-row">Thao tác</div>
                            </div>
                            <div id="body-find-user">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserManage