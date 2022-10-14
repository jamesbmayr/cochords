/*** globals ***/
	/* triggers */
		const TRIGGERS = {
			input: "input",
			change: "change",
			submit: "submit",
			click: "click",
			doubleclick: "dblclick",
			contextmenu: "contextmenu",
			keydown: "keydown",
			keyup: "keyup",
			scroll: "scroll"
		}

		setTriggers()
		function setTriggers(override) {
			try {
				// get mobile right now
					let ISMOBILE = override || (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent)
					TRIGGERS.mousedown = ISMOBILE ? "touchstart" : "mousedown"
					TRIGGERS.mouseup   = ISMOBILE ? "touchend" : "mouseup"
					TRIGGERS.mousemove = ISMOBILE ? "touchmove" : "mousemove"

				// listen for move/drop
					window.addEventListener(TRIGGERS.mousemove, moveMouse)
					window.addEventListener(TRIGGERS.mouseup, upMouse)

				// override mobile later
					if (TRIGGERS.mousedown == "mousedown") {
						window.addEventListener("touchstart", setTriggers)
						return
					}
				
				// overriding --> reset listeners
					if (override) {
						window.removeEventListener("touchstart", setTriggers)
						window.removeEventListener("mousemove", moveMouse)
						window.removeEventListener("mouseup", upMouse)
					}
			} catch (error) {console.log(error)}
		}

	/* double click / right-click */
		document.addEventListener(TRIGGERS.doubleclick, preventDefault)
		document.addEventListener(TRIGGERS.contextmenu, preventDefault)
		function preventDefault(event) {
			event.preventDefault()
		}

	/* constants */
		const CONSTANTS = {
			minute: 1000 * 60, // ms
			pingLoop: 1000 * 60, // ms
			leftColumnWidth: 200, // px
			defaultTempo: 120, // bpm
			tickWidth: 5, // var(--tick-width)
			pitchHeight: 3 * 5, // var(--pitch-height) * var(--pitch-height-modifier)
			minimumDuration: 2, // ms
			ticksPerBeat: 24, // tick
			lowestPitch: 24, // midi
			highestPitch: 96, // midi
			keyboard: {
				escape: 27,
				tab: 9,
				shift: 16,
				delete: 46,
				backspace: 8,
				left: 37,
				right: 39,
				up: 38,
				down: 40
			},
			midiToColor: {
				"24": "rgb(185,  60,  60)",
				"25": "rgb(154,  91,  60)",
				"26": "rgb(123, 123,  60)",
				"27": "rgb( 91, 154,  60)",
				"28": "rgb( 60, 185,  60)",
				"29": "rgb( 60, 154,  91)",
				"30": "rgb( 60, 123, 123)",
				"31": "rgb( 60,  91, 154)",
				"32": "rgb( 60,  60, 185)",
				"33": "rgb( 91,  60, 154)",
				"34": "rgb(123,  60, 123)",
				"35": "rgb(154,  60,  91)",
				"36": "rgb(185,  60,  60)",
				"37": "rgb(154,  91,  60)",
				"38": "rgb(123, 123,  60)",
				"39": "rgb( 91, 154,  60)",
				"40": "rgb( 60, 185,  60)",
				"41": "rgb( 60, 154,  91)",
				"42": "rgb( 60, 123, 123)",
				"43": "rgb( 60,  91, 154)",
				"44": "rgb( 60,  60, 185)",
				"45": "rgb( 91,  60, 154)",
				"46": "rgb(123,  60, 123)",
				"47": "rgb(154,  60,  91)",
				"48": "rgb(215,  90,  90)",
				"49": "rgb(184, 121,  90)",
				"50": "rgb(153, 153,  90)",
				"51": "rgb(121, 184,  90)",
				"52": "rgb( 90, 215,  90)",
				"53": "rgb( 90, 184, 121)",
				"54": "rgb( 90, 153, 153)",
				"55": "rgb( 90, 121, 184)",
				"56": "rgb( 90,  90, 215)",
				"57": "rgb(121,  90, 184)",
				"58": "rgb(153,  90, 153)",
				"59": "rgb(184,  90, 121)",
				"60": "rgb(245, 120, 120)",
				"61": "rgb(214, 151, 120)",
				"62": "rgb(183, 183, 120)",
				"63": "rgb(151, 214, 120)",
				"64": "rgb(120, 245, 120)",
				"65": "rgb(120, 214, 151)",
				"66": "rgb(120, 183, 183)",
				"67": "rgb(120, 151, 214)",
				"68": "rgb(120, 120, 245)",
				"69": "rgb(151, 120, 214)",
				"70": "rgb(183, 120, 183)",
				"71": "rgb(214, 120, 151)",
				"72": "rgb(255, 150, 150)",
				"73": "rgb(244, 181, 150)",
				"74": "rgb(213, 213, 150)",
				"75": "rgb(181, 244, 150)",
				"76": "rgb(150, 255, 150)",
				"77": "rgb(150, 244, 181)",
				"78": "rgb(150, 213, 213)",
				"79": "rgb(150, 181, 244)",
				"80": "rgb(150, 150, 255)",
				"81": "rgb(181, 150, 244)",
				"82": "rgb(213, 150, 213)",
				"83": "rgb(244, 150, 181)",
				"84": "rgb(255, 180, 180)",
				"85": "rgb(244, 181, 150)",
				"86": "rgb(213, 213, 150)",
				"87": "rgb(181, 244, 150)",
				"88": "rgb(150, 255, 150)",
				"89": "rgb(150, 244, 181)",
				"90": "rgb(150, 213, 213)",
				"91": "rgb(150, 181, 244)",
				"92": "rgb(150, 150, 255)",
				"93": "rgb(181, 150, 244)",
				"94": "rgb(213, 150, 213)",
				"95": "rgb(244, 150, 181)",
				"96": "rgb(255, 180, 180)"
			}
		}

	/* state */
		const STATE = {
			composerId: null,
			musicId: null,
			music: {
				id:           null,
				created:      null,
				updated:      null,
				composers:    {},
				title:        "",
				composer:     "",
				swing:        false,
				totalTicks:   0,
				measureTicks: {},
				tempoChanges: {},
				synths:       {},
				parts:        {}
			},
			cursor: {
				held: false,
				measureNumber: null,
				ticksFromLeft: null,
				pitchesFromTop: null
			},
			selected: {
				partId: null,
				notes: []
			},
			keyboard: {
				escape: false,
				tab: false,
				shift: false,
				delete: false,
				backspace: false,
				left: false,
				right: false,
				up: false,
				down: false
			},
			keyboardListeners: {},
			playback: {
				loop: null,
				playing: false,
				swing: false,
				looping: false,
				metronome: false,
				tempo: CONSTANTS.defaultTempo,
				tempoMultiplier: 1,
				interval: null,
				currentMeasure: 1,
				currentTickOfMeasure: 0
			}
		}

	/* keyboard interaction */
		window.addEventListener(TRIGGERS.keydown, pressKey)
		function pressKey(event) {
			try {
				// in an input
					if (document.activeElement && document.activeElement.tagName.toLowerCase() == "input") {
						return
					}

				// update state
					for (let i in STATE.keyboard) {
						if (event.which == CONSTANTS.keyboard[i]) {
							STATE.keyboard[i] = new Date().getTime()
						}
					}

				// special
					if (event.which == CONSTANTS.keyboard.escape && document.activeElement.closest(".part-measure-notes")) {
						downMouseOnContainer()
					}
					if (event.which == CONSTANTS.keyboard.delete && document.activeElement.closest(".part-measure-notes")) {
						deleteNotes()
					}
			} catch (error) {console.log(error)}
		}

		window.addEventListener(TRIGGERS.keyup, liftKey)
		function liftKey(event) {
			try {
				// in an input
					if (document.activeElement && document.activeElement.tagName.toLowerCase() == "input") {
						return
					}

				// update state
					for (let i in STATE.keyboard) {
						if (event.which == CONSTANTS.keyboard[i]) {
							const keyboardHeldData = STATE.keyboard[i]
							STATE.keyboard[i] = false
							if (STATE.keyboardListeners[i]) {
								STATE.keyboardListeners[i](keyboardHeldData)
								delete STATE.keyboardListeners[i]
							}
							
						}
					}
			} catch (error) {console.log(error)}
		}

	/* elements */
		const ELEMENTS = {
			header: {
				name: document.querySelector("#header-file-name"),
				title: document.querySelector("#header-file-title"),
				composer: document.querySelector("#header-file-composer"),
				downloadMusicXML: document.querySelector("#header-file-download"),
				swing: document.querySelector("#header-playback-swing"),
				measuresCurrent: document.querySelector("#header-playback-measures-current"),
				measuresTotal: document.querySelector("#header-playback-measures-total"),
				loop: document.querySelector("#header-playback-loop"),
				metronome: document.querySelector("#header-playback-metronome"),
				tempoMultiplier: document.querySelector("#header-playback-tempo-multiplier"),
				play: document.querySelector("#header-playback-play"),
				uploadSynth: document.querySelector("#header-playback-upload-synth-input"),
			},
			content: {
				element: document.querySelector("#content-outer"),
				measuresContainer: document.querySelector("#content-measures"),
				measures: {},
				measuresSpacer: document.querySelector("#content-measures-spacer"),
				measuresAdd: document.querySelector("#content-measures-add"),
				partsContainer: document.querySelector("#content-parts"),
				parts: {},
				partsAddRow: document.querySelector("#content-parts-add-row"),
				partsAdd: document.querySelector("#content-parts-add"),
				partsSpacer: document.querySelector("#content-parts-spacer")
			}
		}

