import './style.css'
import { initThreeJsScene } from './threeCanvas'

const mainElement = document.querySelector<HTMLDivElement>('#app')
if (mainElement) {
  initThreeJsScene(mainElement)
}
