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
							return "text/" + extension + "; charset=utf-8"
						break
						case "js":
							return "text/javascript; charset=utf-8"
						break
						case "md":
							return "text/html; charset=utf-8"
						break
						case "txt":
						default:
							return "text/plain; charset=utf-8"
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
								title:        "untitled",
								composer:     "",
								swing:        false,
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
								order:       0,
								name:        "",
								instrument:  "",
								midiChannel: 0,
								midiProgram: 0,
								synth:       "",
								measures:    {}
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
								notes:    {},
								ticks:    0
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
								"pitch-height": "3px",
								"tick-width": "5px",
								"pitch-count": "73",
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
								minimumPartNameLength: 1,
								maximumPartNameLength: 20,
								minimumDuration: 2,
								defaultTicks: 96,
								defaultTempo: 120,
								defaultMeasureCount: 4,
								defaultDynamics: 0.83,
								defaultMidiChannel: 1,
								defaultMidiProgram: 1,
								defaultInstrument: "Acoustic Grand Piano",
								minimumMidiChannel: 1,
								maximumMidiChannel: 16,
								lowestPitch: 24, // midi
								highestPitch: 96, // midi
								defaultSynth: "keystone",
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

						case "dynamicToNumber":
							return {
								"ffff": 1.41,
								"fff": 1.27,
								"ff": 1.12,
								"f": 0.98,
								"mf": 0.83,
								"mp": 0.69,
								"p": 0.54,
								"pp": 0.40,
								"ppp": 0.26,
								"pppp": 0.11,
								"n": 0
							}
						break

						case "midiToInstrument":
							return {
								"0": "Percussion",
								"1": "Acoustic Grand Piano",
								"2": "Bright Acoustic Piano",
								"3": "Electric Grand Piano",
								"4": "Honky-tonk Piano",
								"5": "Electric Piano 1",
								"6": "Electric Piano 2",
								"7": "Harpsichord",
								"8": "Clavinet",
								"9": "Celesta",
								"10": "Glockenspiel",
								"11": "Music Box",
								"12": "Vibraphone",
								"13": "Marimba",
								"14": "Xylophone",
								"15": "Tubular Bells",
								"16": "Dulcimer",
								"17": "Drawbar Organ",
								"18": "Percussive Organ",
								"19": "Rock Organ",
								"20": "Church Organ",
								"21": "Reed Organ",
								"22": "Accordion",
								"23": "Harmonica",
								"24": "Tango Accordion",
								"25": "Acoustic Guitar (nylon)",
								"26": "Acoustic Guitar (steel)",
								"27": "Electric Guitar (jazz)",
								"28": "Electric Guitar (clean)",
								"29": "Electric Guitar (muted)",
								"30": "Overdriven Guitar",
								"31": "Distortion Guitar",
								"32": "Guitar harmonics",
								"33": "Acoustic Bass",
								"34": "Electric Bass (finger)",
								"35": "Electric Bass (pick)",
								"36": "Fretless Bass",
								"37": "Slap Bass 1",
								"38": "Slap Bass 2",
								"39": "Synth Bass 1",
								"40": "Synth Bass 2",
								"41": "Violin",
								"42": "Viola",
								"43": "Cello",
								"44": "Contrabass",
								"45": "Tremolo Strings",
								"46": "Pizzicato Strings",
								"47": "Orchestral Harp",
								"48": "Timpani",
								"49": "String Ensemble 1",
								"50": "String Ensemble 2",
								"51": "Synth Strings 1",
								"52": "Synth Strings 2",
								"53": "Choir Aahs",
								"54": "Voice Oohs",
								"55": "Synth Voice",
								"56": "Orchestra Hit",
								"57": "Trumpet",
								"58": "Trombone",
								"59": "Tuba",
								"60": "Muted Trumpet",
								"61": "French Horn",
								"62": "Brass Section",
								"63": "Synth Brass 1",
								"64": "Synth Brass 2",
								"65": "Soprano Sax",
								"66": "Alto Sax",
								"67": "Tenor Sax",
								"68": "Baritone Sax",
								"69": "Oboe",
								"70": "English Horn",
								"71": "Bassoon",
								"72": "Clarinet",
								"73": "Piccolo",
								"74": "Flute",
								"75": "Recorder",
								"76": "Pan Flute",
								"77": "Blown Bottle",
								"78": "Shakuhachi",
								"79": "Whistle",
								"80": "Ocarina",
								"81": "Lead 1 (square)",
								"82": "Lead 2 (sawtooth)",
								"83": "Lead 3 (calliope)",
								"84": "Lead 4 (chiff)",
								"85": "Lead 5 (charang)",
								"86": "Lead 6 (voice)",
								"87": "Lead 7 (fifths)",
								"88": "Lead 8 (bass + lead)",
								"89": "Pad 1 (new age)",
								"90": "Pad 2 (warm)",
								"91": "Pad 3 (polysynth)",
								"92": "Pad 4 (choir)",
								"93": "Pad 5 (bowed)",
								"94": "Pad 6 (metallic)",
								"95": "Pad 7 (halo)",
								"96": "Pad 8 (sweep)",
								"97": "FX 1 (rain)",
								"98": "FX 2 (soundtrack)",
								"99": "FX 3 (crystal)",
								"100": "FX 4 (atmosphere)",
								"101": "FX 5 (brightness)",
								"102": "FX 6 (goblins)",
								"103": "FX 7 (echoes)",
								"104": "FX 8 (sci-fi)",
								"105": "Sitar",
								"106": "Banjo",
								"107": "Shamisen",
								"108": "Koto",
								"109": "Kalimba",
								"110": "Bag pipe",
								"111": "Fiddle",
								"112": "Shanai",
								"113": "Tinkle Bell",
								"114": "Agogo",
								"115": "Steel Drums",
								"116": "Woodblock",
								"117": "Taiko Drum",
								"118": "Melodic Tom",
								"119": "Synth Drum",
								"120": "Reverse Cymbal",
								"121": "Guitar Fret Noise",
								"122": "Breath Noise",
								"123": "Seashore",
								"124": "Bird Tweet",
								"125": "Telephone Ring",
								"126": "Helicopter",
								"127": "Applause",
								"128": "Gunshot",
							}
						break

						case "instrumentToSynth":
							return {
								"percussion": "*percusstom*", // 0
								"acoustic grand piano": "keystone", // 1
								"bright acoustic piano": "keystone", // 2
								"electric grand piano": "keystone", // 3
								"honky-tonk piano": "consona", // 4
								"electric piano 1": "qube", // 5
								"electric piano 2": "glassical", // 6
								"piano": "keystone",
								"harpsichord": "sharpsichord", // 7
								"clavinet": "zipboard", // 8
								"celesta": "bitbottle", // 9
								"glockenspiel": "bellissful", // 10
								"music box": "glassical", // 11
								"vibraphone": "meltmallet", // 12
								"marimba": "mayrimba", // 13
								"xylophone": "nimbusnotes", // 14
								"tubular bells": "bellissful", // 15
								"dulcimer": "sharpsichord", // 16
								"drawbar organ": "soulvation", // 17
								"percussive organ": "pipepad", // 18
								"rock organ": "buzzorgan", // 19
								"church organ": "pipepad", // 20
								"reed organ": "accordienne", // 21
								"organ": "pipepad",
								"accordion": "accordienne", // 22
								"harmonica": "hermanico", // 23
								"tango accordion": "accordienne", // 24
								"acoustic guitar (nylon)": "argit", // 25
								"acoustic guitar (steel)": "randolin", // 26
								"acoustic guitar": "argit",
								"electric guitar (jazz)": "wavecore", // 27
								"electric guitar (clean)": "argit", // 28
								"electric guitar (muted)": "spritzicato", // 29
								"overdriven guitar": "fuzzillade", // 30
								"distortion guitar": "lazerz", // 31
								"guitar harmonics": "chordstrum", // 32
								"electric guitar": "argit",
								"guitar": "argit",
								"acoustic bass": "honeyharp", // 33
								"electric bass (finger)": "jellybanjo", // 34
								"electric bass (pick)": "bowsaw", // 35
								"electic bass": "lowdium",
								"fretless bass": "argit", // 36
								"slap bass 1": "randolin", // 37
								"slap bass 2": "consona", // 38
								"synth bass 1": "lowdium", // 39
								"synth bass 2": "qube", // 40
								"violin": "vyol", // 41
								"viola": "vyol", // 42
								"cello": "swello", // 43
								"contrabass": "swello", // 44
								"tremolo strings": "estrorcha", // 45
								"pizzicato strings": "spritzicato", // 46
								"pizzicato": "spritzicato",
								"orchestral harp": "honeyharp", // 47
								"harp": "honeyharp",
								"timpani": "thumpano", // 48
								"string ensemble 1": "nonsemble", // 49
								"string ensemble 2": "estrorcha", // 50
								"string ensemble": "nonsemble",
								"synth strings 1": "nonsemble", // 51
								"synth strings 2": "estrorcha", // 52
								"synth strings": "estrorcha", // 52
								"strings": "nonsemble",
								"string": "vyol",
								"choir aahs": "rechoirment", // 53
								"chorus": "rechoirment",
								"voice oohs": "voxelle", // 54
								"synth voice": "cantarus", // 55
								"vocals": "voxelle",
								"orchestra hit": "grandom", // 56
								"orchestra": "nonsemble",
								"muted trumpet": "ashbray", // 60
								"trumpet": "trimpot", // 57
								"trombone": "trombus", // 58
								"tuba": "trombus", // 59
								"french horn": "trombus", // 61
								"brass section": "hornithologist", // 62
								"synth brass 1": "hornithologist", // 63
								"synth brass 2": "ashbray", // 64
								"brass": "ashbray",
								"soprano sax": "snacksifolk", // 65
								"soprano saxophone": "snacksifolk",
								"alto sax": "reedles", // 66
								"alto saxophone": "reedles",
								"tenor sax": "snacksifolk", // 67
								"tenor saxophone": "snacksifolk",
								"baritone sax": "bariphone", // 68
								"baritone saxophone": "bariphone",
								"bari sax": "bariphone",
								"bari saxophone": "bariphone",
								"sax": "reedles",
								"saxophone": "reedles",
								"oboe": "tenoir", // 69
								"english horn": "tenoir", // 70
								"bassoon": "reverbassoon", // 71
								"bass clarinet": "tenoir",
								"clarinet": "clarinaut", // 72
								"piccolo": "particcolo", // 73
								"flute": "particcolo", // 74
								"recorder": "mockarina", // 75
								"pan flute": "bitbottle", // 76
								"blown bottle": "bitbottle", // 77
								"bottle": "bitbottle",
								"shakuhachi": "mockarina", // 78
								"whistle": "whissile", // 79
								"ocarina": "mockarina", // 80
								"lead 1 (square)": "square", // 81
								"square": "square",
								"lead 2 (sawtooth)": "sawtooth", // 82
								"sawtooth": "sawtooth",
								"lead 3 (calliope)": "whissile", // 83
								"calliope": "whissile",
								"lead 4 (chiff)": "bowsaw", // 84
								"chiff": "bowsaw",
								"lead 5 (charang)": "lazerz", // 85
								"charang": "lazerz",
								"lead 6 (voice)": "cantarus", // 86
								"voice": "voxelle",
								"lead 7 (fifths)": "chordstrum", // 87
								"fifths": "chordstrum",
								"lead 8 (bass + lead)": "lowdium", // 88
								"bass + lead": "lowdium",
								"lead": "triangle",
								"pad 1 (new age)": "consona", // 89
								"new age": "consona",
								"pad 2 (warm)": "estrorcha", // 90
								"warm": "estrorcha",
								"pad 3 (polysynth)": "ziplimba", // 91
								"polysynth": "ziplimba",
								"pad 4 (choir)": "rechoirment", // 92
								"choir": "rechoirment",
								"pad 5 (bowed)": "bitbottle", // 93
								"bowed": "bitbottle",
								"pad 6 (metallic)": "wavecore", // 94
								"metallic": "wavecore",
								"pad 7 (halo)": "rechoirment", // 95
								"halo": "rechoirment",
								"pad 8 (sweep)": "buzzorgan", // 96
								"sweep": "buzzorgan",
								"synth pad": "theremonster",
								"pad": "sine",
								"fx 1 (rain)": "shimmer", // 97
								"rain": "shimmer",
								"fx 2 (soundtrack)": "theremonster", // 98
								"soundtrack": "theremonster",
								"fx 3 (crystal)": "jangle", // 99
								"crystal": "jangle",
								"fx 4 (atmosphere)": "argit", // 100
								"atmosphere": "argit",
								"fx 5 (brightness)": "wavecore", // 101
								"brightness": "wavecore",
								"fx 6 (goblins)": "darkflute", // 102
								"goblins": "darkflute",
								"fx 7 (echoes)": "underseep", // 103
								"echoes": "underseep",
								"fx 8 (sci-fi)": "warpal", // 104
								"sci-fi": "warpal",
								"fx": "underseep",
								"sitar": "jellybanjo", // 105
								"banjo": "jellybanjo", // 106
								"shamisen": "shamosan", // 107
								"koto": "shamosan", // 108
								"kalimba": "nimbusnotes", // 109
								"bag pipe": "accordienne", // 110
								"bagpipe": "accordienne",
								"bag pipes": "accordienne",
								"bagpipes": "accordienne",
								"fiddle": "vyol", // 111
								"shanai": "snacksifolk", // 112
								"tinkle bell": "bellissful", // 113
								"bells": "bellissful",
								"bell": "bellissful",
								"triangle": "bellissful",
								"agogo": "meltmallet", // 114
								"steel drums": "meltmallet", // 115
								"woodblock": "blik", // 116
								"claves": "blik",
								"taiko drum": "ensnarl", // 117
								"taiko": "ensnarl",
								"melodic tom": "tomgo", // 118
								"tom": "tomgo",
								"synth drum": "tomgo", // 119
								"snare": "ensnarl",
								"bass drum": "boombash",
								"kick drum": "boombash",
								"drum set": "*percusstom*",
								"drumset": "*percusstom*",
								"drums": "*percusstom*",
								"drum": "*percusstom*",
								"reverse cymbal": "cymbilant", // 120
								"hi hat": "hellohat",
								"hi-hat": "hellohat",
								"hihat": "hellohat",
								"crash": "cymbilant",
								"ride": "cymbilant",
								"splash": "cymbilant",
								"cymbal": "cymbilant",
								"tambourine": "plately",
								"guitar fret noise": "buzzorgan", // 121
								"breath noise": "bitbottle", // 122
								"seashore": "sandscrape", // 123
								"shaker": "sandscrape",
								"maraca": "sandscrape",
								"bird tweet": "shring", // 124
								"telephone ring": "telephex", // 125
								"helicopter": "ensnarl", // 126
								"applause": "cymbilant", // 127
								"gunshot": "boombash", // 128
								"ukulele": "honeyharp",
								"mandolin": "randolin",
								"cornet": "ashbray",
								"horns": "hornithologist",
								"horn": "trombus",
								"baritone": "trombus",
								"mellophone": "trombus",
								"euphonium": "trombus",
								"bass": "lowdium",
								"synthesizer": "qube",
								"synth": "qube"
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
					logMessage("db: " + query.command + " " + query.collection + 
						(query.filters ? "\n   > " + JSON.stringify(query.filters) : "") +
						(query.document ? "\n   > " + JSON.stringify(query.document) : ""))

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
									
									if (query.document[updateKeys[u]] === null) {
										delete subdocument[updateKeyLevels[k]]
									}
									else {
										subdocument[updateKeyLevels[k]] = query.document[updateKeys[u]]
									}
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

								// set vs. unset
									let updateKeys = Object.keys(query.document)
									let sets = {}
									let unsets = {}
									for (let k in updateKeys) {
										let key = updateKeys[k]
										let value = query.document[key]
										if (value === null) {
											unsets[key] = null
										}
										else {
											sets[key] = value
										}
									}

								// execute query
									db.collection(query.collection).updateOne(query.filters, (Object.keys(sets).length && Object.keys(unsets).length) ? {$set: sets, $unset: unsets} : Object.keys(sets).length ? {$set: sets} : {$unset: unsets}, function(error, results) {
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
