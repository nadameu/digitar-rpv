import './estilos.scss';
import appFactory from './appFactory';

const app = appFactory(document);
app().catch(e => console.error(e));
