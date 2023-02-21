import Swal from 'sweetalert2'
import xlsx from 'json-as-xlsx';

export const checkAuth = () => {
  let myHeaders = new Headers();
  
  myHeaders.append("Authorization", localStorage.getItem('token-redeem'));
  
  let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  fetch("https://api.f8bet.club/checkAuth", requestOptions)
    .then(response => response.json())
    .then(result => {
      if(result.statusCode == 403) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng.')
        localStorage.clear()
        window.location.replace('/login')
      }
    })
    .catch(error => {
      console.log('error', error)
      Swal.fire('Lỗi!', 'Mất kế nối đến máy chủ', 'warning')
    });  
}

export const login = (username, password) => {
    let myHeaders = new Headers();
    
    myHeaders.append("Content-Type", "application/json");
    
    let raw = JSON.stringify({
      "username": username,
      "password": password
    });
    
    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("https://api.f8bet.club/account/login", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        if(result.username) {
            localStorage.setItem('username-redeem', result.username)
            localStorage.setItem('role-redeem', result.role)
            localStorage.setItem('token-redeem', result.token)
            
            window.location.replace('/')
        } else {
            Swal.fire('Thao tác thất bại!', result.mess, 'error')
        }
      })
      .catch(error => {
        console.log('error', error)
        Swal.fire('Lỗi!', 'Mất kế nối đến máy chủ', 'warning')
      });
}

export const generateCode = (code_length, list_code_length, date_code, promo_id, site, point, exp_code) => {
  let myHeaders = new Headers();
  
  myHeaders.append("Authorization", localStorage.getItem('token-redeem'));

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  fetch("https://api.f8bet.club/generate-code?code_length="+code_length+"&list_code_length="+list_code_length+"&date_code="+date_code+"&promo_id="+promo_id+"&site="+site+"&point="+point+"&exp_code="+exp_code+"&user_used=non&used_time=non&ip=non&fp=non", requestOptions)
    .then(response => response.json())
    .then(result => {
      document.getElementById('download-btn').setAttribute('click-id', 'false')
      console.log(result)
      let data = [
        {
          sheet: site + "_code_sheet",
          columns: [
            { label: "ID", value: "id" },
            { label: "Trang", value: "site"},
            { label: "Mã khuyến mãi", value: "promo_id"},
            { label: "Điểm thưởng", value: "point"},
            { label: "Code", value: "code"},
            { label: "Hạn sử dụng", value: "exp_code"}
          ],
          content: [],
        }
      ]

      result.detail.forEach((el) => {
        let exp_date = ("0" + new Date(el.exp_code*1).getDate()).slice(-2)
        let exp_month = ("0" + (new Date(el.exp_code*1).getMonth() +1)).slice(-2)
        let exp_year = new Date(el.exp_code*1).getFullYear()
        let exp_time = exp_date + "/" + exp_month + "/" + exp_year

        data[0].content.push({
          id: el.date_code,
          site: el.site,
          promo_id: el.promo_id,
          point: el.point,
          code: el.promo_code,
          exp_code: exp_time
        })
      })

      let settings = {
        fileName: site + "_Alibaba_code",
      }
      xlsx(data, settings)
      
      if(result.valid == true) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        })
        
        Toast.fire({
          icon: 'success',
          title: "Thêm thành công " + result.codCount + " mã khuyến mãi"
        })
      } else {
        Swal.fire('Thất bại!', "Có lỗi trong quá trình tạo code, vui lòng thử lại", 'error')
      }
    })
    .catch(error => {
      console.log('error', error)
      Swal.fire('Thất bại!', "Có lỗi trong quá trình tạo code, vui lòng thử lại", 'error')
    });  
}

