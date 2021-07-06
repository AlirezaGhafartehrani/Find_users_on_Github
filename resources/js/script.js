/* Element initiation */
const avatarEelment = document.querySelector('.flex-container__user-infotmation__up-left__img')
const nameElement = document.querySelector('.flex-container__user-infotmation__up-right__name')
const blogElement = document.querySelector('.flex-container__user-infotmation__up-right__blog-address')
const addressElement = document.querySelector('.flex-container__user-infotmation__up-right__user-address')
const bioElement= document.querySelector('.flex-container__user-infotmation__bottom__user-bio')
const inputElement = document.querySelector('.flex-container__input-name__text-input')
const btnElement = document.querySelector('.flex-container__input-name__button')
const errorElement = document.querySelector('.flex-container__user-infotmation__bottom__error')

/* variable initiation */
let username;
let dataObj;

/* Event handler on button click */
btnElement.addEventListener('click',event => {
  username = inputElement.value
  console.log(username)
  /* Puts the bioElement in front of the errorElement with helps of the z-index implemented in style.css */
  errorElement.style.display = 'none'

  /* As long as cookies hold the data as string types with semicolon (;) as separator,
  /* we should change it to JSON format in order to tackle the issue */
  if(document.cookie) {
    const cookieValue = document.cookie
    .split(';')
    .find(row => row.startsWith('data='))
    .slice(5)
    dataObj = JSON.parse(cookieValue)
    console.log(dataObj)
  }

  /* Check if the the cookie holds the user's data or not */
  if(username === dataObj?.login) {
    /* Console prints "FETCH FROM THE COOKIE" while the user's data exists in the cookie so,
    /* we fetch the data directly from the cookie */
    console.log("FETCH FROM THE COOKIE")
    avatarEelment.setAttribute('src',dataObj.avatar_url)
    nameElement.textContent = dataObj.name
    blogElement.textContent = dataObj.blog
    addressElement.textContent = dataObj.location
    bioElement.innerHTML = dataObj.bio
  }
  
  /* If the user's data has not found in the cookie,
  /* it feches it directly from github api by cocatination of the username to the defined URL address */
  else {
    fetch(`https://api.github.com/users/${username}`)
    .then(response => response.json())
    .then(data => {
      /* If the user's data was not represented in the github's data base, 
      /* "ERROR" arises in console and the display's value of errorElement changes to 'block'
      /* this will appears the errorElement in front of the bioElement 
      /* with helps of the z-index implemented in style.css */
      if(data.message === 'Not Found') {
        console.log("ERROR")
        errorElement.style.display = 'block'
      }
      /* Console prints "FETCH BY REQUEST" while the user's data doesn't exist in the cookie so,
      /* we fetch the data directly by sending the request to github api */
      console.log("FETCH BY REQUEST")
      document.cookie = `data=${JSON.stringify(data)}`
      localStorage.setItem('data',data)
      avatarEelment.setAttribute('src',data.avatar_url)
      nameElement.textContent = data.name
      blogElement.textContent = data.blog
      addressElement.textContent = data.location
      bioElement.textContent = data.bio
    })
    
    /* EXTRA MARK IMPLEMENTATION 
    /* If it can't fetch the data for any reason, it shows the "Network Error" in errorElement location */
    .catch(error=> {
      errorElement.style.display = 'block'
      errorElement.textContent = "Network Error"
    })
  }
})