/*** tools ***/
	/* showToast */
		window.TOASTTIME = null
		function showToast(data) {
			try {
				// clear existing countdowns
					if (window.TOASTTIME) {
						clearTimeout(window.TOASTTIME)
						window.TOASTTIME = null
					}

				// append
					if (!window.TOAST) {
						window.TOAST = document.createElement("div")
						window.TOAST.id = "toast"
						window.TOAST.setAttribute("visibility", false)
						window.TOAST.setAttribute("success", false)
						document.body.appendChild(window.TOAST)
					}

				// show
					setTimeout(function() {
						window.TOAST.innerHTML = data.message
						window.TOAST.setAttribute("success", data.success || false)
						window.TOAST.setAttribute("visibility", true)
					}, 200)

				// hide
					window.TOASTTIME = setTimeout(function() {
						window.TOAST.setAttribute("visibility", false)
					}, 5000)
			} catch (error) {console.log(error)}
		}

	/* updateStorage */
		function updateStorage() {
			try {
				// get current
					const storageData = JSON.parse(window.localStorage.cochords || "{}")
					let changed = false

				// name
					if (STATE.music.composers && STATE.music.composers[STATE.composerId] && (!storageData.name || storageData.name !== STATE.music.composers[STATE.composerId].name)) {
						storageData.name = STATE.music.composers[STATE.composerId].name
						changed = true
					}

				// title
					if (!storageData.music) {
						storageData.music = []
						storageData.music.push({id: STATE.music.id, title: STATE.music.title})
						changed = true
					}
					else {
						const storedMusic = storageData.music.find(function(item) {
							return item.id == STATE.music.id
						}) || null

						if (!storedMusic) {
							storageData.music.push({
								id: STATE.music.id,
								title: STATE.music.title
							})
							changed = true
						}
						else if (!storedMusic.title || storedMusic.title !== STATE.music.title) {
							storedMusic.title = STATE.music.title
							changed = true
						}
					}

				// changed?
					if (changed) {
						window.localStorage.cochords = JSON.stringify(storageData)
					}
			} catch (error) {console.log(error)}
		}

/*** socket ***/
	/* checkSocket */
		checkSocket()
		function checkSocket() {
			createSocket()
			STATE.socketCheck = setInterval(function() {
				try {
					if (!STATE.socket) {
						try {
							createSocket()
						}
						catch (error) {console.log(error)}
					}
					else {
						clearInterval(STATE.socketCheck)
					}
				}
				catch (error) {console.log(error)}
			}, 5000)
		}

	/* createSocket */
		function createSocket() {
			try {
				let url = location.href.replace("http","ws")
					url = url.slice(0, url.includes("#") ? url.indexOf("#") : url.length)
				STATE.socket = new WebSocket(url)
				STATE.socket.onopen = function() {
					STATE.socket.send(null)
				}
				STATE.socket.onerror = function(error) {
					showToast({success: false, message: error})
				}
				STATE.socket.onclose = function() {
					showToast({success: false, message: "disconnected"})
					STATE.socket = null
					checkSocket()
				}
				STATE.socket.onmessage = function(message) {
					try {
						let post = JSON.parse(message.data)
						if (post && (typeof post == "object")) {
							receiveSocket(post)
						}
					}
					catch (error) {console.log(error)}
				}

				if (STATE.socket.pingLoop) {
					clearInterval(STATE.socket.pingLoop)
				}
				STATE.socket.pingLoop = setInterval(function() {
					fetch("/ping", {method: "GET"})
						.then(function(response){ return response.json() })
						.then(function(data) {})
				}, CONSTANTS.pingLoop)
			}
			catch (error) {console.log(error)}
		}

	/* receiveSocket */
		function receiveSocket(data) {
			try {
				// meta
					// redirect
						if (data.location) {
							window.location = data.location
							return
						}
						
					// failure
						if (!data || !data.success) {
							showToast({success: false, message: data.message || "unknown websocket error"})
						}

					// toast
						if (data.message) {
							showToast(data)
						}

				// data
					// composer id
						if (data.composerId !== undefined) {
							STATE.composerId = data.composerId
						}

					// music id
						if (data.musicId !== undefined) {
							STATE.musicId = data.musicId
						}

					// music data
						if (data.music) {
							receiveMusic(data.music)
						}
			} catch (error) {console.log(error)}
		}

	/* receiveMusic */
		function receiveMusic(musicJSON) {
			try {
				// metadata
					if (musicJSON.id !== undefined) {
						STATE.music.id = musicJSON.id
						// what if this does not match STATE.musicId ???
					}
					if (musicJSON.created !== undefined) {
						STATE.music.created = musicJSON.created
					}
					if (musicJSON.updated !== undefined) {
						STATE.music.updated = musicJSON.updated
					}
					if (musicJSON.composers !== undefined) {
						receiveComposers(musicJSON.composers)
					}

				// header
					if (musicJSON.title !== undefined) {
						receiveTitle(musicJSON.title)
					}
					if (musicJSON.composer !== undefined) {
						receiveComposer(musicJSON.composer)
					}
					if (musicJSON.swing !== undefined) {
						receiveSwing(musicJSON.swing)
					}
					if (musicJSON.totalTicks !== undefined) {
						STATE.music.totalTicks = musicJSON.totalTicks
					}
					if (musicJSON.measureTicks !== undefined) {
						receiveMeasureTicks(musicJSON.measureTicks)
					}
					if (musicJSON.tempoChanges !== undefined) {
						receiveTempoChanges(musicJSON.tempoChanges)
					}

				// parts
					if (musicJSON.synths !== undefined) {
						receiveSynths(musicJSON.synths)
					}
					if (musicJSON.parts !== undefined) {
						receiveParts(musicJSON.parts)
					}
			} catch (error) {console.log(error)}
		}

/*** header - file ***/
	/* receiveComposers */
		function receiveComposers(composers) {
			try {
				// only changed
					for (let i in composers) {
						STATE.music.composers[i] = composers[i]

						// self
							if (composers[i].id == STATE.composerId) {
								if (ELEMENTS.header.name !== document.activeElement) {
									ELEMENTS.header.name.value = composers[i].name
								}
								updateStorage()
							}
					}
			} catch (error) {console.log(error)}
		}

	/* updateName */
		ELEMENTS.header.name.addEventListener(TRIGGERS.change, updateName)
		function updateName(event) {
			try {
				// validate
					const name = ELEMENTS.header.name.value.trim()
					if (!name || !name.length) {
						return
					}

				// send to server
					STATE.socket.send(JSON.stringify({
						action: "updateName",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						name: name
					}))
			} catch (error) {console.log(error)}
		}

	/* receiveTitle */
		function receiveTitle(title) {
			try {
				// currently editing
					if (ELEMENTS.header.title == document.activeElement) {
						return
					}

				// set title
					STATE.music.title = title.trim()
					ELEMENTS.header.title.value = STATE.music.title

				// store
					updateStorage()
			} catch (error) {console.log(error)}
		}

	/* updateTitle */
		ELEMENTS.header.title.addEventListener(TRIGGERS.change, updateTitle)
		function updateTitle(event) {
			try {
				// validate
					const title = ELEMENTS.header.title.value.trim()
					if (!title || !title.length) {
						return
					}

				// send to server
					STATE.socket.send(JSON.stringify({
						action: "updateTitle",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						title: title
					}))
			} catch (error) {console.log(error)}
		}

	/* receiveComposer */
		function receiveComposer(composer) {
			try {
				// currently editing
					if (ELEMENTS.header.composer == document.activeElement) {
						return
					}

				// set composer
					STATE.music.composer = composer.trim()
					ELEMENTS.header.composer.value = STATE.music.composer
			} catch (error) {console.log(error)}
		}

	/* updateComposer */
		ELEMENTS.header.composer.addEventListener(TRIGGERS.change, updateComposer)
		function updateComposer(event) {
			try {
				// validate
					const composer = ELEMENTS.header.composer.value.trim()
					if (!composer || !composer.length) {
						return
					}

				// send to server
					STATE.socket.send(JSON.stringify({
						action: "updateComposer",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						composer: composer
					}))
			} catch (error) {console.log(error)}
		}

	/* downloadMusicXML */
		ELEMENTS.header.downloadMusicXML.addEventListener(TRIGGERS.click, downloadMusicXML)
		function downloadMusicXML(event) {
			try {
				// in progress message
					showToast({success: true, message: "exporting..."})

				// then package up
					setTimeout(function() {
						try {
							// blur
								ELEMENTS.header.downloadMusicXML.blur()

							// convert
								const musicXML = MUSICXML_J.buildMusicXML(STATE.music)

							// date
								const now = new Date()
								const year = now.getFullYear()
								const month = now.getMonth() + 1
								const day = now.getDate()
								const datestring = year + "-" + ("0" + month).slice(-2) + "-" + ("0" + day).slice(-2)

							// download link
								const downloadLink = document.createElement("a")
									downloadLink.id = "download-link"
									downloadLink.setAttribute("href", "data:text/xml;charset=utf-8," + encodeURIComponent(musicXML))
									downloadLink.setAttribute("download", (STATE.music.title || "untitled") + "_" + datestring + ".musicxml")
								document.body.appendChild(downloadLink)

							// download
								downloadLink.addEventListener(TRIGGERS.click, function() {
									const downloadLink = document.getElementById("download-link")
									document.body.removeChild(downloadLink)
									showToast({success: true, message: "musicXML downloaded"})
								})
								downloadLink.click()
							}
							catch (error) {
								console.log(error)
								showToast({success: false, message: "unable to download musicXML"})
							}
						}, 0)
			} catch (error) {console.log(error)}
		}

