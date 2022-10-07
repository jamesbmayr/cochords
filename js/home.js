/*** globals ***/
	/* triggers */
		const TRIGGERS = {
			click: "click",
			submit: "submit",
			change: "change"
		}

	/* constants */
		const CONSTANTS = {
			minimumComposerNameLength: 3,
			maximumComposerNameLength: 20,
			musicIdLength: 8
		}

	/* musicXML constants */
		const MUSICXML_CONSTANTS = {
			numberToBeat: {
				"1": "whole",
				"2": "half",
				"4": "quarter",
				"8": "eighth",
				"16": "sixteenth"
			},
			beatToTick: {
				"whole": 96,
				"half-dot": 72,
				"half": 48,
				"quarter-dot": 36,
				"quarter": 24,
				"eighth-dot": 18,
				"eighth": 12,
				"sixteenth-dot": 9,
				"sixteenth": 6,
				"16th-dot": 9,
				"16th": 6
			},
			noteNameToMidi: {
				"C-1":  0,
				"C♯-1": 1,
				"D♭-1": 1,
				"D-1":  2,
				"D♯-1": 3,
				"E♭-1": 3,
				"E-1":  4,
				"F-1":  5,
				"F♯-1": 6,
				"G♭-1": 6,
				"G-1":  7,
				"G♯-1": 8,
				"A♭-1": 8,
				"A-1":  9,
				"A♯-1": 0,
				"B♭-1":10,
				"B-1": 11,
				"C0":  12,
				"C♯0": 13,
				"D♭0": 13,
				"D0":  14,
				"D♯0": 15,
				"E♭0": 15,
				"E0":  16,
				"F0":  17,
				"F♯0": 18,
				"G♭0": 18,
				"G0":  19,
				"G♯0": 20,
				"A♭0": 20,
				"A0":  21,
				"A♯0": 22,
				"B♭0": 22,
				"B0":  23,
				"C1":  24,
				"C♯1": 25,
				"D♭1": 25,
				"D1":  26,
				"D♯1": 27,
				"E♭1": 27,
				"E1":  28,
				"F1":  29,
				"F♯1": 30,
				"G♭1": 30,
				"G1":  31,
				"G♯1": 32,
				"A♭1": 32,
				"A1":  33,
				"A♯1": 34,
				"B♭1": 34,
				"B1":  35,
				"C2":  36,
				"C♯2": 37,
				"D♭2": 37,
				"D2":  38,
				"D♯2": 39,
				"E♭2": 39,
				"E2":  40,
				"F2":  41,
				"F♯2": 42,
				"G♭2": 42,
				"G2":  43,
				"G♯2": 44,
				"A♭2": 44,
				"A2":  45,
				"A♯2": 46,
				"B♭2": 46,
				"B2":  47,
				"C3":  48,
				"C♯3": 49,
				"D♭3": 49,
				"D3":  50,
				"D♯3": 51,
				"E♭3": 51,
				"E3":  52,
				"F3":  53,
				"F♯3": 54,
				"G♭3": 54,
				"G3":  55,
				"G♯3": 56,
				"A♭3": 56,
				"A3":  57,
				"A♯3": 58,
				"B♭3": 58,
				"B3":  59,
				"C4":  60,
				"C♯4": 61,
				"D♭4": 61,
				"D4":  62,
				"D♯4": 63,
				"E♭4": 63,
				"E4":  64,
				"F4":  65,
				"F♯4": 66,
				"G♭4": 66,
				"G4":  67,
				"G♯4": 68,
				"A♭4": 68,
				"A4":  69,
				"A♯4": 70,
				"B♭4": 70,
				"B4":  71,
				"C5":  72,
				"C♯5": 73,
				"D♭5": 73,
				"D5":  74,
				"D♯5": 75,
				"E♭5": 75,
				"E5":  76,
				"F5":  77,
				"F♯5": 78,
				"G♭5": 78,
				"G5":  79,
				"G♯5": 80,
				"A♭5": 80,
				"A5":  81,
				"A♯5": 82,
				"B♭5": 82,
				"B5":  83,
				"C6":  84,
				"C♯6": 85,
				"D♭6": 85,
				"D6":  86,
				"D♯6": 87,
				"E♭6": 87,
				"E6":  88,
				"F6":  89,
				"F♯6": 90,
				"G♭6": 90,
				"G6":  91,
				"G♯6": 92,
				"A♭6": 92,
				"A6":  93,
				"A♯6": 94,
				"B♭6": 94,
				"B6":  95,
				"C7":  96,
				"C♯7": 97,
				"D♭7": 97,
				"D7":  98,
				"D♯7": 99,
				"E♭7": 99,
				"E7": 100,
				"F7": 101,
				"F♯7":102,
				"G♭7":102,
				"G7": 103,
				"G♯7":104,
				"A♭7":104,
				"A7": 105,
				"A♯7":106,
				"B♭7":106,
				"B7": 107,
				"C8": 108,
				"C♯8":109,
				"D♭8":109,
				"D8": 110,
				"D♯8":111,
				"E♭8":111,
				"E8": 112,
				"F8": 113,
				"F♯8":114,
				"G♭8":114,
				"G8": 115,
				"G♯8":116,
				"A♭8":116,
				"A8": 117,
				"A♯8":118,
				"B♭8":118,
				"B8": 119,
				"C9": 120,
				"C♯9":121,
				"D♭9":121,
				"D9": 122,
				"D♯9":123,
				"E♭9":123,
				"E9": 124,
				"F9": 125,
				"F♯9":126,
				"G♭9":126,
				"G9": 127,
				"G♯9":128,
				"A♭9":128,
				"A9": 129,
				"A♯9":130,
				"B♭9":130,
				"B9": 131,
				"C10":132
			},
			ensembleInstrumentDefault: "ziplimba",
			instrumentToSynth: {
				"piano": "keystone",
				"harpsichord": "sharpsichord",
				"clavinet": "zipboard",
				"celesta": "bitbottle",
				"glockenspiel": "bellissful",
				"music box": "glassical",
				"vibraphone": "meltmallet",
				"marimba": "mayrimba",
				"xylophone": "nimbusnotes",
				"bell": "bellissful",
				"dulcimer": "sharpsichord",
				"organ": "pipepad",
				"accordion": "accordienne",
				"harmonica": "hermanico",
				"violin": "vyol",
				"viola": "vyol",
				"cello": "swello",
				"contrabass": "swello",
				"ukulele": "honeyharp",
				"acoustic": "randolin",
				"mandolin": "randolin",
				"guitar": "lazerz",
				"pizzicato": "spritzicato",
				"string": "vyol",
				"harp": "honeyharp",
				"timpani": "boombash",
				"choir": "voxelle",
				"voice": "voxelle",
				"vocals": "voxelle",
				"orchestra": "vyol",
				"trumpet": "ashbray",
				"cornet": "ashbray",
				"trombone": "trombus",
				"tuba": "trombus",
				"horn": "trombus",
				"mellophone": "trombus",
				"euphonium": "trombus",
				"brass": "ashbray",
				"soprano saxophone": "snacksifolk",
				"alto saxophone": "snacksifolk",
				"soprano sax": "snacksifolk",
				"alto sax": "snacksifolk",
				"baritone saxophone": "reedles",
				"tenor saxophone": "reedles",
				"bari sax": "reedles",
				"tenor sax": "reedles",
				"saxophone": "reedles",
				"sax": "reedles",
				"oboe": "hermanico",
				"bassoon": "reverbassoon",
				"clarinet": "clarinaut",
				"piccolo": "particcolo",
				"recorder": "mockarina",
				"pan flute": "bitbottle",
				"flute": "particcolo",
				"bottle": "bitbottle",
				"shakuhachi": "mockarina",
				"whistle": "particcolo",
				"ocarina": "mockarina",
				"synthesizer": "zipboard",
				"square": "square",
				"sawtooth": "sawtooth",
				"calliope": "bitbottle",
				"chiff": "bowsaw",
				"charang": "qube",
				"lead": "square",
				"pad": "sine",
				"fx": "underseep",
				"sitar": "zipboard",
				"banjo": "jellybanjo",
				"shamisen": "randolin",
				"koto": "honeyharp",
				"kalimba": "ziplimba",
				"bag pipe": "accordienne",
				"fiddle": "vyol",
				"shanai": "snacksifolk",
				"agogo": "meltmallet",
				"steel drums": "meltmallet",
				"woodblock": "boombash",
				"taiko": "ensnarl",
				"tom": "ensnarl",
				"drum": "ensnarl",
				"percussion": "boombash",
				"bass": "fuzzillade"
			},
		}

	/* elements */
		const ELEMENTS = {
			body: document.body,
			background: document.querySelector("#background"),
			nameInput: document.querySelector("#name-input"),
			logo: document.querySelector("#logo"),
			createMusicForm: document.querySelector("#create-music-form"),
			uploadMusicInput: document.querySelector("#upload-music-input"),
			joinMusicForm: document.querySelector("#join-music-form"),
			joinMusicInput: document.querySelector("#join-music-input"),
			previousMusicSection: document.querySelector("#previous-music-section"),
			previousMusicNone: document.querySelector("#previous-music-none")
		}

