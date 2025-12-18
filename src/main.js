import './style.css'
import { initLogin } from './components/Login.js'

document.addEventListener('DOMContentLoaded', () => {
	const mount = document.getElementById('app')
	initLogin(mount)
})
