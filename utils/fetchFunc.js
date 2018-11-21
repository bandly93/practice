require('es6-promise').polyfill();
require('isomorphic-fetch');

export const sendData = (url) => {
	return fetch(url)
   	.then(res => res.json())
		.then(data =>{
			console.log(data);
		})
		.catch(err => {
			 console.error(err)
		});
}