/*** tools ***/
	/* sendPost */
		function sendPost(options, callback) {
			try {
				// send data to server
					fetch(location.pathname, {method: "POST", body: JSON.stringify(options)})
						.then(function(response){ return response.json() })
						.then(function(data) {
							callback(data || {success: false, message: "unknown error"})
						})
						.catch(function(error) {
							callback({success: false, message: error})
						})
			} catch (error) {console.log(error)}
		}

	/* receivePost */
		function receivePost(data) {
			try {
				// redirect
					if (data.location) {
						window.location = data.location
						return
					}

				// message
					if (data.message) {
						showToast(data)
					}
			} catch (error) {console.log(error)}
		}

	/* isNumLet */
		function isNumLet(string) {
			try {
				return (/^[a-zA-Z0-9]+$/).test(string)
			} catch (error) {console.log(error)}
		}

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

/*** interactive ***/
	/* createMusic */
		ELEMENTS.createMusicForm.addEventListener(TRIGGERS.submit, createMusic)
		function createMusic(event) {
			try {
				// name
					const name = (ELEMENTS.nameInput.value || "").trim()
					if (!name || CONSTANTS.minimumComposerNameLength > name.length || name.length > CONSTANTS.maximumComposerNameLength) {
						showToast({success: false, message: "name must be " + CONSTANTS.minimumComposerNameLength + " to " + CONSTANTS.maximumComposerNameLength + " characters"})
						return
					}

				// post
					sendPost({
						action: "createMusic",
						name: name
					}, receivePost)
			} catch (error) {console.log(error)}
		}

	/* uploadMusic */
		ELEMENTS.uploadMusicInput.addEventListener(TRIGGERS.change, uploadMusic)
		function uploadMusic(event) {
			try {
				// name
					const name = (ELEMENTS.nameInput.value || "").trim()
					if (!name || CONSTANTS.minimumComposerNameLength > name.length || name.length > CONSTANTS.maximumComposerNameLength) {
						showToast({success: false, message: "name must be " + CONSTANTS.minimumComposerNameLength + " to " + CONSTANTS.maximumComposerNameLength + " characters"})
						return
					}

				// file
					const file = ELEMENTS.uploadMusicInput.files[0]
					const path = ELEMENTS.uploadMusicInput.value
					if (!file || (path.slice(-4).toLowerCase() !== ".xml") && (path.slice(-9).toLowerCase() !== ".musicxml")) {
						showToast({success: false, message: "only uncompressed musicXML"})
						return
					}

				// read
					const reader = new FileReader()
						reader.readAsText(file)
						reader.onload = function(event) {
							try {
								// parse XML
									const parser = new DOMParser()
									const musicXML = parser.parseFromString(event.target.result, "text/xml")
									const musicJSON = parseXML(musicXML)

								// empty?
									if (!musicJSON || !musicJSON.totalTicks || !musicJSON.parts || !Object.keys(musicJSON.parts).length) {
										showToast({success: false, message: "unable to parse musicXML file"})
									}

								// post
									sendPost({
										action: "uploadMusic",
										name: name,
										musicJSON: musicJSON
									}, receivePost)
							}
							catch (error) {
								showToast({success: false, message: "invalid musicXML file"})
							}

							ELEMENTS.uploadMusicInput.value = null
						}
			} catch (error) {console.log(error)}
		}

	/* joinMusic */
		ELEMENTS.joinMusicForm.addEventListener(TRIGGERS.submit, joinMusic)
		function joinMusic(event) {
			try {
				// music id
					const musicId = ELEMENTS.joinMusicInput.value || null
					if (!musicId || musicId.length !== CONSTANTS.musicIdLength || !isNumLet(musicId)) {
						showToast({success: false, message: "music id must be " + CONSTANTS.musicIdLength + " letters & numbers"})
						return
					}

				// name
					const name = (ELEMENTS.nameInput.value || "").trim()
					if (!name || CONSTANTS.minimumComposerNameLength > name.length || name.length > CONSTANTS.maximumComposerNameLength) {
						showToast({success: false, message: "name must be " + CONSTANTS.minimumComposerNameLength + " to " + CONSTANTS.maximumComposerNameLength + " characters"})
						return
					}

				// post
					sendPost({
						action: "joinMusic",
						musicId: musicId,
						name: name
					}, receivePost)
			} catch (error) {console.log(error)}
		}

	/* selectMusic */
		function selectMusic(event) {
			try {
				// music id
					const musicId = event.target.value || null
					if (!musicId || musicId.length !== CONSTANTS.musicIdLength || !isNumLet(musicId)) {
						showToast({success: false, message: "invalid music id"})
						return
					}

				// name
					const name = (ELEMENTS.nameInput.value || "").trim()
					if (!name || CONSTANTS.minimumComposerNameLength > name.length || name.length > CONSTANTS.maximumComposerNameLength) {
						showToast({success: false, message: "name must be " + CONSTANTS.minimumComposerNameLength + " to " + CONSTANTS.maximumComposerNameLength + " characters"})
						return
					}

				// post
					sendPost({
						action: "joinMusic",
						musicId: musicId,
						name: name
					}, receivePost)
			} catch (error) {console.log(error)}
		}