/*** header - playback ***/
	/* receiveSwing */
		function receiveSwing(swing) {
			try {
				// set swing
					STATE.music.swing = swing || false
					ELEMENTS.header.swing.checked = STATE.music.swing
					STATE.playback.swing = STATE.music.swing
			} catch (error) {console.log(error)}
		}

	/* updateSwing */
		ELEMENTS.header.swing.addEventListener(TRIGGERS.change, updateSwing)
		function updateSwing(event) {
			try {
				// get value
					const swing = ELEMENTS.header.swing.checked || false

				// send to server
					STATE.socket.send(JSON.stringify({
						action: "updateSwing",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						swing: swing
					}))
			} catch (error) {console.log(error)}
		}

	/* updateCurrentMeasure */
		ELEMENTS.header.measuresCurrent.addEventListener(TRIGGERS.input, updateCurrentMeasure)
		function updateCurrentMeasure(event) {
			try {
				// no measures
					const totalMeasures = Object.keys(STATE.music.measureTicks).length
					if (!totalMeasures) {
						ELEMENTS.header.measuresCurrent.value = 0
						return
					}

				// get measure
					const measureNumber = Math.floor(ELEMENTS.header.measuresCurrent.value) || 0
					if (!measureNumber || measureNumber < 0) {
						ELEMENTS.header.measuresCurrent.value = 1
						return
					}
					if (measureNumber > totalMeasures) {
						ELEMENTS.header.measuresCurrent.value = totalMeasures
						return
					}

				// set state
					STATE.playback.currentMeasure = measureNumber
					ELEMENTS.header.measuresCurrent.value = measureNumber
					STATE.playback.currentTickOfMeasure = 0

				// find measure element
					const measureElement = STATE.selected.partId ? ELEMENTS.content.parts[STATE.selected.partId].measures[measureNumber].element : ELEMENTS.content.measures[measureNumber].element
					measureElement.scrollIntoView({block: "start", inline: "start"})
			} catch (error) {console.log(error)}
		}

	/* setCurrentMeasure */
		ELEMENTS.content.element.addEventListener(TRIGGERS.scroll, setCurrentMeasure)
		function setCurrentMeasure(event) {
			try {
				// currentMeasure is active
					if (document.activeElement == ELEMENTS.header.measuresCurrent) {
						return
					}

				// playing
					if (STATE.playback.playing) {
						return
					}

				// no measures
					const firstMeasure = ELEMENTS.content.measures["1"]
					if (!firstMeasure) {
						return
					}

				// get current scroll position
					for (let m in ELEMENTS.content.measures) {
						const measureRect = ELEMENTS.content.measures[m].element.getBoundingClientRect()
						if (measureRect.x + measureRect.width > CONSTANTS.leftColumnWidth) {
							STATE.playback.currentMeasure = Number(m)
							STATE.playback.currentTickOfMeasure = 0
							ELEMENTS.header.measuresCurrent.value = STATE.playback.currentMeasure
							return
						}
					}
			} catch (error) {console.log(error)}
		}

	/* setLooping */
		ELEMENTS.header.loop.addEventListener(TRIGGERS.change, setLooping)
		function setLooping(event) {
			try {
				// set state
					STATE.playback.looping = Boolean(ELEMENTS.header.loop.checked)
			} catch (error) {console.log(error)}
		}

	/* setMetronome */
		ELEMENTS.header.metronome.addEventListener(TRIGGERS.change, setMetronome)
		function setMetronome(event) {
			try {
				// set state
					STATE.playback.metronome = Boolean(ELEMENTS.header.metronome.checked)
			} catch (error) {console.log(error)}
		}

	/* setTempoMultiplier */
		ELEMENTS.header.tempoMultiplier.addEventListener(TRIGGERS.change, setTempoMultiplier)
		function setTempoMultiplier(event) {
			try {
				// validate
					const tempoMultiplier = Number(ELEMENTS.header.tempoMultiplier.value)
					if (!tempoMultiplier || tempoMultiplier < Number(ELEMENTS.header.tempoMultiplier.min)) {
						ELEMENTS.header.tempoMultiplier.value = ELEMENTS.header.tempoMultiplier.min
						return
					}
					if (tempoMultiplier > Number(ELEMENTS.header.tempoMultiplier.max)) {
						ELEMENTS.header.tempoMultiplier.value = ELEMENTS.header.tempoMultiplier.max
						return
					}

				// set state
					STATE.playback.tempoMultiplier = tempoMultiplier

				// interval
					STATE.playback.interval = Math.round(CONSTANTS.minute / CONSTANTS.ticksPerBeat / (STATE.playback.tempo * STATE.playback.tempoMultiplier))

				// playing?
					if (STATE.playback.playing) {
						clearInterval(STATE.playback.loop)
						STATE.playback.loop = setInterval(playNextTick, STATE.playback.interval)
					}
			} catch (error) {console.log(error)}
		}

	/* setPlaying */
		ELEMENTS.header.play.addEventListener(TRIGGERS.change, setPlaying)
		function setPlaying(event) {
			try {
				// set state
					STATE.playback.playing = Boolean(ELEMENTS.header.play.checked)

				// stop?
					if (!STATE.playback.playing) {
						clearInterval(STATE.playback.loop)
						STATE.playback.loop = null

						for (let i in AUDIO_J.instruments) {
							AUDIO_J.instruments[i].setParameters({ power: 0 })
						}
						return
					}

				// tempo
					let currentTempo = CONSTANTS.defaultTempo
					for (let t in STATE.music.tempoChanges) {
						if (Number(t) <= STATE.playback.currentMeasure) {
							currentTempo = STATE.music.tempoChanges[t]
						}
					}
					STATE.playback.tempo = currentTempo

				// interval
					STATE.playback.interval = Math.round(CONSTANTS.minute / CONSTANTS.ticksPerBeat / (STATE.playback.tempo * STATE.playback.tempoMultiplier))

				// playback
					for (let i in AUDIO_J.instruments) {
						AUDIO_J.instruments[i].setParameters({ power: 1 })
					}
					STATE.playback.loop = setInterval(playNextTick, STATE.playback.interval)
			} catch (error) {console.log(error)}
		}

	/* receiveSynths */
		function receiveSynths(synths) {
			try {
				// loop through
					for (let s in synths) {
						// update state
							STATE.music.synths[s] = synths[s]
							const synthName = STATE.music.synths[s].name

						// find in parts
							for (let p in ELEMENTS.content.parts) {
								const customSynths = ELEMENTS.content.parts[p].synthCustom
								if (!customSynths.querySelector("[value='" + synthName + "']")) {
									const synthOption = document.createElement("option")
										synthOption.value = synthName
										synthOption.innerText = synthName
									customSynths.appendChild(synthOption)
								}
							}
					}
			} catch (error) {console.log(error)}
		}

	/* uploadSynth */
		ELEMENTS.header.uploadSynth.addEventListener(TRIGGERS.change, uploadSynth)
		function uploadSynth(event) {
			try {
				// file
					const file = ELEMENTS.header.uploadSynth.files[0]
					const path = ELEMENTS.header.uploadSynth.value
					if (!file || (path.slice(-5).toLowerCase() !== ".json")) {
						showToast({success: false, message: "only toneMaker-compatible JSON"})
						return
					}

				// read
					const reader = new FileReader()
						reader.readAsText(file)
						reader.onload = function(event) {
							try {
								// parse
									const uploadedString = String(event.target.result)
									const uploadedJSON = JSON.parse(uploadedString)

								// default name
									if (!uploadedJSON.name) {
										uploadedJSON.name = "synth " + (new Date().getTime())
									}

								// send to server
									STATE.socket.send(JSON.stringify({
										action: "uploadSynth",
										composerId: STATE.composerId,
										musicId: STATE.music.id,
										synth: uploadedJSON
									}))

								// blur
									ELEMENTS.header.uploadSynth.blur()
							} catch (error) {
								console.log(error)
								showToast({success: false, message: "unable to upload synth JSON"})
							}
						}
			} catch (error) {console.log(error)}
		}