export const downloadUsedCode = async() => {
  let itemResult = await findCodeOrigin()
  if(itemResult.valid == false) {
    Swal.fire('Thao tác thất bại!', 'Không tìm thấy dữ liệu', 'error')
  } else {
    let data = [
      {
        sheet: "SHBET Used_Code",
        columns: [
          { label: "ID", value: "id" },
          { label: "Trang", value: "site"},
          { label: "Mã khuyến mãi", value: "promo_id"},
          { label: "Điểm thưởng", value: "point"},
          { label: "Code", value: "code"},
          { label: "Người sử dụng", value: "user_used"},
          { label: "Địa chỉ IP", value: "ip"},
          { label: "Mã Fingerprint", value: "fp"},
          { label: "Hạn sử dụng", value: "exp_code"}
        ],
        content: [],
      }
    ]
  
    itemResult.detail.forEach((el) => {
      let exp_date = ("0" + new Date(el.exp_code*1).getDate()).slice(-2)
      let exp_month = ("0" + (new Date(el.exp_code*1).getMonth() +1)).slice(-2)
      let exp_year = new Date(el.exp_code*1).getFullYear()
      let exp_time = exp_date + "/" + exp_month + "/" + exp_year
      if(el.user_used != 'non') {
        data[0].content.push({
          id: el.date_code,
          site: el.site,
          promo_id: el.promo_id,
          point: el.point,
          code: el.promo_code,
          user_used: el.user_used,
          ip: el.ip,
          fp: el.fp,
          exp_code: exp_time
        })
      }
    })
  
    let settings = {
      fileName: "Used_Code_Sheet",
    }
    xlsx(data, settings)
  
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
    })
    Toast.fire({
      icon: 'success',
      title: "Tải thành công !"
    })
  }
}

