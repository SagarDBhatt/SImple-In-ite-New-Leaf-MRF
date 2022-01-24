export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (user && user.accessToken) {
      console.log("Inside authHeader()")
      return { Authorization: 'Bearer ' + user.accessToken };
    }
    
    else {
      return {};
    }
  }