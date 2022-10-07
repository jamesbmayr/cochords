/*** globals ***/
	/* triggers */
		const TRIGGERS = {
			change: "change",
			click: "click",
			submit: "submit",
			dblclick: "dblclick",
			contextmenu: "contextmenu"
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
					window.addEventListener(TRIGGERS.mousemove, moveObject)
					window.addEventListener(TRIGGERS.mouseup, dropObject)

				// override mobile later
					if (TRIGGERS.mousedown == "mousedown") {
						window.addEventListener("touchstart", setTriggers)
						return
					}
				
				// overriding --> reset listeners
					if (override) {
						window.removeEventListener("touchstart", setTriggers)
						window.removeEventListener("mousemove", moveObject)
						window.removeEventListener("mouseup", dropObject)
					}
			} catch (error) {console.log(error)}
		}

	/* double click / right-click */
		document.addEventListener(TRIGGERS.dblclick, preventDefault)
		document.addEventListener(TRIGGERS.contextmenu, preventDefault)
		function preventDefault(event) {
			event.preventDefault()
		}

	/* constants */
		const CONSTANTS = {
			pingLoop: 1000 * 60,
			ticksPerBeat: 24,
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
			}
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
				beatsContainer: document.querySelector("#header-beats-measures"),
				addMeasure: document.querySelector("#header-beats-add-measure"),
				beatsMeasures: {},
				tempoContainer: document.querySelector("#header-tempo-measures"),
				tempoMeasures: {}
			},
			partsContainer: document.querySelector("#parts"),
			parts: {},
			data: document.body.querySelector("#data")
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
							return
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

