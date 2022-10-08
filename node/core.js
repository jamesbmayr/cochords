/*** modules ***/
	const HTTP = require("http")
	const FS   = require("fs")
	module.exports = {}

/*** environment ***/
	const ENVIRONMENT = getEnvironment()
	const MONGO = ENVIRONMENT.db_url ? require("mongodb").MongoClient : null

/*** logs ***/
	/* logError */
		module.exports.logError = logError
		function logError(error) {
			if (ENVIRONMENT.debug) {
				console.log("\n***ERROR @ " + new Date().toLocaleString() + " ***")
				console.log(" - " + error)
				console.dir(arguments)
			}
		}

	/* logStatus */
		module.exports.logStatus = logStatus
		function logStatus(status) {
			if (ENVIRONMENT.debug) {
				console.log("\n--- STATUS @ " + new Date().toLocaleString() + " ---")
				console.log(" - " + status)
			}
		}

	/* logMessage */
		module.exports.logMessage = logMessage
		function logMessage(message) {
			if (ENVIRONMENT.debug) {
				console.log(" - " + new Date().toLocaleString() + ": " + message)
			}
		}

	/* logTime */
		module.exports.logTime = logTime
		function logTime(flag, callback) {
			if (ENVIRONMENT.debug) {
				let before = process.hrtime()
				callback()

				let after = process.hrtime(before)[1] / 1e6
				if (after > 10) {
					logMessage(flag + " " + after)
				}
				else {
					logMessage(".")
				}
			}
			else {
				callback()
			}
		}

