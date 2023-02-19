export const registerAcc = (username, password, role) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem('token-redeem'));
    myHeaders.append("ngrok-skip-browser-warning", "69420");
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
    "username": username,
    "password": password,
    "role": role
    });

    let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    return fetch("http://localhost:5000/account/register", requestOptions)
    .then(response => response.json())
    .then(result => {return result})
    .catch(error => console.log('error', error));
}

export const getAcc = () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem('token-redeem'));
    myHeaders.append("ngrok-skip-browser-warning", "69420");
    
    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    return fetch("http://localhost:5000/account", requestOptions)
      .then(response => response.json())
      .then(result => {return result})
      .catch(error => console.log('error', error));
}

export const updatePassAcc = (username, password) => {
  let myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token-redeem'));
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("ngrok-skip-browser-warning", "69420");


  let raw = JSON.stringify({
    "username": username,
    "password": password
  });

  let requestOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  return fetch("http://localhost:5000/account", requestOptions)
    .then(response => response.json())
    .then(result => {return result})
    .catch(error => console.log('error', error));
}

export const updateRoleAcc = (username, role) => {
  let myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token-redeem'));
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("ngrok-skip-browser-warning", "69420");


  let raw = JSON.stringify({
    "username": username,
    "role": role
  });

  let requestOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  return fetch("http://localhost:5000/account", requestOptions)
    .then(response => response.json())
    .then(result => {return result})
    .catch(error => console.log('error', error));
}

export const removeAcc = (username) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token-redeem'));
  myHeaders.append("ngrok-skip-browser-warning", "69420");
  
  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  return fetch("http://localhost:5000/account?username=" + username, requestOptions)
    .then(response => response.json())
    .then(result => {return result})
    .catch(error => console.log('error', error));
}