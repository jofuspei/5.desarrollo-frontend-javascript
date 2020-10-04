import { templateHeader } from '../templates/header.js';
import { templateFooter } from '../templates/footer.js';

import { setSelect, setErrorBox } from './tools.js';

function main() {
  let API_KEY = window.localStorage.getItem('API_KEY');
  const storageUsers = 'usuarios';

  let moviesPage = 1

  // Idioma de obtención de datos de la llamada al API de películas TheMovieDB
  // Formato ([a-z]{2})-([A-Z]{2}). Ejemplo: en-US
  const lang = 'es-ES';

  // Incluir templates
  const posicion = window.location.pathname.lastIndexOf('/') + 1;
  const page = window.location.pathname.slice(posicion);
  document.querySelector('header').innerHTML = templateHeader.render(page);
  document.querySelector('footer').innerHTML = templateFooter;

  const nationality = document.querySelector('#nationality');
  const region = document.querySelector('#region');
  
  const aNationalities = [
    {id: 'ES', nombre: 'España' , regions : [
      {id: 'MAD', nombre: 'Madrid'},
      {id: 'BCN', nombre:'Barcelona'},
      {id:'VAL', nombre:'Valencia'}
    ]},
    {id: 'EX', nombre: 'Extranjero'}];
  
  if(nationality) {
    setSelect('nationality', aNationalities);
  }

  
  const btnRegister = document.querySelector('#b_register');
  const btnBack = document.querySelector('#b_back');

  const btnLogin = document.querySelector('#b_login');

  const btnMovies = document.querySelector('#b_load');

  const btnPrev = document.querySelector('#prev');
  const btnNext = document.querySelector('#next');
  
  // Handler definitions
  if(nationality) nationality.addEventListener('change', onChangeNationality);

  if(btnRegister) btnRegister.addEventListener('click', onClickRegister);
  if(btnBack) btnBack.addEventListener('click', onClickBack);

  if(btnLogin) btnLogin.addEventListener('click', onClickLogin);

  if(btnMovies) {
      btnMovies.addEventListener('click', onLoadMovies);
      btnPrev.addEventListener('click', () => {goToPage(-1)})
      btnNext.addEventListener('click', () => {goToPage(+1)})
  }


  // Handler functions
  function onChangeNationality() {
    const aRegions = nationality.selectedIndex ? aNationalities[nationality.selectedIndex-1].regions : [];
    if(nationality.selectedOptions[0].value === 'ES'){
      setSelect('region', aRegions);
      region.parentElement.classList.remove('nodisplay');
      region.setAttribute('required', true);
    } else {
      region.parentElement.classList.add('nodisplay');
      region.removeAttribute('required');
    }
  }

  function onClickRegister(ev) {
    ev.preventDefault();
    const regForm = document.querySelector('#register_form');
  
    const user = regForm.querySelector('#i_user');
    const email = regForm.querySelector('#i_email');
    const password = regForm.querySelector('#i_pass');
    const password2 = regForm.querySelector('#i_pass2');
    const name = regForm.querySelector('#i_name');
    const phone = regForm.querySelector('#i_phone');
    const sex = [...regForm.querySelectorAll('input[name="sex"]')];
    const nationality = regForm.querySelector('#nationality');
    const region = regForm.querySelector('#region');
    const apiKey = regForm.querySelector('#i_api_key');
    const comments = regForm.querySelector('#ta_comments');
    const conditions = regForm.querySelector('#conditions');
    
    // Validaciones de formulario
    if(!regForm.checkValidity()){
      let errorMessage = '';
      if(!user.checkValidity()) errorMessage += `<p>El usuario es obligatorio</p>`;
      if(!email.checkValidity()) errorMessage += `<p>El email es obligatorio</p>`;
      if(!password.checkValidity()) errorMessage += `<p>La contraseña es obligatoria</p>`;
      if(!password2.checkValidity()) errorMessage += `<p>La confirmación de contraseña es obligatoria</p>`;
      if(!name.checkValidity()) errorMessage += `<p>El nombre es obligatorio</p>`;
      if(!phone.checkValidity()) errorMessage += `<p>El teléfono es obligatorio</p>`;
      if(!sex[0].checkValidity()) errorMessage += `<p>El género es obligatorio</p>`;
      if(!nationality.checkValidity()) errorMessage += `<p>La nacionalidad es obligatoria</p>`;
      if(region && !region.checkValidity()) errorMessage += `<p>La region es obligatoria</p>`;
      if(!apiKey.checkValidity()) errorMessage += `<p>La API key es obligatoria</p>`;
      if(!conditions.checkValidity()) errorMessage += `<p>Debes aceptar las condiciones de uso</p>`;
      
      setErrorBox(regForm, errorMessage);

      return;
    }

    const users = window.localStorage.getItem(storageUsers) ? JSON.parse(window.localStorage.getItem(storageUsers)) : [];

    const userData = {};
    userData.usuario = user.value;
    userData.correo = email.value;
    userData.pass = password.value;
    userData.pass2 = password2.value;
    userData.nombre = name.value;
    userData.telefono = phone.value;
    userData.genero = sex.filter(option => option.checked)[0].value;
    userData.pais = nationality.value;
    if(region)  userData.provincia = region.value;
    userData.apiKey = apiKey.value;
    userData.comentarios = comments.value;
    userData.condiciones = conditions.value;

    // Validaciones de datos
    if(password.value !== password2.value) {
      setErrorBox(regForm, 'Las contraseñas no coinciden');
      return;
    }

    for(let i=0; i<users.length; i++) {
      if(users[i].usuario === user.value) {
        setErrorBox(regForm, 'El usuario ya existe');
        return;
      }
      if(users[i].correo === email.value) {
        setErrorBox(regForm, 'El correo ya ha sido utilizado por otro usuario');
        return;
      }
    }

    users.push(userData);
    window.localStorage.setItem(storageUsers, JSON.stringify(users));

    // Resetear todos los campos
    regForm.querySelectorAll('input').forEach(item => item.value = '');
    regForm.querySelectorAll('select').forEach(item => item.value = '');
    regForm.querySelectorAll('input:checked').forEach(item => item.checked = false);
    regForm.querySelectorAll('textarea').forEach(item => item.value = '');  
  }

  function onClickBack() {
    window.history.back();
  }

  function onClickLogin() {
    const logForm = document.querySelector('#login_form');

    const user = logForm.querySelector('#i_user');
    const pass = logForm.querySelector('#i_pass');

    if(!logForm.checkValidity()){
      let errorMessage = '';
      if(!user.checkValidity()) errorMessage += `<p>El usuario es obligatorio</p>`;
      if(!pass.checkValidity()) errorMessage += `<p>La contraseña es obligatoria</p>`;

      setErrorBox(logForm, errorMessage);

      return;
    }

    const users = window.localStorage.getItem(storageUsers) ? JSON.parse(window.localStorage.getItem(storageUsers)) : [];
    let findUser = users.find( item => item.usuario.toUpperCase() == user.value.toUpperCase());
    
    let errorLoginMessage = '';
    if (!findUser) {
      errorLoginMessage = '<p>Usuario no encontrado</p>';
    } else if (findUser.pass !== pass.value) {
      errorLoginMessage = '<p>Contraseña incorrecta</p>';
    } else {
      window.localStorage.setItem('API_KEY', findUser.apiKey);  // Utilizamos el apiKey del usuario que se ha logeado
      window.location = 'user.html';
    }

    setErrorBox(logForm, errorLoginMessage);
  }

  function onLoadMovies() {
    let url = 'https://api.themoviedb.org/3/movie/popular?api_key=' + API_KEY;
    url += '&language=' + lang;
    url += '&page=' + moviesPage;
    
    fetch(url)
      .then( res => {
        if (res.status < 200 || res.status >= 300) {
          console.error(res.statusText);
          throw new Error('HTTP Error ' + res.status);
        }
        return res.json();
      })
      .then( data => procesaPeliculas(data))
      .catch (error => alert(error.message))
  }

  function procesaPeliculas(data) {
    let htmlPeliculas = '';
    data.results.forEach(movie => {
      htmlPeliculas += `
        <tr>
          <td>${movie.title}</td>
          <td>
            <button type="button" class="button_secondary button_small movie_detail" id="movie_${movie.id}">Info</button>
          </td>
        </tr>
        <tr><td colspan="2" id="movie_${movie.id}_detail" class="nodisplay"></td></tr>
      `;
    });

    document.querySelector('#movies').classList.remove('nodisplay');
    document.querySelector('#t_movies tbody').innerHTML = htmlPeliculas;

    document.querySelectorAll('.movie_detail').forEach( item => item.addEventListener('click', onMovieDetails));
  }

  function onMovieDetails(ev) {
    const movieID = ev.target.id.split('_')[1];
    const infoBlock = document.querySelector('#movie_' + movieID + '_detail');

    let url = 'https://api.themoviedb.org/3/movie/' + movieID + '?api_key=' + API_KEY;
    url += '&language=' + lang;

    fetch(url)
      .then( res => {
        if (res.status < 200 || res.status >= 300) {
          console.error(res.statusText);
          throw new Error('HTTP Error ' + res.status);
        }
        return res.json();
      })
      .then( data => {
        infoBlock.classList.toggle('nodisplay');
        infoBlock.innerHTML = `
          <p><b>Resumen:</b></p>
          <p>${data.overview}</p>
          <p><b>Puntuación:</b></p>
          <p>${data.vote_average}</p>
          <p><b>Fecha de estreno:</b></p>
          <p>${data.release_date}</p>
        `;
      })
      .catch (error => alert(error.message))
  }


  function goToPage(n) {
    moviesPage += n
    onLoadMovies();
    if (moviesPage > 1) {
        btnPrev.classList.remove('hidden');
    } else {
        btnPrev.classList.add('hidden');
    }
  }
}

main();