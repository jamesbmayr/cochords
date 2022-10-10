/*** globals ***/
	/* musicXML constants */
		const MUSICXML_J = {
			constants: {
				defaultMidiChannel: 1,
				defaultMidiProgram: 1,
				defaultInstrument: "Acoustic Grand Piano",
				defaultSynth: "keystone",
				dynamicToNumber: {
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
				},
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
				midiToInstrument: {
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
				},
				instrumentToSynth: {
					"electric piano": "zipboard",
					"piano": "keystone",
					"keys": "keystone",
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
				notes: {
					// midi:  [Hz, name, accidental, octave]
					// octave -1
						"0":  [8.175, "C", 0, -1], 			// C-1
						"1":  [8.66, "C", 1, -1], 			// C#-1 / Db-1
						"2":  [9.175, "D", 0, -1], 			// D-1
						"3":  [9.725, "E", -1, -1], 		// D#-1 / Eb-1
						"4":  [10.30, "E", 0, -1], 			// E-1
						"5":  [10.915, "F", 0, -1], 		// F-1
						"6":  [11.56, "F", 1, -1], 			// F#-1 / Gb-1
						"7":  [12.25, "G", 0, -1], 			// -1
						"8":  [12.98, "A", -1, -1], 		// G#-1 / Ab-1
						"9":  [13.75, "A", 0, -1], 			// A-1
						"10": [14.57, "B", -1, -1], 		// A#-1 / Bb-1
						"11": [15.435, "B", 0, -1], 		// B-1
					// octave 0
						"12": [16.35, "C", 0, 0], 			// C0
						"13": [17.32, "C", 1, 0], 			// C#0 / Db0
						"14": [18.35, "D", 0, 0], 			// D0
						"15": [19.45, "E", -1, 0], 			// D#0 / Eb0
						"16": [20.60, "E", 0, 0], 			// E0
						"17": [21.83, "F", 0, 0], 			// F0
						"18": [23.12, "F", 1, 0], 			// F#0 / Gb0
						"19": [24.50, "G", 0, 0], 			// 0
						"20": [25.96, "A", -1, 0], 			// G#0 / Ab0
						"21": [27.50, "A", 0, 0], 			// A0
						"22": [29.14, "B", -1, 0], 			// A#0 / Bb0
						"23": [30.87, "B", 0, 0], 			// B0
					// octave 1
						"24": [32.70, "C", 0, 1], 			// C1
						"25": [34.65, "C", 1, 1], 			// C#1 / Db1
						"26": [36.71, "D", 0, 1], 			// D1
						"27": [38.89, "E", -1, 1], 			// D#1 / Eb1
						"28": [41.20, "E", 0, 1], 			// E1
						"29": [43.65, "F", 0, 1], 			// F1
						"30": [46.25, "F", 1, 1], 			// F#1 / Gb1
						"31": [49.00, "G", 0, 1], 			// 1
						"32": [51.91, "A", -1, 1], 			// G#1 / Ab1
						"33": [55.00, "A", 0, 1], 			// A1
						"34": [58.27, "B", -1, 1], 			// A#1 / Bb1
						"35": [61.74, "B", 0, 1], 			// B1
					// octave 2
						"36": [65.41, "C", 0, 2], 			// C2
						"37": [69.30, "C", 1, 2], 			// C#2 / Db2
						"38": [73.42, "D", 0, 2], 			// D2
						"39": [77.78, "E", -1, 2], 			// D#2 / Eb2
						"40": [82.41, "E", 0, 2], 			// E2
						"41": [87.31, "F", 0, 2], 			// F2
						"42": [92.50, "F", 1, 2], 			// F#2 / Gb2
						"43": [98.00, "G", 0, 2], 			// 2
						"44": [103.83, "A", -1, 2], 		// G#2 / Ab2
						"45": [110.00, "A", 0, 2], 			// A2
						"46": [116.54, "B", -1, 2], 		// A#2 / Bb2
						"47": [123.47, "B", 0, 2], 			// B2
					// octave 3
						"48": [130.81, "C", 0, 3], 			// C3
						"49": [138.59, "C", 1, 3], 			// C#3 / Db3
						"50": [146.83, "D", 0, 3], 			// D3
						"51": [155.56, "E", -1, 3], 		// D#3 / Eb3
						"52": [164.81, "E", 0, 3], 			// E3
						"53": [174.61, "F", 0, 3], 			// F3
						"54": [185.00, "F", 1, 3], 			// F#3 / Gb3
						"55": [196.00, "G", 0, 3], 			// G
						"56": [207.65, "A", -1, 3], 		// G#3 / Ab3
						"57": [220.00, "A", 0, 3], 			// A3
						"58": [233.08, "B", -1, 3], 		// A#3 / Bb3
						"59": [246.94, "B", 0, 3], 			// B3
					// octave 4
						"60": [261.63, "C", 0, 4], 			// C4
						"61": [277.18, "C", 1, 4], 			// C#4 / Db4
						"62": [293.67, "D", 0, 4], 			// D4
						"63": [311.13, "E", -1, 4], 		// D#4 / Eb4
						"64": [329.63, "E", 0, 4], 			// E4
						"65": [349.23, "F", 0, 4], 			// F4
						"66": [369.99, "F", 1, 4], 			// F#4 / Gb4
						"67": [392.00, "G", 0, 4], 			// G4
						"68": [415.30, "A", -1, 4], 		// G#4 / Ab4
						"69": [440.00, "A", 0, 4], 			// A4
						"70": [466.16, "B", -1, 4], 		// A#4 / Bb4
						"71": [493.88, "B", 0, 4], 			// B4
					// octave 5
						"72": [523.25, "C", 0, 5], 			// C5
						"73": [554.37, "C", 1, 5], 			// C#5 / Db5
						"74": [587.33, "D", 0, 5], 			// D5
						"75": [622.25, "E", -1, 5], 		// D#5 / Eb5
						"76": [659.25, "E", 0, 5], 			// E5
						"77": [698.46, "F", 0, 5], 			// F5
						"78": [739.99, "F", 1, 5], 			// F#5 / Gb5
						"79": [783.99, "G", 0, 5], 			// G5
						"80": [830.61, "A", -1, 5], 		// G#5 / Ab5
						"81": [880.00, "A", 0, 5], 			// A5
						"82": [932.33, "B", -1, 5], 		// A#5 / Bb5
						"83": [987.77, "B", 0, 5], 			// B5
					// octave 6
						"84": [1046.50, "C", 0, 6], 		// C6
						"85": [1108.73, "C", 1, 6], 		// C#6 / Db6
						"86": [1174.66, "D", 0, 6], 		// D6
						"87": [1244.51, "E", -1, 6], 		// D#6 / Eb6
						"88": [1318.51, "E", 0, 6], 		// E6
						"89": [1396.91, "F", 0, 6], 		// F6
						"90": [1479.98, "F", 1, 6], 		// F#6 / Gb6
						"91": [1567.98, "G", 0, 6], 		// G6
						"92": [1661.22, "A", -1, 6], 		// G#6 / Ab6
						"93": [1760.00, "A", 0, 6], 		// A6
						"94": [1864.66, "B", -1, 6], 		// A#6 / Bb6
						"95": [1975.53, "B", 0, 6], 		// B6
					// octave 7
						"96": [2093.00, "C", 0, 7], 		// C7
						"97": [2217.46, "C", 1, 7], 		// C#7 / Db7
						"98": [2349.32, "D", 0, 7], 		// D7
						"99": [2489.02, "E", -1, 7], 		// D#7 / Eb7
						"100":[2637.02, "E", 0, 7], 		// E7
						"101":[2793.83, "F", 0, 7], 		// F7
						"102":[2959.96, "F", 1, 7], 		// F#7 / Gb7
						"103":[3135.96, "G", 0, 7], 		// G7
						"104":[3322.44, "A", -1, 7], 		// G#7 / Ab7
						"105":[3520.00, "A", 0, 7], 		// A7
						"106":[3729.31, "B", -1, 7], 		// A#7 / Bb7
						"107":[3951.07, "B", 0, 7], 		// B7
					// octave 8
						"108":[4186.01, "C", 0, 8], 		// C8
						"109":[4434.92, "C", 1, 8], 		// C#8 / Db8
						"110":[4698.63, "D", 0, 8], 		// D8
						"111":[4978.03, "E", -1, 8], 		// D#8 / Eb8
						"112":[5274.04, "E", 0, 8], 		// E8
						"113":[5587.65, "F", 0, 8], 		// F8
						"114":[5919.91, "F", 1, 8], 		// F#8 / Gb8
						"115":[6271.93, "G", 0, 8], 		// G8
						"116":[6644.88, "A", -1, 8], 		// G#8 / Ab8
						"117":[7040.00, "A", 0, 8], 		// A8
						"118":[7458.62, "B", -1, 8], 		// A#8 / Bb8
						"119":[7902.13, "B", 0, 8], 		// B8
					// octave 9
						"120":[8372.02, "C", 0, 9], 		// C9
						"121":[8869.84, "C", 1, 9], 		// C#9 / Db9
						"122":[9397.26, "D", 0, 9], 		// D9
						"123":[9956.06, "E", -1, 9], 		// D#9 / Eb9
						"124":[10548.08, "E", 0, 9], 		// E9
						"125":[11175.30, "F", 0, 9], 		// F9
						"126":[11839.82, "F", 1, 9], 		// F#9 / Gb9
						"127":[12543.86, "G", 0, 9], 		// G9
						"128":[13289.76, "A", -1, 9], 		// G#9 / Ab9
						"129":[14080.00, "A", 0, 9], 		// A9
						"130":[14917.24, "B", -1, 9], 		// A#9 / Bb9
						"131":[15804.26, "B", 0, 9], 		// B9
					// octave 10
						"132":[16744.04, "C", 0, 10] 		// C10
				}
			}
		}
		window.MUSICXML_J = MUSICXML_J

/*** helpers ***/
	/* getSynthType */
		MUSICXML_J.getSynthType = getSynthType
		function getSynthType(name) {
			try {
				// find in list
					name = name.trim().toLowerCase()
					for (let i in MUSICXML_J.constants.instrumentToSynth) {
						if (name.includes(i)) {
							return MUSICXML_J.constants.instrumentToSynth[i]
						}
					}

				// default
					return MUSICXML_J.constants.defaultSynth
			} catch (error) {console.log(error)}
		}

	/* getDynamicType */
		MUSICXML_J.getDynamicType = getDynamicType
		function getDynamicType(dynamicAmount) {
			try {
				// loop through all
					for (let i in MUSICXML_J.constants.dynamicToNumber) {
						if (dynamicAmount > MUSICXML_J.constants.dynamicToNumber[i]) {
							return i
						}
					}

				// still here
					return "n"
			} catch (error) {console.log(error)}
		}

	/* getClefType */
		MUSICXML_J.getClefType = getClefType
		function getClefType(midiProgram) {
			try {
				// treble
					if ([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,41,45,46,47,49,50,51,52,53,54,55,56,57,60,61,62,63,64,65,66,67,68,69,70,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,89,90,91,92,93,94,95,96,105,106,107,108,109,110,111,112,113,114,115].includes(midiProgram)) {
						return `<sign>G</sign><line>2</line>`
					}

				// alto
					if ([42].includes(midiProgram)) {
						return `<sign>C</sign><line>3</line>`
					}

				// bass
					if ([33,34,35,36,37,38,39,40,43,44,48,58,59,71,88].includes(midiProgram)) {
						return `<sign>F</sign><line>4</line>`
					}

				// percussion
					if ([97,98,99,100,101,102,103,104,116,117,118,119,120,121,122,123,124,125,126,127,128].includes(midiProgram)) {
						return `<sign>percussion</sign>`
					}

				// other
					return `<sign>none</sign>`

			} catch (error) {console.log(error)}
		}

	/* getTimeType */
		MUSICXML_J.getTimeType = getTimeType
		function getTimeType(ticks) {
			try {
				if (ticks % 24 == 0) {
					return `<beats>` + (ticks / 24) + `</beats><beat-type>4</beat-type>`
				}
				if (ticks % 12 == 0) {
					return `<beats>` + (ticks / 12) + `</beats><beat-type>8</beat-type>`
				}
				if (ticks % 6 == 0) {
					return `<beats>` + (ticks / 6) + `</beats><beat-type>16</beat-type>`
				}
				return `<beats>` + (ticks / 6) + `</beats><beat-type>16</beat-type>`
			} catch (error) {console.log(error)}
		}

	/* getDurationType */
		MUSICXML_J.getDurationType = getDurationType
		function getDurationType(ticks) {
			try {
				if (ticks >= 96) {
					return [`<duration>whole</duration><type>whole</type>`, ticks - 96]
				}
				if (ticks >= 72) {
					return [`<duration>72</duration><type>half</type><dot/>`, ticks - 72]
				}
				if (ticks >= 48) {
					return [`<duration>48</duration><type>half</type>`, ticks - 48]
				}
				if (ticks >= 36) {
					return [`<duration>36</duration><type>quarter</type><dot/>`, ticks - 36]
				}
				if (ticks >= 32) {
					return [`<duration>32</duration><type>half</type><time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes></time-modification>`, ticks - 32]
				}
				if (ticks >= 24) {
					return [`<duration>24</duration><type>quarter</type>`, ticks - 24]
				}
				if (ticks >= 18) {
					return [`<duration>18</duration><type>eighth</type><dot/>`, ticks - 18]
				}
				if (ticks >= 16) {
					return [`<duration>16</duration><type>quarter</type><time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes></time-modification>`, ticks - 16]
				}
				if (ticks >= 12) {
					return [`<duration>12</duration><type>eighth</type>`, ticks - 12]
				}
				if (ticks >= 9) {
					return [`<duration>9</duration><type>sixteenth</type><dot/>`, ticks - 9]
				}
				if (ticks >= 8) {
					return [`<duration>8</duration><type>eighth</type><time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes></time-modification>`, ticks - 8]
				}
				if (ticks >= 6) {
					return [`<duration>6</duration><type>sixteenth</type>`, ticks - 6]
				}
				if (ticks >= 4) {
					return [`<duration>4</duration><type>sixteenth</type><time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes></time-modification>`, ticks - 4]
				}
				if (ticks >= 3) {
					return [`<duration>3</duration><type>thirtysecond</type>`, ticks - 3]
				}
				return ['', 0]
			} catch (error) {console.log(error)}
		}

	/* getPitchType */
		MUSICXML_J.getPitchType = getPitchType
		function getPitchType(midi) {
			try {
				const noteInfo = MUSICXML_J.constants.notes[String(midi)]
				return [`<pitch><step>` + noteInfo[1] + `</step>` + (noteInfo[2] ? (`<alter>` + noteInfo[2] + `</alter>`) : "") + `<octave>` + noteInfo[3] + `</octave></pitch>`,
						noteInfo[2] > 0 ? `<accidental>sharp</accidental>` : noteInfo[2] < 0 ? `<accidental>flat</accidental>` : ""]
			} catch (error) {console.log(error)}
		}

/*** parse ***/
	/* parseMusicXML */
		MUSICXML_J.parseMusicXML = parseMusicXML
		function parseMusicXML(musicXML) {
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
						const partJSON = parseMusicXMLPart(musicXML, partsXML[p])
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

	/* parseMusicXMLPart */
		MUSICXML_J.parseMusicXMLPart = parseMusicXMLPart
		function parseMusicXMLPart(musicXML, partXML) {
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
						partJSON.instrument = (instrumentXML.querySelector("instrument-sound") || instrumentXML.querySelector("virtual-name") || instrumentXML.querySelector("instrument-name") || {}).innerHTML || MUSICXML_J.constants.defaultInstrument
						partJSON.midiChannel = Number((instrumentXML.querySelector("midi-channel") || {}).innerHTML || MUSICXML_J.constants.defaultMidiChannel)
						partJSON.midiProgram = Number((instrumentXML.querySelector("midi-program") || {}).innerHTML)
						partJSON.synth = getSynthType(partJSON.name || partJSON.instrument)
						partJSON.staves = {}
						partJSON.currentTicksPerMeasure = 0
						partJSON.currentTies = {}
					}

				// measures
					const measuresXML = Array.from(partXML.querySelectorAll("part#" + partId + " > measure"))
					partJSON.staves["1"] = {}

				// loop through measures
					for (let m in measuresXML) {
						parseMusicXMLMeasure(partJSON, String(Number(m) + 1), measuresXML[m])
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

	/* parseMusicXMLMeasure */
		MUSICXML_J.parseMusicXMLMeasure = parseMusicXMLMeasure
		function parseMusicXMLMeasure(partJSON, measureNumber, measureXML) {
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
							const duration = Math.round(MUSICXML_J.constants.beatToTick[noteType] * (xmlNote.querySelector("time-modification") ? Number(xmlNote.querySelector("normal-notes").innerHTML) / Number(xmlNote.querySelector("actual-notes").innerHTML) : 1))
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
							const midi = MUSICXML_J.constants.noteNameToMidi[noteName + accidental + octave] || null
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
					const dynamicPhrases = Array.from(measureXML.querySelectorAll("dynamics")) || []
					const dynamicChange = dynamicDirections.length ? (Number(dynamicDirections[dynamicDirections.length - 1].getAttribute("dynamics")) / 100 || 0) : 
										dynamicPhrases.length ? dynamicToNumber[dynamicPhrases[dynamicPhrases.length - 1].innerHTML.toLowerCase().replace(/^[a-z]/g, "")] : null

				// tempo change
					const tempoDirection = measureXML.querySelector("sound[tempo]") || null
					const tempoChange = tempoDirection ? Number(tempoDirection.getAttribute("tempo")) || 0 : null

				// time signature change?
					const xmlAttributes = measureXML.querySelector("attributes") || null
					if (xmlAttributes && xmlAttributes.querySelector("beat-type") && xmlAttributes.querySelector("beats")) {
						const currentBeatType = String(xmlAttributes.querySelector("beat-type").innerHTML)
						const currentBeatsPerMeasure = Number(xmlAttributes.querySelector("beats").innerHTML)
						partJSON.currentTicksPerMeasure = MUSICXML_J.constants.beatToTick[MUSICXML_J.constants.numberToBeat[currentBeatType]] * currentBeatsPerMeasure
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

/*** build ***/
	/* buildMusicXML */
		MUSICXML_J.buildMusicXML = buildMusicXML
		function buildMusicXML(musicJSON) {
			try {
				// build as string
					let musicXML = `<?xml version="1.0" encoding="UTF-8"?>\n`
						musicXML += `<score-partwise version="4.0">\n`

				// info
					musicXML += buildMusicXMLInfo(musicJSON)

				// parts
					const partsList = []
					const parts = []
					let partIndex = 0
					for (let i in musicJSON.parts) {
						partIndex++
						const output = buildMusicXMLPart(musicJSON, i, partIndex)
							partsList.push(output[0])
							parts.push(output[1])
					}

				// concatenate
					musicXML += `\t<part-list>\n` + partsList.join("") + `\t</part-list>\n`
					musicXML += parts.join("")
					musicXML += `</score-partwise>`

				// return	
					return musicXML
			} catch (error) {console.log(error)}
		}

	/* buildMusicXMLInfo */
		MUSICXML_J.buildMusicXMLInfo = buildMusicXMLInfo
		function buildMusicXMLInfo(musicJSON) {
			try {
				// empty to start
					let infoXML = ""

				// title
					infoXML += `\t<movement-title>` + musicJSON.title + `</movement-title>\n`

				// identification
					const now = new Date()
					const year = now.getFullYear()
					const month = now.getMonth() + 1
					const day = now.getDate()
					infoXML += `\t<identification>\n\t\t<creator type="composer">` + musicJSON.composer + `</creator>\n\t\t<encoding>\n\t\t\t<software>CoChords by James Mayr</software>\n\t\t\t<encoding-date>` + (year + "-" + ("0" + month).slice(-2) + "-" + ("0" + day).slice(-2)) + `</encoding-date>\n\t\t</encoding>\n\t</identification>\n`

				// display info
					infoXML += `\t<credit page="1">\n\t\t<credit-type>title</credit-type>\n\t\t<credit-words default-x="50" default-y="1250" font-size="24" justify="left" valign="top">` + musicJSON.title + `</credit-words>\n\t</credit>\n`
					infoXML += `\t<credit page="1">\n\t\t<credit-type>composer</credit-type>\n\t\t<credit-words default-x="950" default-y="1150" font-size="12" justify="right" valign="top">` + musicJSON.composer + `</credit-words>\n\t</credit>\n`

				// return
					return infoXML
			} catch (error) {console.log(error)}
		}

	/* buildMusicXMLPart */
		MUSICXML_J.buildMusicXMLPart = buildMusicXMLPart
		function buildMusicXMLPart(musicJSON, partId, partIndex) {
			try {
				// get part
					const partJSON = musicJSON.paPrts[partIndex]

				// parts list
					// start
						let partsListXML = `\t\t<score-part id="P` + partIndex + `">\n`

					// name
						partsListXML += `\t\t\t<part-name>` + partJSON.name + `</part-name>\n`
						partsListXML += `\t\t\t<part-name-display>\n\t\t\t\t<display-text>` + partJSON.name + `</display-text>\n\t\t\t</part-name-display>\n`
						partsListXML += `\t\t\t<part-abbreviation>` + (partJSON.abbreviation || partJSON.name.slice(0,3)) + `</part-abbreviation>\n`
						partsListXML += `\t\t\t<part-abbreviation-display>\n\t\t\t\t<display-text>` + (partJSON.abbreviation || partJSON.name.slice(0,3)) + `</display-text>\n\t\t\t</part-abbreviation-display>\n`

					// instrument
						partsListXML += `\t\t\t<score-instrument id="P` + partIndex + `-I` + partIndex + `">\n\t\t\t\t<instrument-name>` + (partJSON.instrument || MUSICXML_J.constants.midiToInstrument[partJSON.midiProgram]) + `</instrument-name>\n\t\t\t</score-instrument>\n`
						partsListXML += `\t\t\t<midi-device id="P` + partIndex + `-I` + partIndex + `"></midi-device>\n`
						partsListXML += `\t\t\t<midi-instrument id="P` + partIndex + `-I` + partIndex + `">\n\t\t\t\t<midi-channel>` + partJSON.midiChannel + `</midi-channel>\n\t\t\t\t<midi-program>` + partJSON.midiProgram + `</midi-program>\n\t\t\t\t<volume>80</volume>\n\t\t\t\t<pan>0</pan>\n\t\t\t</midi-instrument>\n`

					// end
						partsListXML += `\t\t</score-part>\n`

				// measures
					// start
						let partXML = `\t<part id="P` + partIndex + `">\n`

					// loop through
						const measures = []
						for (let s in partJSON.staves) { // only ever 1 staff in this app
							let currentTicksPerMeasure = 0
							for (let m in partJSON.staves[s]) {
								// measureJSON
									const measureJSON = partJSON.staves[s][m]

								// start
									let measureXML = `\t\t<measure number="` + m + `">\n`

								// attributes
									let divisionChange = (m == "1") ? `\t\t\t\t<divisions>24</divisions>\n` : "" // never changes
									let keyChange = (m == "1") ? `\t\t\t\t<key><fifths>0</fifths><mode>major</mode></key>\n` : "" // not deduced
									let clefChange = (m == "1") ? `\t\t\t\t<clef>` + getClefType(partJSON.midiProgram) + `</clef>\n` : "" // from midi program
									let timeChange = ""
									if (measureJSON.ticks !== currentTicksPerMeasure) {
										currentTicksPerMeasure = measureJSON.ticks
										timeChange = `\t\t\t\t<time>` + getTimeType(measureJSON.ticks) + `</time>\n`
									}

									if (divisionChange || keyChange || clefChange || timeChange) {
										measureXML += `\t\t\t<attributes>\n` + divisionChange + keyChange + timeChange + clefChange + `\t\t\t</attributes>\n`
									}

								// swing
									if (m == "1") {
										measureXML += partJSON.swing ?
										`\t\t\t<sound><swing><first>2</first><second>1</second><swing-style>Standard</swing-style></swing></sound>\n` : 
										`\t\t\t<sound><swing><straight/></swing></sound>\n`
									}

								// tempo
									if (measureJSON.tempo) {
										measureXML += `\t\t\t<direction directive="yes" placement="above">\n\t\t\t\t<direction-type>\n\t\t\t\t\t<words font-size="12">Tempo ` + measureJSON.tempo + `</words>\n\t\t\t\t</direction-type>\n\t\t\t\t<sound tempo="` + measureJSON.tempo + `"/>\n\t\t\t</direction>\n`
									}

								// dynamics
									if (measureJSON.dynamics) {
										measureXML += `\t\t\t<direction placement="below">\n\t\t\t\t<direction-type>\n\t\t\t\t\t<dynamics><` + getDynamicType(measureJSON.dynamics) + `/></dynamics>\n\t\t\t\t</direction-type>\n\t\t\t\t<sound dynamics="` + (measureJSON.dynamics * 100) + `"/>\n\t\t\t</direction>\n`
									}

								// rest measure
									if (!measureJSON.notes || !Object.keys(measureJSON.notes).length) {
										measureXML += `\t\t\t<note>\n\t\t\t\t<rest measure="yes"/>\n\t\t\t\t<duration>` + currentTicksPerMeasure + `</duration>\n\t\t\t</note>\n`
									}

								// go through ticks of measure
									if (measureJSON.notes) {
										// reset counts
											let currentTickOfMeasure = 0
											let currentRestDuration = 0
										
										// increment ticks
											while (currentTickOfMeasure < currentTicksPerMeasure) {
												// notes
													const notesJSON = measureJSON.notes[String(currentTickOfMeasure)]
													if (notesJSON) {
														// preceding rests
															while (currentRestDuration) {
																const output = getDurationType(currentRestDuration)
																	const durationXML = output[0]
																	currentRestDuration = output[1]
																measureXML += `\t\t\t<note>\n\t\t\t\t<rest/>\n\t\t\t\t` + durationXML + `\n\t\t\t</note>\n`
															}

														// reset info
															let longestNoteDuration = 0
															let noteInChord = -1

														// loop through pitches of chord
															for (let pitch in notesJSON) {
																// increment for each pitch to identify chords
																	noteInChord++

																// get pitch info
																	const output = getPitchType(pitch)
																		const pitchXML = output[0]
																		const accidentalXML = output[1]

																// get duration info
																	let currentNoteDuration = notesJSON[pitch]

																// held over?
																	let heldFromPreviousMeasure = false
																	if (typeof currentNoteDuration == "string" && currentNoteDuration.slice(0,1) == "_") {
																		heldFromPreviousMeasure = true
																		currentNoteDuration = Number(currentNoteDuration.slice(1))
																	}

																// hold over?
																	let holdIntoNextMeasure = false
																	if (currentTickOfMeasure + currentNoteDuration > currentTicksPerMeasure) {
																		// cap it
																			let remainingDuration = currentTicksPerMeasure - currentTickOfMeasure
																			let leftoverDuration = currentNoteDuration - remainingDuration
																			currentNoteDuration = remainingDuration

																		// push to next measure
																			let nextMeasureJSON = partJSON.staves[s][String(Number(m) + 1)]
																			if (nextMeasureJSON) {
																				if (!nextMeasureJSON.notes) {
																					nextMeasureJSON.notes = {}
																				}
																				if (!nextMeasureJSON.notes["0"]) {
																					nextMeasureJSON.notes["0"] = {}
																				}
																				nextMeasureJSON.notes["0"][pitch] = "_" + leftoverDuration
																				holdIntoNextMeasure = true
																			}
																	}
																	longestNoteDuration = Math.max(longestNoteDuration, currentNoteDuration)

																// build note
																	let wasHeld = false
																	while (currentNoteDuration) {
																		const output = getDurationType(currentNoteDuration)
																			const durationXML = output[0]
																			currentNoteDuration = output[1]
																		measureXML += `\t\t\t<note>\n` + 
																			(noteInChord ? `\t\t\t\t<chord/>\n` : "") +
																			(pitchXML ? (`\t\t\t\t` + pitchXML + `\n`) : "") +
																			(durationXML ? (`\t\t\t\t` + durationXML + `\n`) : "") + 
																			(accidentalXML ? (`\t\t\t\t` + accidentalXML + `\n`) : "") + 
																			(wasHeld || heldFromPreviousMeasure || currentNoteDuration || holdIntoNextMeasure ? (`\t\t\t\t<notations>` + (wasHeld || heldFromPreviousMeasure ? `<tied type="stop"/>` : "") + (currentNoteDuration || holdIntoNextMeasure ? `<tied type="start"/>` : "") + `</notations>\n`) : "") +
																			`\t\t\t</note>\n`
																		wasHeld = currentNoteDuration ? true : false
																	}
															}

														// jump to end of longest note
															currentTickOfMeasure += longestNoteDuration
													}

												// rests
													else {
														currentRestDuration++
														currentTickOfMeasure++
													}
											}

										// remaining rests
											while (currentRestDuration) {
												const output = getDurationType(currentRestDuration)
													const durationXML = output[0]
													currentRestDuration = output[1]
												measureXML += `\t\t\t<note>\n\t\t\t\t<rest/>\n\t\t\t\t` + durationXML + `\n\t\t\t</note>\n`
											}
									}

								// end
									measureXML += `\t\t</measure>\n`
									measures.push(measureXML)
							}
						}

					// concatenate
						partXML += measures.join("")
							
					// end
						partXML += `\t</part>\n`

				// return both
					return [partsListXML, partXML]
			} catch (error) {console.log(error)}
		}
