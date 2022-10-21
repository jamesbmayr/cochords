/*** modules ***/
	const CORE = require("../node/core")
	const SESSION = require("../node/session")
	module.exports = {
		actions: {}
	}

/*** constants ***/
	const CONSTANTS = CORE.getAsset("constants")

/*** creates ***/
	/* createOne */
		module.exports.createOne = createOne
		function createOne(REQUEST, callback) {
			try {
				// name
					if (!REQUEST.post.name || CONSTANTS.minimumComposerNameLength > REQUEST.post.name.length || REQUEST.post.name.length > CONSTANTS.maximumComposerNameLength) {
						callback({success: false, message: "name must be between " + CONSTANTS.minimumComposerNameLength + " and " + CONSTANTS.maximumComposerNameLength + " characters"})
						return
					}

				// create
					const composer = CORE.getSchema("composer")
						composer.sessionId = REQUEST.session.id
						composer.name = REQUEST.post.name.trim()

					const music = CORE.getSchema("music")
						music.composers[composer.id] = composer

				// default part
					const part = CORE.getSchema("part")
						part.order = 1
						part.name = "part " + part.order
						part.instrument = CONSTANTS.defaultInstrument
						part.midiChannel = CONSTANTS.defaultMidiChannel
						part.midiProgram = CONSTANTS.defaultMidiProgram
						part.synth = CONSTANTS.defaultSynth
					music.parts[part.id] = part

				// default measures
					for (let m = 1; m <= CONSTANTS.defaultMeasureCount; m++) {
						music.measureTicks[String(m)] = CONSTANTS.defaultTicks
						
						const measure = CORE.getSchema("measure")
							measure.ticks = CONSTANTS.defaultTicks

							if (m == 1) {
								music.tempoChanges[String(m)] = CONSTANTS.defaultTempo
								measure.dynamics = CONSTANTS.defaultDynamics
							}

						part.staves["1"][String(m)] = measure
					}

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "insert"
						query.document = music

				// insert
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							callback(results)
							return
						}

						// update session
							REQUEST.updateSession = {
								composerId: composer.id,
								musicId: music.id
							}
							SESSION.updateOne(REQUEST, null, function() {
								// redirect
									callback({success: true, message: "music created", location: "../music/" + music.id})
							})
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({success: false, message: "unable to " + arguments.callee.name})
			}
		}

	/* uploadOne */
		module.exports.uploadOne = uploadOne
		function uploadOne(REQUEST, callback) {
			try {
				// name
					if (!REQUEST.post.name || CONSTANTS.minimumComposerNameLength > REQUEST.post.name.length || REQUEST.post.name.length > CONSTANTS.maximumComposerNameLength) {
						callback({success: false, message: "name must be between " + CONSTANTS.minimumComposerNameLength + " and " + CONSTANTS.maximumComposerNameLength + " characters"})
						return
					}

				// no data
					if (!REQUEST.post.musicJSON || typeof REQUEST.post.musicJSON !== "object" || !Object.keys(REQUEST.post.musicJSON).length) {
						callback({success: false, message: "missing musicXML data"})
						return
					}

				// create
					const composer = CORE.getSchema("composer")
						composer.sessionId = REQUEST.session.id
						composer.name = REQUEST.post.name.trim()

					const music = CORE.getSchema("music")
						music.composers[composer.id] = composer

				// from musicXML / musicJSON
					music.title        = (REQUEST.post.musicJSON.title || "untitled").slice(0, CONSTANTS.maximumMusicTitleLength)
					music.composer     = (REQUEST.post.musicJSON.composer || "").slice(0, CONSTANTS.maximumMusicComposerLength)
					music.measureTicks = REQUEST.post.musicJSON.measureTicks || {}
					music.swing        = REQUEST.post.musicJSON.swing || false
					music.tempoChanges = REQUEST.post.musicJSON.tempoChanges || {}
					music.parts        = {}

				// verify part
					const midiToInstrument = CORE.getAsset("midiToInstrument")
					const midiInstrumentValues = Object.values(midiToInstrument)
					const midiInstrumentKeys = Object.keys(midiToInstrument)

					for (let i in REQUEST.post.musicJSON.parts) {
						const partJSON = REQUEST.post.musicJSON.parts[i]
						const part = CORE.getSchema("part")

							// info
								part.name = partJSON.name
								part.order = partJSON.order
								part.instrument = midiInstrumentValues.includes(partJSON.instrument) ? partJSON.instrument : CONSTANTS.defaultInstrument
								part.midiChannel = Math.min(CONSTANTS.maximumMidiChannel, Math.max(CONSTANTS.minimumMidiChannel, partJSON.midiChannel))
								part.midiProgram = Number(Math.min(Number(midiInstrumentKeys[midiInstrumentKeys.length - 1]), Math.max(Number(midiInstrumentKeys[0]), partJSON.midiProgram)))
								part.synth = partJSON.synth || CONSTANTS.defaultSynth
								part.staves = partJSON.staves || {"1": {}}

							// measures
								for (let s in part.staves) {
									for (let m in music.measureTicks) {
										if (!part.staves[s][m]) {
											part.staves[s][m] = CORE.getSchema("measure")
										}
										else if (!part.staves[s][m].notes) {
											part.staves[s][m].notes = {}
										}

										if (part.staves[s][m].ticks !== music.measureTicks[m]) {
											part.staves[s][m].ticks = music.measureTicks[m]
										}
										
									}
								}

						music.parts[part.id] = part
					}

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "insert"
						query.document = music

				// insert
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							callback(results)
							return
						}

						// update session
							REQUEST.updateSession = {
								composerId: composer.id,
								musicId: music.id
							}
							SESSION.updateOne(REQUEST, null, function() {
								// redirect
									callback({success: true, message: "music uploaded", location: "../music/" + music.id})
							})
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({success: false, message: "unable to " + arguments.callee.name})
			}
		}

	/* joinOne */
		module.exports.joinOne = joinOne
		function joinOne(REQUEST, callback) {
			try {
				// name
					if (!REQUEST.post.name || CONSTANTS.minimumComposerNameLength > REQUEST.post.name.length || REQUEST.post.name.length > CONSTANTS.maximumComposerNameLength) {
						callback({success: false, message: "name must be between " + CONSTANTS.minimumComposerNameLength + " and " + CONSTANTS.maximumComposerNameLength + " characters"})
						return
					}

				// music id
					if (!REQUEST.post.musicId || REQUEST.post.musicId.length !== CONSTANTS.musicIdLength || !CORE.isNumLet(REQUEST.post.musicId)) {
						callback({success: false, message: "musicId must be " + CONSTANTS.musicIdLength + " letters and numbers"})
						return
					}

				// query
					REQUEST.post.musicId = REQUEST.post.musicId.toLowerCase()
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "find"
						query.filters = {id: REQUEST.post.musicId}

				// find
					CORE.accessDatabase(query, function(results) {
						// not found
							if (!results.success) {
								callback({success: false, message: "no music found"})
								return
							}

						// already a composer
							const music = results.documents[0]
							const composerKeys = Object.keys(music.composers)
							if (composerKeys.find(function(p) { return music.composers[p].sessionId == REQUEST.session.id })) {
								callback({success: true, message: "joining music", location: "../music/" + music.id})
								return
							}

						// create composer
							const composer = CORE.getSchema("composer")
								composer.sessionId = REQUEST.session.id
								composer.name = REQUEST.post.name.trim()

						// query
							const query = CORE.getSchema("query")
								query.collection = "music"
								query.command = "update"
								query.filters = {id: music.id}
								query.document = {
									updated: new Date().getTime()
								}
								query.document["composers." + composer.id] = composer

						// update
							CORE.accessDatabase(query, function(results) {
								if (!results.success) {
									callback(results)
									return
								}

								// update session
									REQUEST.updateSession = {
										composerId: composer.id,
										musicId: music.id
									}
									SESSION.updateOne(REQUEST, null, function() {
										// redirect
											callback({success: true, message: "music joined", location: "../music/" + music.id})
									})
							})
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({success: false, message: "unable to " + arguments.callee.name})
			}
		}

/*** reads ***/
	/* readOne */
		module.exports.readOne = readOne
		function readOne(REQUEST, callback) {
			try {
				// music id
					const musicId = REQUEST.path[REQUEST.path.length - 1]

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "find"
						query.filters = {id: musicId}

				// find
					CORE.accessDatabase(query, function(results) {
						// not found
							if (!results.success) {
								callback({musicId: musicId, success: false, message: "no music found", location: "../../../../", recipients: [REQUEST.session.id]})
								return
							}

						// get composer
							const music = results.documents[0]
							const composerId = Object.keys(music.composers).find(function(c) {
								return music.composers[c].sessionId == REQUEST.session.id
							}) || null
							const composer = composerId ? music.composers[composerId] : CORE.getSchema("composer")

						// update composer
							composer.sessionId = REQUEST.session.id
							composer.connected = true
							const name = composer.name

						// query
							const query = CORE.getSchema("query")
								query.collection = "music"
								query.command = "update"
								query.filters = {id: music.id}
								query.document = {
									updated: new Date().getTime()
								}
								query.document["composers." + composer.id] = composer

						// update music
							CORE.accessDatabase(query, function(results) {
								if (!results.success) {
									results.musicId = REQUEST.path[REQUEST.path.length - 1]
									results.recipients = [REQUEST.session.id]
									callback(results)
									return
								}

								// updated music
									const music = results.documents[0]
									for (let i in music.composers) {
										callback({musicId: music.id, success: true, message: name + " joined", composerId: i, music: music, recipients: [music.composers[i].sessionId]})
									}
							})
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({success: false, message: "unable to " + arguments.callee.name})
			}
		}

/*** updates ***/
	/* updateOne */
		module.exports.updateOne = updateOne
		function updateOne(REQUEST, callback) {
			try {
				// music id
					const musicId = REQUEST.path[REQUEST.path.length - 1]
					if (!musicId || musicId.length !== CONSTANTS.musicIdLength) {
						callback({musicId: musicId, success: false, message: "invalid music id", recipients: [REQUEST.session.id]})
						return
					}

				// action
					if (!REQUEST.post || !REQUEST.post.action || !Object.keys(module.exports.actions).includes(REQUEST.post.action)) {
						callback({musicId: musicId, success: false, message: "invalid action", recipients: [REQUEST.session.id]})
						return
					}

				// composer id
					if (REQUEST.post.action !== "disconnectComposer" && (!REQUEST.post || !REQUEST.post.composerId)) {
						callback({musicId: musicId, success: false, message: "invalid composer id", recipients: [REQUEST.session.id]})
						return
					}

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "find"
						query.filters = {id: musicId}

				// find
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							callback({musicId: musicId, success: false, message: "no music found", recipients: [REQUEST.session.id]})
							return
						}

						// not a composer?
							const music = results.documents[0]
							const composer = music.composers[REQUEST.post.composerId] || music.composers[Object.keys(music.composers).find(function(c) { return music.composers[c].sessionId == REQUEST.session.id })] || null
							if (!composer) {
								callback({musicId: musicId, success: false, message: "not a composer", recipients: [REQUEST.session.id]})
								return
							}

						// action
							module.exports.actions[REQUEST.post.action](REQUEST, music, composer, callback)
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({success: false, message: "unable to " + arguments.callee.name})
			}
		}

/*** deletes ***/
	/* deleteOne */
		module.exports.deleteOne = deleteOne
		function deleteOne(REQUEST, callback) {
			try {
				// music id
					const musicId = REQUEST.path[REQUEST.path.length - 1]
					if (!musicId || musicId.length !== CONSTANTS.musicIdLength) {
						return
					}

				// get session ids
					const sessionIds = []
					for (let i in music.composers) {
						sessionIds.push(music.composers[i].sessionId)
					}

				// update sessions
					for (let i in sessionIds) {
						// that id
							const thatSessionId = sessionIds[i]

						// make a pseudoRequest session for clearing it out
							const pseudoRequest = {
								session: {
									id: thatSessionId
								},
								cookie: {},
								updateSession: {
									composerId: null,
									musicId: null
								}
							}

						// update and callback (redirect)
							SESSION.updateOne(pseudoRequest, null, function() {
								callback({success: true, musicId: music.id, message: "the music has been deleted", recipients: [thatSessionId], location: "../../../../"})
							})
					}

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "delete"
						query.filters = {id: musicId}

				// find
					CORE.accessDatabase(query, callback)
			}
			catch (error) {
				CORE.logError(error)
			}
		}

/*** actions ***/
	/* disconnectComposer */
		module.exports.actions.disconnectComposer = disconnectComposer
		function disconnectComposer(REQUEST, music, composer, callback) {
			try {
				// update this composer
					composer.connected = false
					const name = composer.name

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "update"
						query.filters = {id: music.id}
						query.document = {
							updated: new Date().getTime()
						}
						query.document["composers." + composer.id] = composer

				// parts?
					const updatedParts = {}
					for (let p in music.parts) {
						if (music.parts[p].editorId == composer.id) {
							updatedParts[p] = {editorId: null}
							query.document["parts." + p + ".editorId"] = null
						}
					}

				// update
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							results.musicId = REQUEST.path[REQUEST.path.length - 1]
							results.recipients = [REQUEST.session.id]
							callback(results)
							return
						}

						// updated music
							const music = results.documents[0]
							const updatedData = {}
								updatedData.composers = {}
								updatedData.composers[composer.id] = composer
								if (Object.keys(updatedParts).length) {
									updatedData.parts = updatedParts
								}

						// inform other composers
							for (let i in music.composers) {
								callback({musicId: music.id, success: true, message: name + " disconnected", music: updatedData, recipients: [music.composers[i].sessionId]})
							}
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({musicId: REQUEST.path[REQUEST.path.length - 1], success: false, message: "unable to " + arguments.callee.name, recipients: [REQUEST.session.id]})
			}
		}

	/* uploadSynth */
		module.exports.actions.uploadSynth = uploadSynth
		function uploadSynth(REQUEST, music, composer, callback) {
			try {
				// no synth
					if (!REQUEST.post.synth || typeof REQUEST.post.synth !== "object") {
						callback({musicId: musicId, success: false, message: "missing synth JSON", recipients: [REQUEST.session.id]})
						return
					}

				// new synth
					const synth = CORE.getSchema("synth")
						synth.id = REQUEST.post.synth.id || synth.id
						synth.name = (REQUEST.post.synth.name || synth.name).replace(/^[a-zA-Z0-9\s]/g, "")
						synth.polysynth = REQUEST.post.synth.polysynth || synth.polysynth
						synth.noise = REQUEST.post.synth.noise || synth.noise
						synth.imag = REQUEST.post.synth.imag || synth.imag
						synth.real = REQUEST.post.synth.real || synth.real
						synth.envelope = REQUEST.post.synth.envelope || synth.envelope
						synth.bitcrusher = REQUEST.post.synth.bitcrusher || synth.bitcrusher
						synth.filters = REQUEST.post.synth.filters || synth.filters
						synth.echo = REQUEST.post.synth.echo || synth.echo

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "update"
						query.filters = {id: music.id}
						query.document = {
							updated: new Date().getTime()
						}
						query.document["synths." + synth.name] = synth

				// update
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							results.musicId = REQUEST.path[REQUEST.path.length - 1]
							results.recipients = [REQUEST.session.id]
							callback(results)
							return
						}

						// updated music
							const music = results.documents[0]
							const updatedData = {}
								updatedData.synths = {}
								updatedData.synths[synth.id] = synth

						// inform other composers
							for (let i in music.composers) {
								callback({musicId: music.id, success: true, music: updatedData, recipients: [music.composers[i].sessionId]})
							}
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({musicId: REQUEST.path[REQUEST.path.length - 1], success: false, message: "unable to " + arguments.callee.name, recipients: [REQUEST.session.id]})
			}
		}

	/* updateName */
		module.exports.actions.updateName = updateName
		function updateName(REQUEST, music, composer, callback) {
			try {
				// previous data
					const previousData = {composers: {}}
						previousData.composers[composer.id] = composer

				// get name
					const name = String(REQUEST.post.name).trim()

				// no name
					if (!name || !name.length) {
						callback({musicId: musicId, success: false, message: "missing name", music: previousData, recipients: [REQUEST.session.id]})
						return
					}

				// invalid length
					if (CONSTANTS.minimumComposerNameLength > name.length || name.length > CONSTANTS.maximumComposerNameLength) {
						callback({musicId: musicId, success: false, message: "name must be " + CONSTANTS.minimumComposerNameLength + " - " + CONSTANTS.maximumComposerNameLength + " characters", music: previousData, recipients: [REQUEST.session.id]})
						return
					}

				// update this composer
					const previousName = composer.name
					composer.name = name

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "update"
						query.filters = {id: music.id}
						query.document = {
							updated: new Date().getTime()
						}
						query.document["composers." + composer.id] = composer

				// update
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							results.musicId = REQUEST.path[REQUEST.path.length - 1]
							results.recipients = [REQUEST.session.id]
							callback(results)
							return
						}

						// updated music
							const music = results.documents[0]
							const updatedData = {}
								updatedData.composers = {}
								updatedData.composers[composer.id] = composer

						// inform other composers
							for (let i in music.composers) {
								callback({musicId: music.id, success: true, message: previousName + " is now " + name, music: updatedData, recipients: [music.composers[i].sessionId]})
							}
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({musicId: REQUEST.path[REQUEST.path.length - 1], success: false, message: "unable to " + arguments.callee.name, recipients: [REQUEST.session.id]})
			}
		}

	/* updateTitle */
		module.exports.actions.updateTitle = updateTitle
		function updateTitle(REQUEST, music, composer, callback) {
			try {
				// previous data
					const previousData = {title: music.title}

				// get title
					const title = String(REQUEST.post.title).trim()

				// no title
					if (!title || !title.length) {
						callback({musicId: musicId, success: false, message: "missing title", music: previousData, recipients: [REQUEST.session.id]})
						return
					}

				// invalid length
					if (CONSTANTS.minimumMusicTitleLength > title.length || title.length > CONSTANTS.maximumMusicTitleLength) {
						callback({musicId: musicId, success: false, message: "title must be " + CONSTANTS.minimumMusicTitleLength + " - " + CONSTANTS.maximumMusicTitleLength + " characters", music: previousData, recipients: [REQUEST.session.id]})
						return
					}

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "update"
						query.filters = {id: music.id}
						query.document = {
							updated: new Date().getTime()
						}
						query.document["title"] = title

				// update
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							results.musicId = REQUEST.path[REQUEST.path.length - 1]
							results.recipients = [REQUEST.session.id]
							callback(results)
							return
						}

						// updated music
							const music = results.documents[0]
							const updatedData = {}
								updatedData.title = title

						// inform other composers
							for (let i in music.composers) {
								callback({musicId: music.id, success: true, music: updatedData, recipients: [music.composers[i].sessionId]})
							}
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({musicId: REQUEST.path[REQUEST.path.length - 1], success: false, message: "unable to " + arguments.callee.name, recipients: [REQUEST.session.id]})
			}
		}

	/* updateComposer */
		module.exports.actions.updateComposer = updateComposer
		function updateComposer(REQUEST, music, composer, callback) {
			try {
				// previous data
					const previousData = {composer: music.composer}

				// get composer
					const composer = String(REQUEST.post.composer).trim()

				// invalid length
					if (CONSTANTS.minimumMusicComposerLength > composer.length || composer.length > CONSTANTS.maximumMusicComposerLength) {
						callback({musicId: musicId, success: false, message: "composer must be " + CONSTANTS.minimumMusicComposerLength + " - " + CONSTANTS.maximumMusicComposerLength + " characters", music: previousData, recipients: [REQUEST.session.id]})
						return
					}

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "update"
						query.filters = {id: music.id}
						query.document = {
							updated: new Date().getTime()
						}
						query.document["composer"] = composer

				// update
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							results.musicId = REQUEST.path[REQUEST.path.length - 1]
							results.recipients = [REQUEST.session.id]
							callback(results)
							return
						}

						// updated music
							const music = results.documents[0]
							const updatedData = {}
								updatedData.composer = composer

						// inform other composers
							for (let i in music.composers) {
								callback({musicId: music.id, success: true, music: updatedData, recipients: [music.composers[i].sessionId]})
							}
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({musicId: REQUEST.path[REQUEST.path.length - 1], success: false, message: "unable to " + arguments.callee.name, recipients: [REQUEST.session.id]})
			}
		}

	/* updateSwing */
		module.exports.actions.updateSwing = updateSwing
		function updateSwing(REQUEST, music, composer, callback) {
			try {
				// get swing
					const swing = Boolean(REQUEST.post.swing)

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "update"
						query.filters = {id: music.id}
						query.document = {
							updated: new Date().getTime()
						}
						query.document["swing"] = swing

				// update
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							results.musicId = REQUEST.path[REQUEST.path.length - 1]
							results.recipients = [REQUEST.session.id]
							callback(results)
							return
						}

						// updated music
							const music = results.documents[0]
							const updatedData = {}
								updatedData.swing = swing

						// inform other composers
							for (let i in music.composers) {
								callback({musicId: music.id, success: true, music: updatedData, recipients: [music.composers[i].sessionId]})
							}
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({musicId: REQUEST.path[REQUEST.path.length - 1], success: false, message: "unable to " + arguments.callee.name, recipients: [REQUEST.session.id]})
			}
		}

	/* insertMeasure */
		module.exports.actions.insertMeasure = insertMeasure
		function insertMeasure(REQUEST, music, composer, callback) {
			try {
				// get measure number
					const lastMeasureNumber = Object.keys(music.measureTicks).length
					const measureNumber = Number(REQUEST.post.measure) || 0
					if (!measureNumber || measureNumber < 0) {
						callback({musicId: musicId, success: false, message: "cannot insert a measure before measure " + measureNumber, recipients: [REQUEST.session.id]})
						return
					}

				// get counts
					const newMeasureTicks = (!lastMeasureNumber ? CONSTANTS.defaultTicks : 
											(measureNumber == 1) ? music.measureTicks["1"] : 
											music.measureTicks[String(measureNumber - 1)]) || CONSTANTS.defaultTicks

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "update"
						query.filters = {id: music.id}
						query.document = {
							updated: new Date().getTime()
						}

				// renumber all higher measures in measureTicks
					const updatedMeasureTicks = {}
					for (let m = lastMeasureNumber; m >= measureNumber; m--) {
						updatedMeasureTicks[String(m + 1)] = music.measureTicks[String(m)]
						query.document["measureTicks." + String(m + 1)] = music.measureTicks[String(m)]
					}
					updatedMeasureTicks[String(measureNumber)] = newMeasureTicks
					query.document["measureTicks." + String(measureNumber)] = newMeasureTicks

				// renumber all higher measures in tempoChanges
					const updatedTempoChanges = {}
					for (let m = lastMeasureNumber; m >= measureNumber; m--) {
						if (music.tempoChanges[String(m)]) {
							updatedTempoChanges[String(m + 1)] = music.tempoChanges[String(m)]
							query.document["tempoChanges." + String(m + 1)] = music.tempoChanges[String(m)]
							updatedTempoChanges[String(m)] = null
							query.document["tempoChanges." + String(m)] = null
						}
					}
					if (measureNumber == 1) {
						if (!lastMeasureNumber) {
							updatedTempoChanges["1"] = CONSTANTS.defaultTempo
							query.document["tempoChanges.1"] = CONSTANTS.defaultTempo
						}
						else {
							updatedTempoChanges["1"] = music.tempoChanges["2"] || CONSTANTS.defaultTempo
							query.document["tempoChanges.1"] = updatedTempoChanges["1"]
							updatedTempoChanges["2"] = null
							query.document["tempoChanges.2"] = null
						}
					}

				// renumber all higher measures in all parts
					const updatedParts = {}
					for (let p in music.parts) {
						updatedParts[p] = {staves: {}}
						for (let s in music.parts[p].staves) {
							updatedParts[p].staves[s] = {}
							const staff = music.parts[p].staves[s]
							for (let m = lastMeasureNumber; m >= measureNumber; m--) {
								updatedParts[p].staves[s][String(m + 1)] = CORE.duplicateObject(music.parts[p].staves[s][String(m)] || CORE.getSchema("measure"))
								query.document["parts." + p + ".staves." + s + "." + String(m + 1)] = CORE.duplicateObject(updatedParts[p].staves[s][String(m + 1)])
								if (!updatedParts[p].staves[s][String(m + 1)].dynamics) {
									updatedParts[p].staves[s][String(m + 1)].dynamics = null
								}
							}

							const newMeasure = CORE.getSchema("measure")
								newMeasure.ticks = newMeasureTicks
								if (measureNumber == 1) {
									if (!lastMeasureNumber) {
										newMeasure.dynamics = CONSTANTS.defaultDynamics
									}
									else {
										newMeasure.dynamics = updatedParts[p].staves[s]["2"].dynamics || CONSTANTS.defaultDynamics
										updatedParts[p].staves[s]["2"].dynamics = null
										delete query.document["parts." + p + ".staves." + s + ".2"].dynamics
									}
								}
							
							query.document["parts." + p + ".staves." + s + "." + String(measureNumber)] = CORE.duplicateObject(newMeasure)
							if (measureNumber > 1) {
								newMeasure.dynamics = null
							}
							updatedParts[p].staves[s][String(measureNumber)] = newMeasure
						}
					}

				// update
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							results.musicId = REQUEST.path[REQUEST.path.length - 1]
							results.recipients = [REQUEST.session.id]
							callback(results)
							return
						}

						// updated music
							const music = results.documents[0]
							const updatedData = {}
								updatedData.measureTicks = updatedMeasureTicks
								updatedData.tempoChanges = updatedTempoChanges
								updatedData.parts = updatedParts

						// inform other composers
							for (let i in music.composers) {
								callback({musicId: music.id, success: true, message: "inserted measure " + measureNumber, music: updatedData, recipients: [music.composers[i].sessionId]})
							}
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({musicId: REQUEST.path[REQUEST.path.length - 1], success: false, message: "unable to " + arguments.callee.name, recipients: [REQUEST.session.id]})
			}
		}

	/* deleteMeasure */
		module.exports.actions.deleteMeasure = deleteMeasure
		function deleteMeasure(REQUEST, music, composer, callback) {
			try {
				// get measure number
					const measureNumber = Number(REQUEST.post.measure) || 0
					const lastMeasureNumber = Object.keys(music.measureTicks).length
					if (!measureNumber || measureNumber < 0 || measureNumber > Object.keys(music.measureTicks).length) {
						callback({musicId: musicId, success: false, message: "cannot delete measure " + measureNumber, recipients: [REQUEST.session.id]})
						return
					}

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "update"
						query.filters = {id: music.id}
						query.document = {
							updated: new Date().getTime()
						}

				// renumber all higher measures in measureTicks
					const updatedMeasureTicks = {}
					for (let m = measureNumber; m < lastMeasureNumber; m++) {
						updatedMeasureTicks[String(m)] = music.measureTicks[String(m + 1)]
						query.document["measureTicks." + String(m)] = music.measureTicks[String(m + 1)]
					}
					updatedMeasureTicks[String(lastMeasureNumber)] = null
					query.document["measureTicks." + String(lastMeasureNumber)] = null

				// renumber all higher measures in tempoChanges
					const updatedTempoChanges = {}
					if (measureNumber !== 1) {
						updatedTempoChanges[String(measureNumber)] = null
						query.document["tempoChanges." + String(measureNumber)] = null
					}
					for (let m = measureNumber; m < lastMeasureNumber; m++) {
						if (music.tempoChanges[String(m + 1)]) {
							updatedTempoChanges[String(m)] = music.tempoChanges[String(m + 1)]
							query.document["tempoChanges." + String(m)] = music.tempoChanges[String(m + 1)]
							updatedTempoChanges[String(m + 1)] = null
							query.document["tempoChanges." + String(m + 1)] = null
						}
					}

				// renumber all higher measures in all parts
					const updatedParts = {}
					for (let p in music.parts) {
						updatedParts[p] = {staves: {}}
						for (let s in music.parts[p].staves) {
							updatedParts[p].staves[s] = {}
							const staff = music.parts[p].staves[s]
							for (let m = measureNumber; m < lastMeasureNumber; m++) {
								updatedParts[p].staves[s][String(m)] = CORE.duplicateObject(staff[String(m + 1)] || CORE.getSchema("measure"))
								if (updatedParts[p].staves[s][String(m)].dynamics === undefined) {
									updatedParts[p].staves[s][String(m)].dynamics = null
								}
								query.document["parts." + p + ".staves." + s + "." + String(m)] = CORE.duplicateObject(staff[String(m + 1)] || CORE.getSchema("measure"))
							}
							updatedParts[p].staves[s][String(lastMeasureNumber)] = null
							query.document["parts." + p + ".staves." + s + "." + String(lastMeasureNumber)] = null

							if (measureNumber == 1 && lastMeasureNumber >= 2 && updatedParts[p].staves[s]["1"].dynamics === null) {
								updatedParts[p].staves[s]["1"].dynamics = music.parts[p].staves[s]["1"].dynamics
								query.document["parts." + p + ".staves." + s + ".1"].dynamics = music.parts[p].staves[s]["1"].dynamics
							}
						}
					}

				// update
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							results.musicId = REQUEST.path[REQUEST.path.length - 1]
							results.recipients = [REQUEST.session.id]
							callback(results)
							return
						}

						// updated music
							const music = results.documents[0]
							const updatedData = {}
								updatedData.measureTicks = updatedMeasureTicks
								updatedData.tempoChanges = updatedTempoChanges
								updatedData.parts = updatedParts

						// inform other composers
							for (let i in music.composers) {
								callback({musicId: music.id, success: true, message: "deleted measure " + measureNumber, music: updatedData, recipients: [music.composers[i].sessionId]})
							}
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({musicId: REQUEST.path[REQUEST.path.length - 1], success: false, message: "unable to " + arguments.callee.name, recipients: [REQUEST.session.id]})
			}
		}

	/* updateTicks */
		module.exports.actions.updateTicks = updateTicks
		function updateTicks(REQUEST, music, composer, callback) {
			try {
				// get measure number
					const measureNumber = Number(REQUEST.post.measure) || 0
					const lastMeasureNumber = Object.keys(music.measureTicks).length
					if (!measureNumber || measureNumber < 0 || measureNumber > lastMeasureNumber) {
						callback({musicId: musicId, success: false, message: "cannot change beats for measure " + measureNumber, recipients: [REQUEST.session.id]})
						return
					}

				// previous data
					const previousData = {measureTicks: {}}
						previousData.measureTicks[String(measureNumber)] = music.measureTicks[String(measureNumber)]

				// get counts
					const newTicks = Math.floor(REQUEST.post.ticks || 0)
					if (!newTicks || newTicks < 0) {
						callback({musicId: musicId, success: false, message: "invalid # beats for measure " + measureNumber, music: previousData, recipients: [REQUEST.session.id]})
						return
					}

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "update"
						query.filters = {id: music.id}
						query.document = {
							updated: new Date().getTime()
						}

				// change beats for this measure in measureTicks
					const updatedMeasureTicks = {}
					updatedMeasureTicks[String(measureNumber)] = newTicks
					query.document["measureTicks." + String(measureNumber)] = newTicks

				// change beats for this measure in all parts
					const updatedParts = {}
					for (let p in music.parts) {
						updatedParts[p] = {staves: {}}
						for (let s in music.parts[p].staves) {
							updatedParts[p].staves[s] = {}
							const measure = music.parts[p].staves[s][String(measureNumber)]
							updatedParts[p].staves[s][String(measureNumber)] = {notes: {}, ticks: newTicks}
							query.document["parts." + p + ".staves." + s + "." + String(measureNumber) + ".ticks"] = newTicks

							for (let n in measure.notes) {
								if (Number(n) >= measure.ticks) {
									updatedParts[p].staves[s][String(measureNumber)].notes[n] = null
									query.document["parts." + p + ".staves." + s + "." + String(measureNumber) + ".notes." + n] = null
								}
							}
						}
					}

				// update
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							results.musicId = REQUEST.path[REQUEST.path.length - 1]
							results.recipients = [REQUEST.session.id]
							callback(results)
							return
						}

						// updated music
							const music = results.documents[0]
							const updatedData = {}
								updatedData.measureTicks = updatedMeasureTicks
								updatedData.parts = updatedParts

						// inform other composers
							for (let i in music.composers) {
								callback({musicId: music.id, success: true, music: updatedData, recipients: [music.composers[i].sessionId]})
							}
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({musicId: REQUEST.path[REQUEST.path.length - 1], success: false, message: "unable to " + arguments.callee.name, recipients: [REQUEST.session.id]})
			}
		}

	/* updateTempo */
		module.exports.actions.updateTempo = updateTempo
		function updateTempo(REQUEST, music, composer, callback) {
			try {
				// get measure number
					const measureNumber = Number(REQUEST.post.measure) || 0
					const lastMeasureNumber = Object.keys(music.measureTicks).length
					if (!measureNumber || measureNumber < 0 || measureNumber > lastMeasureNumber) {
						callback({musicId: musicId, success: false, message: "cannot change tempo for measure " + measureNumber, recipients: [REQUEST.session.id]})
						return
					}

				// previous data
					const previousData = {tempoChanges: {}}
						previousData.tempoChanges[String(measureNumber)] = music.tempoChanges[String(measureNumber)]

				// get tempo
					const newTempo = Math.floor(REQUEST.post.tempo || 0)
					if (newTempo < 0) {
						callback({musicId: musicId, success: false, message: "cannot change to a negative tempo for measure " + measureNumber, music: previousData, recipients: [REQUEST.session.id]})
						return
					}

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "update"
						query.filters = {id: music.id}
						query.document = {
							updated: new Date().getTime()
						}

				// change tempo for this measure in tempoChanges
					const updatedTempoChanges = {}
					if (newTempo) {
						updatedTempoChanges[String(measureNumber)] = newTempo
						query.document["tempoChanges." + String(measureNumber)] = newTempo
					}
					else {
						if (measureNumber == 1) {
							const previousData = {tempoChanges: {"1": music.tempoChanges["1"]}}
							callback({musicId: musicId, success: false, message: "cannot remove tempo from first measure", music: previousData, recipients: [REQUEST.session.id]})
							return
						}
						updatedTempoChanges[String(measureNumber)] = null
						query.document["tempoChanges." + String(measureNumber)] = null
					}

				// update
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							results.musicId = REQUEST.path[REQUEST.path.length - 1]
							results.recipients = [REQUEST.session.id]
							callback(results)
							return
						}

						// updated music
							const music = results.documents[0]
							const updatedData = {}
								updatedData.tempoChanges = updatedTempoChanges

						// inform other composers
							for (let i in music.composers) {
								callback({musicId: music.id, success: true, music: updatedData, recipients: [music.composers[i].sessionId]})
							}
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({musicId: REQUEST.path[REQUEST.path.length - 1], success: false, message: "unable to " + arguments.callee.name, recipients: [REQUEST.session.id]})
			}
		}

	/* updatePartEditor */
		module.exports.actions.updatePartEditor = updatePartEditor
		function updatePartEditor(REQUEST, music, composer, callback) {
			try {
				// get part
					const partId = String(REQUEST.post.partId) || null
					if (!partId || !partId.length || !music.parts[partId]) {
						callback({musicId: musicId, success: false, message: "could not find part " + partId, recipients: [REQUEST.session.id]})
						return
					}
					const part = music.parts[REQUEST.post.partId]

				// previous data
					const previousData = {parts: {}}
						previousData.parts[partId] = {editor: part.editorId}

				// already being edited by someone else
					if (part.editorId && part.editorId !== REQUEST.post.composerId) {
						callback({musicId: musicId, success: false, message: "part " + partId + " is being edited by someone else", music: previousData, recipients: [REQUEST.session.id]})
						return
					}

				// illegal move
					const editorId = REQUEST.post.editorId
					if (editorId && !(editorId in music.composers)) {
						callback({musicId: musicId, success: false, message: "cannot make someone else edit part " + partId, music: previousData, recipients: [REQUEST.session.id]})
						return
					}

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "update"
						query.filters = {id: music.id}
						query.document = {
							updated: new Date().getTime()
						}
						query.document["parts." + partId + ".editorId"] = editorId

				// editing others?
					const updatedOtherParts = {}
					for (let p in music.parts) {
						if (music.parts[p].editorId == composer.id) {
							updatedOtherParts[p] = {editorId: null}
							query.document["parts." + p + ".editorId"] = null
						}
					}

				// update
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							results.musicId = REQUEST.path[REQUEST.path.length - 1]
							results.recipients = [REQUEST.session.id]
							callback(results)
							return
						}

						// updated music
							const music = results.documents[0]
							const updatedData = {}
								updatedData.parts = {}
								updatedData.parts[partId] = {editorId: editorId}
								for (let i in updatedOtherParts) {
									updatedData.parts[i] = updatedOtherParts[i]
								}

						// inform other composers
							for (let i in music.composers) {
								callback({musicId: music.id, success: true, music: updatedData, recipients: [music.composers[i].sessionId]})
							}
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({musicId: REQUEST.path[REQUEST.path.length - 1], success: false, message: "unable to " + arguments.callee.name, recipients: [REQUEST.session.id]})
			}
		}

	/* updatePartName */
		module.exports.actions.updatePartName = updatePartName
		function updatePartName(REQUEST, music, composer, callback) {
			try {
				// get part
					const partId = String(REQUEST.post.partId) || null
					if (!partId || !partId.length || !music.parts[partId]) {
						callback({musicId: musicId, success: false, message: "could not find part " + partId, recipients: [REQUEST.session.id]})
						return
					}
					const part = music.parts[REQUEST.post.partId]

				// previous data
					const previousData = {parts: {}}
						previousData.parts[partId] = {name: part.name}

				// already being edited by someone else
					if (!part.editorId || part.editorId !== REQUEST.post.composerId) {
						callback({musicId: musicId, success: false, message: "part " + partId + " is being edited by someone else", music: previousData, recipients: [REQUEST.session.id]})
						return
					}

				// get name
					const name = String(REQUEST.post.name) || null
					if (!name || CONSTANTS.minimumPartNameLength > name.length || name.length > CONSTANTS.maximumPartNameLength) {
						callback({musicId: musicId, success: false, message: "part name must be " + CONSTANTS.minimumPartNameLength + " to " + CONSTANTS.maximumPartNameLength + " characters", music: previousData, recipients: [REQUEST.session.id]})
						return
					}

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "update"
						query.filters = {id: music.id}
						query.document = {
							updated: new Date().getTime()
						}
						query.document["parts." + partId + ".name"] = name

				// update
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							results.musicId = REQUEST.path[REQUEST.path.length - 1]
							results.recipients = [REQUEST.session.id]
							callback(results)
							return
						}

						// updated music
							const music = results.documents[0]
							const updatedData = {}
								updatedData.parts = {}
								updatedData.parts[partId] = {name: name}

						// inform other composers
							for (let i in music.composers) {
								callback({musicId: music.id, success: true, music: updatedData, recipients: [music.composers[i].sessionId]})
							}
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({musicId: REQUEST.path[REQUEST.path.length - 1], success: false, message: "unable to " + arguments.callee.name, recipients: [REQUEST.session.id]})
			}
		}

	/* updatePartInstrument */
		module.exports.actions.updatePartInstrument = updatePartInstrument
		function updatePartInstrument(REQUEST, music, composer, callback) {
			try {
				// get part
					const partId = String(REQUEST.post.partId) || null
					if (!partId || !partId.length || !music.parts[partId]) {
						callback({musicId: musicId, success: false, message: "could not find part " + partId, recipients: [REQUEST.session.id]})
						return
					}
					const part = music.parts[REQUEST.post.partId]

				// previous data
					const previousData = {parts: {}}
						previousData.parts[partId] = {midiProgram: part.midiProgram, instrument: part.instrument}

				// already being edited by someone else
					if (!part.editorId || part.editorId !== REQUEST.post.composerId) {
						callback({musicId: musicId, success: false, message: "part " + partId + " is being edited by someone else", music: previousData, recipients: [REQUEST.session.id]})
						return
					}

				// get midiChannel
					const midiToInstrument = CORE.getAsset("midiToInstrument")
					const midiProgram = String(REQUEST.post.midiProgram) || null
					if (!(midiProgram in midiToInstrument)) {
						callback({musicId: musicId, success: false, message: "unknown MIDI instrument", music: previousData, recipients: [REQUEST.session.id]})
						return
					}

				// derive instrument
					const instrument = midiToInstrument[midiProgram] || CONSTANTS.defaultInstrument

				// derive synth
					const instrumentToSynth = CORE.getAsset("instrumentToSynth")
					let synth = CONSTANTS.defaultSynth
					for (let i in instrumentToSynth) {
						if (instrument.toLowerCase().includes(i)) {
							synth = instrumentToSynth[i]
							break
						}
					}

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "update"
						query.filters = {id: music.id}
						query.document = {
							updated: new Date().getTime()
						}
						query.document["parts." + partId + ".midiProgram"] = midiProgram
						query.document["parts." + partId + ".instrument"] = instrument
						query.document["parts." + partId + ".synth"] = synth

				// update
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							results.musicId = REQUEST.path[REQUEST.path.length - 1]
							results.recipients = [REQUEST.session.id]
							callback(results)
							return
						}

						// updated music
							const music = results.documents[0]
							const updatedData = {}
								updatedData.parts = {}
								updatedData.parts[partId] = {midiProgram: midiProgram, instrument: instrument, synth: synth}

						// inform other composers
							for (let i in music.composers) {
								callback({musicId: music.id, success: true, music: updatedData, recipients: [music.composers[i].sessionId]})
							}
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({musicId: REQUEST.path[REQUEST.path.length - 1], success: false, message: "unable to " + arguments.callee.name, recipients: [REQUEST.session.id]})
			}
		}

	/* updatePartSynth */
		module.exports.actions.updatePartSynth = updatePartSynth
		function updatePartSynth(REQUEST, music, composer, callback) {
			try {
				// get part
					const partId = String(REQUEST.post.partId) || null
					if (!partId || !partId.length || !music.parts[partId]) {
						callback({musicId: musicId, success: false, message: "could not find part " + partId, recipients: [REQUEST.session.id]})
						return
					}
					const part = music.parts[REQUEST.post.partId]

				// previous data
					const previousData = {parts: {}}
						previousData.parts[partId] = {synth: part.synth}

				// already being edited by someone else
					if (!part.editorId || part.editorId !== REQUEST.post.composerId) {
						callback({musicId: musicId, success: false, message: "part " + partId + " is being edited by someone else", music: previousData, recipients: [REQUEST.session.id]})
						return
					}

				// get synth
					const synth = String(REQUEST.post.synth) || null
					if (!synth) {
						callback({musicId: musicId, success: false, message: "unknown synth", music: previousData, recipients: [REQUEST.session.id]})
						return
					}

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "update"
						query.filters = {id: music.id}
						query.document = {
							updated: new Date().getTime()
						}
						query.document["parts." + partId + ".synth"] = synth

				// update
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							results.musicId = REQUEST.path[REQUEST.path.length - 1]
							results.recipients = [REQUEST.session.id]
							callback(results)
							return
						}

						// updated music
							const music = results.documents[0]
							const updatedData = {}
								updatedData.parts = {}
								updatedData.parts[partId] = {synth: synth}

						// inform other composers
							for (let i in music.composers) {
								callback({musicId: music.id, success: true, music: updatedData, recipients: [music.composers[i].sessionId]})
							}
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({musicId: REQUEST.path[REQUEST.path.length - 1], success: false, message: "unable to " + arguments.callee.name, recipients: [REQUEST.session.id]})
			}
		}

	/* updatePartOrder */
		module.exports.actions.updatePartOrder = updatePartOrder
		function updatePartOrder(REQUEST, music, composer, callback) {
			try {
				// get part
					const partId = String(REQUEST.post.partId) || null
					if (!partId || !partId.length || !music.parts[partId]) {
						callback({musicId: musicId, success: false, message: "could not find part " + partId, recipients: [REQUEST.session.id]})
						return
					}
					const part = music.parts[REQUEST.post.partId]

				// previous data
					const partKeys = Object.keys(music.parts)
					const previousData = {parts: {}}
						previousData.parts[partId] = {order: part.order}

				// validate
					const direction = REQUEST.post.direction || null
					const oldOrder = part.order

					if (!direction || (direction !== "up" && direction !== "down")) {
						callback({musicId: musicId, success: false, message: "unknown direction", music: previousData, recipients: [REQUEST.session.id]})
						return
					}
					if (direction == "up" && oldOrder == 1) {
						callback({musicId: musicId, success: false, message: "unable to move first part up", music: previousData, recipients: [REQUEST.session.id]})
						return
					}
					if (direction == "down" && oldOrder == partKeys.length) {
						callback({musicId: musicId, success: false, message: "unable to move last part down", music: previousData, recipients: [REQUEST.session.id]})
						return
					}

				// get swap
					const newOrder = oldOrder + (direction == "up" ? -1 : direction == "down" ? 1 : 0)
					const otherPartId = partKeys.find(function(p) {
						return music.parts[p].order == newOrder
					}) || null
					if (!newOrder || !otherPartId) {
						callback({musicId: musicId, success: false, message: "could not swap order", music: previousData, recipients: [REQUEST.session.id]})
						return
					}

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "update"
						query.filters = {id: music.id}
						query.document = {
							updated: new Date().getTime()
						}
						query.document["parts." + partId + ".order"] = newOrder
						query.document["parts." + otherPartId + ".order"] = oldOrder

				// update
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							results.musicId = REQUEST.path[REQUEST.path.length - 1]
							results.recipients = [REQUEST.session.id]
							callback(results)
							return
						}

						// updated music
							const music = results.documents[0]
							const updatedData = {}
								updatedData.parts = {}
								updatedData.parts[partId] = {order: newOrder}
								updatedData.parts[otherPartId] = {order: oldOrder}

						// inform other composers
							for (let i in music.composers) {
								callback({musicId: music.id, success: true, music: updatedData, recipients: [music.composers[i].sessionId]})
							}
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({musicId: REQUEST.path[REQUEST.path.length - 1], success: false, message: "unable to " + arguments.callee.name, recipients: [REQUEST.session.id]})
			}
		}

	/* deletePart */
		module.exports.actions.deletePart = deletePart
		function deletePart(REQUEST, music, composer, callback) {
			try {
				// get part
					const partId = String(REQUEST.post.partId) || null
					if (!partId || !partId.length || !music.parts[partId]) {
						callback({musicId: musicId, success: false, message: "could not find part " + partId, recipients: [REQUEST.session.id]})
						return
					}
					const part = music.parts[REQUEST.post.partId]

				// already being edited by someone else
					if (!part.editorId || part.editorId !== REQUEST.post.composerId) {
						callback({musicId: musicId, success: false, message: "part " + partId + " is being edited by someone else", recipients: [REQUEST.session.id]})
						return
					}

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "update"
						query.filters = {id: music.id}
						query.document = {
							updated: new Date().getTime()
						}
						query.document["parts." + partId] = null

				// all subsequent parts
					const updatedParts = {}
						updatedParts[partId] = null
					for (let p in music.parts) {
						if (music.parts[p].order > part.order) {
							updatedParts[p] = {order: music.parts[p].order - 1}
							query.document["parts." + p + ".order"] = music.parts[p].order - 1
						}
					}

				// update
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							results.musicId = REQUEST.path[REQUEST.path.length - 1]
							results.recipients = [REQUEST.session.id]
							callback(results)
							return
						}

						// updated music
							const music = results.documents[0]
							const updatedData = {}
								updatedData.parts = updatedParts

						// inform other composers
							for (let i in music.composers) {
								callback({musicId: music.id, success: true, music: updatedData, recipients: [music.composers[i].sessionId]})
							}
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({musicId: REQUEST.path[REQUEST.path.length - 1], success: false, message: "unable to " + arguments.callee.name, recipients: [REQUEST.session.id]})
			}
		}

	/* addPart */
		module.exports.actions.addPart = addPart
		function addPart(REQUEST, music, composer, callback) {
			try {
				// get existing channels
					const usedChannels = []
					for (let p in music.parts) {
						usedChannels.push(music.parts[p].midiChannel)
					}
					usedChannels.sort()
					let nextAvailableChannel = CONSTANTS.minimumMidiChannel
					while (usedChannels.includes(nextAvailableChannel)) {
						nextAvailableChannel++
					}
					if (nextAvailableChannel > CONSTANTS.maximumMidiChannel) {
						nextAvailableChannel = CONSTANTS.defaultMidiChannel
					}

				// new
					const part = CORE.getSchema("part")
						part.order = Object.keys(music.parts).length + 1
						part.name = "part " + part.order
						part.instrument = CONSTANTS.defaultInstrument
						part.midiChannel = nextAvailableChannel
						part.midiProgram = CONSTANTS.defaultMidiProgram
						part.synth = CONSTANTS.defaultSynth

				// measures
					const measures = part.staves["1"]
					for (let m in music.measureTicks) {
						measures[m] = CORE.getSchema("measure")
						measures[m].ticks = music.measureTicks[m]

						if (m == "1") {
							measures[m].dynamics = CONSTANTS.defaultDynamics
						}
					}

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "update"
						query.filters = {id: music.id}
						query.document = {
							updated: new Date().getTime()
						}
						query.document["parts." + part.id] = part

				// update
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							results.musicId = REQUEST.path[REQUEST.path.length - 1]
							results.recipients = [REQUEST.session.id]
							callback(results)
							return
						}

						// updated music
							const music = results.documents[0]
							const updatedData = {}
								updatedData.parts = {}
								updatedData.parts[part.id] = part

						// inform other composers
							for (let i in music.composers) {
								callback({musicId: music.id, success: true, music: updatedData, recipients: [music.composers[i].sessionId]})
							}
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({musicId: REQUEST.path[REQUEST.path.length - 1], success: false, message: "unable to " + arguments.callee.name, recipients: [REQUEST.session.id]})
			}
		}

	/* updatePartMeasureDynamics */
		module.exports.actions.updatePartMeasureDynamics = updatePartMeasureDynamics
		function updatePartMeasureDynamics(REQUEST, music, composer, callback) {
			try {
				// get part
					const partId = String(REQUEST.post.partId) || null
					if (!partId || !partId.length || !music.parts[partId]) {
						callback({musicId: musicId, success: false, message: "could not find part " + partId, recipients: [REQUEST.session.id]})
						return
					}
					const part = music.parts[REQUEST.post.partId]

				// get measure number
					const measureNumber = Number(REQUEST.post.measure) || 0
					const lastMeasureNumber = Object.keys(music.measureTicks).length
					if (!measureNumber || measureNumber < 0 || measureNumber > lastMeasureNumber) {
						callback({musicId: musicId, success: false, message: "cannot change dynamics for measure " + measureNumber, recipients: [REQUEST.session.id]})
						return
					}

				// previous data
					const previousData = {parts: {}}
						previousData.parts[partId] = {staves: {}}
						for (let s in part.staves) {
							previousData.parts[partId].staves[s] = {}
							previousData.parts[partId].staves[s][measureNumber] = {dynamics: part.staves[s][measureNumber].dynamics}
						}

				// already being edited by someone else
					if (!part.editorId || part.editorId !== REQUEST.post.composerId) {
						callback({musicId: musicId, success: false, message: "part " + partId + " is being edited by someone else", music: previousData, recipients: [REQUEST.session.id]})
						return
					}

				// get dynamic
					let dynamic = REQUEST.post.dynamic
					if (dynamic == "-") {
						if (measureNumber == "1") {
							callback({musicId: musicId, success: false, message: "cannot remove dynamics from measure 1", music: previousData, recipients: [REQUEST.session.id]})
							return
						}
					}
					else {
						const dynamicToNumber = CORE.getAsset("dynamicToNumber")
						if (isNaN(dynamic) || dynamic < 0 || dynamic > dynamicToNumber[Object.keys(dynamicToNumber)[0]]) {
							callback({musicId: musicId, success: false, message: "unknown dynamic for " + measureNumber, music: previousData, recipients: [REQUEST.session.id]})
							return
						}
						dynamic = Number(dynamic)
					}

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "update"
						query.filters = {id: music.id}
						query.document = {
							updated: new Date().getTime()
						}

				// update this measure
					const updatedParts = {}
						updatedParts[partId] = {staves: {}}
					for (let s in part.staves) {
						updatedParts[partId].staves[s] = {}
						updatedParts[partId].staves[s][measureNumber] = {dynamics: (dynamic == "-" ? null : dynamic)}
						query.document["parts." + partId + ".staves." + s + "." + measureNumber + ".dynamics"] = (dynamic == "-" ? null : dynamic)
					}

				// update
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							results.musicId = REQUEST.path[REQUEST.path.length - 1]
							results.recipients = [REQUEST.session.id]
							callback(results)
							return
						}

						// updated music
							const music = results.documents[0]
							const updatedData = {}
								updatedData.parts = updatedParts

						// inform other composers
							for (let i in music.composers) {
								callback({musicId: music.id, success: true, music: updatedData, recipients: [music.composers[i].sessionId]})
							}
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({musicId: REQUEST.path[REQUEST.path.length - 1], success: false, message: "unable to " + arguments.callee.name, recipients: [REQUEST.session.id]})
			}
		}

	/* addPartMeasureNotes */
		module.exports.actions.addPartMeasureNotes = addPartMeasureNotes
		function addPartMeasureNotes(REQUEST, music, composer, callback) {
			try {
				// get part
					const partId = String(REQUEST.post.partId) || null
					if (!partId || !partId.length || !music.parts[partId]) {
						callback({musicId: musicId, success: false, message: "could not find part " + partId, recipients: [REQUEST.session.id]})
						return
					}
					const part = music.parts[REQUEST.post.partId]

				// already being edited by someone else
					if (!part.editorId || part.editorId !== REQUEST.post.composerId) {
						callback({musicId: musicId, success: false, message: "part " + partId + " is being edited by someone else", recipients: [REQUEST.session.id]})
						return
					}

				// validate notes
					const lastMeasureNumber = Object.keys(music.measureTicks).length
					const newNotes = REQUEST.post.notes || []
					for (let n = 0; n < newNotes.length; n++) {
						const measureNumber = Number(newNotes[n].measureNumber) || 0
					    if (!measureNumber || measureNumber < 0 || measureNumber > lastMeasureNumber || !newNotes[n].pitch || !newNotes[n].duration) {
					        newNotes.splice(n, 1)
					    }
					}
					if (!newNotes.length) {
						callback({musicId: musicId, success: false, message: "no valid notes", recipients: [REQUEST.session.id]})
						return
					}

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "update"
						query.filters = {id: music.id}
						query.document = {
							updated: new Date().getTime()
						}

				// find measures
					const updatedParts = {}
						updatedParts[partId] = {staves: {}}
					for (let s in part.staves) {
						updatedParts[partId].staves[s] = {}

						// loop through notes
							for (let n in newNotes) {
								// note
									const newNote = newNotes[n]

								// get measure number
									const measureNumber = Number(newNote.measureNumber) || 0
									if (!updatedParts[partId].staves[s][String(measureNumber)]) {
										updatedParts[partId].staves[s][String(measureNumber)] = {notes: part.staves[s][measureNumber].notes}
									}

								// notes
									if (!updatedParts[partId].staves[s][measureNumber].notes[String(newNote.tick)]) {
										updatedParts[partId].staves[s][measureNumber].notes[String(newNote.tick)] = {}
										updatedParts[partId].staves[s][measureNumber].notes[String(newNote.tick)][String(newNote.pitch)] = newNote.duration
										query.document["parts." + partId + ".staves." + s + "." + measureNumber + ".notes." + newNote.tick] = {}
										query.document["parts." + partId + ".staves." + s + "." + measureNumber + ".notes." + newNote.tick][String(newNote.pitch)] = newNote.duration
									}
									else {
										updatedParts[partId].staves[s][measureNumber].notes[String(newNote.tick)][String(newNote.pitch)] = newNote.duration
										query.document["parts." + partId + ".staves." + s + "." + measureNumber + ".notes." + newNote.tick + "." + newNote.pitch] = newNote.duration
									}
							}
					}

				// update
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							results.musicId = REQUEST.path[REQUEST.path.length - 1]
							results.recipients = [REQUEST.session.id]
							callback(results)
							return
						}

						// updated music
							const music = results.documents[0]
							const updatedData = {}
								updatedData.parts = updatedParts

						// inform other composers
							for (let i in music.composers) {
								callback({musicId: music.id, success: true, music: updatedData, recipients: [music.composers[i].sessionId]})
							}
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({musicId: REQUEST.path[REQUEST.path.length - 1], success: false, message: "unable to " + arguments.callee.name, recipients: [REQUEST.session.id]})
			}
		}

	/* updatePartMeasureNotes */
		module.exports.actions.updatePartMeasureNotes = updatePartMeasureNotes
		function updatePartMeasureNotes(REQUEST, music, composer, callback) {
			try {
				// get part
					const partId = String(REQUEST.post.partId) || null
					if (!partId || !partId.length || !music.parts[partId]) {
						callback({musicId: musicId, success: false, message: "could not find part " + partId, recipients: [REQUEST.session.id]})
						return
					}
					const part = music.parts[REQUEST.post.partId]

				// notes
					const updatedNotes = REQUEST.post.notes
					if (!REQUEST.post.notes || !REQUEST.post.notes.length) {
						callback({musicId: musicId, success: false, message: "no notes selected to change", recipients: [REQUEST.session.id]})
						return
					}

				// previous data
					const lastMeasureNumber = Object.keys(music.measureTicks).length
					const previousData = {parts: {}}
						previousData.parts[partId] = {staves: {}}
						for (let s in part.staves) {
							previousData.parts[partId].staves[s] = {}
							for (let n in updatedNotes) {
								const measureNumber = updatedNotes[n].measureNumber
								if (!measureNumber || measureNumber < 0 || measureNumber > lastMeasureNumber) {
									callback({musicId: musicId, success: false, message: "cannot update notes in measure " + measureNumber, recipients: [REQUEST.session.id]})
									return
								}
								previousData.parts[partId].staves[s][measureNumber] = {notes: part.staves[s][measureNumber].notes}
							}
						}

				// already being edited by someone else
					if (!part.editorId || part.editorId !== REQUEST.post.composerId) {
						callback({musicId: musicId, success: false, message: "part " + partId + " is being edited by someone else", music: previousData, recipients: [REQUEST.session.id]})
						return
					}

				// loop through notes
					for (let n in updatedNotes) {
						// updated note
							const updatedNote = updatedNotes[n]

						// impossible note
							let noteBefore = updatedNote.noteBefore
							let noteAfter = updatedNote.noteAfter
							if (!noteAfter || !noteAfter.pitch || !noteAfter.duration) {
								callback({musicId: musicId, success: false, message: "invalid note", music: previousData, recipients: [REQUEST.session.id]})
								return
							}

						// find new measure
							updatedNote.newMeasureNumber = Number(updatedNote.measureNumber)
							if (noteAfter.tick < 0) {
								while (noteAfter.tick < 0) {
									updatedNote.newMeasureNumber--
									if (updatedNote.newMeasureNumber && music.measureTicks[String(updatedNote.newMeasureNumber)]) {
										noteAfter.tick += music.measureTicks[String(updatedNote.newMeasureNumber)]
									}
									if (!updatedNote.newMeasureNumber) {
										callback({musicId: musicId, success: false, message: "invalid note placement", music: previousData, recipients: [REQUEST.session.id]})
										return
									}
								}
							}

							if (noteAfter.tick >= music.measureTicks[updatedNote.newMeasureNumber]) {
								while (noteAfter.tick >= music.measureTicks[String(updatedNote.newMeasureNumber)]) {
									if (updatedNote.newMeasureNumber > lastMeasureNumber) {
										callback({musicId: musicId, success: false, message: "invalid note placement", music: previousData, recipients: [REQUEST.session.id]})
										return
									}
									noteAfter.tick -= music.measureTicks[String(updatedNote.newMeasureNumber)]
									updatedNote.newMeasureNumber++
								}
							}
					}

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "update"
						query.filters = {id: music.id}
						query.document = {
							updated: new Date().getTime()
						}

				// find measure
					const updatedParts = {}
						updatedParts[partId] = {staves: {}}
					for (let s in part.staves) {
						updatedParts[partId].staves[s] = {}

						for (let n in updatedNotes) {
							// note
								const note = updatedNotes[n]

							// remove old note
								updatedParts[partId].staves[s][note.measureNumber] = {notes: part.staves[s][note.measureNumber].notes}
								if (updatedParts[partId].staves[s][note.measureNumber].notes[String(note.noteBefore.tick)]) {
									delete updatedParts[partId].staves[s][note.measureNumber].notes[String(note.noteBefore.tick)][String(note.noteBefore.pitch)]

									// only pitch at this tick?
										if (!Object.keys(updatedParts[partId].staves[s][note.measureNumber].notes[String(note.noteBefore.tick)]).length) {
											delete updatedParts[partId].staves[s][note.measureNumber].notes[String(note.noteBefore.tick)]
											query.document["parts." + partId + ".staves." + s + "." + note.measureNumber + ".notes." + note.noteBefore.tick] = null
										}
										else {
											query.document["parts." + partId + ".staves." + s + "." + note.measureNumber + ".notes." + note.noteBefore.tick + "." + note.noteBefore.pitch] = null
										}
								}

							// set new note
								if (note.newMeasureNumber !== note.measureNumber) {
									updatedParts[partId].staves[s][note.newMeasureNumber] = {notes: part.staves[s][note.newMeasureNumber].notes}
								}
								if (!updatedParts[partId].staves[s][note.newMeasureNumber].notes[String(note.noteAfter.tick)]) {
									updatedParts[partId].staves[s][note.newMeasureNumber].notes[String(note.noteAfter.tick)] = {}
									updatedParts[partId].staves[s][note.newMeasureNumber].notes[String(note.noteAfter.tick)][String(note.noteAfter.pitch)] = note.noteAfter.duration
									query.document["parts." + partId + ".staves." + s + "." + note.newMeasureNumber + ".notes." + note.noteAfter.tick] = {}
									query.document["parts." + partId + ".staves." + s + "." + note.newMeasureNumber + ".notes." + note.noteAfter.tick][String(note.noteAfter.pitch)] = note.noteAfter.duration
								}
								else {
									updatedParts[partId].staves[s][note.newMeasureNumber].notes[String(note.noteAfter.tick)][String(note.noteAfter.pitch)] = note.noteAfter.duration
									query.document["parts." + partId + ".staves." + s + "." + note.newMeasureNumber + ".notes." + note.noteAfter.tick + "." + note.noteAfter.pitch] = note.noteAfter.duration
								}
						}
					}

				// update
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							results.musicId = REQUEST.path[REQUEST.path.length - 1]
							results.recipients = [REQUEST.session.id]
							callback(results)
							return
						}

						// updated music
							const music = results.documents[0]
							const updatedData = {}
								updatedData.parts = updatedParts

						// inform other composers
							for (let i in music.composers) {
								callback({musicId: music.id, success: true, music: updatedData, recipients: [music.composers[i].sessionId]})
							}
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({musicId: REQUEST.path[REQUEST.path.length - 1], success: false, message: "unable to " + arguments.callee.name, recipients: [REQUEST.session.id]})
			}
		}

	/* deletePartMeasureNotes */
		module.exports.actions.deletePartMeasureNotes = deletePartMeasureNotes
		function deletePartMeasureNotes(REQUEST, music, composer, callback) {
			try {
				// get part
					const partId = String(REQUEST.post.partId) || null
					if (!partId || !partId.length || !music.parts[partId]) {
						callback({musicId: musicId, success: false, message: "could not find part " + partId, recipients: [REQUEST.session.id]})
						return
					}
					const part = music.parts[REQUEST.post.partId]

				// notes
					const oldNotes = REQUEST.post.notes
					if (!REQUEST.post.notes || !REQUEST.post.notes.length) {
						callback({musicId: musicId, success: false, message: "no notes selected for deletion", recipients: [REQUEST.session.id]})
						return
					}

				// previous data
					const lastMeasureNumber = Object.keys(music.measureTicks).length
					const previousData = {parts: {}}
						previousData.parts[partId] = {staves: {}}
						for (let s in part.staves) {
							previousData.parts[partId].staves[s] = {}
							for (let n in oldNotes) {
								const measureNumber = oldNotes[n].measureNumber
								if (!measureNumber || measureNumber < 0 || measureNumber > lastMeasureNumber) {
									callback({musicId: musicId, success: false, message: "cannot remove notes from measure " + measureNumber, recipients: [REQUEST.session.id]})
									return
								}
								previousData.parts[partId].staves[s][measureNumber] = {notes: part.staves[s][measureNumber].notes}
							}
						}

				// already being edited by someone else
					if (!part.editorId || part.editorId !== REQUEST.post.composerId) {
						callback({musicId: musicId, success: false, message: "part " + partId + " is being edited by someone else", music: previousData, recipients: [REQUEST.session.id]})
						return
					}

				// query
					const query = CORE.getSchema("query")
						query.collection = "music"
						query.command = "update"
						query.filters = {id: music.id}
						query.document = {
							updated: new Date().getTime()
						}

				// find measure
					const updatedParts = {}
						updatedParts[partId] = {staves: {}}
					for (let s in part.staves) {
						updatedParts[partId].staves[s] = {}

						// remove old notes
							for (let n in oldNotes) {
								const oldNote = oldNotes[n]
								updatedParts[partId].staves[s][oldNote.measureNumber] = {notes: part.staves[s][oldNote.measureNumber].notes}
								if (updatedParts[partId].staves[s][oldNote.measureNumber].notes[String(oldNote.tick)]) {
									delete updatedParts[partId].staves[s][oldNote.measureNumber].notes[String(oldNote.tick)][String(oldNote.pitch)]

									// only pitch at this tick?
										if (!Object.keys(updatedParts[partId].staves[s][oldNote.measureNumber].notes[String(oldNote.tick)]).length) {
											delete updatedParts[partId].staves[s][oldNote.measureNumber].notes[String(oldNote.tick)]
											query.document["parts." + partId + ".staves." + s + "." + oldNote.measureNumber + ".notes." + oldNote.tick] = null
										}
										else {
											query.document["parts." + partId + ".staves." + s + "." + oldNote.measureNumber + ".notes." + oldNote.tick + "." + oldNote.pitch] = null
										}
								}
							}
					}

				// update
					CORE.accessDatabase(query, function(results) {
						if (!results.success) {
							results.musicId = REQUEST.path[REQUEST.path.length - 1]
							results.recipients = [REQUEST.session.id]
							callback(results)
							return
						}

						// updated music
							const music = results.documents[0]
							const updatedData = {}
								updatedData.parts = updatedParts

						// inform other composers
							for (let i in music.composers) {
								callback({musicId: music.id, success: true, music: updatedData, recipients: [music.composers[i].sessionId]})
							}
					})
			}
			catch (error) {
				CORE.logError(error)
				callback({musicId: REQUEST.path[REQUEST.path.length - 1], success: false, message: "unable to " + arguments.callee.name, recipients: [REQUEST.session.id]})
			}
		}
