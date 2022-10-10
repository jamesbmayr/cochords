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
			ticksPerBeat: 24
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
			},
			content: {
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
								continue
							}

						// upsert
							STATE.music.measureTicks[m] = measureTicks[m]
							if (!ELEMENTS.content.measures[m]) {
								ELEMENTS.content.measures[m] = buildMeasure(m)
							}
							
							ELEMENTS.content.measures[m].element.style.width = "calc(var(--tick-width) * " + measureTicks[m] + " + var(--border-size))";
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
				// loop through
					for (let id in partsJSON) {
						const partJSON = partsJSON[id]

						// delete
							if (partJSON === null) {
								delete STATE.music.parts[id]
								ELEMENTS.content.parts[id].infoContainer.remove()
								ELEMENTS.content.parts[id].measuresContainer.remove()
								delete ELEMENTS.content.parts[id]
								continue
							}

						// upsert
							if (!ELEMENTS.content.parts[id]) {
								STATE.music.parts[id] = {}
								ELEMENTS.content.parts[id] = buildPart(id)
							}
							
							receivePart(id, partJSON)
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
							partObject.editorText.innerHTML = ""
							partObject.editInput.checked = false
							partObject.measuresContainer.removeAttribute("locked")
						}
						else if (partJSON.editorId == STATE.composerId) {
							STATE.music.parts[partId].editorId = partJSON.editorId
							partObject.editInput.checked = true
							partObject.measuresContainer.setAttribute("locked", "self")
						}
						else {
							STATE.music.parts[partId].editorId = partJSON.editorId
							partObject.editorText.innerHTML = "&#128274;&nbsp;" + STATE.music.composers[partJSON.editorId].name
							partObject.editInput.checked = false
							partObject.measuresContainer.setAttribute("locked", "other")
						}
					}

				// info
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
									partObject.measures[m] = buildPartMeasure(partObject.measuresContainer, m)
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
						measureObject.element.style.width = "calc(var(--tick-width) * " + measureJSON.ticks + " + var(--border-size))"
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
				
				// notes // ???
					if (measureJSON.notes === null) {
						measureState.notes = {}
					}
					else if (measureJSON.notes !== undefined) {
						measureState.notes = measureJSON.notes
					}
					measureObject.notesContainer.innerHTML = ""
					measureObject.notesContainer.innerHTML = "ticks: " + measureState.ticks + "<br>notes: " + JSON.stringify(measureState.notes) + "<br>" + (measureState.dynamics ? ("dynamics: " + measureState.dynamics) : "")
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
						measures: {}
					}
			} catch (error) {console.log(error)}
		}

	/* buildPartMeasure */
		function buildPartMeasure(measuresContainer, measureNumber) {
			try {
				// measure
					const measure = document.createElement("td")
						measure.className = "part-measure"
						measure.setAttribute("measure", measureNumber)
					measuresContainer.appendChild(measure)

				// notes container
					const notesContainer = document.createElement("div")
						notesContainer.className = "part-measure-notes"
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
						notesContainer: notesContainer,
						notes: {}
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

/*** playback ***/
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
					AUDIO_J.instruments[partId].setParameters({power: volume ? 1 : 0, volume: volume})
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
