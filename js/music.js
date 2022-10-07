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
			pingLoop: 1000 * 60
		}

	/* state */
		const STATE = {
			composerId: null,
			musicId: null
		}

	/* elements */
		const ELEMENTS = {
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
				// set state
					STATE.music = musicJSON

				// update localstorage
					updateStorage()

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