/*** localstorage ***/
	/* loadContent */
		loadContent()
		function loadContent() {
			try {
				// localstorage
					if (!window.localStorage || !window.localStorage.cochords) {
						return
					}
					const storageData = JSON.parse(window.localStorage.cochords)

				// name
					if (storageData.name) {
						ELEMENTS.nameInput.value = storageData.name.trim()
					}

				// history
					if (storageData.music) {
						for (let i in storageData.music) {
							createMusicButton(storageData.music[i])
						}

						ELEMENTS.previousMusicNone.remove()
					}
			} catch (error) {console.log(error)}
		}

	/* createMusicButton */
		function createMusicButton(musicInfo) {
			try {
				// no id
					if (!musicInfo || !musicInfo.id) {
						return
					}

				// button
					const buttonElement = document.createElement("button")
						buttonElement.className = "previous-music-button"
						buttonElement.id = musicInfo.id
						buttonElement.value = musicInfo.id
						buttonElement.innerText = musicInfo.title
						buttonElement.addEventListener(TRIGGERS.click, selectMusic)
					ELEMENTS.previousMusicSection.appendChild(buttonElement)
			} catch (error) {console.log(error)}
		}

/*** musicXML ***/
	/* parseXML */
		function parseXML(musicXML) {
			try {
				// empty JSON
					const musicJSON = {}

				// credit
					musicJSON.title = (musicXML.querySelector("movement-title") || {}).innerHTML || ""
					musicJSON.composer = (musicXML.querySelector("creator") || {}).innerHTML || ""

				// parts
					musicJSON.parts = {}
					const partsXML = Array.from(musicXML.querySelectorAll("part"))

				// loop through XML
					for (let p in partsXML) {
						const partJSON = parseXMLPart(musicXML, partsXML[p])
						if (partJSON) {
							musicJSON.parts[partJSON.partId] = partJSON
						}
					}

				// ticks, swing, tempo
					musicJSON.totalTicks = 0
					musicJSON.measureTicks = {}
					musicJSON.swing = false
					musicJSON.tempoChanges = {}
					for (let p in musicJSON.parts) {
						if (musicJSON.parts[p].totalTicks > musicJSON.totalTicks) {
							musicJSON.totalTicks = musicJSON.parts[p].totalTicks
						}
						if (musicJSON.parts[p].swing) {
							musicJSON.swing = true
						}

						for (let m in musicJSON.parts[p].staves['1']) {
							if (!musicJSON.measureTicks[m]) {
								musicJSON.measureTicks[m] = musicJSON.parts[p].staves['1'][m].ticks
							}
							if (musicJSON.parts[p].staves['1'][m].tempo) {
								musicJSON.tempoChanges[m] = musicJSON.parts[p].staves['1'][m].tempo
							}
						}
					}

				// return
					return musicJSON
			} catch (error) {console.log(error)}
		}

	/* parseXMLPart */
		function parseXMLPart(musicXML, partXML) {
			try {
				// add to list
					const partId = partXML.getAttribute("id")
					const partJSON = {
						partId: partId
					}
				
				// part info
					const instrumentXML = musicXML.querySelector("score-part#" + partId)
					if (instrumentXML) {
						partJSON.name = (instrumentXML.querySelector("part-name") || {}).innerHTML || ""
						partJSON.instrument = (instrumentXML.querySelector("instrument-sound") || instrumentXML.querySelector("virtual-name") || instrumentXML.querySelector("instrument-name") || {}).innerHTML || ""
						partJSON.midiChannel = Number((instrumentXML.querySelector("midi-channel") || {}).innerHTML || 0)
						partJSON.midiProgram = Number((instrumentXML.querySelector("midi-program") || {}).innerHTML || 0)
						partJSON.synth = mapInstrument(partJSON.name || partJSON.instrument)
						partJSON.staves = {}
						partJSON.currentTicksPerMeasure = 0
						partJSON.currentTies = {}
					}

				// measures
					const measuresXML = Array.from(partXML.querySelectorAll("part#" + partId + " > measure"))
					partJSON.staves["1"] = {}

				// loop through measures
					for (let m in measuresXML) {
						parseXMLMeasure(partJSON, String(Number(m) + 1), measuresXML[m])
					}

				// first measure
					partJSON.swing = false
					if (measuresXML[0] && !measuresXML[0].querySelector("sound swing straight") && measuresXML[0].querySelector("sound swing")) {
						partJSON.swing = true
					}

				// delete temporary attributes
					delete partJSON.currentTicksPerMeasure
					delete partJSON.currentTies

				// add up ticks
					partJSON.totalTicks = 0
					for (let m in partJSON.staves["1"]) {
						partJSON.totalTicks += (partJSON.staves["1"][m].ticks || 0)
					}

				// return
					return partJSON
			} catch (error) {console.log(error)}
		}

	/* parseXMLMeasure */
		function parseXMLMeasure(partJSON, measureNumber, measureXML) {
			try {
				// reset ticks & staff
					let currentTicks = {}

				// loop through notes
					const notesXML = Array.from(measureXML.querySelectorAll("measure > note")) || []
					for (let n in notesXML) {
						// note
							const xmlNote = notesXML[n]

						// staff
							const currentStaffId = xmlNote.querySelector("staff") ? String(xmlNote.querySelector("staff").innerHTML) : "1"
							if (!partJSON.staves[currentStaffId]) {
								partJSON.staves[currentStaffId] = {}
							}
							if (!partJSON.staves[currentStaffId][measureNumber]) {
								partJSON.staves[currentStaffId][measureNumber] = {}
							}
							if (!currentTicks[currentStaffId]) {
								currentTicks[currentStaffId] = 0
							}

						// rest measure?
							if (xmlNote.querySelector("rest[measure='yes']")) {
								continue
							}

						// duration
							const noteType = (xmlNote.querySelector("type") || {}).innerHTML + (xmlNote.querySelector("dot") ? "-dot" : "") || ""
							if (!noteType) { continue }
							const duration = Math.round(MUSICXML_CONSTANTS.beatToTick[noteType] * (xmlNote.querySelector("time-modification") ? Number(xmlNote.querySelector("normal-notes").innerHTML) / Number(xmlNote.querySelector("actual-notes").innerHTML) : 1))
							if (!duration) { continue }

						// rest
							if (xmlNote.querySelector("rest")) {
								currentTicks[currentStaffId] += duration
								continue
							}

						// pitch (midi)
							const noteName = (xmlNote.querySelector("pitch step") || xmlNote.querySelector("unpitched display-step") || {}).innerHTML
							const alter = Number((xmlNote.querySelector("pitch alter") || {}).innerHTML) || 0
							const accidental = (alter == -1) ? "♭" : (alter == 1) ? "♯" : ""
							const octave = (xmlNote.querySelector("pitch octave") || xmlNote.querySelector("unpitched display-octave") || {}).innerHTML
							const midi = MUSICXML_CONSTANTS.noteNameToMidi[noteName + accidental + octave] || null
							if (!midi) {
								currentTicks[currentStaffId] += duration
								continue
							}

						// chord
							let chord = false
							if (xmlNote.querySelector("chord")) {
								chord = true
								currentTicks[currentStaffId] -= duration
							}

						// tie?
							let heldOver = false
							if (xmlNote.querySelector("tie[type='stop']") && partJSON.currentTies[midi]) {
								const tieStart = String(partJSON.currentTies[midi]).split(".")
								const tieStartMeasure = tieStart[0]
								const tieStartTick = tieStart[1]

								// update existing note's duration
									if (partJSON.staves[currentStaffId][tieStartMeasure] &&
										partJSON.staves[currentStaffId][tieStartMeasure].notes[tieStartTick] &&
										partJSON.staves[currentStaffId][tieStartMeasure].notes[tieStartTick][String(midi)]) {
										partJSON.staves[currentStaffId][tieStartMeasure].notes[tieStartTick][String(midi)] += duration
										heldOver = true
									}
								
								// end of that tie?
									if (!xmlNote.querySelector("tie[type='start']")) {
										delete partJSON.currentTies[midi]
									}
							}
							else if (xmlNote.querySelector("tie[type='start']") && !partJSON.currentTies[midi]) {
								partJSON.currentTies[midi] = measureNumber + "." + String(currentTicks[currentStaffId])
							}

						// chord?
							if (!heldOver && chord && 
								partJSON.staves[currentStaffId][measureNumber].notes &&
								partJSON.staves[currentStaffId][measureNumber].notes[String(currentTicks[currentStaffId])]) {
								partJSON.staves[currentStaffId][measureNumber].notes[String(currentTicks[currentStaffId])][String(midi)] = duration
							}

						// new note
							else if (!heldOver) {
								if (!partJSON.staves[currentStaffId][measureNumber].notes) {
									partJSON.staves[currentStaffId][measureNumber].notes = {}
								}
								if (!partJSON.staves[currentStaffId][measureNumber].notes[String(currentTicks[currentStaffId])]) {
									partJSON.staves[currentStaffId][measureNumber].notes[String(currentTicks[currentStaffId])] = {}
								}
								partJSON.staves[currentStaffId][measureNumber].notes[String(currentTicks[currentStaffId])][String(midi)] = duration
							}

						// increment currentTicks
							currentTicks[currentStaffId] += duration
					}

				// dynamic change
					const dynamicDirections = Array.from(measureXML.querySelectorAll("sound[dynamics]")) || []
					const dynamicChange = dynamicDirections.length ? Number(dynamicDirections[dynamicDirections.length - 1].getAttribute("dynamics")) / 100 || 0 : null

				// tempo change
					const tempoDirection = measureXML.querySelector("sound[tempo]") || null
					const tempoChange = tempoDirection ? Number(tempoDirection.getAttribute("tempo")) || 0 : null

				// time signature change?
					const xmlAttributes = measureXML.querySelector("attributes") || null
					if (xmlAttributes && xmlAttributes.querySelector("beat-type") && xmlAttributes.querySelector("beats")) {
						const currentBeatType = String(xmlAttributes.querySelector("beat-type").innerHTML)
						const currentBeatsPerMeasure = Number(xmlAttributes.querySelector("beats").innerHTML)
						partJSON.currentTicksPerMeasure = MUSICXML_CONSTANTS.beatToTick[MUSICXML_CONSTANTS.numberToBeat[currentBeatType]] * currentBeatsPerMeasure
					}

					for (let staff in partJSON.staves) {
						if (!partJSON.staves[staff][measureNumber]) {
							partJSON.staves[staff][measureNumber] = {}
						}
						partJSON.staves[staff][measureNumber].ticks = partJSON.currentTicksPerMeasure

						if (tempoChange) {
							partJSON.staves[staff][measureNumber].tempo = tempoChange
						}
						if (dynamicChange) {
							partJSON.staves[staff][measureNumber].dynamics = dynamicChange
						}
					}
			} catch (error) {console.log(error)}
		}

	/* mapInstrument */
		function mapInstrument(name) {
			try {
				// find in list
					name = name.trim().toLowerCase()
					for (let i in MUSICXML_CONSTANTS.instrumentToSynth) {
						if (name.includes(i)) {
							return MUSICXML_CONSTANTS.instrumentToSynth[i]
						}
					}

				// default
					return MUSICXML_CONSTANTS.ensembleInstrumentDefault
			} catch (error) {console.log(error)}
		}