export const deleteCode = (promo_code, date_code, promo_id, user_used, exp_code) => {
  if(promo_code != "") {
    promo_code = "promo_code="+promo_code
  }
  if(date_code != "") {
    date_code = "date_code="+date_code
  }
  if(promo_id != "") {
    promo_id = "promo_id="+promo_id
  }
  if(user_used != "") {
    user_used = "user_used="+user_used
  }
  if(exp_code != "default") {
    exp_code = "exp_code="+exp_code
  }

  function bouncer(arr) {
    return arr.filter(Boolean);
  }
  
  let newArray = bouncer([promo_code, date_code, promo_id, user_used, exp_code]);

  function removeItemAll(arr, value) {
    let i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

  let findCodeArray = removeItemAll(newArray, 'default')
  if(findCodeArray != "") {
    findCodeArray[0] = "?"+findCodeArray[0]
    for(let i = 1; i < findCodeArray.length; i++) {
      findCodeArray[i] = "&"+findCodeArray[i]
    }
  }
  
  let endPoint = "https://api.f8bet.club/code"
  findCodeArray.forEach((el) => {
    endPoint = endPoint + el
  })

  console.log(endPoint)

  let myHeaders = new Headers();
  
  myHeaders.append("Authorization", localStorage.getItem('token-redeem'));
  
  let requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(endPoint, requestOptions)
  .then(response => response.json())
  .then(result => {
    console.log(result)
    if(result.deletedCount > 0) {
      Swal.fire('Thành công!', "Xóa thành công " + result.deletedCount +" mục dữ liệu", 'success')
      .then(() => {window.location.reload()})
    } else {
      Swal.fire('Thao tác thất bại!', 'Không tìm thấy dữ liệu', 'error')
    }
  })
  .catch(error => {
    console.log('error', error)
    Swal.fire('Lỗi!', 'Mất kế nối đến máy chủ', 'warning')
  });
  
}

export const findCode = (promo_code, date_code, promo_id, user_used, ip, exp_code) => {
  if(promo_code != "") {
    promo_code = "promo_code="+promo_code
  }
  if(date_code != "") {
    date_code = "date_code="+date_code
  }
  if(promo_id != "") {
    promo_id = "promo_id="+promo_id
  }
  if(user_used != "") {
    user_used = "user_used="+user_used
  }
  if(ip != "") {
    ip = "ip="+ip
  }
  if(exp_code != "default") {
    exp_code = "exp_code="+exp_code
  }

  function bouncer(arr) {
    return arr.filter(Boolean);
  }
  
  let newArray = bouncer([promo_code, date_code, promo_id, user_used, ip, exp_code]);

  function removeItemAll(arr, value) {
    let i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

  let findCodeArray = removeItemAll(newArray, 'default')
  if(findCodeArray != "") {
    findCodeArray[0] = "?"+findCodeArray[0]
    for(let i = 1; i < findCodeArray.length; i++) {
      findCodeArray[i] = "&"+findCodeArray[i]
    }
  }
  
  let endPoint = "https://api.f8bet.club/code"
  findCodeArray.forEach((el) => {
    endPoint = endPoint + el
  })

  let myHeaders = new Headers();
  
  myHeaders.append("Authorization", localStorage.getItem('token-redeem'));
  
  let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  fetch(endPoint, requestOptions)
  .then(response => response.json())
  .then(result => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    })
    Toast.fire({
      icon: 'success',
      title: 'Tải dữ liệu thành công thành công'
    })
    console.log(result)
    if(result.valid == false){
      Swal.fire('Thao tác thất bại!', "Không tìm thấy dữ liệu, xin vui lòng thử lại.", 'error')
    } else {
      let container = document.getElementById('body-find-code')
      container.innerHTML =''
      result.detail.forEach((el) => {
        let rowItemFind = document.createElement('div')
        rowItemFind.setAttribute('class', 'row-item-find')
        container.appendChild(rowItemFind)

        let itemId = document.createElement('div')
        itemId.setAttribute('class', 'td-item-find item-id')
        itemId.innerHTML = el.date_code
        rowItemFind.appendChild(itemId)

        let itemPromoID = document.createElement('div')
        itemPromoID.setAttribute('class', 'td-item-find item-promo-id')
        itemPromoID.innerHTML = el.promo_id
        rowItemFind.appendChild(itemPromoID)

        let itemCode = document.createElement('div')
        itemCode.setAttribute('class', 'td-item-find item-code')
        itemCode.innerHTML = el.promo_code
        rowItemFind.appendChild(itemCode)

        let itemPoint = document.createElement('div')
        itemPoint.setAttribute('class', 'td-item-find item-point')
        itemPoint.innerHTML = el.point
        rowItemFind.appendChild(itemPoint)

        let itemUserUsed = document.createElement('div')
        itemUserUsed.setAttribute('class', 'td-item-find item-user-used')
        if(el.user_used == 'non') {
          itemUserUsed.innerHTML = '-'
        } else {
          itemUserUsed.innerHTML = el.user_used
        }
        rowItemFind.appendChild(itemUserUsed)
        
        let used_date = ("0" + new Date(el.used_time).getDate()).slice(-2)
        let used_month = ("0" + (new Date(el.used_time).getMonth() +1)).slice(-2)
        let used_year = new Date(el.used_time).getFullYear()
        let used_time = used_date + ' tháng ' + used_month + ', ' + used_year + `<br>` 

        let usedTime = document.createElement('div')
        usedTime.setAttribute('class', 'td-item-find item-used-time')
        if(el.used_time == 0) {
          usedTime.innerHTML = '-'
        } else {
          usedTime.innerHTML = used_time
        }
        rowItemFind.appendChild(usedTime)
        
        let itemIP = document.createElement('div')
        itemIP.setAttribute('class', 'td-item-find item-ip')
        if(el.ip == 'non' || el.ip == undefined) {
          itemIP.innerHTML = '-'
        } else {
          itemIP.innerHTML = el.ip
        }
        rowItemFind.appendChild(itemIP)

        let itemFP = document.createElement('div')
        itemFP.setAttribute('class', 'td-item-find item-fp')
        if(el.fp == 'non' || el.fp == undefined) {
          itemFP.innerHTML = '-'
        } else {
          itemFP.innerHTML = el.fp
        }
        rowItemFind.appendChild(itemFP)

        let expCode = document.createElement('div')
        expCode.setAttribute('class', 'td-item-find item-exp-code')
        rowItemFind.appendChild(expCode)

        let exp_date = ("0" + new Date(el.exp_code).getDate()).slice(-2)
        let exp_month = ("0" + (new Date(el.exp_code).getMonth() +1)).slice(-2)
        let exp_year = new Date(el.exp_code).getFullYear()
        let exp_time = exp_date + ' tháng ' + exp_month + ', ' + exp_year + `<br>` 

        let countDownDate = new Date(el.exp_code).getTime();
        let x = setInterval(function() {
          let now = new Date().getTime();
          let distance = countDownDate - now;
            
          let days = Math.floor(distance / (1000 * 60 * 60 * 24));
          let hours = ("0" + Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).slice(-2)
          let minutes = ("0" + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).slice(-2);
          let seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
          expCode.innerHTML = exp_time + days + 'd ' + hours + ":" + minutes + ":" + seconds
            
          if (distance < 0) {
            clearInterval(x);
            expCode.innerHTML = "Đã hết hạn";
          }
        }, 1000);

      })
    }
  })
  .catch(error => {
    console.log('error', error)
    Swal.fire('Lỗi!', 'Mất kế nối đến máy chủ', 'warning')
  });
}

