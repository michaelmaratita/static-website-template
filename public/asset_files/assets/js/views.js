window.onload = function() {
    fetch('INSERT_YOUR_API_URL', {
		method: 'POST',
		headers: {
			'Content-Type' : 'application/json'
		},
		body: JSON.stringify("")
	}).then(res => res.json())
        .then(data => {
            const viewer_count = data.views
            const viewers = document.getElementById('viewers');
            viewers.innerHTML = `${viewer_count}`
        });
};