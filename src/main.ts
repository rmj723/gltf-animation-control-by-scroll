import * as $ from 'jquery';
import ThreeApp from './three/app';

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    const container = $('#scene-container')[0] as HTMLDivElement;
    const myApp = new ThreeApp(container);
    myApp.start();
});