/*** header - measures ***/
	/* receiveMeasureTicks */
		function receiveMeasureTicks(measureTicks) {
			try {
				// loop through measures
					for (let m in measureTicks) {
						// delete
							if (measureTicks[m] === null) {
								delete STATE.music.measureTicks[m]
								ELEMENTS.content.measures[m].element.remove()
								delete ELEMENTS.content.measures[m]
								if (STATE.playback.currentMeasure == Number(m)) {
									STATE.playback.currentMeasure = (Number(m) - 1)
								}
								continue
							}

						// upsert
							STATE.music.measureTicks[m] = measureTicks[m]
							if (!ELEMENTS.content.measures[m]) {
								ELEMENTS.content.measures[m] = buildMeasure(m)
							}
							if (!STATE.playback.currentMeasure) {
								STATE.playback.currentMeasure = 1
								ELEMENTS.header.measuresCurrent.value = 1
							}
							
							ELEMENTS.content.measures[m].element.style.width = "calc(var(--tick-width) * " + measureTicks[m] + ")";
							ELEMENTS.content.measures[m].beatsInput.value = Math.floor(measureTicks[m] / CONSTANTS.ticksPerBeat)
					}

				// set total measure count
					const measureCount = Object.keys(STATE.music.measureTicks).length
					ELEMENTS.header.measuresTotal.value = measureCount
					ELEMENTS.header.measuresCurrent.max = measureCount
					if (ELEMENTS.header.measuresCurrent.value > measureCount) {
						ELEMENTS.header.measuresCurrent.value = measureCount
					}
			} catch (error) {console.log(error)}
		}

	/* receiveTempoChanges */
		function receiveTempoChanges(tempoChanges) {
			try {
				// loop through changes
					for (let m in tempoChanges) {
						// delete
							if (tempoChanges[m] === null) {
								delete STATE.music.tempoChanges[m]
								if (ELEMENTS.content.measures[m]) {
									ELEMENTS.content.measures[m].tempoInput.value = 0
									ELEMENTS.content.measures[m].tempoInput.setAttribute("value-present", false)
								}
								continue
							}

						// upsert
							STATE.music.tempoChanges[m] = tempoChanges[m]
							ELEMENTS.content.measures[m].tempoInput.value = tempoChanges[m]
							ELEMENTS.content.measures[m].tempoInput.setAttribute("value-present", true)
					}
			} catch (error) {console.log(error)}
		}

	/* buildMeasure */
		function buildMeasure(m) {
			try {
				// measure
					const measure = document.createElement("th")
						measure.className = "music-measure"
						measure.id = "music-measure-" + m
						measure.setAttribute("measure", m)
					ELEMENTS.content.measuresContainer.insertBefore(measure, ELEMENTS.content.measuresSpacer)

				// insert measure before
					const insertButton = document.createElement("button")
						insertButton.className = "music-measure-insert"
						insertButton.innerHTML = "+"
						insertButton.title = "insert measure before " + m
						insertButton.addEventListener(TRIGGERS.click, insertMeasure)
					measure.appendChild(insertButton)

				// number
					const measureNumber = document.createElement("div")
						measureNumber.className = "music-measure-number"
						measureNumber.innerText = m
					measure.appendChild(measureNumber)

				// delete this measure
					const deleteButton = document.createElement("button")
						deleteButton.className = "music-measure-delete"
						deleteButton.innerHTML = "&times;"
						deleteButton.title = "delete measure " + m
						deleteButton.addEventListener(TRIGGERS.click, deleteMeasure)
					measure.appendChild(deleteButton)

				// beats per measure
					const beatsInput = document.createElement("input")
						beatsInput.className = "music-measure-beats"
						beatsInput.type = "number"
						beatsInput.min = "1"
						beatsInput.step = "1"
						beatsInput.placeholder = "♩"
						beatsInput.title = "measure " + m + " beats"
						beatsInput.value = "0"
						beatsInput.addEventListener(TRIGGERS.change, updateBeats)
					measure.appendChild(beatsInput)

				// bpm from measure on
					const tempoInput = document.createElement("input")
						tempoInput.className = "music-measure-tempo"
						tempoInput.type = "number"
						tempoInput.min = "1"
						tempoInput.step = "1"
						tempoInput.placeholder = "BPM"
						tempoInput.title = "measure " + m + " tempo"
						tempoInput.value = "0"
						tempoInput.addEventListener(TRIGGERS.change, updateTempo)
						tempoInput.setAttribute("value-present", false)
					measure.appendChild(tempoInput)

				// save
					return {
						element: measure,
						beatsInput: beatsInput,
						tempoInput: tempoInput,
						deleteButton: deleteButton,
						insertButton: insertButton
					}
			} catch (error) {console.log(error)}
		}

	/* addMeasure */
		ELEMENTS.content.measuresAdd.addEventListener(TRIGGERS.click, addMeasure)
		function addMeasure(event) {
			try {
				// get last measure
					const measureNumber = Object.keys(STATE.music.measureTicks).length + 1

				// send to server
					STATE.socket.send(JSON.stringify({
						action: "insertMeasure",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						measure: measureNumber
					}))
			} catch (error) {console.log(error)}
		}

	/* insertMeasure */
		function insertMeasure(event) {
			try {
				// get measure
					const measureNumber = Number(event.target.closest(".music-measure").getAttribute("measure"))
					if (!measureNumber) {
						showToast({success: false, message: "unable to find measure"})
						return
					}

				// send to server
					STATE.socket.send(JSON.stringify({
						action: "insertMeasure",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						measure: measureNumber
					}))
			} catch (error) {console.log(error)}
		}

	/* deleteMeasure */
		function deleteMeasure(event) {
			try {
				// get measure
					const measureNumber = Number(event.target.closest(".music-measure").getAttribute("measure"))
					if (!measureNumber) {
						showToast({success: false, message: "unable to find measure"})
						return
					}

				// send to server
					STATE.socket.send(JSON.stringify({
						action: "deleteMeasure",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						measure: measureNumber
					}))
			} catch (error) {console.log(error)}
		}

	/* updateBeats */
		function updateBeats(event) {
			try {
				// get measure
					const measureNumber = Number(event.target.closest(".music-measure").getAttribute("measure"))
					if (!measureNumber) {
						showToast({success: false, message: "unable to find measure"})
						return
					}

				// get beats
					const beats = Number(event.target.value) || 0
					if (!beats || beats < 0) {
						event.target.value = (STATE.music.measureTicks[String(measureNumber)] || 0) / CONSTANTS.ticksPerBeat
						showToast({success: false, message: "invalid # beats"})
						return
					}

				// get ticks
					const ticks = Math.floor(beats * CONSTANTS.ticksPerBeat)

				// send to server
					STATE.socket.send(JSON.stringify({
						action: "updateTicks",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						measure: measureNumber,
						ticks: ticks
					}))
			} catch (error) {console.log(error)}
		}

	/* updateTempo */
		function updateTempo(event) {
			try {
				// get measure
					const measureNumber = Number(event.target.closest(".music-measure").getAttribute("measure"))
					if (!measureNumber) {
						showToast({success: false, message: "unable to find measure"})
						return
					}

				// get tempo
					const tempo = Number(event.target.value) || 0
					if (tempo < 0) {
						event.target.value = STATE.music.tempoChanges[String(measureNumber)] || 0
						showToast({success: false, message: "invalid tempo"})
						return
					}

				// send to server
					STATE.socket.send(JSON.stringify({
						action: "updateTempo",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						measure: measureNumber,
						tempo: tempo
					}))
			} catch (error) {console.log(error)}
		}

