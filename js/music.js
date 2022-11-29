/*** globals ***/
	/* triggers */
		const ISMOBILE = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent)
		const TRIGGERS = {
			input: "input",
			change: "change",
			submit: "submit",
			click: "click",
			doubleclick: "dblclick",
			contextmenu: "contextmenu",
			keydown: "keydown",
			keyup: "keyup",
			scroll: "scroll",
			mousedown: ISMOBILE ? "touchstart" : "mousedown",
			mouseup: ISMOBILE ? "touchend" : "mouseup",
			mousemove: ISMOBILE ? "touchmove" : "mousemove"
		}

	// listen for move/drop
		window.addEventListener(TRIGGERS.mousemove, moveMouse, {passive: false})
		window.addEventListener(TRIGGERS.mouseup, upMouse)

	/* constants */
		const CONSTANTS = {
			rounding: 10e6,
			second: 1000, // ms
			minute: 1000 * 60, // ms
			pingLoop: 1000 * 60, // ms
			deleteTimeout: 1000 * 3, // ms
			leftColumnWidth: 200, // px
			measureContainerToNotesOffset: 10, // px
			defaultTempo: 120, // bpm
			tickWidth: 5, // var(--tick-width)
			pitchHeight: 3 * 5, // var(--pitch-height) * var(--pitch-height-modifier)
			minimumDuration: 2, // tick
			ticksPerBeat: 24, // tick
			quantizeTicks: 6, // tick
			pitchesPerOctave: 12, // midi
			lowestPitch: 24, // midi
			highestPitch: 96, // midi
			swingBeats: {
				halfBeats: [0, 0.5, 3, 3.5, 6, 6.5, 9, 9.5], // tick
				doubleBeats: [13, 16, 19, 22] // tick
			},
			metronome: {
				synth: "blik",
				volume: 0.2, // ratio
				frequency: 440, // Hz
				sustain: 200, // ms
			},
			keyboard: {
				a: 65,
				altoption: 18,
				arrowdown: 40,
				arrowleft: 37,
				arrowright: 39,
				arrowup: 38,
				backspace: 8,
				c: 67,
				control: 17,
				delete: 46,
				enter: 13,
				escape: 27,
				meta: 91,
				o: 79,
				s: 83,
				shift: 16,
				space: 32,
				tab: 9,
				v: 86,
				x: 88,
				z: 90
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
			music: {
				id:           null,
				created:      null,
				updated:      null,
				composers:    {},
				title:        "",
				composer:     "",
				swing:        false,
				measureTicks: {},
				tempoChanges: {},
				synths:       {},
				parts:        {}
			},
			cursor: {
				held: false,
				measureNumber: null,
				ticksFromLeft: null,
				pitchesFromTop: null,
				element: null
			},
			selected: {
				partId: null,
				notes: {},
				notesFromMidiInput: {
					ongoing: {},
					complete: []
				},
				notesFromClipboard: {},
				history: [],
				historyIndex: 0
			},
			keyboard: {
				a: false,
				altoption: false,
				arrowdown: false,
				arrowleft: false,
				arrowright: false,
				arrowup: false,
				backspace: false,
				c: false,
				control: false,
				delete: false,
				enter: false,
				escape: false,
				meta: false,
				o: false,
				s: false,
				shift: false,
				space: false,
				tab: false,
				v: false,
				x: false,
				z: false
			},
			keyboardListeners: {},
			playback: {
				loop: null,
				recording: false,
				playing: false,
				swing: false,
				looping: false,
				metronome: false,
				tempo: CONSTANTS.defaultTempo,
				tempoMultiplier: 1,
				interval: null,
				currentMeasure: 1,
				currentTickOfMeasure: 0,
				partDynamics: {},
				noteTimeouts: []
			}
		}

	/* keys */
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

				// hotkeys
					if ((event.which == CONSTANTS.keyboard.s) && (STATE.keyboard.meta || STATE.keyboard.control)) {
						event.preventDefault()
						downloadMusicXML()
					}
					else if ((event.which == CONSTANTS.keyboard.o) && (STATE.keyboard.meta || STATE.keyboard.control)) {
						event.preventDefault()
						ELEMENTS.header.uploadSynth.click()
					}

				// note editing hotkeys
					else if (document.activeElement == ELEMENTS.body && (event.which == CONSTANTS.keyboard.v) && (STATE.keyboard.meta || STATE.keyboard.control)) {
						addNotesFromClipboard(STATE.selected.notesFromClipboard)
					}
					else if (document.activeElement == ELEMENTS.body && (event.which == CONSTANTS.keyboard.a) && (STATE.keyboard.meta || STATE.keyboard.control)) {
						selectAllNotes()
					}
					else if (document.activeElement == ELEMENTS.body && (event.which == CONSTANTS.keyboard.z) && (STATE.keyboard.meta || STATE.keyboard.control) && STATE.keyboard.shift) {
						redoNoteAction()
					}
					else if (document.activeElement == ELEMENTS.body && (event.which == CONSTANTS.keyboard.z) && (STATE.keyboard.meta || STATE.keyboard.control)) {
						undoNoteAction()
					}

				// note editing keys
					else if (Object.keys(STATE.selected.notes).length || (document.activeElement && document.activeElement.closest(".part-measure-notes"))) {
						pressKeyWithinMeasure(event.which)
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
			title: document.querySelector("title"),
			body: document.body,
			header: {
				sidebarCollapse: document.querySelector("#header-sidebar-collapse"),
				play: document.querySelector("#header-playback-play"),
				record: document.querySelector("#header-playback-record"),
				loop: document.querySelector("#header-playback-loop"),
				title: document.querySelector("#header-file-title"),
				composer: document.querySelector("#header-file-composer"),
				downloadMusicXML: document.querySelector("#header-file-download"),
				uploadSynth: document.querySelector("#header-file-upload-synth-input"),
			},
			content: {
				outer: document.querySelector("#content-outer"),
				table: document.querySelector("#content"),
				measuresContainer: document.querySelector("#content-measures"),
				measuresText: document.querySelector("#content-measures-text"),
				measuresCurrent: document.querySelector("#content-measures-position-current"),
				measuresTotal: document.querySelector("#content-measures-position-total"),
				swing: document.querySelector("#content-measures-swing"),
				metronome: document.querySelector("#content-measures-metronome"),
				tempoMultiplier: document.querySelector("#content-measures-tempo-multiplier"),
				measures: {},
				measuresSpacer: document.querySelector("#content-measures-spacer"),
				measuresAdd: document.querySelector("#content-measures-add"),
				partsContainer: document.querySelector("#content-parts"),
				parts: {},
				partsAddRow: document.querySelector("#content-parts-add-row"),
				partsAdd: document.querySelector("#content-parts-add"),
				partsSpacer: document.querySelector("#content-parts-spacer"),
				delete: document.querySelector("#content-delete-button")
			},
			help: {
				noteHelper: document.querySelector("#note-helper"),
				button: document.querySelector("#help-button"),
				content: document.querySelector("#help-content"),
				name: document.querySelector("#help-name")
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
					else if (STATE.music.deleted) {
						storageData.music = storageData.music.filter(function(item) {
							return item.id !== STATE.music.id
						}) || []
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
				STATE.socket.keepPinging = false
				STATE.socket.onopen = function() {
					STATE.socket.send(null)

					if (STATE.selected.partId) {
						setTimeout(function() {
							STATE.socket.send(JSON.stringify({
								action: "updatePartEditor",
								composerId: STATE.composerId,
								musicId: STATE.music.id,
								partId: STATE.selected.partId,
								editorId: STATE.composerId
							}))
						}, 1000)
					}
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
						STATE.socket.keepPinging = true
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
					if (STATE.socket.keepPinging) {
						STATE.socket.keepPinging = false
						fetch("/ping", {method: "GET"})
							.then(function(response){ return response.json() })
							.then(function(data) {})
					}
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
						else if (data.message) {
							showToast(data)
						}

					// deleted
						if (data.deleted) {
							STATE.music.deleted = true
							updateStorage()
							setTimeout(function() {
								window.location = "../../../../"
							}, CONSTANTS.deleteTimeout)
						}

				// data
					if (!STATE.music.deleted) {
						// composer id
							if (data.composerId !== undefined) {
								STATE.composerId = data.composerId
							}

						// music data
							if (data.music) {
								receiveMusic(data.music)
							}
					}
			} catch (error) {console.log(error)}
		}

	/* receiveMusic */
		function receiveMusic(musicJSON) {
			try {
				// metadata
					if (musicJSON.id !== undefined) {
						STATE.music.id = musicJSON.id
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
								if (ELEMENTS.help.name !== document.activeElement) {
									ELEMENTS.help.name.value = composers[i].name
								}
								updateStorage()
							}
					}
			} catch (error) {console.log(error)}
		}

	/* updateName */
		ELEMENTS.help.name.addEventListener(TRIGGERS.change, updateName)
		function updateName(event) {
			try {
				// validate
					const name = ELEMENTS.help.name.value.trim()
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
					ELEMENTS.title.innerText = "CoChords" + (STATE.music.title ? " | " + STATE.music.title : "")

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

	/* deleteMusic */
		ELEMENTS.content.delete.addEventListener(TRIGGERS.click, deleteMusic)
		function deleteMusic(event) {
			try {
				// send to server
					STATE.socket.send(JSON.stringify({
						action: "deleteMusic",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
					}))
			} catch (error) {console.log(error)}
		}

/*** header - playback ***/
	/* toggleSidebar */
		ELEMENTS.header.sidebarCollapse.addEventListener(TRIGGERS.change, toggleSidebar)
		function toggleSidebar(event) {
			try {
				// open
					if (ELEMENTS.header.sidebarCollapse.checked) {
						ELEMENTS.content.outer.removeAttribute("collapsed")
						return
					}

				// collapse
					ELEMENTS.content.outer.setAttribute("collapsed", true)
			} catch (error) {console.log(error)}
		}

	/* receiveSwing */
		function receiveSwing(swing) {
			try {
				// set swing
					STATE.music.swing = swing || false
					ELEMENTS.content.swing.checked = STATE.music.swing
					STATE.playback.swing = STATE.music.swing
			} catch (error) {console.log(error)}
		}

	/* updateSwing */
		ELEMENTS.content.swing.addEventListener(TRIGGERS.change, updateSwing)
		function updateSwing(event) {
			try {
				// get value
					const swing = ELEMENTS.content.swing.checked || false

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
		ELEMENTS.content.measuresCurrent.addEventListener(TRIGGERS.input, updateCurrentMeasure)
		function updateCurrentMeasure(event) {
			try {
				// no measures
					const totalMeasures = Object.keys(STATE.music.measureTicks).length
					if (!totalMeasures) {
						ELEMENTS.content.measuresCurrent.value = 0
						return
					}

				// get measure
					const measureNumber = Math.floor(ELEMENTS.content.measuresCurrent.value) || 0
					if (!measureNumber || measureNumber < 0) {
						ELEMENTS.content.measuresCurrent.value = 1
						return
					}
					if (measureNumber > totalMeasures) {
						ELEMENTS.content.measuresCurrent.value = totalMeasures
						return
					}

				// set state
					STATE.playback.currentMeasure = measureNumber
					ELEMENTS.content.measuresCurrent.value = measureNumber
					STATE.playback.currentTickOfMeasure = 0

				// find measure element
					const measureElement = STATE.selected.partId ? ELEMENTS.content.parts[STATE.selected.partId].measures[measureNumber].element : ELEMENTS.content.measures[measureNumber].element
					measureElement.scrollIntoView({block: "start", inline: "start"})
			} catch (error) {console.log(error)}
		}

	/* setCurrentMeasure */
		ELEMENTS.content.outer.addEventListener(TRIGGERS.scroll, setCurrentMeasure)
		function setCurrentMeasure(event) {
			try {
				// currentMeasure is active
					if (document.activeElement == ELEMENTS.content.measuresCurrent) {
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
							ELEMENTS.content.measuresCurrent.value = STATE.playback.currentMeasure
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
		ELEMENTS.content.metronome.addEventListener(TRIGGERS.change, setMetronome)
		function setMetronome(event) {
			try {
				// set state
					STATE.playback.metronome = Boolean(ELEMENTS.content.metronome.checked)
			} catch (error) {console.log(error)}
		}

	/* setTempoMultiplier */
		ELEMENTS.content.tempoMultiplier.addEventListener(TRIGGERS.change, setTempoMultiplier)
		function setTempoMultiplier(event) {
			try {
				// validate
					const tempoMultiplier = Number(ELEMENTS.content.tempoMultiplier.value)
					if (!tempoMultiplier || tempoMultiplier < Number(ELEMENTS.content.tempoMultiplier.min)) {
						ELEMENTS.content.tempoMultiplier.value = ELEMENTS.content.tempoMultiplier.min
						return
					}
					if (tempoMultiplier > Number(ELEMENTS.content.tempoMultiplier.max)) {
						ELEMENTS.content.tempoMultiplier.value = ELEMENTS.content.tempoMultiplier.max
						return
					}

				// set state
					STATE.playback.tempoMultiplier = tempoMultiplier

				// interval
					STATE.playback.interval = Math.round(CONSTANTS.minute / CONSTANTS.ticksPerBeat / (STATE.playback.tempo * STATE.playback.tempoMultiplier))

				// playing?
					if (STATE.playback.playing) {
						clearInterval(STATE.playback.loop)
						STATE.playback.loop = setInterval(playTick, STATE.playback.interval)
					}
			} catch (error) {console.log(error)}
		}

	/* setRecording */
		ELEMENTS.header.record.addEventListener(TRIGGERS.change, setRecording)
		function setRecording(event) {
			try {
				// no audio
					if (!AUDIO_J.audio) {
						ELEMENTS.header.record.checked = false
						STATE.playback.recording = false
						return
					}

				// not playing --> be ready
					if (!STATE.playback.playing) {
						STATE.playback.recording = Boolean(ELEMENTS.header.record.checked)
						return
					}

				// playing & recording --> cancel
					if (STATE.playback.recording) {
						STATE.playback.recording = false
						AUDIO_J.stopRecording()
						return
					}

				// playing --> start recording
					STATE.playback.recording = true
					AUDIO_J.startRecording()
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
						// stop playing
							clearInterval(STATE.playback.loop)
							STATE.playback.loop = null
							STATE.playback.currentTickOfMeasure = 0
							STATE.playback.partDynamics = {}

							ELEMENTS.content.outer.removeAttribute("playing")

						// silence parts
							if (AUDIO_J.audio) {
								for (let p in STATE.music.parts) {
									if (AUDIO_J.instruments[p]) {
										AUDIO_J.instruments[p].setParameters({power: 0})
									}
									if (STATE.selected.partId == p) {
										AUDIO_J.instruments[p].setParameters({power: 1})
									}
								}
							}

						// reset playing notes
							for (let t in STATE.playback.noteTimeouts) {
								clearTimeout(STATE.playback.noteTimeouts[t])
								delete STATE.playback.noteTimeouts[t]
							}
							const playingNotes = Array.from(ELEMENTS.content.partsContainer.querySelectorAll(".part-measure-note[playing='true']"))
							for (let p in playingNotes) {
								playingNotes[p].removeAttribute("playing")
							}

						// submit midi notes
							for (let n in STATE.selected.notesFromMidiInput.ongoing) {
								const note = STATE.selected.notesFromMidiInput.ongoing[n]
								STATE.selected.notesFromMidiInput.complete.push(note)
							}
							STATE.selected.notesFromMidiInput.ongoing = {}

						// any to submit?
							if (STATE.selected.notesFromMidiInput.complete.length) {
								addNotes(STATE.selected.notesFromMidiInput.complete)
								STATE.selected.notesFromMidiInput.complete = []
							}

						// output recording
							if (STATE.playback.recording) {
								AUDIO_J.stopRecording()
							}
						return
					}

				// start --> submit any selected notes
					updateNotes()
					updateNoteHelper()

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

				// parts
					for (let p in STATE.music.parts) {
						// synths
							if (AUDIO_J.audio && AUDIO_J.instruments[p]) {
								AUDIO_J.instruments[p].setParameters({power: 1})
							}

						// dynamics
							const measuresWithDynamics = Object.keys(STATE.music.parts[p].measures).filter(function(m) {
								return (Number(m) <= STATE.playback.currentMeasure) && (STATE.music.parts[p].measures[m].dynamics !== undefined)
							}) || null
							
							STATE.playback.partDynamics[p] = measuresWithDynamics ? STATE.music.parts[p].measures[measuresWithDynamics[measuresWithDynamics.length - 1]].dynamics : 0
					}

				// start recording
					if (STATE.playback.recording) {
						AUDIO_J.startRecording()
					}

				// playback
					ELEMENTS.content.outer.setAttribute("playing", true)
					STATE.playback.loop = setInterval(playTick, STATE.playback.interval)
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
								if (!customSynths.querySelector("[value='" + s + "']")) {
									const synthOption = document.createElement("option")
										synthOption.value = s
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
								ELEMENTS.content.measuresCurrent.value = 1
							}
							
							ELEMENTS.content.measures[m].element.style.width = "calc(var(--tick-width) * " + measureTicks[m] + ")";
							ELEMENTS.content.measures[m].beatsInput.value = Math.floor(measureTicks[m] / CONSTANTS.ticksPerBeat)
					}

				// set total measure count
					const measureCount = Object.keys(STATE.music.measureTicks).length
					ELEMENTS.content.measuresTotal.value = measureCount
					ELEMENTS.content.measuresCurrent.max = measureCount
					if (ELEMENTS.content.measuresCurrent.value > measureCount) {
						ELEMENTS.content.measuresCurrent.value = measureCount
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
							if (STATE.music.measureTicks[m]) {
								STATE.music.tempoChanges[m] = tempoChanges[m]
								ELEMENTS.content.measures[m].tempoInput.value = tempoChanges[m]
								ELEMENTS.content.measures[m].tempoInput.setAttribute("value-present", true)
							}
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

				// re-sort to do editor last
					const partKeys = Object.keys(partsJSON).sort(function(a, b) {
						return a.editorId
					}).reverse()

				// loop through
					for (let index in partKeys) {
						const id = partKeys[index]
						const partJSON = partsJSON[id]

						// delete
							if (partJSON === null) {
								delete STATE.music.parts[id]
								ELEMENTS.content.parts[id].infoContainer.remove()
								ELEMENTS.content.parts[id].measuresContainer.remove()
								delete ELEMENTS.content.parts[id]

								if (STATE.selected.partId == id) {
									STATE.selected.partId = null
									STATE.selected.notes = {}
									STATE.selected.notesFromMidiInput.ongoing = {}
									STATE.selected.notesFromMidiInput.complete = []
									setCursorState()
								}

								if (AUDIO_J.audio && AUDIO_J.instruments[id]) {
									AUDIO_J.instruments[id].setParameters({power: 0})
									delete AUDIO_J.instruments[id]
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
						receivePartEditor(partId, partJSON, partObject)
					}

				// sidebar info
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

				// synth --> update audio
					if (partJSON.synth) {
						STATE.music.parts[partId].synth = partJSON.synth
						partObject.synthSelect.value = partJSON.synth

						if (AUDIO_J.audio && (!AUDIO_J.instruments[partId] || AUDIO_J.instruments[partId].parameters.name !== partJSON.synth)) {
							if (AUDIO_J.instruments[partId]) {
								AUDIO_J.instruments[partId].setParameters({power: 0})
							}

							const parameters = AUDIO_J.getInstrument(partJSON.synth) || STATE.music.synths[partJSON.synth]
							if (parameters) {
								AUDIO_J.instruments[partId] = AUDIO_J.buildInstrument(parameters)

								if (ELEMENTS.content.parts[partId]) {
									const volume = Math.min(1, Math.max(0, Number(ELEMENTS.content.parts[partId].volumeInput.value)))
									AUDIO_J.instruments[partId].setParameters({volume: volume})

									const panning = Math.min(1, Math.max(-1, Number(ELEMENTS.content.parts[partId].panningInput.value)))
									AUDIO_J.instruments[partId].setParameters({panning: panning})
								}

								if (STATE.playback.playing || STATE.selected.partId == partId) {
									AUDIO_J.instruments[partId].setParameters({power: 1})
								}
								else {
									AUDIO_J.instruments[partId].setParameters({power: 0})
								}
							}
						}
					}

				// measures
					const measuresJSON = partJSON.measures
					for (let m in measuresJSON) {
						// delete
							if (measuresJSON[m] === null) {
								delete STATE.music.parts[partId].measures[m]
								partObject.measures[m].element.remove()
								delete partObject.measures[m]
								continue
							}

						// upsert
							if (!STATE.music.parts[partId].measures) {
								STATE.music.parts[partId].measures = {}
							}
							if (!partObject.measures[m]) {
								STATE.music.parts[partId].measures[m] = {ticks: 0, notes: {}}
								partObject.measures[m] = buildPartMeasure(partId, partObject.measuresContainer, partObject.spacer, m)
							}

							receivePartMeasure(partId, m, partObject.measures[m], STATE.music.parts[partId].measures[m], measuresJSON[m])
					}
			} catch (error) {console.log(error)}
		}

	/* receivePartEditor */
		function receivePartEditor(partId, partJSON, partObject) {
			try {
				// previously selected?
					const wasSelected = Boolean(partId == STATE.selected.partId)

				// no one or someone else now
					if (partJSON.editorId == null) {
						// no editor
							delete STATE.music.parts[partId].editorId
							STATE.selected.partId = null

						// editor text
							partObject.editorText.innerHTML = ""
							partObject.editInput.checked = false

						// unlock
							partObject.measuresContainer.removeAttribute("locked")
					}
					else if (partJSON.editorId !== STATE.composerId) {
						// other editor
							STATE.music.parts[partId].editorId = partJSON.editorId
							STATE.selected.partId = null

						// editor text
							partObject.editorText.innerHTML = "&#128274;&nbsp;" + STATE.music.composers[partJSON.editorId].name
							partObject.editInput.checked = false

						// lock
							partObject.measuresContainer.setAttribute("locked", "other")
					}

				// self now
					else {
						// you editor
							STATE.selected.partId = partId
							STATE.music.parts[partId].editorId = partJSON.editorId
							partObject.editInput.checked = true

						// selection
							STATE.selected.notes = {}
							STATE.selected.notesFromMidiInput.ongoing = {}
							STATE.selected.notesFromMidiInput.complete = []
							STATE.selected.history = []
							STATE.selected.historyIndex = 0
							setCursorState()

						// lock
							partObject.measuresContainer.setAttribute("locked", "self")

						// part synth as active instrument
							AUDIO_J.activeInstrumentId = partId

						// tabbable elements
							const tabbableElements = Array.from(ELEMENTS.content.parts[partId].measuresContainer.querySelectorAll("[quasi-tabbable]"))
							for (let t in tabbableElements) {
								tabbableElements[t].removeAttribute("tabindex")
							}
							ELEMENTS.content.parts[partId].nameInput.removeAttribute("disabled")
					}

				// synth power
					if (AUDIO_J.audio && !STATE.playback.playing) {
						AUDIO_J.instruments[partId].setParameters({power: (partJSON.editorId == STATE.composerId)})
					}

				// previously selected but not now --> put notes back
					if (wasSelected && (partId !== STATE.selected.partId)) {
						// selected notes --> submit & unselect
							revertNotes()
							setCursorState()

						// active instrument						
							AUDIO_J.activeInstrumentId = null

						// untabbable elements
							const tabbableElements = Array.from(ELEMENTS.content.parts[partId].measuresContainer.querySelectorAll("[quasi-tabbable]"))
							for (let t in tabbableElements) {
								tabbableElements[t].setAttribute("tabindex", "-1")
							}
							ELEMENTS.content.parts[partId].nameInput.setAttribute("disabled", true)

						// selection
							STATE.selected.notesFromMidiInput.ongoing = {}
							STATE.selected.notesFromMidiInput.complete = []
							STATE.selected.history = []
							STATE.selected.historyIndex = 0
					}
			} catch (error) {console.log(error)}
		}

	/* receivePartMeasure */
		function receivePartMeasure(partId, measureNumber, measureObject, measureState, measureJSON) {
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
						buildMeasureNote(partId, measureNumber, n, measureState.notes[n])
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
								partEditText.innerHTML = "&#x2710;&nbsp;edit"
								partEditText.title = "edit this part"
							partEditLabel.appendChild(partEditText)

					// name
						const partNameLabel = document.createElement("label")
							partNameLabel.className = "part-info-label part-info-label-name"
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
								partName.setAttribute("quasi-tabbable", true)
								partName.setAttribute("tabindex", "-1")
								partName.setAttribute("disabled", true)
							partNameLabel.appendChild(partName)

					// instrument
						const partInstrumentLabel = document.createElement("label")
							partInstrumentLabel.className = "part-info-label part-info-label-instrument"
						partEditLabel.appendChild(partInstrumentLabel)

							const partInstrumentText = document.createElement("span")
								partInstrumentText.innerText = "midi"
							partInstrumentLabel.appendChild(partInstrumentText)

							const partInstrument = document.createElement("select")
								partInstrument.className = "part-info-instrument"
								partInstrument.title = "MIDI instrument"
								partInstrument.addEventListener(TRIGGERS.change, updatePartInstrument)
								partInstrument.setAttribute("quasi-tabbable", true)
								partInstrument.setAttribute("tabindex", "-1")
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
							partSynthLabel.className = "part-info-label part-info-label-synth"
						partEditLabel.appendChild(partSynthLabel)

							const partSynthText = document.createElement("span")
								partSynthText.innerText = "synth"
							partSynthLabel.appendChild(partSynthText)

							const partSynth = document.createElement("select")
								partSynth.className = "part-info-synth"
								partSynth.title = "synth"
								partSynth.addEventListener(TRIGGERS.change, updatePartSynth)
								partSynth.setAttribute("quasi-tabbable", true)
								partSynth.setAttribute("tabindex", "-1")
							partSynthLabel.appendChild(partSynth)

							const instrumentListStructure = AUDIO_J.getInstruments({include: ["simple", "default", "custom"], grouping: "family", format: "select", select: partSynth})
							const customGroup = instrumentListStructure.custom._optgroup

						// delete
							const partDeleteOuter = document.createElement("details")
								partDeleteOuter.className = "part-info-edit-delete-outer"
								partDeleteOuter.setAttribute("quasi-tabbable", true)
								partDeleteOuter.setAttribute("tabindex", "-1")
							partEditLabel.appendChild(partDeleteOuter)

							const partDeleteSummary = document.createElement("summary")
								partDeleteSummary.className = "part-info-edit-delete-summary"
								partDeleteSummary.innerHTML = "&times;"
							partDeleteOuter.appendChild(partDeleteSummary)

							const partDelete = document.createElement("button")
								partDelete.className = "part-info-edit-delete"
								partDelete.innerHTML = "delete part"
								partDelete.title = "permanently delete part from score"
								partDelete.addEventListener(TRIGGERS.click, deletePart)
								partDelete.setAttribute("quasi-tabbable", true)
								partDelete.setAttribute("tabindex", "-1")
							partDeleteOuter.appendChild(partDelete)

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
								partOrderUp.setAttribute("quasi-tabbable", true)
								partOrderUp.setAttribute("tabindex", "-1")
							partOrderLabel.appendChild(partOrderUp)

							const partOrderDown = document.createElement("button")
								partOrderDown.className = "part-info-order-down"
								partOrderDown.title = "move down"
								partOrderDown.innerHTML = "&darr;"
								partOrderDown.value = "down"
								partOrderDown.addEventListener(TRIGGERS.click, updatePartOrder)
								partOrderDown.setAttribute("quasi-tabbable", true)
								partOrderDown.setAttribute("tabindex", "-1")
							partOrderLabel.appendChild(partOrderDown)

					// panning
						const partPanningLabel = document.createElement("label")
							partPanningLabel.className = "part-info-label part-info-panning-label"
						infoContainerInner.appendChild(partPanningLabel)

							const partPanningText = document.createElement("span")
								partPanningText.innerHTML = "&#x21F9;"
							partPanningLabel.appendChild(partPanningText)

							const partPanning = document.createElement("input")
								partPanning.className = "part-info-panning"
								partPanning.type = "range"
								partPanning.min = "-1"
								partPanning.max = "1"
								partPanning.step = "0.1"
								partPanning.value = "0"
								partPanning.title = "instrument panning"
								partPanning.addEventListener(TRIGGERS.input, setPartPanning)
							partPanningLabel.appendChild(partPanning)

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

					// before
						const partBefore = document.createElement("td")
							partBefore.className = "part-before"
						partRow.appendChild(partBefore)

					// spacer
						const partSpacer = document.createElement("td")
							partSpacer.className = "part-spacer"
						partRow.appendChild(partSpacer)

							const partSpacerBorder = document.createElement("div")
								partSpacerBorder.className = "part-spacer-border"
							partSpacer.appendChild(partSpacerBorder)

						const partAfter = document.createElement("td")
							partAfter.className = "part-after"
						partRow.appendChild(partAfter)

				// object
					return {
						infoContainer: infoContainer,
						editorText: partEditorText,
						editInput: partEdit,
						panningInput: partPanning,
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
		function buildPartMeasure(partId, measuresContainer, spacer, measureNumber) {
			try {
				// measure
					const measure = document.createElement("td")
						measure.className = "part-measure"
						measure.setAttribute("measure", measureNumber)
					measuresContainer.insertBefore(measure, spacer)

				// measure border
					const measureBorderTop = document.createElement("div")
						measureBorderTop.className = "part-measure-border"
					measure.appendChild(measureBorderTop)

				// notes container
					const notesContainer = document.createElement("div")
						notesContainer.className = "part-measure-notes"
						notesContainer.addEventListener(TRIGGERS.mousedown, downMouseOnContainer)
						notesContainer.addEventListener(TRIGGERS.doubleclick, doubleclickOnContainer)
						notesContainer.addEventListener(TRIGGERS.contextmenu, doubleclickOnContainer)
					measure.appendChild(notesContainer)

				// dynamics input
					const dynamicsInput = document.createElement("select")
						dynamicsInput.className = "part-measure-dynamics"
						dynamicsInput.title = "dynamics"
						dynamicsInput.value = "-"
						dynamicsInput.addEventListener(TRIGGERS.change, updatePartMeasureDynamics)
						dynamicsInput.setAttribute("value-present", false)
						dynamicsInput.setAttribute("quasi-tabbable", true)
						if (partId !== STATE.selected.partId) {
							dynamicsInput.setAttribute("tabindex", "-1")
						}
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

				// measure border
					const measureBorderBottom = document.createElement("div")
						measureBorderBottom.className = "part-measure-border"
					measure.appendChild(measureBorderBottom)

				// object
					return {
						element: measure,
						dynamicsInput: dynamicsInput,
						notesContainer: notesContainer
					}
			} catch (error) {console.log(error)}
		}

	/* buildMeasureNote */
		function buildMeasureNote(partId, measureNumber, tickOfMeasure, pitches) {
			try {
				// notes container
					if (!ELEMENTS.content.parts[partId].measures[measureNumber]) {
						return
					}
					const notesContainer = ELEMENTS.content.parts[partId].measures[measureNumber].notesContainer

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
								noteElement.setAttribute("quasi-tabbable", true)
							notesContainer.appendChild(noteElement)

						// selection
							if (partId !== STATE.selected.partId) {
								noteElement.setAttribute("tabindex", "-1")
							}
							else if (STATE.selected.notes[measureNumber + "." + tickOfMeasure + ":" + p]) {
								const selectedNote = STATE.selected.notes[measureNumber + "." + tickOfMeasure + ":" + p]
								
								noteElement.setAttribute("interim-tick", selectedNote.element.getAttribute("interim-tick"))
								noteElement.setAttribute("interim-pitch", selectedNote.element.getAttribute("interim-pitch"))
								noteElement.setAttribute("interim-duration", selectedNote.element.getAttribute("interim-duration"))
								noteElement.setAttribute("selected", true)
								noteElement.focus()

								selectedNote.element.remove()
								STATE.selected.notes[measureNumber + "." + tickOfMeasure + ":" + p].element = noteElement
							}

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
						updateNotes()

						setTimeout(function() {
							STATE.socket.send(JSON.stringify({
								action: "updatePartEditor",
								composerId: STATE.composerId,
								musicId: STATE.music.id,
								partId: partId,
								editorId: null
							}))
						}, 0)
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

	/* setPartPanning */
		function setPartPanning(event) {
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
					const panning = Math.min(1, Math.max(-1, Number(event.target.value)))

				// set instrument
					AUDIO_J.instruments[partId].setParameters({panning: panning})
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

/*** notes - editing ***/
	/* addNotes */
		function addNotes(notes, sound) {
			try {
				// playing
					if (STATE.playback.playing) {
						return
					}

				// no part selected
					if (!STATE.selected.partId) {
						return
					}

				// something else selected
					if (Object.keys(STATE.selected.notes).length) {
						return
					}

				// clean notes
					const lastMeasureNumber = Object.keys(STATE.music.measureTicks).length
					for (let n = 0; n < notes.length; n++) {
						if (notes[n].measureNumber <= 0 || notes[n].measureNumber > lastMeasureNumber) {
							notes.splice(n, 1)
							n--
						}
					}

				// no notes
					if (!notes || !notes.length) {
						return
					}

				// sound
					if (sound && AUDIO_J.audio && AUDIO_J.instruments[STATE.selected.partId]) {
						for (let n in notes) {
							const frequency = AUDIO_J.getNote(notes[n].pitch)[0]
							AUDIO_J.instruments[STATE.selected.partId].press(frequency, CONSTANTS.metronome.volume)
							AUDIO_J.instruments[STATE.selected.partId].lift(frequency, CONSTANTS.metronome.sustain)
						}
					}

				// optimistically create
					for (let n in notes) {
						const pitches = {}
							pitches[notes[n].pitch] = notes[n].duration
						buildMeasureNote(STATE.selected.partId, notes[n].measureNumber, notes[n].tick, pitches)
					}

				// send to server
					rememberNoteAction("addPartMeasureNotes", notes)
					STATE.socket.send(JSON.stringify({
						action: "addPartMeasureNotes",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						partId: STATE.selected.partId,
						notes: notes
					}))
			} catch (error) {console.log(error)}
		}

	/* addNotesFromClipboard */
		function addNotesFromClipboard() {
			try {
				// playing
					if (STATE.playback.playing) {
						return
					}

				// no part selected
					if (!STATE.selected.partId) {
						return
					}

				// cursor state not set
					if (!STATE.cursor.measureNumber) {
						return
					}

				// nothing in clipboard
					if (!Object.keys(STATE.selected.notesFromClipboard).length) {
						return
					}

				// get offset
					const offsets = {
						measureNumber: Infinity,
						tick: Infinity,
						pitch: -Infinity
					}
					for (let n in STATE.selected.notesFromClipboard) {
						if (STATE.selected.notesFromClipboard[n].measureNumber < offsets.measureNumber) {
							offsets.measureNumber = STATE.selected.notesFromClipboard[n].measureNumber
							if (STATE.selected.notesFromClipboard[n].tick < offsets.tick) {
								offsets.tick = STATE.selected.notesFromClipboard[n].tick
							}
						}
						if (STATE.selected.notesFromClipboard[n].pitch > offsets.pitch) {
							offsets.pitch = STATE.selected.notesFromClipboard[n].pitch
						}
					}

				// add notes
					event.preventDefault()
					const newNotes = []
					
					for (let n in STATE.selected.notesFromClipboard) {
						newNotes.push({
							measureNumber: (STATE.selected.notesFromClipboard[n].measureNumber - offsets.measureNumber) + STATE.cursor.measureNumber,
							tick: (STATE.selected.notesFromClipboard[n].tick - offsets.tick) + STATE.cursor.ticksFromLeft,
							pitch: (STATE.selected.notesFromClipboard[n].pitch - offsets.pitch) + (CONSTANTS.highestPitch - STATE.cursor.pitchesFromTop),
							duration: STATE.selected.notesFromClipboard[n].duration
						})
					}
					addNotes(newNotes)
			} catch (error) {console.log(error)}
		}

	/* selectNotes */
		function selectNotes(notes, sound) {
			try {
				// playing
					if (STATE.playback.playing) {
						return
					}
					
				// no part selected
					if (!STATE.selected.partId) {
						return
					}

				// sound
					if (sound && AUDIO_J.audio && AUDIO_J.instruments[STATE.selected.partId]) {
						for (let n in notes) {
							const frequency = AUDIO_J.getNote(notes[n].pitch)[0]
							AUDIO_J.instruments[STATE.selected.partId].press(frequency, CONSTANTS.metronome.volume)
							AUDIO_J.instruments[STATE.selected.partId].lift(frequency, CONSTANTS.metronome.sustain)
						}
					}

				// loop through to find elements
					for (let n in notes) {
						const id = notes[n].id || (notes[n].measureNumber + "." + notes[n].tick + ":" + notes[n].pitch)
						
						const noteElement = notes[n].element || ELEMENTS.content.parts[STATE.selected.partId].measures[notes[n].measureNumber].notesContainer.querySelector("[actual-tick='" + notes[n].tick + "'][actual-pitch='" + notes[n].pitch + "'][actual-duration='" + notes[n].duration + "']")
							noteElement.setAttribute("selected", true)
							noteElement.setAttribute("interim-tick", notes[n].tick)
							noteElement.setAttribute("interim-pitch", notes[n].pitch)
							noteElement.setAttribute("interim-duration", notes[n].duration)
							noteElement.focus()
						
						STATE.selected.notes[id] = {
							id: id,
							element: noteElement,
							measureNumber: notes[n].measureNumber,
							tick: notes[n].tick,
							pitch: notes[n].pitch,
							duration: notes[n].duration,
							end: notes[n].end || false
						}
					}
			} catch (error) {console.log(error)}
		}

	/* unselectNotes */
		function unselectNotes(notes) {
			try {
				// no notes?
					notes = notes || STATE.selected.notes
					if (!Object.keys(notes).length) {
						return
					}

				// loop through to find elements
					for (let n in notes) {
						const noteElement = notes[n].element
						if (noteElement) {
							noteElement.removeAttribute("selected")
							noteElement.removeAttribute("interim-tick")
							noteElement.removeAttribute("interim-pitch")
							noteElement.removeAttribute("interim-duration")
						}
						delete STATE.selected.notes[notes[n].id]
					}

				// clear state
					if (!Object.keys(STATE.selected.notes).length) {
						document.activeElement.blur()
						ELEMENTS.body.focus()
					}
			} catch (error) {console.log(error)}
		}

	/* moveNotes */
		function moveNotes(notes, options) {
			try {
				// playing
					if (STATE.playback.playing) {
						return
					}
					
				// no part selected
					if (!STATE.selected.partId) {
						return
					}

				// no notes?
					notes = notes || STATE.selected.notes
					if (!Object.keys(notes).length) {
						return
					}

				// options
					options = {
						ticksChange: options.ticksChange || 0,
						pitchesChange: options.pitchesChange || 0,
						forceEnd: options.forceEnd || false,
						forceStart: options.forceStart || false,
						relativeToInterim: options.relativeToInterim || false,
						quantize: options.quantize || false
					}

				// stop waiting for cursor lift
					STATE.cursor.element = null

				// loop through notes
					for (let n in notes) {
						// note
							const thisNoteElement = notes[n].element
							const previousTick = Number(thisNoteElement.getAttribute("tick"))
							const previousPitch = Number(thisNoteElement.getAttribute("pitch"))
							const previousDuration = Number(thisNoteElement.getAttribute("duration"))

							const interimTick = Number(thisNoteElement.getAttribute("interim-tick"))
							const interimPitch = Number(thisNoteElement.getAttribute("interim-pitch"))
							const interimDuration = Number(thisNoteElement.getAttribute("interim-duration"))

						// end
							if (!options.forceStart && (notes[n].end || options.forceEnd)) {
								const offsetFromPreviousSubbeat = options.quantize ? ((options.relativeToInterim ? interimDuration : previousDuration) % CONSTANTS.quantizeTicks) : 0
								const offsetFromNextSubbeat = options.quantize ? ((options.relativeToInterim ? interimDuration : previousDuration) % CONSTANTS.quantizeTicks - CONSTANTS.quantizeTicks) : 0
								const offsetFromSubbeat = options.quantize ? ((offsetFromPreviousSubbeat <= Math.abs(offsetFromNextSubbeat)) ? offsetFromPreviousSubbeat * -1 : offsetFromNextSubbeat * -1) : 0

								const newDuration = Math.max(CONSTANTS.minimumDuration, (options.relativeToInterim ? interimDuration : previousDuration) + (options.quantize ? offsetFromSubbeat : options.ticksChange))
								thisNoteElement.setAttribute("duration", newDuration)
								thisNoteElement.style.width = "calc(var(--tick-width) * " + newDuration + ")"

								if (!options.relativeToInterim) {
									thisNoteElement.setAttribute("interim-duration", newDuration)
								}
								continue
							}

						// info
							const offsetFromPreviousSubbeat = options.quantize ? ((options.relativeToInterim ? interimTick : previousTick) % CONSTANTS.quantizeTicks) : 0
							const offsetFromNextSubbeat = options.quantize ? ((options.relativeToInterim ? interimTick : previousTick) % CONSTANTS.quantizeTicks - CONSTANTS.quantizeTicks) : 0
							const offsetFromSubbeat = options.quantize ? ((offsetFromPreviousSubbeat <= Math.abs(offsetFromNextSubbeat)) ? offsetFromPreviousSubbeat * -1 : offsetFromNextSubbeat * -1) : 0

							const newTick = (options.relativeToInterim ? interimTick : previousTick) + (options.quantize ? offsetFromSubbeat : options.ticksChange)
							const newPitch = Math.max(CONSTANTS.lowestPitch, Math.min(CONSTANTS.highestPitch, (options.relativeToInterim ? interimPitch : previousPitch) + options.pitchesChange))
							const noteInfo = MUSICXML_J.constants.notes[newPitch]
							const noteName = noteInfo[1] + (noteInfo[2] == -1 ? "♭" : noteInfo[2] == 1 ? "♯" : "") + noteInfo[3]
							const noteColor = CONSTANTS.midiToColor[newPitch] || "var(--dark-gray)"

						// element
							thisNoteElement.setAttribute("tick", newTick)
							thisNoteElement.setAttribute("pitch", newPitch)
							thisNoteElement.style.background = noteColor
							thisNoteElement.style.marginLeft = "calc(var(--tick-width) * " + newTick + ")"
							thisNoteElement.style.marginTop = "calc(var(--pitch-height) * var(--pitch-height-modifier) * " + (CONSTANTS.highestPitch - newPitch) + ")"
							thisNoteElement.querySelector(".part-measure-note-text").innerText = noteName

							if (!options.relativeToInterim) {
								thisNoteElement.setAttribute("interim-tick", newTick)
								thisNoteElement.setAttribute("interim-pitch", newPitch)
							}

						// sound
							if (AUDIO_J.audio && AUDIO_J.instruments[STATE.selected.partId] && newPitch !== previousPitch) {
								const frequency = AUDIO_J.getNote(newPitch)[0]
								AUDIO_J.instruments[STATE.selected.partId].press(frequency, CONSTANTS.metronome.volume)
								AUDIO_J.instruments[STATE.selected.partId].lift(frequency, CONSTANTS.metronome.sustain)
							}
					}
			} catch (error) {console.log(error)}
		}

	/* revertNotes */
		function revertNotes(notes) {
			try {
				// no notes?
					notes = notes || STATE.selected.notes
					if (!Object.keys(notes).length) {
						return
					}

				// loop through
					for (let n in notes) {
						// revert to original state
							notes[n].element.setAttribute("tick", notes[n].tick)
							notes[n].element.setAttribute("pitch", notes[n].pitch)
							notes[n].element.setAttribute("duration", notes[n].duration)

						// get info
							const noteInfo = MUSICXML_J.constants.notes[notes[n].pitch]
							const noteName = noteInfo[1] + (noteInfo[2] == -1 ? "♭" : noteInfo[2] == 1 ? "♯" : "") + noteInfo[3]
							const noteColor = CONSTANTS.midiToColor[notes[n].pitch] || "var(--dark-gray)"

						// restyle & move
							notes[n].element.style.marginLeft = "calc(var(--tick-width) * " + notes[n].tick + ")"
							notes[n].element.style.width = "calc(var(--tick-width) * " + notes[n].duration + ")"
							notes[n].element.style.marginTop = "calc(var(--pitch-height) * var(--pitch-height-modifier) * " + (CONSTANTS.highestPitch - notes[n].pitch) + ")"
							notes[n].element.style.background = noteColor
							notes[n].element.querySelector(".part-measure-note-text").innerText = noteName
					}

				// remove from selection
					unselectNotes(notes)
			} catch (error) {console.log(error)}
		}

	/* deleteNotes */
		function deleteNotes(notes) {
			try {
				// playing
					if (STATE.playback.playing) {
						return
					}
					
				// no part selected
					if (!STATE.selected.partId) {
						return
					}

				// no notes?
					notes = notes || STATE.selected.notes
					if (!Object.keys(notes).length) {
						return
					}

				// update to do
					const deletedNotes = []
					const deletedNoteElements = []
				
				// loop through
					for (let n in notes) {
						deletedNoteElements.push(notes[n].element)
						const deletedNote = {
							measureNumber: notes[n].measureNumber,
							tick: notes[n].tick,
							pitch: notes[n].pitch,
							duration: notes[n].duration
						}
						deletedNotes.push(deletedNote)
					}

				// nothing to send?
					if (!deletedNotes.length) {
						return
					}

				// optimistically delete
					setTimeout(function() {
						for (let n in deletedNoteElements) {
							deletedNoteElements[n].remove()
						}
					}, 0)

				// send to server
					rememberNoteAction("deletePartMeasureNotes", deletedNotes)
					STATE.socket.send(JSON.stringify({
						action: "deletePartMeasureNotes",
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						partId: STATE.selected.partId,
						notes: deletedNotes
					}))

				// revert everything remaining
					revertNotes()
			} catch (error) {console.log(error)}
		}

	/* updateNotes */
		function updateNotes(notes) {
			try {
				// no part selected
					if (!STATE.selected.partId) {
						return
					}

				// no notes?
					notes = notes || STATE.selected.notes
					if (!Object.keys(notes).length) {
						return
					}

				// update to do
					const updatedNotes = []
				
				// loop through
					for (let n in notes) {
						// identify updates
							const updatedNote = {
								before: {
									measureNumber: notes[n].measureNumber,
									tick: notes[n].tick,
									pitch: notes[n].pitch,
									duration: notes[n].duration
								},
								after: {
									measureNumber: notes[n].measureNumber,
									tick: Number(notes[n].element.getAttribute("tick")),
									pitch: Number(notes[n].element.getAttribute("pitch")),
									duration: Number(notes[n].element.getAttribute("duration"))
								}
							}

						// no updates
							if (updatedNote.before.tick     !== updatedNote.after.tick  ||
								updatedNote.before.pitch    !== updatedNote.after.pitch ||
								updatedNote.before.duration !== updatedNote.after.duration) {
								updatedNotes.push(updatedNote)
							}
					}

				// send to server
					if (updatedNotes.length) {
						rememberNoteAction("updatePartMeasureNotes", updatedNotes)
						STATE.socket.send(JSON.stringify({
							action: "updatePartMeasureNotes",
							composerId: STATE.composerId,
							musicId: STATE.music.id,
							partId: STATE.selected.partId,
							notes: updatedNotes
						}))
					}

				// remove from selection
					unselectNotes(notes)
					revertNotes()
			} catch (error) {console.log(error)}
		}

/*** notes - history ***/
	/* rememberNoteAction */
		function rememberNoteAction(action, notes) {
			try {
				// remove all events after index
					STATE.selected.history.splice(STATE.selected.historyIndex, STATE.selected.history.length - STATE.selected.historyIndex)

				// add new event
					STATE.selected.history.push({action: action, notes: notes})

				// set index to end
					STATE.selected.historyIndex = STATE.selected.history.length
			} catch (error) {console.log(error)}
		}

	/* undoNoteAction */
		function undoNoteAction() {
			try {
				// playing
					if (STATE.playback.playing) {
						return
					}
					
				// no part selected
					if (!STATE.selected.partId) {
						return
					}

				// get action & notes from history
					if (!STATE.selected.history.length || !STATE.selected.history[STATE.selected.historyIndex - 1]) {
						showToast({success: false, message: "no action to undo"})
						return
					}
					let action = STATE.selected.history[STATE.selected.historyIndex - 1].action
					let notes  = STATE.selected.history[STATE.selected.historyIndex - 1].notes
					STATE.selected.historyIndex--

				// flip action
					if (action == "addPartMeasureNotes") {
						action = "deletePartMeasureNotes"
					}
					else if (action == "deletePartMeasureNotes") {
						action = "addPartMeasureNotes"
					}
					else if (action == "updatePartMeasureNotes") {
						notes = JSON.parse(JSON.stringify(notes))
						for (let n in notes) {
							const tempNotes = notes[n].before
							notes[n].before = notes[n].after
							notes[n].after  = tempNotes
						}
					}
					else {
						showToast({success: false, message: "unknown action to undo"})
						return
					}

				// send to server
					STATE.socket.send(JSON.stringify({
						action: action,
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						partId: STATE.selected.partId,
						notes: notes
					}))
			} catch (error) {console.log(error)}
		}

	/* redoNoteAction */
		function redoNoteAction() {
			try {
				// playing
					if (STATE.playback.playing) {
						return
					}
					
				// no part selected
					if (!STATE.selected.partId) {
						return
					}

				// get action & notes from history
					if (!STATE.selected.history.length || !STATE.selected.history[STATE.selected.historyIndex]) {
						showToast({success: false, message: "no action to redo"})
						return
					}
					const action = STATE.selected.history[STATE.selected.historyIndex].action
					const notes  = STATE.selected.history[STATE.selected.historyIndex].notes
					STATE.selected.historyIndex++

				// send to server
					STATE.socket.send(JSON.stringify({
						action: action,
						composerId: STATE.composerId,
						musicId: STATE.music.id,
						partId: STATE.selected.partId,
						notes: notes
					}))
			} catch (error) {console.log(error)}
		}

/*** notes - mouse ***/
	/* setCursorState */
		function setCursorState(event, note) {
			try {
				// none
					if (!note || !STATE.selected.partId) {
						STATE.cursor.measureNumber = null
						STATE.cursor.ticksFromLeft = null
						STATE.cursor.pitchesFromTop = null
						STATE.cursor.element = null
						return
					}

				// measure
					const notesContainer = ELEMENTS.content.parts[STATE.selected.partId].measures[note.measureNumber].notesContainer
					const notesContainerRect = notesContainer.getBoundingClientRect()

				// cursor coordinates
					const cursorX = event.touches && event.touches.length ? event.touches[0].clientX : event.clientX
					const cursorY = event.touches && event.touches.length ? event.touches[0].clientY : event.clientY

				// info
					STATE.cursor.measureNumber = note.measureNumber
					STATE.cursor.ticksFromLeft = Math.floor((cursorX - notesContainerRect.x) / CONSTANTS.tickWidth)
					STATE.cursor.pitchesFromTop = Math.floor((cursorY - notesContainerRect.y) / CONSTANTS.pitchHeight)
			} catch (error) {console.log(error)}
		}

	/* doubleclickOnContainer */
		function doubleclickOnContainer(event) {
			try {
				// prevent default
					event.preventDefault()

				// get current position
					const cursorX = event.touches && event.touches.length ? event.touches[0].clientX : event.clientX
					const cursorY = event.touches && event.touches.length ? event.touches[0].clientY : event.clientY

				// get measure
					const measureElement = event.target.closest(".part-measure")
					if (!measureElement) {
						return
					}

				// relative to measure
					const measureNumber = Number(measureElement.getAttribute("measure"))
					const notesContainer = ELEMENTS.content.parts[STATE.selected.partId].measures[measureNumber].notesContainer
					const notesContainerRect = notesContainer.getBoundingClientRect()
					const ticksFromLeft = Math.floor((cursorX - notesContainerRect.x) / CONSTANTS.tickWidth)
					const pitchesFromTop = Math.floor((cursorY - notesContainerRect.y) / CONSTANTS.pitchHeight)

				// new note
					const note = {
						measureNumber: measureNumber,
						tick: ticksFromLeft,
						pitch: CONSTANTS.highestPitch - pitchesFromTop,
						duration: CONSTANTS.ticksPerBeat
					}
					addNotes([note], true)

				// cancel box
					STATE.cursor.held = false
			} catch (error) {console.log(error)}
		}

	/* downMouseOnNote */
		function downMouseOnNote(event) {
			try {
				// note element
					const noteElement = event.target.closest(".part-measure-note")
					const measureNumber = Number(noteElement.closest(".part-measure").getAttribute("measure"))
					const isEnd = (event.target.className == "part-measure-note-end") || false

				// part id
					const partId = noteElement.closest(".part-row").getAttribute("partid")
					if (partId !== STATE.selected.partId) {
						return
					}

				// build note
					const tick = Number(noteElement.getAttribute("actual-tick"))
					const pitch = Number(noteElement.getAttribute("actual-pitch"))
					const duration = Number(noteElement.getAttribute("actual-duration"))
					const note = {
						id: measureNumber + "." + tick + ":" + pitch,
						element: noteElement,
						measureNumber: measureNumber,
						tick: tick,
						pitch: pitch,
						duration: duration,
						end: isEnd
					}

				// right-click --> delete
					if (event.button == 2 || event.ctrlKey || event.mobileContextMenu) {
						event.preventDefault()
						event.stopPropagation()
						deleteNotes([note])
						return
					}

				// hold mouse
					STATE.cursor.held = true
					event.stopPropagation()

				// cursor state
					setCursorState(event, note)

				// holding shift
					if (STATE.keyboard.shift) {
						// note selected --> wait for lift to unselect
							if (STATE.selected.notes[note.id]) {
								STATE.cursor.element = note.element
								return
							}

						// note not selected --> add to selection
							selectNotes([note], true)
							return
					}

				// not holding shift
					// note selected --> wait for lift to unselect
						if (STATE.selected.notes[note.id]) {
							// end?
								if (note.end !== STATE.selected.notes[note.id].end) {
									STATE.selected.notes[note.id].end = note.end
								}
							STATE.cursor.element = note.element
							return
						}

					// note not selected --> make this the only selection
						updateNotes()
						selectNotes([note], true)
						moveMouse(event)
			} catch (error) {console.log(error)}
		}

	/* rightClickOnNote */
		function rightClickOnNote(event) {
			try {
				// prevent default
					event.preventDefault()
					event.stopPropagation()

				// desktop
					if (!ISMOBILE) {
						return
					}
				
				// pass on to downMouseOnNote
					event.mobileContextMenu = true
					downMouseOnNote(event)
			} catch (error) {console.log(error)}
		}

	/* moveMouse */
		function moveMouse(event) {
			try {
				// note helper
					updateNoteHelper(event)

				// no part selected
					if (!STATE.selected.partId) {
						return
					}

				// not held
					if (!STATE.cursor.held) {
						return
					}

				// no notes --> selection box
					if (!Object.keys(STATE.selected.notes).length || STATE.keyboard.shift) {
						updateSelectionBox(event)
						return
					}

				// prevent container from scrolling
					event.stopPropagation()
					event.preventDefault()

				// get current position
					const cursorX = event.touches && event.touches.length ? event.touches[0].clientX : event.clientX
					const cursorY = event.touches && event.touches.length ? event.touches[0].clientY : event.clientY

				// relative to measure
					const notesContainer = ELEMENTS.content.parts[STATE.selected.partId].measures[STATE.cursor.measureNumber].notesContainer
					const notesContainerRect = notesContainer.getBoundingClientRect()
					const ticksFromLeft = Math.floor((cursorX - notesContainerRect.x) / CONSTANTS.tickWidth)
					const pitchesFromTop = Math.floor((cursorY - notesContainerRect.y) / CONSTANTS.pitchHeight)

				// change from before
					const ticksChange = ticksFromLeft - STATE.cursor.ticksFromLeft
					const pitchesChange = STATE.cursor.pitchesFromTop - pitchesFromTop

				// loop through and move
					moveNotes(null, {
						ticksChange: ticksChange,
						pitchesChange: pitchesChange,
						relativeToInterim: true
					})
			} catch (error) {console.log(error)}
		}

	/* upMouse */
		function upMouse(event) {
			try {
				// right-click
					if (event.button == 2 || event.ctrlKey) {
						return
					}

				// release
					STATE.cursor.held = false

				// unselecting something
					if (STATE.cursor.element) {
						const noteElement = STATE.cursor.element.closest(".part-measure-note")
						const measureElement = noteElement.closest(".part-measure")
						if (!measureElement) {
							noteElement.remove()
						}
						else {
							const measureNumber = Number(measureElement.getAttribute("measure"))
							const id = measureNumber + "." + noteElement.getAttribute("actual-tick") + ":" + noteElement.getAttribute("actual-pitch")
							if (STATE.selected.notes[id]) {
								revertNotes([STATE.selected.notes[id]])
							}
						}
						
						STATE.cursor.element = null
						return
					}

				// no part
					if (!STATE.selected.partId) {
						return
					}

				// interim pitches
					if (!ELEMENTS.content.selectionBox && Object.keys(STATE.selected.notes).length) {
						for (let n in STATE.selected.notes) {
							const note = STATE.selected.notes[n]
								note.element.setAttribute("interim-tick", note.element.getAttribute("tick"))
								note.element.setAttribute("interim-pitch", note.element.getAttribute("pitch"))
								note.element.setAttribute("interim-duration", note.element.getAttribute("duration"))
						}
						return
					}

				// selection box?
					// not held
						if (!ELEMENTS.content.selectionBox) {
							return
						}

					// update box
						const selectionBox = updateSelectionBox(event)
						if (!selectionBox) {
							ELEMENTS.content.selectionBox.remove()
							delete ELEMENTS.content.selectionBox
							return
						}

					// get pitches
						const notes = []
						for (let m = selectionBox.startMeasure; m <= selectionBox.endMeasure; m++) {
							const measure = STATE.music.parts[STATE.selected.partId].measures[String(m)]
							for (let n in measure.notes) {
								if (m == selectionBox.startMeasure && Number(n) < selectionBox.startTick) {
									continue
								}
								if (m == selectionBox.endMeasure && Number(n) > selectionBox.endTick) {
									continue
								}
								for (let p in measure.notes[n]) {
									if (Number(p) < selectionBox.startPitch || Number(p) > selectionBox.endPitch) {
										continue
									}
									const note = {
										id: m + "." + n + ":" + p,
										measureNumber: m,
										tick: Number(n),
										duration: Number(measure.notes[n][p]),
										pitch: Number(p),
										end: false
									}
									notes.push(note)
								}
							}
						}

					// notes? --> selection
						if (notes.length) {
							selectNotes(notes)
							return
						}

					// no notes? --> creation
						// multiple pitches?
							if (selectionBox.startPitch !== selectionBox.endPitch) {
								return
							}

						// duration
							let duration = 1
							if (selectionBox.startMeasure == selectionBox.endMeasure) {
								duration += Math.floor(selectionBox.endTick - selectionBox.startTick)
							}
							else {
								duration += STATE.music.measureTicks[String(selectionBox.startMeasure)] - selectionBox.startTick
								for (let i = selectionBox.startMeasure + 1; i < selectionBox.endMeasure; i++) {
									duration += STATE.music.measureTicks[String(i)]
								}
								duration += selectionBox.endTick
							}

						// no duration?
							if (duration < CONSTANTS.quantizeTicks) {
								return
							}

						// create note
							const note = {
								measureNumber: selectionBox.startMeasure,
								tick: selectionBox.startTick,
								duration: duration,
								pitch: selectionBox.startPitch
							}

							addNotes([note], true)
			} catch (error) {console.log(error)}
		}

	/* downMouseOnContainer */
		function downMouseOnContainer(event) {
			try {
				// no part
					if (!STATE.selected.partId) {
						return
					}

				// set cursor
					const notesContainer = event.target.closest(".part-measure-notes")
					const measureNumber = Number(notesContainer.parentNode.getAttribute("measure"))
					setCursorState(event, {measureNumber: measureNumber})
					STATE.cursor.held = true

				// update notes
					if (Object.keys(STATE.selected.notes).length && !STATE.keyboard.shift) {
						updateNotes()
					}

				// right-click --> create new note
					if (event.button == 2 || event.ctrlKey || event.mobileContextMenu) {
						event.preventDefault()
						return
					}

				// start a box
					updateSelectionBox(event)
			} catch (error) {console.log(error)}
		}

	/* updateSelectionBox */
		function updateSelectionBox(event) {
			try {
				// cursor position
					const cursorX = event.touches && event.touches.length ? event.touches[0].clientX : event.changedTouches && event.changedTouches.length ? event.changedTouches[0].clientX : event.clientX
					const cursorY = event.touches && event.touches.length ? event.touches[0].clientY : event.changedTouches && event.changedTouches.length ? event.changedTouches[0].clientY : event.clientY
					const notesContainer = event.target.closest(".part-measure-notes")
					const measureElement = event.target.closest(".part-measure")
					if (!notesContainer || !measureElement) {
						return
					}

				// info
					const measureNumber = Number(measureElement.getAttribute("measure"))
					const notesContainerRect = notesContainer.getBoundingClientRect()
					const ticksFromLeft = Math.max(0, Math.floor((cursorX - notesContainerRect.x) / CONSTANTS.tickWidth))
					const pitchesFromTop = Math.max(0, Math.floor((cursorY - notesContainerRect.y) / CONSTANTS.pitchHeight))

					if (measureNumber < 1 || measureNumber > Object.keys(STATE.music.measureTicks).length) {
						return
					}

				// get box parameters
					const startTime  = Math.min(measureNumber + ticksFromLeft / CONSTANTS.rounding, STATE.cursor.measureNumber + STATE.cursor.ticksFromLeft / CONSTANTS.rounding)
						const startMeasure = Math.floor(startTime)
						const startTick    = Math.round((startTime % 1) * CONSTANTS.rounding)
					const endTime    = Math.max(measureNumber + ticksFromLeft / CONSTANTS.rounding, STATE.cursor.measureNumber + STATE.cursor.ticksFromLeft / CONSTANTS.rounding)
						const endMeasure = Math.floor(endTime)
						const endTick    = Math.round((endTime % 1) * CONSTANTS.rounding)
					const startPitch = Math.min(CONSTANTS.highestPitch - pitchesFromTop, CONSTANTS.highestPitch - STATE.cursor.pitchesFromTop)
					const endPitch   = Math.max(CONSTANTS.highestPitch - pitchesFromTop, CONSTANTS.highestPitch - STATE.cursor.pitchesFromTop)

				// down --> create box
					if (event.type == TRIGGERS.mousedown && !ELEMENTS.content.selectionBox) {
						const selectionBox = document.createElement("div")
							selectionBox.id = "selection-box"
						notesContainer.appendChild(selectionBox)
						ELEMENTS.content.selectionBox = selectionBox
					}

				// move --> adjust box
					if (event.type == TRIGGERS.mousemove && ELEMENTS.content.selectionBox) {
						const startNotesContainer = ELEMENTS.content.parts[STATE.selected.partId].measures[String(startMeasure)].notesContainer
						const endNotesContainer   = ELEMENTS.content.parts[STATE.selected.partId].measures[String(endMeasure)].notesContainer
						if (ELEMENTS.content.selectionBox.parentNode !== startNotesContainer) {
							startNotesContainer.appendChild(ELEMENTS.content.selectionBox)
						}

						let pitchDifference = endPitch - startPitch
						let tickDifference = endTick - startTick
						for (let m = startMeasure; m < endMeasure; m++) {
							tickDifference += STATE.music.measureTicks[String(m)]
						}

						ELEMENTS.content.selectionBox.style.top = "calc(var(--pitch-height) * var(--pitch-height-modifier) * " + (CONSTANTS.highestPitch - endPitch) + ")"
						ELEMENTS.content.selectionBox.style.height = "calc(var(--pitch-height) * var(--pitch-height-modifier) * " + (pitchDifference + 1) + ")"
						ELEMENTS.content.selectionBox.style.left = "calc(var(--tick-width) * " + startTick + ")"
						ELEMENTS.content.selectionBox.style.width = "calc(var(--tick-width) * " + (tickDifference + 1) + ")"
					}

				// up --> delete box
					if (event.type == TRIGGERS.mouseup && ELEMENTS.content.selectionBox) {
						ELEMENTS.content.selectionBox.remove()
						delete ELEMENTS.content.selectionBox
					}

				// return info
					return {
						startMeasure: startMeasure,
						startTick: startTick,
						startPitch: startPitch,
						endMeasure: endMeasure,
						endTick: endTick,
						endPitch: endPitch
					}
			} catch (error) {console.log(error)}
		}

	/* updateNoteHelper */
		function updateNoteHelper(event) {
			try {
				// no event?
					if (!event || !STATE.selected.partId || STATE.playback.playing) {
						ELEMENTS.help.noteHelper.innerText = ""
						return
					}

				// cursor
					const cursorX = event.touches && event.touches.length ? event.touches[0].clientX : event.clientX
					const cursorY = event.touches && event.touches.length ? event.touches[0].clientY : event.clientY

				// move
					ELEMENTS.help.noteHelper.style.left = cursorX + "px"
					ELEMENTS.help.noteHelper.style.top  = cursorY + "px"

				// get containers
					const containerRect = ELEMENTS.content.parts[STATE.selected.partId].measuresContainer.getBoundingClientRect()
					const infoRect = ELEMENTS.content.parts[STATE.selected.partId].infoContainer.getBoundingClientRect()
					const headerRect = ELEMENTS.content.measuresText.getBoundingClientRect()

				// out of bounds
					if (cursorX < (infoRect.x + infoRect.width) || 
						cursorY < (headerRect.y + headerRect.height) || 
						cursorY < containerRect.y + CONSTANTS.measureContainerToNotesOffset || cursorY > (containerRect.y + containerRect.height)) {
						ELEMENTS.help.noteHelper.innerText = ""
						return
					}

				// get note
					const midiNote = CONSTANTS.highestPitch - Math.floor((cursorY - containerRect.y - CONSTANTS.measureContainerToNotesOffset) / CONSTANTS.pitchHeight)

				// illegal note
					if (midiNote < CONSTANTS.lowestPitch || midiNote > CONSTANTS.highestPitch) {
						ELEMENTS.help.noteHelper.innerText = ""
						return
					}

				// set text
					const noteInfo = MUSICXML_J.constants.notes[midiNote]
					ELEMENTS.help.noteHelper.innerText = noteInfo[1] + (noteInfo[2] == -1 ? "♭" : noteInfo[2] == 1 ? "♯" : "") + noteInfo[3]
			} catch (error) {console.log(error)}
		}

/*** notes - keyboard ***/
	/* pressKey */
		function pressKeyWithinMeasure(key) {
			try {
				// escape --> revert
					if (key == CONSTANTS.keyboard.escape) {
						revertNotes()
						event.preventDefault()
						return
					}

				// enter --> submit
					if (key == CONSTANTS.keyboard.enter) {
						updateNotes()
						event.preventDefault()
						return
					}

				// delete/backspace --> delete
					if (key == CONSTANTS.keyboard.delete || key == CONSTANTS.keyboard.backspace) {
						deleteNotes()
						event.preventDefault()
						return
					}

				// space --> toggle selection
					if (key == CONSTANTS.keyboard.space && document.activeElement.className == "part-measure-note") {
						// note element
							const noteElement = document.activeElement
							const measureNumber = Number(noteElement.closest(".part-measure").getAttribute("measure"))
							const tick = Number(noteElement.getAttribute("actual-tick"))
							const pitch = Number(noteElement.getAttribute("actual-pitch"))
							const duration = Number(noteElement.getAttribute("actual-duration"))

						// part id
							const partId = noteElement.closest(".part-row").getAttribute("partid")
							if (partId !== STATE.selected.partId) {
								return
							}

						// build note
							const note = {
								id: measureNumber + "." + tick + ":" + pitch,
								element: noteElement,
								measureNumber: measureNumber,
								tick: tick,
								pitch: pitch,
								duration: duration,
								end: false
							}

						// already selected
							const id = note.measureNumber + "." + note.tick + ":" + note.pitch
							if (STATE.selected.notes[id]) {
								revertNotes([note])
								event.preventDefault()
								return
							}
						
						// add to selection
							selectNotes([note], true)
							event.preventDefault()
							return
					}

				// arrow up & down --> pitch up & down
					if (key == CONSTANTS.keyboard.arrowup) {
						moveNotes(null, {
							pitchesChange: STATE.keyboard.shift ? CONSTANTS.pitchesPerOctave : 1
						})
						event.preventDefault()
						return
					}
					if (key == CONSTANTS.keyboard.arrowdown) {
						moveNotes(null, {
							pitchesChange: STATE.keyboard.shift ? -CONSTANTS.pitchesPerOctave : -1
						})
						event.preventDefault()
						return
					}

				// arrow left & right --> tick left & right (shift for duration change)
					if (key == CONSTANTS.keyboard.arrowleft) {
						moveNotes(null, {
							ticksChange: STATE.keyboard.shift ? -CONSTANTS.ticksPerBeat : -1,
							forceStart: STATE.keyboard.altoption ? false : true,
							forceEnd: STATE.keyboard.altoption ? true : false,
							quantize: (STATE.keyboard.meta || STATE.keyboard.control)
						})
						event.preventDefault()
						return
					}
					if (key == CONSTANTS.keyboard.arrowright) {
						moveNotes(null, {
							ticksChange: STATE.keyboard.shift ? CONSTANTS.ticksPerBeat : 1,
							forceStart: STATE.keyboard.altoption ? false : true,
							forceEnd: STATE.keyboard.altoption ? true : false,
							quantize: (STATE.keyboard.meta || STATE.keyboard.control)
						})
						event.preventDefault()
						return
					}

				// cut & copy
					if ((key == CONSTANTS.keyboard.c || key == CONSTANTS.keyboard.x) && (STATE.keyboard.meta || STATE.keyboard.control)) {
						STATE.selected.notesFromClipboard = {}
						for (let n in STATE.selected.notes) {
							STATE.selected.notesFromClipboard[n] = {
								measureNumber: STATE.selected.notes[n].measureNumber,
								duration: Number(STATE.selected.notes[n].element.getAttribute("duration")),
								pitch: Number(STATE.selected.notes[n].element.getAttribute("pitch")),
								tick: Number(STATE.selected.notes[n].element.getAttribute("tick"))
							}
						}

						if (key == CONSTANTS.keyboard.x) {
							deleteNotes()
						}
						event.preventDefault()
						return
					}
			} catch (error) {console.log(error)}
		}

	/* selectAllNotes */
		function selectAllNotes() {
			try {
				// playing
					if (STATE.playback.playing) {
						return
					}
					
				// no part selected
					if (!STATE.selected.partId) {
						return
					}

				// prevent default
					event.preventDefault()

				// lists
					const notes = []
					const noteElements = Array.from(ELEMENTS.content.parts[STATE.selected.partId].measuresContainer.querySelectorAll(".part-measure-note"))

				// loop through
					for (let n in noteElements) {
						const noteElement = noteElements[n]
						const measureNumber = Number(noteElement.closest(".part-measure").getAttribute("measure"))
						const tick = Number(noteElement.getAttribute("actual-tick"))
						const pitch = Number(noteElement.getAttribute("actual-pitch"))
						const duration = Number(noteElement.getAttribute("actual-duration"))

						const note = {
							id: measureNumber + "." + tick + ":" + pitch,
							element: noteElement,
							measureNumber: measureNumber,
							tick: tick,
							pitch: pitch,
							duration: duration,
							end: false
						}

						notes.push(note)
					}

				// select
					selectNotes(notes)
			} catch (error) {console.log(error)}
		}

	/* pressMIDIKey */
		AUDIO_J.midi.pressKey = pressMIDIKey
		function pressMIDIKey(pitch, velocity) {
			try {
				// no selected part
					if (!STATE.selected.partId) {
						return
					}

				// not playing --> sound will start due to activeInstrumentId hook
					if (!STATE.playback.playing) {
						return
					}

				// create note
					const note = {
						measureNumber: STATE.playback.currentMeasure,
						tick: STATE.playback.currentTickOfMeasure,
						pitch: pitch,
						duration: 1
					}

				// add to list
					STATE.selected.notesFromMidiInput.ongoing[String(pitch)] = note
			} catch (error) {console.log(error)}
		}

	/* liftMIDIKey */
		AUDIO_J.midi.liftKey = liftMIDIKey
		function liftMIDIKey(pitch) {
			try {
				// no selected part
					if (!STATE.selected.partId) {
						return
					}

				// not playing --> sound will stop due to activeInstrumentId hook
					if (!STATE.playback.playing) {
						return
					}

				// find note
					const note = STATE.selected.notesFromMidiInput.ongoing[String(pitch)]
					if (!note) {
						return
					}

				// move buckets
					STATE.selected.notesFromMidiInput.complete.push(note)
					delete STATE.selected.notesFromMidiInput.ongoing[String(pitch)]
			} catch (error) {console.log(error)}
		}

/*** playback ***/	
	/* firstClick */
		window.addEventListener(TRIGGERS.click, firstClick)
		function firstClick() {
			try {
				// already audio
					if (AUDIO_J.audio) {
						return
					}

				// build
					AUDIO_J.buildAudio()

				// metronome
					AUDIO_J.instruments._metronome = AUDIO_J.buildInstrument(AUDIO_J.getInstrument(CONSTANTS.metronome.synth))
					AUDIO_J.instruments._metronome.setParameters({volume: CONSTANTS.metronome.volume})

				// existing parts
					for (let p in STATE.music.parts) {
						const parameters = AUDIO_J.getInstrument(STATE.music.parts[p].synth) || STATE.music.synths[STATE.music.parts[p].synth]
						if (parameters) {
							AUDIO_J.instruments[p] = AUDIO_J.buildInstrument(parameters)

							if (STATE.playback.playing || p == STATE.selected.partId) {
								AUDIO_J.instruments[p].setParameters({power: 1})
							}
							else {
								AUDIO_J.instruments[p].setParameters({power: 0})	
							}
						}
					}
			} catch (error) {console.log(error)}
		}

	/* playTick */
		function playTick() {
			try {
				// no measures
					if (!STATE.music.measureTicks[STATE.playback.currentMeasure]) {
						incrementTick()
						return
					}

				// metronome
					if (STATE.playback.metronome && !(STATE.playback.currentTickOfMeasure % CONSTANTS.ticksPerBeat)) {
						playMetronome()
					}

				// loop through parts
					for (let p in STATE.music.parts) {
						playPart(p)
					}

				// slide measures
					const totalOffset = -2 * CONSTANTS.leftColumnWidth + 
						ELEMENTS.content.measures[String(STATE.playback.currentMeasure)].element.offsetLeft + 
						STATE.playback.currentTickOfMeasure * CONSTANTS.tickWidth
					ELEMENTS.content.outer.scrollTo({left: totalOffset})

				// increment duration for MIDI-pressed notes
					if (STATE.playback.currentTickOfMeasure % 1 == 0) { // account for swing
						for (let n in STATE.selected.notesFromMidiInput.ongoing) {
							STATE.selected.notesFromMidiInput.ongoing[n].duration++
						}
					}

				// next
					if (incrementTick()) {
						incrementTick()
					}
			} catch (error) {console.log(error)}
		}

	/* playMetronome */
		function playMetronome() {
			try {
				// no metronome
					if (!AUDIO_J.instruments._metronome) {
						return
					}

				// click
					AUDIO_J.instruments._metronome.press(CONSTANTS.metronome.frequency)
					setTimeout(function() {
						AUDIO_J.instruments._metronome.kill(CONSTANTS.metronome.frequency)
					}, CONSTANTS.metronome.sustain)
			} catch (error) {console.log(error)}
		}

	/* playPart */
		function playPart(partId) {
			try {
				// part
					const partJSON = STATE.music.parts[partId]

				// get measure
					const measure = partJSON.measures[String(STATE.playback.currentMeasure)]
					if (!measure) {
						return
					}

				// dynamics
					if (measure.dynamics !== undefined) {
						STATE.playback.partDynamics[partId] = measure.dynamics
					}

				// get synth
					const synth = AUDIO_J.instruments[partId]
					if (!synth) {
						return
					}

				// get notes for this beat
					if (!measure.notes) {
						return
					}
					const beatNotes = measure.notes[STATE.playback.currentTickOfMeasure] || null
					if (!beatNotes) {
						return
					}
				
				// notes
					const notesContainer = ELEMENTS.content.parts[partId].measures[String(STATE.playback.currentMeasure)].notesContainer
					for (let n in beatNotes) {
						const frequency = AUDIO_J.getNote(n)[0]
						synth.press(frequency, STATE.playback.partDynamics[partId] || -1) // to account for n/0
						const waitMS = STATE.playback.interval * Math.max(1, (beatNotes[n] - 1))
						synth.lift(frequency, waitMS)

						const noteElement = notesContainer.querySelector(".part-measure-note[actual-tick='" + STATE.playback.currentTickOfMeasure + "'][actual-pitch='" + n + "']")
						noteElement.setAttribute("playing", true)
						const noteTimeout = setTimeout(function() {
							try {
								noteElement.removeAttribute("playing")
								delete STATE.playback.noteTimeouts[STATE.playback.currentMeasure + "." + STATE.playback.currentTickOfMeasure + "-" + n]
							} catch (error) {}
						}, waitMS)
						STATE.playback.noteTimeouts[STATE.playback.currentMeasure + "." + STATE.playback.currentTickOfMeasure + "-" + n] = noteTimeout
					}
			} catch (error) {console.log(error)}
		}

	/* incrementTick */
		function incrementTick() {
			try {
				// get last measure
					const lastMeasureNumber = Object.keys(STATE.music.measureTicks).length

				// increment tick --> swing
					let again = false
					if (STATE.playback.swing) {
						const currentTickOfBeat = STATE.playback.currentTickOfMeasure % CONSTANTS.ticksPerBeat
						if (CONSTANTS.swingBeats.halfBeats.includes(currentTickOfBeat)) { 
							STATE.playback.currentTickOfMeasure += 0.5
						}
						else {
							STATE.playback.currentTickOfMeasure += 1

							if (CONSTANTS.swingBeats.doubleBeats.includes(currentTickOfBeat)) {
								again = true
							}
						}
					}
					else {
						STATE.playback.currentTickOfMeasure += 1
					}

				// next measure
					if (STATE.playback.currentTickOfMeasure >= STATE.music.measureTicks[String(STATE.playback.currentMeasure)]) {
						STATE.playback.currentTickOfMeasure = 0

						// more measures?
							if (STATE.playback.currentMeasure < lastMeasureNumber) {
								STATE.playback.currentMeasure++
								ELEMENTS.content.measuresCurrent.value = STATE.playback.currentMeasure
							}

						// end of last measure, but looping?
							else if (STATE.playback.looping) {
								STATE.playback.currentMeasure = 1
								ELEMENTS.content.measuresCurrent.value = STATE.playback.currentMeasure
							}

						// end
							else {
								resetPlayback()
								return false
							}

						// still playing --> check for tempo changes
							if (STATE.music.tempoChanges[String(STATE.playback.currentMeasure)]) {
								STATE.playback.tempo = STATE.music.tempoChanges[String(STATE.playback.currentMeasure)]
								STATE.playback.interval = Math.round(CONSTANTS.minute / CONSTANTS.ticksPerBeat / (STATE.playback.tempo * STATE.playback.tempoMultiplier))
								clearInterval(STATE.playback.loop)
								STATE.playback.loop = setInterval(playTick, STATE.playback.interval)
							}
					}

				// again (for swing)
					return again
			} catch (error) {console.log(error)}
		}

	/* resetPlayback */
		function resetPlayback() {
			try {
				// stop loop
					clearInterval(STATE.playback.loop)
					STATE.playback.loop = null
					STATE.playback.playing = false
					ELEMENTS.header.play.checked = false

				// back to 0
					STATE.playback.partDynamics = {}
					STATE.playback.currentTickOfMeasure = 0
					ELEMENTS.content.outer.removeAttribute("playing")
				
				// stop instrument
					if (AUDIO_J.audio) {
						for (let p in STATE.music.parts) {
							if (AUDIO_J.instruments[p]) {
								AUDIO_J.instruments[p].setParameters({power: 0})
							}
							if (STATE.selected.partId == p) {
								AUDIO_J.instruments[p].setParameters({power: 1})
							}
						}
					}

				// reset playing notes
					for (let t in STATE.playback.noteTimeouts) {
						clearTimeout(STATE.playback.noteTimeouts[t])
						delete STATE.playback.noteTimeouts[t]
					}
					const playingNotes = Array.from(ELEMENTS.content.partsContainer.querySelectorAll(".part-measure-note[playing='true']"))
					for (let p in playingNotes) {
						playingNotes[p].removeAttribute("playing")
					}

				// submit midi notes
					for (let n in STATE.selected.notesFromMidiInput.ongoing) {
						const note = STATE.selected.notesFromMidiInput.ongoing[n]
						STATE.selected.notesFromMidiInput.complete.push(note)
					}
					STATE.selected.notesFromMidiInput.ongoing = {}

					if (STATE.selected.notesFromMidiInput.complete.length) {
						addNotes(STATE.selected.notesFromMidiInput.complete)
						STATE.selected.notesFromMidiInput.complete = []
					}

				// output recording
					if (STATE.playback.recording) {
						AUDIO_J.stopRecording()
					}
			} catch (error) {console.log(error)}
		}