/*** maps ***/
	/* getEnvironment */
		module.exports.getEnvironment = getEnvironment
		function getEnvironment() {
			try {
				if (process.env.DOMAIN !== undefined) {
					return {
						port:            process.env.PORT,
						domain:          process.env.DOMAIN,
						debug:           process.env.DEBUG || false,
						cache:           process.env.CACHE || false,
						db_username:     process.env.DB_USERNAME,
						db_password:     process.env.DB_PASSWORD,
						db_url:          process.env.DB_URL,
						db_name:         process.env.DB_NAME,
						db:              "mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@" + process.env.DB_URL,
						db_cache: {
							sessions:    {},
							music:       {}
						},
						ws_config: {
							autoAcceptConnections: false
						}
					}
				}
				else {
					return {
						port:            3000,
						domain:          "localhost",
						debug:           true,
						cache:           true,
						db_username:     null,
						db_password:     null,
						db_url:          null,
						db_name:         null,
						db_cache: {
							sessions:    {},
							music:       {}
						},
						ws_config: {
							autoAcceptConnections: false
						}
					}
				}
			}
			catch (error) {
				logError(error)
				return false
			}
		}

	/* getContentType */
		module.exports.getContentType = getContentType
		function getContentType(string) {
			try {
				let array = string.split(".")
				let extension = array[array.length - 1].toLowerCase()

				switch (extension) {
					// application
						case "json":
						case "pdf":
						case "rtf":
						case "xml":
						case "zip":
							return "application/" + extension
						break

					// font
						case "otf":
						case "ttf":
						case "woff":
						case "woff2":
							return "font/" + extension
						break

					// audio
						case "aac":
						case "midi":
						case "wav":
							return "audio/" + extension
						break
						case "mid":
							return "audio/midi"
						break
						case "mp3":
							return "audio/mpeg"
						break
						case "oga":
							return "audio/ogg"
						break
						case "weba":
							return "audio/webm"
						break

					// images
						case "iso":
						case "bmp":
						case "gif":
						case "jpeg":
						case "png":
						case "tiff":
						case "webp":
							return "image/" + extension
						break
						case "jpg":
							return "image/jpeg"
						break
						case "svg":
							return "image/svg+xml"
						break
						case "tif":
							return "image/tiff"
						break

					// video
						case "mpeg":
						case "webm":
							return "video/" + extension
						break
						case "ogv":
							return "video/ogg"
						break

					// text
						case "css":
						case "csv":
						case "html":
							return "text/" + extension
						break
						case "js":
							return "text/javascript"
						break
						case "md":
							return "text/html"
						break
						case "txt":
						default:
							return "text/plain"
						break
				}
			}
			catch (error) {logError(error)}
		}

	/* getSchema */
		module.exports.getSchema = getSchema
		function getSchema(index) {
			try {
				switch (index) {
					// core
						case "query":
							return {
								collection: null,
								command:    null,
								filters:    null,
								document:   null,
								options:    {}
							}
						break

						case "session":
							return {
								id:               generateRandom(),
								updated:          new Date().getTime(),
								composerId:       null,
								musicId:          null,
								info: {
									"ip":         null,
									"user-agent": null,
									"language":   null
								}
							}
						break

					// large structures
						case "composer":
							return {
								id:        generateRandom(),
								sessionId: null,
								connected: false,
								name:      "anonymous"
							}
						break

						case "music":
							return {
								id:           generateRandom(null, getAsset("constants").musicIdLength).toLowerCase(),
								created:      new Date().getTime(),
								updated:      new Date().getTime(),
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
						break

					// small structures
						case "part":
							return {
								id:          generateRandom(),
								name:        "",
								instrument:  "",
								midiChannel: 0,
								midiProgram: 0,
								synth:       "",
								staves: {
									"1":     {}
								}
							}
						break

						case "synth":
							return {
								id:           generateRandom(),
								name:         "",
								polysynth:    {},
								noise:        {},
								imag:         new Float32Array(1 + 32),
								real:         new Float32Array(1 + 32),
								wave:         null,
								envelope: {
									attack:   0,
									decay:    0,
									sustain:  1,
									release:  0,
								},
								bitcrusher: {
									bits:     0,
									norm:     0
								},
								filters:      {},
								echo: {
									delay:    0,
									feedback: 0
								}
							}
						break

						case "measure":
							return {
								ticks:    0,
								tempo:    null,
								dynamics: null,
								notes:    {}
							}
						break

					// other
						default:
							return null
						break
				}
			}
			catch (error) {
				logError(error)
				return false
			}
		}

	/* getAsset */
		module.exports.getAsset = getAsset
		function getAsset(index) {
			try {
				switch (index) {
					// web
						case "title":
							return "CoChords"
						break
						case "logo":
							return `<link rel="shortcut icon" href="logo.png"/>`
						break
						case "meta":
							let title = getAsset("title")
							return `<meta charset="UTF-8"/>
									<meta name="description" content="` + title + ` is a collaborative music composition and playback tool"/>
									<meta name="author" content="James Mayr"/>
									<meta property="og:title" content="` + title + `"/>
									<meta property="og:description" content="` + title + ` is a collaborative music composition and playback tool"/>
									<meta property="og:image" content="https://jamesmayr.com/cochords/banner.png"/>
									<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0"/>`
						break
						case "fonts":
							return `<link href="https://fonts.googleapis.com/css2?family=Alata&display=swap" rel="stylesheet">`
						break
						case "css-variables":
							// output
								let output = ""

							// colors
								let colors = getAsset("colors")
								for (let i in colors) {
									output += ("--" + i + ": " + colors[i] + "; ")
								}

							// sizes
								let sizes = getAsset("sizes")
								for (let i in sizes) {
									output += ("--" + i + ": " + sizes[i] + "; ")
								}

							// fonts
								let fonts = getAsset("fonts")
									fonts = fonts.slice(fonts.indexOf("family=") + 7, fonts.indexOf("&display="))
									fonts = fonts.split("|")
								for (let i in fonts) {
									let font = fonts[i].replace(/\+/i, " ")
										font = font.split(":")[0]
									output += ("--font-" + i + ": '" + font + "', sans-serif; ")
								}

							// return
								return `<style>:root {` + output + `}</style>`
						break

					// styling
						case "colors":
							return {
								"light-gray": "#dddddd",
								"medium-gray": "#555555",
								"dark-gray": "#111111",
								"light-blue": "#04b1ff",
								"medium-blue": "#0066aa",
								"dark-blue": "#003377",
								"medium-red": "#d94c4c"
							}
						break

						case "sizes":
							return {
								"shadow-size": "10px",
								"border-radius": "20px",
								"blur-size": "3px",
								"border-size": "2px",
								"small-gap-size": "5px",
								"medium-gap-size": "10px",
								"large-gap-size": "20px",
								"small-font-size": "15px",
								"medium-font-size": "20px",
								"large-font-size": "35px",
								"huge-font-size": "50px",
								"transition-time": "0.5s",
								"left-column-size": "200px",
								"hover-brightness": "0.75",
								"disabled-brightness": "0.5",
								"disconnected-opacity": "0.5"
							}
						break

					// constants
						case "constants":
							return {
								alphabet: "abcdefghijklmnopqrstuvwxyz",
								randomLength: 16,
								minuteMS: 60000,
								secondMS: 1000,
								cookieLength: 1000 * 60 * 60 * 24 * 7,
								minimumComposerNameLength: 3,
								maximumComposerNameLength: 20,
								musicIdLength: 8,
								minimumMusicTitleLength: 1,
								maximumMusicTitleLength: 100,
								minimumMusicComposerLength: 0,
								maximumMusicComposerLength: 100,
								rounding: 100,
								attempts: 1000,
							}
						break

					// musicXML
						case "noteNameToMidi": 
							return {
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
							}
						break

						case "midiToColor": 
							return {
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
								"84": "rgb(255, 180, 180)"
							}
						break

						case "numberToBeat":
							return {
								"1": "whole",
								"2": "half",
								"4": "quarter",
								"8": "eighth",
								"16": "sixteenth"
							}
						break

						case "beatToTick":
							return {
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
							}
						break

						case "instrumentToSynth":
							return {
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
							}
						break

					// other
						default:
							return null
						break
				}
			}
			catch (error) {
				logError(error)
				return false
			}
		}

/*** checks ***/
	/* isNumLet */
		module.exports.isNumLet = isNumLet
		function isNumLet(string) {
			try {
				return (/^[a-zA-Z0-9]+$/).test(string)
			}
			catch (error) {
				logError(error)
				return false
			}
		}

/*** tools ***/
	/* renderHTML */
		module.exports.renderHTML = renderHTML
		function renderHTML(REQUEST, path, callback) {
			try {
				let html = {}
				FS.readFile(path, "utf8", function (error, file) {
					if (error) {
						logError(error)
						callback("")
						return
					}

					html.original = file
					html.array = html.original.split(/<script\snode>|<\/script>node>/gi)

					for (html.count = 1; html.count < html.array.length; html.count += 2) {
						try {
							html.temp = eval(html.array[html.count])
						}
						catch (error) {
							html.temp = ""
							logError("<sn>" + Math.ceil(html.count / 2) + "</sn>\n" + error)
						}
						html.array[html.count] = html.temp
					}

					callback(html.array.join(""))
				})
			}
			catch (error) {
				logError(error)
				callback("")
			}
		}

	/* constructHeaders */
		module.exports.constructHeaders = constructHeaders
		function constructHeaders(REQUEST) {
			try {
				// asset
					if (REQUEST.method == "GET" && (REQUEST.fileType || !REQUEST.session)) {
						return {"Content-Type": REQUEST.contentType}
					}

				// get
					if (REQUEST.method == "GET") {
						return {
							"Set-Cookie": ("session=" + REQUEST.session.id + "; expires=" + (new Date(new Date().getTime() + getAsset("constants").cookieLength).toUTCString()) + "; path=/; domain=" + ENVIRONMENT.domain + "; SameSite=Strict;"),
							"Content-Type": "text/html; charset=utf-8"
						}
					}

				// post
					if (REQUEST.method == "POST") {
						return {
							"Content-Type": "application/json"
						}
					}
			}
			catch (error) {
				logError(error)
				callback({success: false, message: "unable to " + arguments.callee.name})
			}
		}

	/* duplicateObject */
		module.exports.duplicateObject = duplicateObject
		function duplicateObject(object) {
			try {
				return JSON.parse(JSON.stringify(object))
			}
			catch (error) {
				logError(error)
				return null
			}
		}

/*** randoms ***/
	/* generateRandom */
		module.exports.generateRandom = generateRandom
		function generateRandom(set, length) {
			try {
				set = set || getAsset("constants").alphabet
				length = length || getAsset("constants").randomLength

				let output = ""
				for (let i = 0; i < length; i++) {
					output += (set[Math.floor(Math.random() * set.length)])
				}

				return output
			}
			catch (error) {
				logError(error)
				return null
			}
		}

	/* chooseRandom */
		module.exports.chooseRandom = chooseRandom
		function chooseRandom(options) {
			try {
				if (!Array.isArray(options)) {
					return false
				}

				return options[Math.floor(Math.random() * options.length)]
			}
			catch (error) {
				logError(error)
				return false
			}
		}

	/* sortRandom */
		module.exports.sortRandom = sortRandom
		function sortRandom(options) {
			try {
				if (!Array.isArray(options)) {
					return false
				}
				
				let copy = duplicateObject(options)

				let x = copy.length
				while (x > 0) {
					let y = Math.floor(Math.random() * x)
					x -= 1
					let temp = copy[x]
					copy[x] = copy[y]
					copy[y] = temp
				}

				return copy
			}
			catch (error) {
				logError(error)
				return false
			}
		}

/*** database ***/
	/* accessDatabase */
		module.exports.accessDatabase = accessDatabase
		function accessDatabase(query, callback) {
			try {
				// no query?
					if (!query) {
						if (typeof ENVIRONMENT.db_cache !== "object") {
							callback({success: false, message: "invalid database"})
							return
						}
						callback(ENVIRONMENT.db_cache)
						return
					}

				// log
					logMessage("db: " + query.command + " " + query.collection)

				// go to Mongo
					if (ENVIRONMENT.db_url) {
						accessMongo(query, callback)
						return
					}

				// fake database?
					if (!ENVIRONMENT.db_cache) {
						logError("database not found")
						callback({success: false, message: "database not found"})
						return
					}

				// collection
					if (!ENVIRONMENT.db_cache[query.collection]) {
						logError("collection not found")
						callback({success: false, message: "collection not found"})
						return
					}

				// find
					if (query.command == "find") {
						// all documents
							let documentKeys = Object.keys(ENVIRONMENT.db_cache[query.collection])

						// apply filters
							let filters = Object.keys(query.filters)
							for (let f in filters) {
								let property = filters[f]
								let filter = query.filters[property]

								if (filter instanceof RegExp) {
									documentKeys = documentKeys.filter(function(key) {
										return filter.test(ENVIRONMENT.db_cache[query.collection][key][property])
									})
								}
								else {
									documentKeys = documentKeys.filter(function(key) {
										return filter == ENVIRONMENT.db_cache[query.collection][key][property]
									})
								}
							}

						// get documents
							let documents = []
							for (let d in documentKeys) {
								documents.push(duplicateObject(ENVIRONMENT.db_cache[query.collection][documentKeys[d]]))
							}

						// no documents
							if (!documents.length) {
								callback({success: false, count: 0, documents: []})
								return
							}

						// yes documents
							callback({success: true, count: documentKeys.length, documents: documents})
							return
					}

				// insert
					if (query.command == "insert") {
						// unique id
							let id = null
							do {
								id = generateRandom()
							}
							while (ENVIRONMENT.db_cache[query.collection][id])

						// insert document
							ENVIRONMENT.db_cache[query.collection][id] = duplicateObject(query.document)

						// return document
							callback({success: true, count: 1, documents: [query.document]})
							return
					}

				// update
					if (query.command == "update") {
						// all documents
							let documentKeys = Object.keys(ENVIRONMENT.db_cache[query.collection])

						// apply filters
							let filters = Object.keys(query.filters)
							for (let f in filters) {
								documentKeys = documentKeys.filter(function(key) {
									return ENVIRONMENT.db_cache[query.collection][key][filters[f]] == query.filters[filters[f]]
								})
							}

						// update keys
							let updateKeys = Object.keys(query.document)

						// update
							for (let d in documentKeys) {
								let document = ENVIRONMENT.db_cache[query.collection][documentKeys[d]]

								for (let u in updateKeys) {
									let subdocument = document
									let updateKeyLevels = updateKeys[u].split(".")
									let k = 0
									while (k < updateKeyLevels.length - 1) {
										if (typeof subdocument[updateKeyLevels[k]] == "undefined") {
											subdocument[updateKeyLevels[k]] = {}
										}
										subdocument = subdocument[updateKeyLevels[k]]
										k++
									}
									
									subdocument[updateKeyLevels[k]] = query.document[updateKeys[u]]
								}
							}

						// update documents
							let documents = []
							for (let d in documentKeys) {
								documents.push(duplicateObject(ENVIRONMENT.db_cache[query.collection][documentKeys[d]]))
							}

						// no documents
							if (!documents.length) {
								callback({success: false, count: 0, documents: []})
								return
							}

						// yes documents
							callback({success: true, count: documentKeys.length, documents: documents})
							return
					}

				// delete
					if (query.command == "delete") {
						// all documents
							let documentKeys = Object.keys(ENVIRONMENT.db_cache[query.collection])

						// apply filters
							let filters = Object.keys(query.filters)
							for (let f in filters) {
								documentKeys = documentKeys.filter(function(key) {
									return ENVIRONMENT.db_cache[query.collection][key][filters[f]] == query.filters[filters[f]]
								})
							}

						// delete
							for (let d in documentKeys) {
								delete ENVIRONMENT.db_cache[query.collection][documentKeys[d]]
							}

						// no documents
							if (!documentKeys.length) {
								callback({success: false, count: 0})
							}

						// yes documents
							callback({success: true, count: documentKeys.length})
							return
					}
			}
			catch (error) {
				logError(error)
				callback({success: false, message: "unable to " + arguments.callee.name})
			}
		}

	/* accessMongo */
		module.exports.accessMongo = accessMongo
		function accessMongo(query, callback) {
			try {
				// find
					if (query.command == "find") {
						// find in cache
							if (ENVIRONMENT.cache) {
								// all documents
									let documentKeys = Object.keys(ENVIRONMENT.db_cache[query.collection])

								// apply filters
									let filters = Object.keys(query.filters)
									for (let f in filters) {
										let property = filters[f]
										let filter = query.filters[property]

										if (filter instanceof RegExp) {
											documentKeys = documentKeys.filter(function(key) {
												return filter.test(ENVIRONMENT.db_cache[query.collection][key][property])
											})
										}
										else {
											documentKeys = documentKeys.filter(function(key) {
												return filter == ENVIRONMENT.db_cache[query.collection][key][property]
											})
										}
									}

								// get documents
									let documents = []
									for (let d in documentKeys) {
										documents.push(duplicateObject(ENVIRONMENT.db_cache[query.collection][documentKeys[d]]))
									}

								// documents in cache
									if (documents && documents.length) {
										callback({success: true, count: documentKeys.length, documents: documents})
										return
									}
							}

						// connect
							logMessage("db: connecting")
							MONGO.connect(ENVIRONMENT.db, { useNewUrlParser: true, useUnifiedTopology: true }, function(error, client) {
								// connect
									if (error) {
										logError(error)
										callback({success: false, message: error})
										try { client.close() } catch (error) {}
										return
									}

									let db = client.db(ENVIRONMENT.db_name)

								// execute query
									db.collection(query.collection).find(query.filters).toArray(function (error, documents) {
										// error
											if (error) {
												callback({success: false, message: JSON.stringify(error)})
												client.close()
												return
											}

										// no documents
											if (!documents.length) {
												callback({success: false, count: 0, documents: []})
												client.close()
												return
											}

										// yes documents
											// update cache
												if (ENVIRONMENT.cache) {
													for (let i in documents) {
														ENVIRONMENT.db_cache[query.collection][documents[i]._id] = duplicateObject(documents[i])
													}
												}

											// return documents
												callback({success: true, count: documents.length, documents: documents})
												client.close()
												return
									})
							})
					}

				// insert
					if (query.command == "insert") {
						// prevent duplicate _id
							if (query.document._id) {
								delete query.document._id
							}

						// connect
							logMessage("db: connecting")
							MONGO.connect(ENVIRONMENT.db, { useNewUrlParser: true, useUnifiedTopology: true }, function(error, client) {
								// connect
									if (error) {
										logError(error)
										callback({success: false, message: error})
										try { client.close() } catch (error) {}
										return
									}

									let db = client.db(ENVIRONMENT.db_name)

								// execute query
									db.collection(query.collection).insertOne(query.document, function (error, results) {
										// error
											if (error) {
												callback({success: false, message: JSON.stringify(error)})
												client.close()
												return
											}

										// success
											// update cache
												if (ENVIRONMENT.cache) {
													ENVIRONMENT.db_cache[query.collection][results.insertedId] = duplicateObject(query.document)
												}

											// return documents
												callback({success: true, count: results.nInserted, documents: [query.document]})
												client.close()
												return
									})
							})
					}

				// update
					if (query.command == "update") {
						// prevent updating _id
							if (query.document._id) {
								delete query.document._id
							}

						// connect
							logMessage("db: connecting")
							MONGO.connect(ENVIRONMENT.db, { useNewUrlParser: true, useUnifiedTopology: true }, function(error, client) {
								// connect
									if (error) {
										logError(error)
										callback({success: false, message: error})
										try { client.close() } catch (error) {}
										return
									}

									let db = client.db(ENVIRONMENT.db_name)

								// execute query
									db.collection(query.collection).updateOne(query.filters, {$set: query.document}, function(error, results) {
										// error
											if (error) {
												callback({success: false, message: JSON.stringify(error)})
												client.close()
												return
											}

										// find
											db.collection(query.collection).find(query.filters).toArray(function (error, documents) {
												// error
													if (error) {
														callback({success: false, message: JSON.stringify(error)})
														client.close()
														return
													}

												// no documents
													if (!documents.length) {
														callback({success: false, count: 0, documents: []})
														client.close()
														return
													}

												// yes documents
													// update cache
														if (ENVIRONMENT.cache) {
															for (let i in documents) {
																ENVIRONMENT.db_cache[query.collection][documents[i]._id] = duplicateObject(documents[i])
															}
														}

													// return documents
														callback({success: true, count: documents.length, documents: documents})
														client.close()
														return
											})
									})
							})
					}

				// delete
					if (query.command == "delete") {
						// connect
							logMessage("db: connecting")
							MONGO.connect(ENVIRONMENT.db, { useNewUrlParser: true, useUnifiedTopology: true }, function(error, client) {
								// connect
									if (error) {
										logError(error)
										callback({success: false, message: error})
										try { client.close() } catch (error) {}
										return
									}

									let db = client.db(ENVIRONMENT.db_name)

								// get _ids
									db.collection(query.collection).find(query.filters).toArray(function (error, documents) {
										// error
											if (error) {
												callback({success: false, message: JSON.stringify(error)})
												client.close()
												return
											}

										// no documents
											if (!documents.length) {
												callback({success: true, count: 0})
												client.close()
												return
											}

										// yes documents --> store _ids
											let _ids = []
											for (let i in documents) {
												_ids.push(documents[i]._id)
											}
										
										// delete
											db.collection(query.collection).deleteMany(query.filters, function(error, results) {
												// error
													if (error) {
														callback({success: false, message: JSON.stringify(error)})
														client.close()
														return
													}

												// no documents any more
													// update cache
														if (ENVIRONMENT.cache) {
															for (let i in _ids) {
																delete ENVIRONMENT.db_cache[query.collection][_ids[i]]
															}
														}

													// return documents
														callback({success: true, count: results.deletedCount})
														client.close()
														return
											})
									})
							})
					}
			}
			catch (error) {
				logError(error)
				callback({success: false, message: "unable to " + arguments.callee.name})
			}
		}
