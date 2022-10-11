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

	/* elements */
		const ELEMENTS = {
			body: document.body,
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
									const musicJSON = MUSICXML_J.parseMusicXML(musicXML)

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
					if (storageData.music && storageData.music.length) {
						for (let i in storageData.music) {
							createMusicButton(storageData.music[i])
						}

						ELEMENTS.previousMusicNone.setAttribute("invisible", true)
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
						buttonElement.title = "load previous music"
						buttonElement.addEventListener(TRIGGERS.click, selectMusic)
					ELEMENTS.previousMusicSection.appendChild(buttonElement)

					const deleteButton = document.createElement("button")
						deleteButton.className = "previous-music-delete"
						deleteButton.value = musicInfo.id
						deleteButton.innerHTML = "&times;"
						deleteButton.title = "remove from history"
						deleteButton.addEventListener(TRIGGERS.click, forgetMusic)
					ELEMENTS.previousMusicSection.appendChild(deleteButton)
			} catch (error) {console.log(error)}
		}

	/* forgetMusic */
		function forgetMusic(event) {
			try {
				// get id
					const musicId = event.target.value

				// remove buttons
					event.target.remove()
					ELEMENTS.previousMusicSection.querySelector(".previous-music-button[value='" + musicId + "']").remove()

				// no more?
					if (!Array.from(ELEMENTS.previousMusicSection.querySelectorAll(".previous-music-button")).length) {
						ELEMENTS.previousMusicNone.removeAttribute("invisible")
					}

				// localstorage
					if (!window.localStorage || !window.localStorage.cochords) {
						return
					}
					const storageData = JSON.parse(window.localStorage.cochords)

				// remove and replace
					if (storageData.music) {
						storageData.music = storageData.music.filter(function(item) {
							return item.id !== musicId
						})
					}

					window.localStorage.cochords = JSON.stringify(storageData)
			} catch (error) {console.log(error)}
		}
