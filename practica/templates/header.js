export const templateHeader =  {
  render: (page) => {
    let menu, title;
    switch (page) {
      case 'index.html':
        title = 'Inicio';
        menu = `
          <li><a href="./register.html">Registro</a></li>
          <li><a href="./login.html">Login</a></li>
        `;
        break;
    
      case 'login.html':
        title = 'Login';
        menu = `
          <li><a href="./index.html">Inicio</a></li>
          <li><a href="./register.html">Registro</a></li>
        `;
        break;

      case 'register.html':
        title = 'Registro';
        menu = `
          <li><a href="./index.html">Inicio</a></li>
          <li><a href="./login.html">Login</a></li>
        `;
        break;

      default:
        title = 'Inicio';
        menu = `
          <li><a href="./register.html">Registro</a></li>
          <li><a href="./login.html">Login</a></li>
        `;
        break;
    }
    return `
      <div class="menu">
        <ul>${menu}</ul>
      </div>
      <h1>${title}</h1>
    `;
  }
};