/*** parts ***/
	/* receiveParts */
		function receiveParts(partsJSON) {
			try {
				// assume no order changes
					let orderChanges = null

				// loop through
					for (let id in partsJSON) {
						const partJSON = partsJSON[id]

						// delete
							if (partJSON === null) {
								delete STATE.music.parts[id]
								ELEMENTS.content.parts[id].infoContainer.remove()
								ELEMENTS.content.parts[id].measuresContainer.remove()
								delete ELEMENTS.content.parts[id]

								if (STATE.selected.partId == id) {
									STATE.selected.partId = null
									STATE.selected.notes = []
								}
								continue
							}

						// upsert
							if (!ELEMENTS.content.parts[id]) {
								STATE.music.parts[id] = {}
								ELEMENTS.content.parts[id] = buildPart(id)
							}
							
							receivePart(id, partJSON)

						// order?
							if (partJSON.order) {
								orderChanges = true
							}
					}

				// order
					if (orderChanges) {
						while (orderChanges) {
							orderChanges = false
							const rows = Array.from(ELEMENTS.content.partsContainer.querySelectorAll(".part-row"))

							for (let r = 0; r < rows.length - 1; r++) {
								const thisPart = rows[r]
								const nextPart = rows[r + 1]
								
								if (Number(thisPart.getAttribute("order")) > Number(nextPart.getAttribute("order"))) {
									ELEMENTS.content.partsContainer.insertBefore(nextPart, thisPart)
									orderChanges = true
									break
								}
							}
						}
					}
			} catch (error) {console.log(error)}
		}

	/* receivePart */
		function receivePart(partId, partJSON) {
			try {
				// get part
					const partObject = ELEMENTS.content.parts[partId]

				// editor
					if (partJSON.editorId !== undefined) {
						if (partJSON.editorId == null) {
							delete STATE.music.parts[partId].editorId
							STATE.selected.partId = null
							partObject.editorText.innerHTML = ""
							partObject.editInput.checked = false
							partObject.measuresContainer.removeAttribute("locked")
						}
						else if (partJSON.editorId == STATE.composerId) {
							STATE.selected.partId = partId
							STATE.music.parts[partId].editorId = partJSON.editorId
							partObject.editInput.checked = true
							partObject.measuresContainer.setAttribute("locked", "self")
						}
						else {
							STATE.selected.partId = null
							STATE.music.parts[partId].editorId = partJSON.editorId
							partObject.editorText.innerHTML = "&#128274;&nbsp;" + STATE.music.composers[partJSON.editorId].name
							partObject.editInput.checked = false
							partObject.measuresContainer.setAttribute("locked", "other")
						}
					}

				// info
					if (partJSON.order) {
						STATE.music.parts[partId].order = partJSON.order
						partObject.measuresContainer.setAttribute("order", partJSON.order)
					}
					if (partJSON.name) {
						STATE.music.parts[partId].name = partJSON.name
						partObject.nameInput.value = partJSON.name
					}
					if (partJSON.midiChannel) {
						STATE.music.parts[partId].midiChannel = partJSON.midiChannel
					}
					if (partJSON.instrument || partJSON.midiProgram) {
						STATE.music.parts[partId].instrument = partJSON.instrument
						STATE.music.parts[partId].midiProgram = partJSON.midiProgram
						partObject.instrumentSelect.value = partJSON.midiProgram
					}
					if (partJSON.synth) {
						STATE.music.parts[partId].synth = partJSON.synth
						partObject.synthSelect.value = partJSON.synth
					}

				// measures
					if (!STATE.music.parts[partId].staves) {
						STATE.music.parts[partId].staves = {}
					}
					for (let s in partJSON.staves) { // all parts are 1 staff
						if (!STATE.music.parts[partId].staves[s]) {
							STATE.music.parts[partId].staves[s] = {}
						}

						const measuresJSON = partJSON.staves[s]
						for (let m in measuresJSON) {
							// delete
								if (measuresJSON[m] === null) {
									delete STATE.music.parts[partId].staves[s][m]
									partObject.measures[m].element.remove()
									delete partObject.measures[m]
									continue
								}

							// upsert
								if (!partObject.measures[m]) {
									STATE.music.parts[partId].staves[s][m] = {ticks: 0, notes: {}}
									partObject.measures[m] = buildPartMeasure(partObject.measuresContainer, partObject.spacer, m)
								}

								receivePartMeasure(partObject.measures[m], STATE.music.parts[partId].staves[s][m], measuresJSON[m])
						}
					}
			} catch (error) {console.log(error)}
		}

	/* receivePartMeasure */
		function receivePartMeasure(measureObject, measureState, measureJSON) {
			try {
				// ticks
					if (measureJSON.ticks !== undefined) {
						measureState.ticks = measureJSON.ticks
						measureObject.element.style.width = "calc(var(--tick-width) * " + measureJSON.ticks + ")"
					}

				// dynamics
					if (measureJSON.dynamics === null) {
						delete measureState.dynamics
						measureObject.dynamicsInput.value = "-"
						measureObject.dynamicsInput.setAttribute("value-present", false)
					}
					else if (measureJSON.dynamics !== undefined) {
						measureState.dynamics = measureJSON.dynamics
						measureObject.dynamicsInput.value = measureJSON.dynamics
						measureObject.dynamicsInput.setAttribute("value-present", true)
					}
				
				// notes
					if (measureJSON.notes === null) {
						measureState.notes = {}
					}
					else if (measureJSON.notes !== undefined) {
						measureState.notes = measureJSON.notes
					}
					measureObject.notesContainer.innerHTML = ""

					for (let n in measureState.notes) {
						buildMeasureNote(measureObject.notesContainer, n, measureState.notes[n])
					}
			} catch (error) {console.log(error)}
		}

	/* buildPart */
		function buildPart(partId) {
			try {
				// row
					const partRow = document.createElement("tr")
						partRow.className = "part-row"
						partRow.id = "part-row-" + partId
						partRow.setAttribute("partid", partId)
						partRow.setAttribute("order", 0)
					ELEMENTS.content.partsContainer.insertBefore(partRow, ELEMENTS.content.partsAddRow)

				// info
					const infoContainer = document.createElement("th")
						infoContainer.className = "part-info"
					partRow.appendChild(infoContainer)

					const infoContainerInner = document.createElement("div")
						infoContainerInner.className = "part-info-inner"
					infoContainer.appendChild(infoContainerInner)

					// edit
						const partEditLabel = document.createElement("label")
							partEditLabel.className = "part-info-edit-outer"
						infoContainerInner.appendChild(partEditLabel)

							const partEdit = document.createElement("input")
								partEdit.className = "part-info-edit"
								partEdit.type = "checkbox"
								partEdit.addEventListener(TRIGGERS.change, updatePartEditor)
							partEditLabel.appendChild(partEdit)

							const partEditorText = document.createElement("div")
								partEditorText.innerText = ""
								partEditorText.className = "part-info-editor"
							partEditLabel.appendChild(partEditorText)

							const partEditText = document.createElement("div")
								partEditText.className = "part-info-edit-text pseudo-button"
								partEditText.innerHTML = "&#x270F;&nbsp;edit"
								partEditText.title = "edit this part"
							partEditLabel.appendChild(partEditText)

							const partDelete = document.createElement("button")
								partDelete.className = "part-info-edit-delete"
								partDelete.innerHTML = "&times;&nbsp;delete"
								partDelete.title = "permanently delete part from score"
								partDelete.addEventListener(TRIGGERS.click, deletePart)
							partEditLabel.appendChild(partDelete)

					// name
						const partNameLabel = document.createElement("label")
							partNameLabel.className = "part-info-label"
						partEditLabel.appendChild(partNameLabel)

							const partNameText = document.createElement("span")
								partNameText.innerText = "name"
							partNameLabel.appendChild(partNameText)

							const partName = document.createElement("input")
								partName.className = "part-info-name"
								partName.type = "text"
								partName.placeholder = "part name"
								partName.title = "part name"
								partName.addEventListener(TRIGGERS.change, updatePartName)
							partNameLabel.appendChild(partName)

					// instrument
						const partInstrumentLabel = document.createElement("label")
							partInstrumentLabel.className = "part-info-label"
						partEditLabel.appendChild(partInstrumentLabel)

							const partInstrumentText = document.createElement("span")
								partInstrumentText.innerText = "midi"
							partInstrumentLabel.appendChild(partInstrumentText)

							const partInstrument = document.createElement("select")
								partInstrument.className = "part-info-instrument"
								partInstrument.title = "MIDI instrument"
								partInstrument.addEventListener(TRIGGERS.change, updatePartInstrument)
							partInstrumentLabel.appendChild(partInstrument)

								const midiProgramKeys = Object.keys(MUSICXML_J.constants.midiToInstrument)
								for (let k in midiProgramKeys) {
									const option = document.createElement("option")
										option.innerText = MUSICXML_J.constants.midiToInstrument[midiProgramKeys[k]]
										option.value = midiProgramKeys[k]
									partInstrument.appendChild(option)
								}

					// synth
						const partSynthLabel = document.createElement("label")
							partSynthLabel.className = "part-info-label"
						partEditLabel.appendChild(partSynthLabel)

							const partSynthText = document.createElement("span")
								partSynthText.innerText = "synth"
							partSynthLabel.appendChild(partSynthText)

							const partSynth = document.createElement("select")
								partSynth.className = "part-info-synth"
								partSynth.title = "synth"
								partSynth.addEventListener(TRIGGERS.change, updatePartSynth)
							partSynthLabel.appendChild(partSynth)

							// simple
								const simpleSynths = AUDIO_J.getInstruments("simple")
								const simpleGroup = document.createElement("optgroup")
									simpleGroup.label = "[simple]"
								partSynth.appendChild(simpleGroup)
								
								for (let i in simpleSynths) {
									const option = document.createElement("option")
										option.innerText = simpleSynths[i]
										option.value = simpleSynths[i]
									simpleGroup.appendChild(option)
								}

							// default
								const defaultSynths = AUDIO_J.getInstruments("default")
								const defaultGroup = document.createElement("optgroup")
									defaultGroup.label = "[default]"
								partSynth.appendChild(defaultGroup)
								
								for (let i in defaultSynths) {
									const option = document.createElement("option")
										option.innerText = defaultSynths[i]
										option.value = defaultSynths[i]
									defaultGroup.appendChild(option)
								}

							// custom
								const customSynths = Object.keys(STATE.music.synths) || []
								const customGroup = document.createElement("optgroup")
									customGroup.label = "[custom]"
								partSynth.appendChild(customGroup)
								
								for (let i in customSynths) {
									const option = document.createElement("option")
										option.innerText = customSynths[i]
										option.value = customSynths[i]
									customGroup.appendChild(option)
								}

					// order
						const partOrderLabel = document.createElement("div")
							partOrderLabel.className = "part-info-order-label"
						infoContainerInner.appendChild(partOrderLabel)

							const partOrderText = document.createElement("span")
								partOrderText.innerText = "move"
							partOrderLabel.appendChild(partOrderText)

							const partOrderUp = document.createElement("button")
								partOrderUp.className = "part-info-order-up"
								partOrderUp.title = "move up"
								partOrderUp.innerHTML = "&uarr;"
								partOrderUp.value = "up"
								partOrderUp.addEventListener(TRIGGERS.click, updatePartOrder)
							partOrderLabel.appendChild(partOrderUp)

							const partOrderDown = document.createElement("button")
								partOrderDown.className = "part-info-order-down"
								partOrderDown.title = "move down"
								partOrderDown.innerHTML = "&darr;"
								partOrderDown.value = "down"
								partOrderDown.addEventListener(TRIGGERS.click, updatePartOrder)
							partOrderLabel.appendChild(partOrderDown)

					// volume
						const partVolumeLabel = document.createElement("label")
							partVolumeLabel.className = "part-info-label part-info-volume-label"
						infoContainerInner.appendChild(partVolumeLabel)

							const partVolumeText = document.createElement("span")
								partVolumeText.innerHTML = "&#x1F508;"
							partVolumeLabel.appendChild(partVolumeText)

							const partVolume = document.createElement("input")
								partVolume.className = "part-info-volume"
								partVolume.type = "range"
								partVolume.min = "0"
								partVolume.max = "1"
								partVolume.step = "0.05"
								partVolume.value = "1"
								partVolume.title = "playback volume"
								partVolume.addEventListener(TRIGGERS.input, setPartVolume)
							partVolumeLabel.appendChild(partVolume)

					// spacer
						const partSpacer = document.createElement("td")
							partSpacer.className = "part-spacer"
						partRow.appendChild(partSpacer)

						const partAfter = document.createElement("td")
							partAfter.className = "part-after"
						partRow.appendChild(partAfter)

				// object
					return {
						infoContainer: infoContainer,
						editorText: partEditorText,
						editInput: partEdit,
						volumeInput: partVolume,
						nameInput: partName,
						instrumentSelect: partInstrument,
						synthSelect: partSynth,
						synthCustom: customGroup,
						deleteButton: partDelete,
						measuresContainer: partRow,
						spacer: partSpacer,
						measures: {}
					}
			} catch (error) {console.log(error)}
		}

	/* buildPartMeasure */
		function buildPartMeasure(measuresContainer, spacer, measureNumber) {
			try {
				// measure
					const measure = document.createElement("td")
						measure.className = "part-measure"
						measure.setAttribute("measure", measureNumber)
					measuresContainer.insertBefore(measure, spacer)

				// notes container
					const notesContainer = document.createElement("div")
						notesContainer.className = "part-measure-notes"
						notesContainer.addEventListener(TRIGGERS.mousedown, downMouseOnContainer)
						notesContainer.addEventListener(TRIGGERS.doubleclick, addNote)
					measure.appendChild(notesContainer)

				// dynamics input
					const dynamicsInput = document.createElement("select")
						dynamicsInput.className = "part-measure-dynamics"
						dynamicsInput.title = "dynamics"
						dynamicsInput.value = "-"
						dynamicsInput.addEventListener(TRIGGERS.change, updatePartMeasureDynamics)
						dynamicsInput.setAttribute("value-present", false)
					measure.appendChild(dynamicsInput)

						const nullOption = document.createElement("option")
							nullOption.innerText = "-"
							nullOption.value = "-"
						dynamicsInput.appendChild(nullOption)

						let volumeCount = Object.keys(MUSICXML_J.constants.dynamicToNumber).length - 1
						for (let i in MUSICXML_J.constants.dynamicToNumber) {
							const option = document.createElement("option")
								option.innerText = volumeCount + "-" + i
								option.value = MUSICXML_J.constants.dynamicToNumber[i]
							dynamicsInput.appendChild(option)
							volumeCount--
						}

				// object
					return {
						element: measure,
						dynamicsInput: dynamicsInput,
						notesContainer: notesContainer
					}
			} catch (error) {console.log(error)}
		}

	/* buildMeasureNote */
		function buildMeasureNote(notesContainer, tickOfMeasure, pitches) {
			try {
				// loop through notes
					for (let p in pitches) {
						// note info
							const noteInfo = MUSICXML_J.constants.notes[p]
							const noteName = noteInfo[1] + (noteInfo[2] == -1 ? "♭" : noteInfo[2] == 1 ? "♯" : "") + noteInfo[3]
							const noteColor = CONSTANTS.midiToColor[p] || "var(--dark-gray)"

						// solid for now
							const noteElement = document.createElement("button")
								noteElement.className = "part-measure-note"
								noteElement.style.marginLeft = "calc(var(--tick-width) * " + tickOfMeasure + ")"
								noteElement.style.width = "calc(var(--tick-width) * " + pitches[p] + ")"
								noteElement.style.marginTop = "calc(var(--pitch-height) * var(--pitch-height-modifier) * " + (CONSTANTS.highestPitch - p) + ")"
								noteElement.style.background = noteColor
								noteElement.setAttribute("tick", tickOfMeasure)
								noteElement.setAttribute("actual-tick", tickOfMeasure)
								noteElement.setAttribute("pitch", p)
								noteElement.setAttribute("actual-pitch", p)
								noteElement.setAttribute("duration", pitches[p])
								noteElement.setAttribute("actual-duration", pitches[p])
								noteElement.addEventListener(TRIGGERS.contextmenu, rightClickOnNote)
								noteElement.addEventListener(TRIGGERS.mousedown, downMouseOnNote)
							notesContainer.appendChild(noteElement)

						// text
							const noteText = document.createElement("div")
								noteText.className = "part-measure-note-text"
								noteText.innerText = noteName
							noteElement.appendChild(noteText)

						// end
							const noteEnd = document.createElement("div")
								noteEnd.className = "part-measure-note-end"
								noteEnd.addEventListener(TRIGGERS.mousedown, downMouseOnNote)
							noteElement.appendChild(noteEnd)
					}
			} catch (error) {console.log(error)}
		}

	/* updatePartEditor */
		function updatePartEditor(event) {
			try {
				// get part
					const partId = event.target.closest(".part-row").getAttribute("partid")
					if (!partId) {
						showToast({success: false, message: "unable to find part"})
						return
					}

				// edited by you --> clear
					if (STATE.music.parts[partId].editorId == STATE.composerId) {
						STATE.socket.send(JSON.stringify({
							action: "updatePartEditor",
							composerId: STATE.composerId,
							musicId: STATE.music.id,
							partId: partId,
							editorId: null
						}))
						return
					}

				// edited by someone else
					if (STATE.music.parts[partId].editorId) {
						showToast({success: false, message: "part is being edited"})
						ELEMENTS.content.parts[partId].editInput.checked = false
						return
					}

				// available
					STATE.socket.send(JSON.stringify({
						action: "updatePartEditor",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						partId: partId,
						editorId: STATE.composerId
					}))
			} catch (error) {console.log(error)}
		}

	/* updatePartName */
		function updatePartName(event) {
			try {
				// get part
					const partId = event.target.closest(".part-row").getAttribute("partid")
					if (!partId) {
						showToast({success: false, message: "unable to find part"})
						return
					}

				// edited by someone else
					if (STATE.music.parts[partId].editorId !== STATE.composerId) {
						return
					}

				// get name
					const name = event.target.value.trim() || ""
					if (!name || !name.length) {
						event.target.value = STATE.music.parts[partId].name
						showToast({success: false, message: "cannot remove instrument name"})
						return
					}

				// send to server
					STATE.socket.send(JSON.stringify({
						action: "updatePartName",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						partId: partId,
						name: name
					}))
			} catch (error) {console.log(error)}
		}

	/* updatePartInstrument */
		function updatePartInstrument(event) {
			try {
				// get part
					const partId = event.target.closest(".part-row").getAttribute("partid")
					if (!partId) {
						showToast({success: false, message: "unable to find part"})
						return
					}

				// edited by someone else
					if (STATE.music.parts[partId].editorId !== STATE.composerId) {
						return
					}

				// get instrument
					const midiProgram = event.target.value
					if (!(midiProgram in MUSICXML_J.constants.midiToInstrument)) {
						event.target.value = STATE.music.parts[partId].midiProgram
						showToast({success: false, message: "unknown instrument"})
						return
					}

				// send to server
					STATE.socket.send(JSON.stringify({
						action: "updatePartInstrument",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						partId: partId,
						midiProgram: midiProgram
					}))
			} catch (error) {console.log(error)}
		}

	/* updatePartSynth */
		function updatePartSynth(event) {
			try {
				// get part
					const partId = event.target.closest(".part-row").getAttribute("partid")
					if (!partId) {
						showToast({success: false, message: "unable to find part"})
						return
					}

				// edited by someone else
					if (STATE.music.parts[partId].editorId !== STATE.composerId) {
						return
					}

				// get synth
					const synth = event.target.value
					if (!synth || !synth.length) {
						event.target.value = STATE.music.parts[partId].synth
						showToast({success: false, message: "unknown synth"})
						return
					}

				// send to server
					STATE.socket.send(JSON.stringify({
						action: "updatePartSynth",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						partId: partId,
						synth: synth
					}))
			} catch (error) {console.log(error)}
		}

	/* updatePartOrder */
		function updatePartOrder(event) {
			try {
				// get part
					const partId = event.target.closest(".part-row").getAttribute("partid")
					if (!partId) {
						showToast({success: false, message: "unable to find part"})
						return
					}

				// direction
					const direction = event.target.value
					if (direction !== "up" && direction !== "down") {
						return
					}

				// first?
					if (direction == "up" && STATE.music.parts[partId].order == 1) {
						return
					}

				// last
					if (direction == "down" && STATE.music.parts[partId].order == Object.keys(STATE.music.parts).length) {
						return
					}

				// send to server
					STATE.socket.send(JSON.stringify({
						action: "updatePartOrder",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						partId: partId,
						direction: direction
					}))
			} catch (error) {console.log(error)}
		}

	/* setPartVolume */
		function setPartVolume(event) {
			try {
				// get part
					const partId = event.target.closest(".part-row").getAttribute("partid")
					if (!partId) {
						showToast({success: false, message: "unable to find part"})
						return
					}

				// no audio_j
					if (!AUDIO_J.audio || !AUDIO_J.instruments[partId]) {
						return
					}

				// get volume
					const volume = Math.min(1, Math.max(0, Number(event.target.value)))

				// set instrument
					AUDIO_J.instruments[partId].setParameters({volume: volume})
			} catch (error) {console.log(error)}
		}

	/* deletePart */
		function deletePart(event) {
			try {
				// get part
					const partId = event.target.closest(".part-row").getAttribute("partid")
					if (!partId) {
						showToast({success: false, message: "unable to find part"})
						return
					}

				// edited by someone else
					if (STATE.music.parts[partId].editorId !== STATE.composerId) {
						return
					}

				// send to server
					STATE.socket.send(JSON.stringify({
						action: "deletePart",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						partId: partId
					}))
			} catch (error) {console.log(error)}
		}

	/* addPart */
		ELEMENTS.content.partsAdd.addEventListener(TRIGGERS.click, addPart)
		function addPart(event) {
			try {
				// send to server
					STATE.socket.send(JSON.stringify({
						action: "addPart",
						composerId: STATE.composerId,
						musicId: STATE.music.id
					}))
			} catch (error) {console.log(error)}
		}

	/* updatePartMeasureDynamics */
		function updatePartMeasureDynamics(event) {
			try {
				// get part
					const partId = event.target.closest(".part-row").getAttribute("partid")
					if (!partId) {
						showToast({success: false, message: "unable to find part"})
						return
					}

				// edited by someone else
					if (STATE.music.parts[partId].editorId !== STATE.composerId) {
						return
					}

				// get measure
					const measureNumber = Number(event.target.closest(".part-measure").getAttribute("measure"))
					if (!measureNumber) {
						showToast({success: false, message: "unable to find measure"})
						return
					}

				// get dynamic
					let dynamic = event.target.value
					if (dynamic !== "-") {
						dynamic = Number(dynamic)
						if (isNaN(dynamic) || dynamic < 0 || dynamic > MUSICXML_J.constants.dynamicToNumber[Object.keys(MUSICXML_J.constants.dynamicToNumber)[0]]) {
							showToast({success: false, message: "invalid dynamic"})
							return
						}
					}

				// send to server
					STATE.socket.send(JSON.stringify({
						action: "updatePartMeasureDynamics",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						partId: partId,
						measure: measureNumber,
						dynamic: dynamic
					}))
			} catch (error) {console.log(error)}
		}

