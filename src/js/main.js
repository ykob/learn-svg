import init004 from './init/004.js'

const { pathname } = window.location;

const init = () => {
  switch (pathname.replace('004.html', '')) {
    case '/':
      init004();
      break;
    default:
  }
}
init();
