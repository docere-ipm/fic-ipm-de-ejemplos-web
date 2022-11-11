breeds = fetch('https://dog.ceo/api/breeds/list/all')

const randomUrl = name => { return `https://dog.ceo/api/breed/${name}/images/random`; };


//
// Cargar la lista de razas
//
const ucfirst = s => { return s.charAt(0).toUpperCase() + s.slice(1); };

const seedAutocompleteData = data => {
    let out = '';
    for (const breed of Object.keys(data)) {
	out += `<option value="${ucfirst(breed)}"/>`;
    };
    datalist.innerHTML = out;
};


//
// Cargar una photo aleatoria
//
const loadRandomPhoto = _ => {
    let name = breedInput.value;
    name = name.replace(' - ', '/').toLowerCase().trim();
    url = randomUrl(name);
    feedback.classList.remove('error');
    feedback.classList.add('loading');
    feedback.innerText = `Loading ${name} ...`;
    dogImage.src = 'i/snoopy.gif';
    fetch(url)
        .then(response => {
	    if (response.ok) {
		return response.json();
	    }
	    else {
		err = new Error(response.statusText);
		throw err;
	    }
	})
	.then(data => {
	    feedback.classList.remove('loading');
	    feedback.classList.remove('error');
	    dogImage.src = `${data.message}`;
	    let bits = data.message.split('/');
	    bits = bits[bits.length-2]
		.split('-')
		.map(b => ucfirst(b))
		.join(' - ');
	    dogInfo.innerText = bits;
	})
	.catch(err => {
	    dogImage.src = 'i/dribbble.webp';
	    feedback.classList.remove('loading');
	    feedback.classList.add('error');
	    feedback.innerText = err.message;
	});
};


//
// A partir de aquí, el código no se puede ejecutar hasta que este creado el árbol DOM.
//
const form = document.querySelector('form');
const breedInput = document.querySelector('#breed');
const datalist = document.querySelector('#allBreeds');
const reloadButton = document.querySelector('main button');
const dogInfo = document.querySelector('main article h2');
const dogImage = document.querySelector('main article img');
const feedback = document.querySelector('main article p.feedback');

// TODO: manejar errores
breeds
    .then(response => response.json())
    .then(data => { seedAutocompleteData(data.message); });

breedInput.addEventListener('change', loadRandomPhoto);
reloadButton.addEventListener('click', loadRandomPhoto);
form.addEventListener('submit', e => { loadRandomPhoto(); e.preventDefault(); });
