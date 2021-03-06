import React from 'react'
import ReactDOM from 'react-dom'
import Statistics from './components/Statistics/index.jsx'
import Timers from './components/Timers/index.jsx'
import AppFrame from './components/AppFrame/index.jsx'
import BlackList from './components/BlackList/index.jsx'
import PopupQueue from './components/PopupQueue/index.jsx'

import { useRoot } from 'baobab-react/hooks'
import { hot } from 'react-hot-loader/root'

import './global.css'

import tree from './storage/state'
import monitorStatistics from './services/monitor_statistics'
import tickTimers from './services/tick_timers'
import sendToClock from './services/send_to_clock'

const { ipcRenderer } = global.require('electron')
import { addPopup } from './actions/popups'

import './utils/fa-library'
;(async () => {
	let timer = await monitorStatistics(tree)
	if (module.hot) {
		module.hot.addDisposeHandler(() => clearInterval(timer))
	}
})()
;(async () => {
	let timer = await tickTimers(tree)
	if (module.hot) {
		module.hot.addDisposeHandler(() => clearInterval(timer))
	}
})()
;(async () => {
	let timer = await sendToClock(tree)
	if (module.hot) {
		module.hot.addDisposeHandler(() => clearInterval(timer))
	}
})()

ipcRenderer.once('update-available', () => {
	addPopup(tree, { type: 'updater' })
})

let App = function() {
	const Root = useRoot(tree)

	ipcRenderer.send('ready-for-updates')

	return (
		<Root>
			<AppFrame />
			<div className="main_container">
				<Timers />
				<Statistics />
				<BlackList />
				<PopupQueue />
			</div>
		</Root>
	)
}

App = hot(App)
ReactDOM.render(<App />, document.getElementById('app-entry'))

if (module.hot) {
	module.hot.accept('./storage/state.js', () => location.reload())
}
