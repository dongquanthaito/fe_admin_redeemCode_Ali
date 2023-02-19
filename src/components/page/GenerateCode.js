import { useEffect } from "react";
import Header from "../../layout/Header";
import Sidebar from "../sidebar/Sidebar";

import Swal from 'sweetalert2'

import '../../assets/styles/pages.css'
import { deleteCode, downloadUsedCode, findCode, findCodeOrigin, generateCode, updateCode } from "../../services/api.servics";

const GenerateCode = () => {
    let roleJs

    useEffect(() => {
        if(!localStorage.getItem('username-redeem')) {
            window.location.replace('/login')
        }
        if(localStorage.getItem('role-redeem') == 'user') {
            roleJs = 'user'
            document.getElementsByClassName('input-form-cont')[0].style.display='none'
            document.getElementById('edit-btn').style.display='none'
            document.getElementById('delete-code-btn').style.display='none'
            document.getElementsByClassName('user-manager-div')[0].style.display='none'
            document.getElementsByClassName('row-input')[6].style.display='none'
            document.getElementsByClassName('row-input')[7].style.display='none'
            document.getElementsByClassName('row-input')[11].style.display='none'
        }
        document.getElementsByClassName('user-text')[0].innerHTML = localStorage.getItem('username-redeem').toUpperCase()
        document.getElementsByClassName('transfer-machine')[0].innerHTML = "Tạo mã khuyến mãi"        
    })
    //Dashboard
    useEffect(async() => {
        
        let codeResult = await findCodeOrigin()
        let numCodeUsed = 0
        let amount = 0
        codeResult.detail.forEach((el) => {
            if(el.user_used != 'non') {
                numCodeUsed++
                amount = amount + ((el.point) * 1000)
            }
        })
        document.getElementById('count-bill').innerHTML = numCodeUsed
        document.getElementById('balance').innerHTML = codeResult.detail.length
        document.getElementById('amount-currency').innerHTML = amount.toLocaleString('en-US')
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

    useEffect(() => {
        //Download code
        document.getElementById('download-btn').addEventListener('click', () => {
            let date_code = document.getElementById('id').value
            let site = document.getElementById('site').value
            let point = document.getElementById('point').value
            let list_code_length = document.getElementById('list-code-length').value
            let code_length = document.getElementById('code-length').value
            let exp_code = new Date(document.getElementById('exp-code').value  + ' 23:59:59').getTime()
            
            if(date_code=="" || site=='default' || point=="" || list_code_length=="" || code_length=="") {
                Swal.fire('Thao tác thất bại!', 'Vui lòng nhập đầy đủ thông tin.', 'error')
            } else {
                if(document.getElementById('download-btn').getAttribute('click-id') == 'false') {
                    document.getElementById('download-btn').setAttribute('click-id', 'true')
                    Swal.fire({
                        text: 'Đang tạo dữ liệu ...',
                        width: 250,
                        didOpen: () => {
                            Swal.showLoading()
                        }
                    })
                    generateCode(code_length, list_code_length, date_code, site, point, exp_code)
                }
            }
            
        })

        //Delete Code
        document.getElementById('delete-code-btn').addEventListener('click', () => {
            Swal.fire({
                title: 'Bạn chắc chắn muốn xóa ?',
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: 'Xóa',
            }).then((result) => {
            if (result.isConfirmed) {
                let promo_code = document.getElementById('find-code').value
                let date_code = document.getElementById('find-id').value
                let site = document.getElementById('find-site').value
                let user_used = document.getElementById('find-user-used').value
                let exp_code
                if(document.getElementById('find-exp-code').value == "") {
                    exp_code = "default"
                } else {
                    exp_code = new Date(document.getElementById('find-exp-code').value  + ' 23:59:59').getTime()
                }
                Swal.fire({
                    text: 'Đang xóa dữ liệu ...',
                    width: 250,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                })
                deleteCode(promo_code, date_code, site, user_used, exp_code)
            }
            })
        })

        //Find Code
        document.getElementById('search-code-btn').addEventListener('click', () => {

            let promo_code = document.getElementById('find-code').value
            let date_code = document.getElementById('find-id').value
            let site = document.getElementById('find-site').value
            let user_used = document.getElementById('find-user-used').value
            let ip = document.getElementById('find-ip').value
            let exp_code
            if(document.getElementById('find-exp-code').value == "") {
                exp_code = "default"
            } else {
                exp_code = new Date(document.getElementById('find-exp-code').value  + ' 23:59:59').getTime()
            }
            if(roleJs == "user") {
                if(promo_code == "" && user_used == "" && ip == "") {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Vui lòng nhập thông tin tìm kiếm !',
                    })
                } else {
                    Swal.fire({
                        text: 'Đang tải dữ liệu ...',
                        width: 250,
                        didOpen: () => {
                            Swal.showLoading()
                        }
                    })
                    findCode(promo_code, date_code, site, user_used, ip, exp_code)
                }
            } else {
                Swal.fire({
                    text: 'Đang tải dữ liệu ...',
                    width: 250,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                })
    
                findCode(promo_code, date_code, site, user_used, ip, exp_code)
            }
            

        })

        //Unchecked
        document.getElementById('unchecked-btn').addEventListener('click', () => {
            document.getElementById('find-code').value = ""
            document.getElementById('find-id').value = ""
            document.getElementById('find-site').value = "default"
            document.getElementById('find-user-used').value = ""
            document.getElementById('find-ip').value = ""
            document.getElementById('find-exp-code').value = 'dd/mm/yyyy'
        })

        //Edit
        document.getElementById('edit-btn').addEventListener('click', async () => {
            let { value: id_search } = await Swal.fire({
                icon: 'question',
                title: 'Chọn điều kiện cập nhật',
                input: 'select',
                inputOptions: {
                  'id': 'Cập nhật theo mã phát hành',
                  'code_promo': 'Cập nhật theo mã CODE'
                },
                inputPlaceholder: 'Điều kiện cập nhật',
                showCancelButton: true,
                inputValidator: (value) => {
                  return new Promise((resolve) => {
                    if (!value) {
                        resolve('Vui lòng chọn điều kiện')
                    } else {
                        resolve()
                    }
                  })
                }
              })
              
            if (id_search == 'id') {
                Swal.fire({
                    width: 600,
                    title: 'Chỉ nhập 1 trong 2 nội dung cập nhật: điểm thưởng hoặc user sử dụng',
                    html:
                        '<input id="id-modal" class="swal2-input" placeholder="Mã phát hành">' +
                        '<input id="point-modal" class="swal2-input" placeholder="Cập nhật điểm thưởng">' +
                        '<input id="user-used-modal" class="swal2-input" placeholder="Cập nhật user sử dụng">',
                    showCancelButton: true,
                    confirmButtonText: 'Xác nhận',
                    cancelButtonText: 'Hủy',
                    preConfirm: () => {
                        localStorage.setItem('id-modal', document.getElementById('id-modal').value)
                        localStorage.setItem('point-modal', document.getElementById('point-modal').value)
                        localStorage.setItem('user-used-modal', document.getElementById('user-used-modal').value) 
                      }
                })
                .then((result) => {
                    if(result.isConfirmed) {
                        Swal.fire({
                            text: 'Đang tìm dữ liệu ...',
                            width: 250,
                            didOpen: () => {
                                Swal.showLoading()
                            }
                        })
                        let id = localStorage.getItem('id-modal')
                        let userUsedModal = localStorage.getItem('user-used-modal')
                        let pointModal = localStorage.getItem('point-modal')
                        if(pointModal != "" && userUsedModal != "") {
                            Swal.fire('Thao tác thất bại!', 'Vui lòng chỉ nhập 1 trong 2 nội dung cập nhật: điểm thưởng hoặc user sử dụng', 'error')
                        } else {
                            if(userUsedModal != "") {
                                updateCode(id, userUsedModal, "date_code", "user_used")
                            }
                            if(pointModal != "") {
                                updateCode(id, pointModal, "date_code", "point")
                            }
                        }
                    }
                })
            }
            if (id_search == 'code_promo') {
                Swal.fire({
                    width: 600,
                    title: 'Cập nhật người sử dụng mã khuyến mãi',
                    html:
                        '<input id="code-modal" class="swal2-input" placeholder="Mã CODE">' +
                        '<input id="user-used-modal" class="swal2-input" placeholder="Cập nhật người sử dụng">',
                    showCancelButton: true,
                    confirmButtonText: 'Xác nhận',
                    cancelButtonText: 'Hủy',
                    preConfirm: () => {
                        localStorage.setItem('code-modal', document.getElementById('code-modal').value)
                        localStorage.setItem('user-used-modal', document.getElementById('user-used-modal').value) 
                    }
                })
                .then((result) => {
                    if(result.isConfirmed) {
                        Swal.fire({
                            text: 'Đang tìm dữ liệu ...',
                            width: 250,
                            didOpen: () => {
                                Swal.showLoading()
                            }
                        })
                        let code = localStorage.getItem('code-modal')
                        let userUsedModal = localStorage.getItem('user-used-modal')

                        if(userUsedModal != "") {
                            updateCode(code, userUsedModal, "promo_code", "user_used")
                        }
                        
                    }
                })
            }
        })

        //Download used code
        document.getElementById('download-code-btn').addEventListener('click', () => {
            Swal.fire({
                text: 'Đang tạo dữ liệu ...',
                width: 250,
                didOpen: () => {
                    Swal.showLoading()
                }
            })
            downloadUsedCode()
        })
    })


    return(
        <>
            <Sidebar />
            <div id="main">
                <Header />
                <div className='status-transfer'>
                    <div className='card-status-transfer'>
                        <div className='item-status-transfer'>
                            <div className='body-item-status-transfer'>
                                <p className='title-item-status-transfer'>Số code đã nhận</p>
                                <div className='num-cont-item-status-transfer'>
                                    <i className="fa-solid fa-file-import icon-item"></i>
                                    <div className='amount-item-cont'>
                                        <p id='count-bill' className='amount-item'></p>
                                        <p className='amount-item unit-item'>code</p>
                                    </div>
                                </div>
                                <div className='color-animation'></div>
                            </div>
                        </div>
                    </div>
                    <div className='card-status-transfer'>
                        <div className='item-status-transfer'>
                            <div className='body-item-status-transfer'>
                                <p className='title-item-status-transfer'>Số tiền đã phát</p>
                                <div className='num-cont-item-status-transfer'>
                                    <i className="fa-solid fa-money-bill-transfer"></i>
                                    <div className='amount-item-cont'>
                                        <p id='amount-currency' className='amount-item'></p>
                                        <p className='amount-item unit-item'>VNĐ</p>
                                    </div>
                                </div>
                                <div className='color-animation'></div>
                            </div>
                        </div>
                    </div>
                    <div className='card-status-transfer last-card'>
                        <div className='item-status-transfer'>
                            <div className='body-item-status-transfer'>
                                <p className='title-item-status-transfer'>Số code đã tạo</p>
                                <div className='num-cont-item-status-transfer'>
                                    <i className="fa-solid fa-gift"></i>
                                    <div className='amount-item-cont'>
                                        <p id='balance' className='amount-item'></p>
                                        <p className='amount-item unit-item'>code</p>
                                    </div>
                                </div>
                                <div className='color-animation'></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="input-form-cont">
                    <div className="input-form-wrapper">
                        <div className="row-input">
                            <input id="id" type='text' placeholder="Mã phát hành"></input>
                        </div>
                        <div className="row-input">
                            <select id="site">
                                <option value='default'>- Trang -</option>
                                <option value='shbet'>SHBET</option>
                                <option value='new88'>NEW88</option>
                            </select>
                        </div>
                        <div className="row-input">
                            <input id="point" type='text' placeholder="Điểm thưởng" autoComplete="off"></input>
                        </div>
                        <div className="row-input">
                            <input id="list-code-length" type='text' placeholder="Số lượng code phát hành" autoComplete="off"></input>
                        </div>
                        <div className="row-input">
                            <input id="code-length" type='text' placeholder="Số ký tự của một code" autoComplete="off"></input>
                        </div>
                        <div className="row-input">
                            <input id="exp-code" type='date' placeholder="Hạn sử dụng" title="Hạn sử dụng code"></input>
                        </div>
                    </div>
                    <div className="download-btn-cont">
                        <button id="download-btn" click-id='false'>
                            <i className="fa-solid fa-download"></i>
                            Tải code
                        </button>
                    </div>
                </div>
                <div className="find-code-cont">
                    <div className="title-find-code-table">
                        <div className="mark"></div>
                        <p className="title-text-table">Tìm mã khuyến mãi</p>
                    </div>
                    <div className="body-find-code-table">
                        <div className="input-form-wrapper">
                            <div className="row-input">
                                <input id="find-id" type='text' placeholder="Mã phát hành"></input>
                            </div>
                            <div className="row-input">
                                <select id="find-site">
                                    <option value='default'>- Trang -</option>
                                    <option value='shbet'>SHBET</option>
                                    <option value='new88'>NEW88</option>
                                </select>
                            </div>
                            <div className="row-input">
                                <input id="find-code" type='text' placeholder="Mã khuyến mãi"></input>
                            </div>
                            <div className="row-input">
                                <input id="find-user-used" type='text' placeholder="Player ID"></input>
                            </div>
                            <div className="row-input">
                                <input id="find-ip" type='text' placeholder="Địa chỉ IP"></input>
                            </div>
                            <div className="row-input">
                                <input id="find-exp-code" type='date' placeholder="Hạn sử dụng" title="Hạn sử dụng code"></input>
                            </div>
                            <div className="button-cont">
                                <div id="unchecked-btn" className="search-icon" title="Bỏ chọn tất cả">
                                    <i className="fa-solid fa-x"></i>
                                </div>
                                <div id="search-code-btn" className="search-icon" title="Tìm kiếm">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </div>
                                <div id="download-code-btn" className="search-icon" title="Tải danh sách đã nhận code">
                                    <i className="fa-solid fa-file-arrow-down"></i> 
                                </div>
                                <div id="delete-code-btn" className="search-icon" title="Xóa">
                                    <i className="fa-solid fa-trash-can"></i>
                                </div>
                                <div id="edit-btn" className="search-icon" title="Cập nhật thông tin">
                                    <i className="fa-regular fa-pen-to-square"></i>
                                </div>
                            </div>
                        </div>
                        <p className="note-find-table">
                            * Không bắc buộc nhập hết.
                            <br></br>
                            ** Nếu để trống tất cả, đồng nghĩa việc tìm hoặc xóa tất cả.
                        </p>
                    </div>
                    <div className="item-find-cont">
                        <div className="row-title-find">
                            <div className="td-item-title-find item-id">ID</div>
                            <div className="td-item-title-find item-site">Trang</div>
                            <div className="td-item-title-find item-code">Code</div>
                            <div className="td-item-title-find item-point">Điểm thưởng</div>
                            <div className="td-item-title-find item-user-used">Người sử dụng</div>
                            <div className="td-item-title-find item-used-time">Thời gian sử dụng</div>
                            <div className="td-item-title-find item-ip">Địa chỉ IP</div>
                            <div className="td-item-title-find item-fp">Mã Fingerprint</div>
                            <div className="td-item-title-find item-exp-code">Hạn sử dụng</div>
                        </div>
                        <div id="body-find-code">
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GenerateCode