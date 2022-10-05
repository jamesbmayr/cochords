/*** globals ***/
	/* triggers */
		const TRIGGERS = {
			click: "click",
			submit: "submit"
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
			background: document.querySelector("#background"),
			logo: document.querySelector("#logo"),
			newMusicForm: document.querySelector("#new-music-form"),
			joinMusicForm: document.querySelector("#join-music-form"),
			musicIdInput: document.querySelector("#music-id-input"),
			nameInput: document.querySelector("#name-input")
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
		ELEMENTS.newMusicForm.addEventListener(TRIGGERS.submit, createMusic)
		function createMusic(event) {
			try {
				// name
					let name = (ELEMENTS.nameInput.value || "").trim()
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

	/* joinMusic */
		ELEMENTS.joinMusicForm.addEventListener(TRIGGERS.submit, joinMusic)
		function joinMusic(event) {
			try {
				// room id
					let musicId = ELEMENTS.musicIdInput.value || null
					if (!musicId || musicId.length !== CONSTANTS.musicIdLength || !isNumLet(musicId)) {
						showToast({success: false, message: "music id must be " + CONSTANTS.musicIdLength + " letters & numbers"})
						return
					}

				// name
					let name = (ELEMENTS.nameInput.value || "").trim()
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
