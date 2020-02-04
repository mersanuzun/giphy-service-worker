const giphyApiKey = '****';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).then((reg) => {
      console.log('Registration succeeded.');
    }).catch((error) => {
      console.error('Registration failed with ', error);
    });
}

(async function run() {
    const loadingSpinner = document.getElementById('loader');

    const endpoint = `https://api.giphy.com/v1/gifs/trending?api_key=${giphyApiKey}&limit=10&rating=G`;
    const response = await axios.get(endpoint);

    loadingSpinner.style.display = 'none';

    const giphyWrapper = document.getElementsByClassName('giphy-wrapper')[0];

    response.data.data.forEach(giphy => {
        const div = document.createElement('div');
        const img = document.createElement('img');

        div.className = 'giphy'

        img.src = giphy.images.downsized_medium.url;

        div.appendChild(img)
        giphyWrapper.appendChild(div);
    });
})()