export const updateCode = (id, value, typeID, typeValue) => {
  let myHeaders = new Headers();
  
  myHeaders.append("Content-Type", "application/json");
  
  if(typeID == "date_code") {
    if(typeValue == 'user_used') {
      let raw = JSON.stringify({
        "date_code": id,
        "user_used": value
      });
      
      let requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      fetch("https://api.f8bet.club/code", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result)
          if(result.detail.modifiedCount == 0) {
            Swal.fire('Thao tác thất bại !', 'Không tìm thấy dữ liệu, vui lòng thử lại', 'error')
          } else {
            Swal.fire('Thành công !', 'Cập nhật thành công '+result.detail.modifiedCount+' user sử dụng', 'success')
          }
        })
        .catch(error => {
          console.log('error', error)
          Swal.fire('Lỗi!', 'Mất kế nối đến máy chủ', 'warning')
        });
    }
    if(typeValue == 'point') {
      let raw = JSON.stringify({
        "date_code": id,
        "point": value
      });
      
      let requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      fetch("https://api.f8bet.club/code", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result)
          if(result.detail.modifiedCount == 0) {
            Swal.fire('Thao tác thất bại !', 'Không tìm thấy dữ liệu, vui lòng thử lại', 'error')
          } else {
            Swal.fire('Thành công !', 'Cập nhật thành công điểm thưởng', 'success')
          }
        })
        .catch(error => {
          console.log('error', error)
          Swal.fire('Lỗi!', 'Mất kế nối đến máy chủ', 'warning')
        });
    }
  }

  if(typeID == "promo_code") {
    let raw = JSON.stringify({
      "promo_code": id,
      "user_used": value
    });
    
    let requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("https://api.f8bet.club/code", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        if(result.detail.modifiedCount == 0) {
          Swal.fire('Thao tác thất bại !', 'Không tìm thấy dữ liệu, vui lòng thử lại', 'error')
        } else {
          Swal.fire('Thành công !', 'Cập nhật thành công cơ sở dữ liệu', 'success')
        }
    })
    .catch(error => {
      console.log('error', error)
      Swal.fire('Lỗi!', 'Mất kế nối đến máy chủ', 'warning')
    });
  }
}

export const findCodeOrigin = () => {
  let myHeaders = new Headers();
  
  myHeaders.append("Content-Type", "application/json");

  let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  return fetch("https://api.f8bet.club/code", requestOptions)
    .then(response => response.json())
    .then(result => {return result})
    .catch(error => console.log('error', error));
}

export const uploadCode = (data) => {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  let raw = JSON.stringify(data);
  
  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  
  fetch("https://api.f8bet.club/code", requestOptions)
  .then(response => response.json())
  .then(result => {
    console.log(result)
    Swal.fire({
      icon: 'success',
      title: 'Upload data thành công !',
    })
  })
  .catch(error => console.log('error', error));  
}