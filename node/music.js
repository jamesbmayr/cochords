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
					music.totalTicks   = REQUEST.post.musicJSON.totalTicks || 0
					music.measureTicks = REQUEST.post.musicJSON.measureTicks || {}
					music.swing        = REQUEST.post.musicJSON.swing || false
					music.tempoChanges = REQUEST.post.musicJSON.tempoChanges || {}
					music.parts        = REQUEST.post.musicJSON.parts || {}

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
						synth.name = REQUEST.post.synth.name || synth.name
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
						query.document["synths." + synth.id] = synth

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
				// get name
					const name = String(REQUEST.post.name).trim()

				// no name
					if (!name || !name.length) {
						callback({musicId: musicId, success: false, message: "missing name", recipients: [REQUEST.session.id]})
						return
					}

				// invalid length
					if (CONSTANTS.minimumComposerNameLength > name.length || name.length > CONSTANTS.maximumComposerNameLength) {
						callback({musicId: musicId, success: false, message: "name must be " + CONSTANTS.minimumComposerNameLength " - " + CONSTANTS.maximumComposerNameLength + " characters", recipients: [REQUEST.session.id]})
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
				// get title
					const title = String(REQUEST.post.title).trim()

				// no title
					if (!title || !title.length) {
						callback({musicId: musicId, success: false, message: "missing title", recipients: [REQUEST.session.id]})
						return
					}

				// invalid length
					if (CONSTANTS.minimumMusicTitleLength > title.length || title.length > CONSTANTS.maximumMusicTitleLength) {
						callback({musicId: musicId, success: false, message: "title must be " + CONSTANTS.minimumMusicTitleLength " - " + CONSTANTS.maximumMusicTitleLength + " characters", recipients: [REQUEST.session.id]})
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
				// get composer
					const composer = String(REQUEST.post.composer).trim()

				// invalid length
					if (CONSTANTS.minimumMusicComposerLength > composer.length || composer.length > CONSTANTS.maximumMusicComposerLength) {
						callback({musicId: musicId, success: false, message: "composer must be " + CONSTANTS.minimumMusicComposerLength " - " + CONSTANTS.maximumMusicComposerLength + " characters", recipients: [REQUEST.session.id]})
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
