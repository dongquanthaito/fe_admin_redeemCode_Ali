import { useEffect } from 'react'
import '../../assets/styles/component/login.css'
import bannerLogin from '../../assets/images/loginBanner.png'
import pattern from '../../assets/images/pattern.png'
import Swal from 'sweetalert2'
import { login } from '../../services/api.servics'

const Login = () => {
    useEffect(() => {
        let state = false
        document.getElementsByClassName('toggle-pass')[0].addEventListener('click', () => {
            if(state == false) {
                document.getElementsByClassName('toggle-pass')[0].classList.remove('fa-eye')
                document.getElementsByClassName('toggle-pass')[0].classList.add('fa-eye-slash')
                document.getElementById('password-id').setAttribute('type', 'text')
                state = true
            } else {
                document.getElementsByClassName('toggle-pass')[0].classList.remove('fa-eye-slash')
                document.getElementsByClassName('toggle-pass')[0].classList.add('fa-eye')
                document.getElementById('password-id').setAttribute('type', 'password')
                state = false
            }
        })

        window.addEventListener('keypress', e => {
            if(e.keyCode == 13) {
                document.getElementsByClassName('submit-login-btn')[0].click()
            }
        })
    })

    useEffect(() => {
        document.getElementsByClassName('submit-login-btn')[0].addEventListener('click', () => {
            let username = document.getElementById('user-id').value.toString().toLowerCase()
            let password = document.getElementById('password-id').value
            if(username == "" || password == "") {
                Swal.fire('Thao tác thất bại!', 'Vui lòng nhập đầy đủ thông tin.', 'error')
            } else {
                login(username, password)
            }
        })

        document.getElementsByClassName('change-pass-login')[0].addEventListener('click', () => {
            Swal.fire({
                icon: "info",
                title: 'Nhập thông tin',
                html:
                  '<input id="username-change" class="swal2-input" placeholder="Tên đăng nhập">' +
                  '<input id="pass=change" class="swal2-input" placeholder="Mật khẩu">',
                preConfirm: () => {
                    console.log('abc')
                    let usernameChange = document.getElementById('username-change').value
                    let passChange = document.getElementById('pass-change').value
                    if(usernameChange == '' || passChange == '') {
                        Swal.fire({
                            icon: 'error',
                            title: 'Vui lòng nhập đầy đủ thông tin',
                          })
                    }
                    
                }
              })
        })
    })
    return (
        <div id="login">
            <div className='banner-login'>
                <img src={bannerLogin}></img>
            </div>
            <div className='login-form'>
                <div className='login-form-cont'>
                    <p className='title-login'>Alibaba - Trang quản trị code</p>
                    <p className='content-login'>Vui lòng đăng nhập để sử dụng</p>
                    <div className='input-form-login'>
                        <div className='input-login-wrapper'>
                            <i className="fa-solid fa-user"></i>
                            <div className='input-login-cont'>
                                <input id='user-id' type='text' placeholder='Tên đăng nhập'></input>
                            </div>
                        </div>
                        <div className='input-login-wrapper'>
                            <i className="fa-solid fa-lock"></i>
                            <div className='input-login-cont'>
                                <input id='password-id' type='password' placeholder='Mật khẩu'></input>
                            </div>
                            <i className="toggle-pass fa-regular fa-eye"></i>
                        </div>
                        <p className='change-pass-login'>Quên mật khẩu</p>
                    </div>
                    <div className='submit-login'>
                        <button className='submit-login-btn'>Đăng nhập</button>
                    </div>
                </div>
                <img className='pattern-login' src={pattern}></img>
            </div>
        </div>
    )
}

export default Login