import Swal from 'sweetalert2'

import { getAcc, registerAcc, removeAcc, updatePassAcc, updateRoleAcc } from "../services/userManage.api.service"

export const registerAccCtrl = async(username, password, role) => {
    let regisResult = await registerAcc(username, password, role)
    console.log(regisResult)
    if(regisResult) {
        document.getElementById('register-btn').setAttribute('click-id', 'false')
    }
    if(regisResult.code == 502) {
        Swal.fire({
            icon: 'error',
            title: 'Tài khoản đã tồn tại !',
        })
    } else {
        if(regisResult.valid == true) {
            Swal.fire({
                icon: 'success',
                title: 'Tạo tài khoản thành công !',
            }).then(() => {
                window.location.reload()
            })
        } else if(regisResult.valid == false) {
            Swal.fire({
                icon: 'error',
                title: 'Tạo tài khoản thất bại !',
            })
        }
    }
    
}

export const getAccCtrl = async() => {
    let getAccResult = await getAcc()
    if(getAccResult.valid == true) {
        let container = document.getElementById('body-find-user')
        container.innerHTML = ''

        getAccResult.detail.forEach((el) => {
            let rowBody = document.createElement('div')
            rowBody.setAttribute('class', 'row-body-find-user')
            container.appendChild(rowBody)

            let usernameRow = document.createElement('div')
            usernameRow.setAttribute('class', 'td-item-title-find username-row')
            usernameRow.innerHTML = el.username
            rowBody.appendChild(usernameRow)

            let roleRow = document.createElement('div')
            roleRow.setAttribute('class', 'td-item-title-find role-row')
            roleRow.innerHTML = (el.role).toUpperCase()
            rowBody.appendChild(roleRow)

            let itemCont = document.createElement('div')
            itemCont.setAttribute('class', 'button-config-cont config-row')
            rowBody.appendChild(itemCont)

            let itemConfig1 = document.createElement('div')
            itemConfig1.setAttribute('class', 'config-btn change-pass')
            itemConfig1.setAttribute('username-id', el.username)
            itemConfig1.innerHTML = 'Đổi mật khẩu'
            itemCont.appendChild(itemConfig1)

            let itemConfig2 = document.createElement('div')
            itemConfig2.setAttribute('class', 'config-btn change-role')
            itemConfig2.setAttribute('username-id', el.username)
            itemConfig2.innerHTML = 'Cập nhật quyền'
            itemCont.appendChild(itemConfig2)

            let itemConfig3 = document.createElement('div')
            itemConfig3.setAttribute('class', 'config-btn remove-user')
            itemConfig3.setAttribute('username-id', el.username)
            itemConfig3.innerHTML = 'Xóa người dùng'
            itemCont.appendChild(itemConfig3)

            let icon1 = document.createElement('i')
            icon1.setAttribute('class', 'fa-solid fa-lock')
            itemConfig1.appendChild(icon1)

            let icon2 = document.createElement('i')
            icon2.setAttribute('class', 'fa-solid fa-user-tag')
            itemConfig2.appendChild(icon2)

            let icon3 = document.createElement('i')
            icon3.setAttribute('class', 'fa-solid fa-user-slash')
            itemConfig3.appendChild(icon3)
        })

        //Change pass
        document.querySelectorAll('.change-pass').forEach((el) => {
            el.addEventListener('click', async() => {
                let username = el.getAttribute('username-id')
                const { value: password } = await Swal.fire({
                    title: 'Nhập mật khẩu mới tài khoản ' + el.getAttribute('username-id'),
                    input: 'password',
                    inputPlaceholder: 'Mật khẩu mới',
                  })
                  if (password) {
                    Swal.fire({
                        text: 'Đang cập nhật mật khẩu ...',
                        width: 250,
                        didOpen: () => {
                            Swal.showLoading()
                        }
                    })
                    
                    let changePassResult = await updatePassAcc(username, password)
                    if(changePassResult.valid == true) {
                        Swal.fire('Thành công!', 'Đã cập nhật mật khẩu tài khoản ' + username, 'success')
                        .then(() => {
                            if(username == localStorage.getItem('username-redeem')) {
                                window.location.replace('/login')
                            }
                        })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Cập nhật mật khẩu thất bại !',
                        })
                    }
                  }
            })
        })

        //Change role
        document.querySelectorAll('.change-role').forEach((el) => {
            el.addEventListener('click', async() => {
                let username = el.getAttribute('username-id')
                let { value: role } = await Swal.fire({
                    icon: 'question',
                    title: 'Chọn phân quyền',
                    input: 'select',
                    inputOptions: {
                      'user': 'User',
                      'admin': 'Admin'
                    },
                    inputPlaceholder: 'Phân quyền',
                    showCancelButton: true,
                    inputValidator: (value) => {
                      return new Promise((resolve) => {
                        if (!value) {
                            resolve('Vui lòng chọn quyền')
                        } else {
                            resolve()
                        }
                      })
                    }
                  })
                if (role) {
                    Swal.fire({
                        text: 'Đang cập nhật mật khẩu ...',
                        width: 250,
                        didOpen: () => {
                            Swal.showLoading()
                        }
                    })
                    let roleResult = await updateRoleAcc(username, role)
                    if(roleResult.valid == true) {
                        Swal.fire('Thành công!', 'Đã cập nhật mật khẩu tài khoản ' + username, 'success')
                        .then(() => {
                            if(username == localStorage.getItem('username-redeem')) {
                                window.location.replace('/login')
                            }
                        })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Cập nhật quyền thất bại !',
                        })
                    }
                }
            })
        })

        //Remove acc
        document.querySelectorAll('.remove-user').forEach((el) => {
            el.addEventListener('click', () => {
                let username = el.getAttribute('username-id')
                Swal.fire({
                    icon: 'warning',
                    title: 'Bạn có chắc chắn xóa tài khoản ' + username + ' ?',
                    showCancelButton: true,
                    confirmButtonText: 'Xóa tài khoản',
                    cancelButtonText: 'Hủy'
                }).then(async (result) => {
                    if(result.isConfirmed) {
                        Swal.fire({
                            text: 'Đang xóa tài khoản ...',
                            width: 250,
                            didOpen: () => {
                                Swal.showLoading()
                            }
                        })
                        
                        let removeAccResult = await removeAcc(username)
                        if(removeAccResult.deletedCount == 0) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Không tìm thấy tài khoản !',
                            })
                        } else {
                            Swal.fire({
                                icon: 'success',
                                title: 'Xóa thành công tài khoản ' + username,
                            })
                        }
                    }
                })
            })
        })
    }
}