/*** notes ***/	
	/* addNote */
		function addNote(event) {
			try {
				// something else selected
					if (STATE.selected.notes.length) {
						return
					}

				// get current position
					const cursorX = event.touches && event.touches.length ? event.touches[0].clientX : event.clientX
					const cursorY = event.touches && event.touches.length ? event.touches[0].clientY : event.clientY

				// get measure
					const measureElement = event.target.closest(".part-measure")
					if (!measureElement) {
						return
					}

				// relative to measure
					const measureNumber = measureElement.getAttribute("measure")
					const measureRect = measureElement.getBoundingClientRect()
					const ticksFromLeft = Math.floor((cursorX - measureRect.x) / CONSTANTS.tickWidth)
					const pitchesFromTop = Math.floor((cursorY - measureRect.y) / CONSTANTS.pitchHeight)

				// new note
					const note = {
						measureNumber: measureNumber,
						tick: ticksFromLeft,
						pitch: CONSTANTS.highestPitch - pitchesFromTop,
						duration: CONSTANTS.ticksPerBeat
					}

				// send to server
					STATE.socket.send(JSON.stringify({
						action: "addPartMeasureNote",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						partId: STATE.selected.partId,
						note: note
					}))
			} catch (error) {console.log(error)}
		}

	/* selectNote */
		function selectNote(noteElement, isEnd) {
			try {
				// element
					let alreadyExists = true
					let selectedNote = STATE.selected.notes.find(function(note) {
						return note.element == noteElement
					}) || null

					if (!selectedNote) {
						alreadyExists = false
						selectedNote = {
							element: noteElement,
							measureNumber: noteElement.closest(".part-measure").getAttribute("measure"),
						}
					}

				// is end
					selectedNote.end = isEnd || false

				// attributes
					selectedNote.element.setAttribute("selected", true)

				// add to selection
					if (!alreadyExists) {
						STATE.selected.notes.push(selectedNote)
					}

				// return
					return selectedNote
			} catch (error) {console.log(error)}
		}

	/* unselectNotes */
		function unselectNotes(notes) {
			try {
				// no notes?
					notes = notes || STATE.selected.notes
					if (!notes.length) {
						return
					}

				// update to do
					const updatedNotes = []
				
				// loop through
					for (let n in notes) {
						// identify updates
							const updatedNote = {
								measureNumber: notes[n].measureNumber,
								noteBefore: {
									tick: Number(notes[n].element.getAttribute("actual-tick")),
									pitch: Number(notes[n].element.getAttribute("actual-pitch")),
									duration: Number(notes[n].element.getAttribute("actual-duration"))
								},
								noteAfter: {
									tick: Number(notes[n].element.getAttribute("tick")),
									pitch: Number(notes[n].element.getAttribute("pitch")),
									duration: Number(notes[n].element.getAttribute("duration"))
								}
							}

						// no updates
							if (updatedNote.noteBefore.tick     !== updatedNote.noteAfter.tick  ||
								updatedNote.noteBefore.pitch    !== updatedNote.noteAfter.pitch ||
								updatedNote.noteBefore.duration !== updatedNote.noteAfter.duration) {
								updatedNotes.push(updatedNote)
							}

						// remove from selection
							notes[n].element.removeAttribute("selected")
							STATE.selected.notes = STATE.selected.notes.filter(function(s) {
								return s.element !== notes[n].element
							}) || []
					}

				// nothing to send?
					if (!updatedNotes.length) {
						return notes[notes.length - 1]
					}

				// send to server
					STATE.socket.send(JSON.stringify({
						action: "updatePartMeasureNotes",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						partId: STATE.selected.partId,
						notes: updatedNotes
					}))

				// return last one
					return notes[notes.length - 1]
			} catch (error) {console.log(error)}
		}

	/* deleteNotes */
		function deleteNotes(notes) {
			try {
				// no notes?
					notes = notes || STATE.selected.notes
					if (!notes.length) {
						return
					}

				// update to do
					const deletedNotes = []
				
				// loop through
					for (let n in notes) {
						const deletedNote = {
							measureNumber: notes[n].measureNumber,
							tick: Number(notes[n].getAttribute("actual-tick")),
							pitch: Number(notes[n].getAttribute("actual-pitch")),
							duration: Number(notes[n].getAttribute("actual-duration"))
						}
						deletedNotes.push(deletedNote)
					}

				// nothing to send?
					if (!deletedNotes.length) {
						return
					}

				// send to server
					STATE.socket.send(JSON.stringify({
						action: "deletePartMeasureNotes",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						partId: STATE.selected.partId,
						notes: deletedNotes
					}))

			} catch (error) {console.log(error)}
		}

	/* moveNotes */
		function moveNotes(notes, ticksChange, pitchesChange) {
			try {
				// loop through notes
					for (let n in notes) {
						// note
							const thisNote = notes[n]

						// end
							if (thisNote.end) {
								const duration = Math.max(CONSTANTS.minimumDuration, (thisNote.previousDuration + ticksChange))
								thisNote.element.setAttribute("duration", duration)
								thisNote.element.style.width = "calc(var(--tick-width) * " + duration + ")"
								continue
							}

						// info
							const tick = thisNote.previousTick + ticksChange
							const pitch = thisNote.previousPitch + pitchesChange
							const noteInfo = MUSICXML_J.constants.notes[pitch]
							const noteName = noteInfo[1] + (noteInfo[2] == -1 ? "♭" : noteInfo[2] == 1 ? "♯" : "") + noteInfo[3]
							const noteColor = CONSTANTS.midiToColor[pitch] || "var(--dark-gray)"

						// element
							thisNote.element.setAttribute("tick", tick)
							thisNote.element.setAttribute("pitch", pitch)
							thisNote.element.style.background = noteColor
							thisNote.element.style.marginLeft = "calc(var(--tick-width) * " + tick + ")"
							thisNote.element.style.marginTop = "calc(var(--pitch-height) * var(--pitch-height-modifier) * " + (CONSTANTS.highestPitch - pitch) + ")"
							thisNote.element.querySelector(".part-measure-note-text").innerText = noteName
					}
			} catch (error) {console.log(error)}
		}

	/* setCursorState */
		function setCursorState(cursorX, cursorY, note) {
			try {
				// none
					if (!note) {
						STATE.cursor.measureNumber = null
						STATE.cursor.ticksFromLeft = null
						STATE.cursor.pitchesFromTop = null
						return
					}

				// measure
					const measureElement = ELEMENTS.content.parts[STATE.selected.partId].measures[note.measureNumber].notesContainer
					const measureRect = measureElement.getBoundingClientRect()

				// reset all notes' previouses
					for (let n in STATE.selected.notes) {
						const selectedNote = STATE.selected.notes[n]
							selectedNote.previousTick = Number(selectedNote.element.getAttribute("tick"))
							selectedNote.previousPitch = Number(selectedNote.element.getAttribute("pitch"))
							selectedNote.previousDuration = Number(selectedNote.element.getAttribute("duration"))
					}

				// info
					STATE.cursor.measureNumber = note.measureNumber
					STATE.cursor.ticksFromLeft = Math.floor((cursorX - measureRect.x) / CONSTANTS.tickWidth)
					STATE.cursor.pitchesFromTop = Math.floor((cursorY - measureRect.y) / CONSTANTS.pitchHeight)
			} catch (error) {console.log(error)}
		}

	/* downMouseOnNote */
		function downMouseOnNote(event) {
			try {
				// right-click
					if (event.button == 2 || event.ctrlKey) {
						return
					}

				// part id
					const noteElement = event.target.closest(".part-measure-note")
					const partId = noteElement.closest(".part-row").getAttribute("partid")
					if (partId !== STATE.selected.partId) {
						return
					}

				// hold mouse
					STATE.cursor.held = true
					event.stopPropagation()
				
				// get current position
					const cursorX = event.touches && event.touches.length ? event.touches[0].clientX : event.clientX
					const cursorY = event.touches && event.touches.length ? event.touches[0].clientY : event.clientY

				// not holding shift
					if (!STATE.keyboard.shift) {
						// unselect everything else
							if (STATE.selected.notes.length) {
								const unselectedNotes = []
								for (let n in STATE.selected.notes) {
									if (STATE.selected.notes[n].element !== noteElement) {
										unselectedNotes.push(STATE.selected.notes[n])
									}
								}
								unselectNotes(unselectedNotes)
							}

						// select this one
							const selectedNote = selectNote(noteElement, (event.target.className == "part-measure-note-end"))
							setCursorState(cursorX, cursorY, selectedNote)
							return
					}

				// holding shift --> already selected? --> unselect
					for (let n in STATE.selected.notes) {
						if (STATE.selected.notes[n].element == noteElement) {
							const unselectedNote = unselectNotes([STATE.selected.notes[n]])
							setCursorState(cursorX, cursorY, unselectedNote)
							return
						}
					}

				// holding shift --> add to selection
					const selectedNote = selectNote(noteElement, (event.target.className == "part-measure-note-end"))
					setCursorState(cursorX, cursorY, selectedNote)
			} catch (error) {console.log(error)}
		}

	/* moveMouse */
		function moveMouse(event) {
			try {
				// nothing selected
					if (!STATE.selected.partId || !STATE.selected.notes.length || !STATE.cursor.held) {
						return
					}

				// get current position
					const cursorX = event.touches && event.touches.length ? event.touches[0].clientX : event.clientX
					const cursorY = event.touches && event.touches.length ? event.touches[0].clientY : event.clientY

				// relative to measure
					const measureElement = ELEMENTS.content.parts[STATE.selected.partId].measures[STATE.cursor.measureNumber].notesContainer
					const measureRect = measureElement.getBoundingClientRect()
					const ticksFromLeft = Math.floor((cursorX - measureRect.x) / CONSTANTS.tickWidth)
					const pitchesFromTop = Math.floor((cursorY - measureRect.y) / CONSTANTS.pitchHeight)

				// change from before
					const ticksChange = ticksFromLeft - STATE.cursor.ticksFromLeft
					const pitchesChange = STATE.cursor.pitchesFromTop - pitchesFromTop

				// loop through and move
					moveNotes(STATE.selected.notes, ticksChange, pitchesChange)
			} catch (error) {console.log(error)}
		}

	/* upMouse */
		function upMouse(event) {
			try {
				// right-click
					if (event && (event.button == 2 || event.ctrlKey)) {
						return
					}

				// release mouse
					STATE.cursor.held = false
					setCursorState()
			} catch (error) {console.log(error)}
		}

	/* rightClickOnNote */
		function rightClickOnNote(event) {
			try {
				// prevent creating a new one
					event.preventDefault()

				// part id
					const noteElement = event.target.closest(".part-measure-note")
					const partId = noteElement.closest(".part-row").getAttribute("partid")
					if (partId !== STATE.selected.partId) {
						return
					}

				// get note
					const note = {
						element: noteElement,
						measureNumber: noteElement.closest(".part-measure").getAttribute("measure"),
						end: false,
						previousTick: Number(noteElement.getAttribute("tick")),
						previousPitch: Number(noteElement.getAttribute("pitch")),
						previousDuration: Number(noteElement.getAttribute("duration"))
					}

				// delete
					deleteNotes([note])
			} catch (error) {console.log(error)}
		}

	/* downMouseOnContainer */
		function downMouseOnContainer(event) {
			try {
				// unselect notes
					unselectNotes()
					setCursorState()
			} catch (error) {console.log(error)}
		}

