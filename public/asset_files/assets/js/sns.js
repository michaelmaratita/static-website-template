const formEl = document.querySelector('form')

formEl.addEventListener('submit', event => {
	event.preventDefault();
	sendSNS();

    formEl.reset();
});

function sendSNS() {
	const formData = new FormData(formEl);
	const data = Object.fromEntries(formData);
	// console.log(data)
    fetch('INSERT_YOUR_API_URL', {
		method: 'POST',
		headers: {
			'Content-Type' : 'application/json'
		},
		body: JSON.stringify(data)
	}).then(res => res.json())
	// .then(data => console.log(data.statusCode))
    .then (data => {
		if (data.statusCode == 200) {
			Swal.fire({
			title: "Success!",
			text: "Message was successfully sent!",
			icon: "success"
			});
		}
	})
    .catch(error => console.log(error));
}