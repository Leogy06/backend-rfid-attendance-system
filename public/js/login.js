document.addEventListener('DOMContentLoaded', async () => {
  
  document.getElementById('email').focus();
  document.getElementById('login-form').addEventListener('submit', async(e) => {
    e.preventDefault()

    const userEmail = document.getElementById('email').value
    const userPass = document.getElementById('password').value

    fetch('http://localhost:3002/admin/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({userEmail, userPass}),
    })
    .then(response => {
      if (!response.ok) {
        
        throw new Error(`Server can't reach, Status: ${response.status}`)
      } else {
        return response.json();
      }
    })
    .then(data => {
      alert('Login success', data);
      window.location.href = 'home.html';
    })
    .catch(error => { 
      alert('Invalid credentials', error)
    })
  })
})