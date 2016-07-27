import init005 from './init/005.js'
import init004 from './init/004.js'

const { pathname } = window.location;

const init = () => {
  switch (pathname.replace('/', '')) {
    case '005.html':
      init005();
      break;
    case '004.html':
      init004();
      break;
    default:
  }
}
init();