/*** music ***/
	/* receiveMusic */
		function receiveMusic(musicJSON) {
			try {
				// metadata
					if (musicJSON.id !== undefined) {
						STATE.music.id = musicJSON.id
						// ??? what if this does not match STATE.musicId ???
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

				// display
					ELEMENTS.data.innerHTML = JSON.stringify(STATE.music, null, 2)
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

	/* uploadSynth */
		ELEMENTS.header.uploadSynth.addEventListener(TRIGGERS.change, uploadSynth)
		function uploadSynth(event) {
			try {
				// file
					const file = ELEMENTS.uploadSynth.files[0]
					const path = ELEMENTS.uploadSynth.value
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

/*** receives - meta & header ***/
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

	/* receiveTitle */
		function receiveTitle(title) {
			try {
				// currently editing
					if (ELEMENTS.header.title = document.activeElement) {
						return
					}

				// set title
					STATE.music.title = title.trim()
					ELEMENTS.header.title.value = STATE.music.title

				// store
					updateStorage()
			} catch (error) {console.log(error)}
		}

	/* receiveComposer */
		function receiveComposer(composer) {
			try {
				// currently editing
					if (ELEMENTS.header.title = document.activeElement) {
						return
					}

				// set composer
					STATE.music.composer = composer.trim()
					ELEMENTS.header.composer.value = STATE.music.composer
			} catch (error) {console.log(error)}
		}

	/* receiveSwing */
		function receiveSwing(swing) {
			try {
				// set swing
					STATE.music.swing = swing || false
					ELEMENTS.header.swing.checked = STATE.music.swing
			} catch (error) {console.log(error)}
		}

	/* receiveMeasureTicks */
		function receiveMeasureTicks(measureTicks) {
			try {
				// set state
					STATE.music.measureTicks = measureTicks

				// upsert measures
					for (let m in STATE.music.measureTicks) {
						if (!ELEMENTS.header.beatsMeasures[m]) {
							createBeatsMeasure(m)
						}
						ELEMENTS.header.beatsMeasures[m].beatsInput.value = Math.floor(STATE.music.measureTicks[m] / CONSTANTS.ticksPerBeat)
					}

				// set total measure count
					const measureCount = Object.keys(STATE.music.measureTicks).length
					ELEMENTS.header.measuresTotal.innerText = measureCount
					ELEMENTS.header.measuresCurrent.max = measureCount
					if (ELEMENTS.header.measuresCurrent.value > measureCount) {
						ELEMENTS.header.measuresCurrent.value = measureCount
					}
			} catch (error) {console.log(error)}
		}

	/* receiveTempoChanges */
		function receiveTempoChanges(tempoChanges) {
			try {
				// set state
					STATE.music.tempoChanges = tempoChanges

				// override measures
					for (let m in ELEMENTS.header.tempoMeasures) {
						if (STATE.music.tempoChanges[m]) {
							ELEMENTS.header.tempoMeasures[m].tempoInput.value = STATE.music.tempoChanges[m]
						}
						else {
							ELEMENTS.header.tempoMeasures[m].tempoInput.value = 0	
						}
					}
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
							for (let p in ELEMENTS.parts) {
								const customSynths = ELEMENTS.parts[p].synthsSelect.custom
								if (!customSynths.querySelector("[value='" + synthName + "']")) {
									const synthOption = document.createElement("option")
										synthOption.value = s
										synthOption.innerText = synthName
									customSynths.appendChild(synthOption)
								}
							}
					}
			} catch (error) {console.log(error)}
		}

	/* receiveParts */
		function receiveParts(parts) {
			try {
				// ???
			} catch (error) {console.log(error)}
		}

/*** creates ***/
	/* createBeatsMeasure */
		function createBeatsMeasure(m) {
			try {
				// measure
					const measure = document.createElement("div")
						measure.className = "beats-measure"
						measure.id = "beats-measure-" + m
					ELEMENTS.header.beatsContainer.appendChild(measure)

				// insert measure before
					const insertButton = document.createElement("button")
						insertButton.className = "beats-measure-insert"
						insertButton.innerHTML = "+"
						insertButton.title = "insert measure"
					measure.appendChild(insertButton)

				// beats per measure
					const beatsInput = document.createElement("input")
						beatsInput.className = "beats-measure-input"
						beatsInput.type = "number"
						beatsInput.min = "1"
						beatsInput.step = "1"
						beatsInput.placeholder = "# beats"
					measure.appendChild(beatsInput)
				
				// delete this measure
					const deleteButton = document.createElement("button")
						deleteButton.className = "beats-measure-delete"
						deleteButton.innerHTML = "&times;"
						deleteButton.title = "delete measure"
					measure.appendChild(deleteButton)

				// save to elements
					ELEMENTS.header.beatsMeasures[m] = {
						measure: measure,
						beatsInput: beatsInput,
						delete: deleteButton,
						insert: insertButton
					}

				// tempo
					createTempoMeasure(m)
			} catch (error) {console.log(error)}
		}

	/* createTempoMeasure */
		function createTempoMeasure(m) {
			try {
				// measure
					const measure = document.createElement("div")
						measure.className = "tempo-measure"
						measure.id = "tempo-measure-" + m
					ELEMENTS.header.tempoContainer.appendChild(measure)

				// bpm from measure on
					const tempoInput = document.createElement("input")
						tempoInput.className = "tempo-measure-input"
						tempoInput.type = "number"
						tempoInput.min = "1"
						tempoInput.step = "1"
						tempoInput.placeholder = "bpm"
					measure.appendChild(tempoInput)
				
				// save to elements
					ELEMENTS.header.tempoMeasures[m] = {
						measure: measure,
						tempoInput: tempoInput
					}
			} catch (error) {console.log(error)}
		}

/*** updates ***/
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

/*** objects ***/
	/* grabObject */
		function grabObject() {
			try {

			} catch (error) {console.log(error)}
		}

	/* moveObject */
		function moveObject() {
			try {

			} catch (error) {console.log(error)}
		}

	/* dropObject */
		function dropObject() {
			try {

			} catch (error) {console.log(error)}
		}
