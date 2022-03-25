function Toaster(property) {

	if (!property) property = {}
	if (!property.corner) property.corner = "top_right";
	if (!property.delay) property.delay = 5000;
	if (!property.maxElem) property.maxElem = 10;

    // toaster container
	const toasterContainer = document.createElement("div");
    toasterContainer.id = "toasterContainer";
    toasterContainer.className = property.corner;
	document.body.appendChild(toasterContainer);

    // alerts container
	const countAlerts = document.getElementsByClassName("alerts");

    // toaster creation
	this.toasterCreate = (style, title, content) => {
		let alerts = document.createElement("div");
        alerts.className = "alerts";
        alerts.className += " alerts-" + style;

		if (!content) {
			alerts.innerHTML = `<h3>${title}</h3>`;
		} else {
			alerts.innerHTML = `<h3>${title}</h3><p>${content}</p>`;
		};

        toasterContainer.appendChild(alerts);
		setTimeout(() => alerts.classList.toggle("fadeOut"), property.delay - 300);
		setTimeout(() => toasterContainer.removeChild(alerts), property.delay);
	};

    // rendering of toaster
	this.render = (rendering) => {
		if (!rendering) rendering = {}
		const exceptionsParam = !rendering.style || ( rendering.style != 'info' && rendering.style != 'success' && rendering.style != 'danger' && rendering.style != 'warning');

		rendering.style = exceptionsParam ? 'info' : rendering.style;

		if (rendering.title) {
			rendering.title = rendering.title;
			rendering.content = rendering.content;
		}

		if (countAlerts.length < property.maxElem) {
			this.toasterCreate(rendering.style, rendering.title, rendering.content);
		};
	};
};