/*** playback ***/
	/* playNextTick */
		function playNextTick(event) {
			try {
				// no measures
					const lastMeasureNumber = Object.keys(STATE.music.measureTicks).length
					if (!lastMeasureNumber) {
						clearInterval(STATE.playback.loop)
						STATE.playback.loop = null
						STATE.playback.playing = false
						STATE.playback.currentMeasure = 0
						STATE.playback.currentTickOfMeasure = 0

						ELEMENTS.header.play.checked = false
						ELEMENTS.header.currentMeasure.value = 0
						return
					}

				// metronome
					if (STATE.playback.metronome) {
						// ???
					}

				// loop through parts
					for (let p in STATE.music.parts) {
						// ???
					}

				// slide content
					const totalOffset = -CONSTANTS.leftColumnWidth + ELEMENTS.content.measures[String(STATE.playback.currentMeasure)].element.offsetLeft + (STATE.playback.currentTickOfMeasure * CONSTANTS.tickWidth)
					ELEMENTS.content.element.scrollTo({left: totalOffset})

				// update tick
					STATE.playback.currentTickOfMeasure++

					// next measure
						if (STATE.playback.currentTickOfMeasure >= STATE.music.measureTicks[String(STATE.playback.currentMeasure)]) {
							STATE.playback.currentTickOfMeasure = 0

							// more measures?
								if (STATE.playback.currentMeasure < lastMeasureNumber) {
									STATE.playback.currentMeasure++
									ELEMENTS.header.measuresCurrent.value = STATE.playback.currentMeasure

									// tempo changes
										if (STATE.music.tempoChanges[String(STATE.playback.currentMeasure)]) {
											STATE.playback.tempo = STATE.music.tempoChanges[String(STATE.playback.currentMeasure)]
											STATE.playback.interval = Math.round(CONSTANTS.minute / CONSTANTS.ticksPerBeat / (STATE.playback.tempo * STATE.playback.tempoMultiplier))
											clearInterval(STATE.playback.loop)
											STATE.playback.loop = setInterval(playNextTick, STATE.playback.interval)
										}

									return
								}

							// end of last measure, but looping?
								if (STATE.playback.looping) {
									STATE.playback.currentMeasure = 1
									ELEMENTS.header.measuresCurrent.value = STATE.playback.currentMeasure

									// tempo changes
										if (STATE.music.tempoChanges[String(STATE.playback.currentMeasure)]) {
											STATE.playback.tempo = STATE.music.tempoChanges[String(STATE.playback.currentMeasure)]
											STATE.playback.interval = Math.round(CONSTANTS.minute / CONSTANTS.ticksPerBeat / (STATE.playback.tempo * STATE.playback.tempoMultiplier))
											clearInterval(STATE.playback.loop)
											STATE.playback.loop = setInterval(playNextTick, STATE.playback.interval)
										}

									return
								}
									
							// end music
								clearInterval(STATE.playback.loop)
								STATE.playback.loop = null
								STATE.playback.playing = false
								STATE.playback.currentMeasure = 1
								STATE.playback.currentTickOfMeasure = 0

								ELEMENTS.header.play.checked = false
								ELEMENTS.header.measuresCurrent.value = 1
						}
			} catch (error) {console.log(error)}
		}

