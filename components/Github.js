import React, { Component } from 'react';

class GithubApp extends Component{
	constructor(){
		//holds state for the search bar 
		super();
		//set default inputType to stars
		this.state = {
			searchInput : '',
			items : [],
			inputType:'stars',
			urlConstants :'access_token=29a5338387328a35b1badf89d1f3363130fcee85',
		}
	}

	updateState = (e) => {
		//update the state as the search bar changes.
		const {name,value} = e.target;
		this.setState({[name] : value});
	}
	
	handleSubmit = async (e) => {
		//calls the fetchApi function
		e.preventDefault();
		const {	searchInput,inputType,urlConstants } = this.state;	
		let url = await `https://api.github.com/search/repositories?q=org:${searchInput}&sort=${inputType}&per_page=10`;
		let fetchUrl = url+urlConstants
		let jsonData = await this.fetchApi(fetchUrl);
		//get top 10 results;
		let arr = await jsonData.items.slice(0,10);
		this.setState({items:arr});
	}

	getContributors = async () => {
		let obj = {}
		const { items,urlConstants } = this.state;
		//o(n log m) very slow if dataset is large;
		for(let i = 0; i < items.length; i++){
			//limit to 1000 results;
			let count = 0;
			let page = 1;
			while(page !== 10){
				let url = items[i].contributors_url + "?" + urlConstants + `&page=${page}&per_page=100`;
				let jsonData = await this.fetchApi(url);
				if(jsonData.length === 0){
					break;
				}
				count += jsonData.length;
				page++;
			}
			obj[count] = items[i].name;
		}
		let keys = Object.keys(obj);
		let sorted = keys.sort((a,b)=>a-b);
		let reverse = sorted.reverse();
		
	}

	inputFields = () => {
		let fields = ['stars','forks'];
		return fields.map(field => <input
			key = {field}
			type = 'button'
			name = 'inputType'
			value = {field}
			onClick = {this.updateState}
			/>
		)
	}

	searchBar = () =>{
		//returns a search bar
		return <div>
		 <input 
			type = 'text'
			value = {this.state.searchInput}
			name = 'searchInput'
			onChange = {this.updateState}
		/>
		<input type = 'submit' onClick = {this.handleSubmit} />
		</div>
	}	

	mapItems = () => {
		//maps the items from the api
		const {items} = this.state;
		return items.map((repo,i) => <div key = {repo.name}> {i+1} : {repo.name} </div>)
	}

	async fetchApi(url){
		//async function that returns the fetch result in json format 
		let result = await fetch(url);
		console.log(url);
		let jsonData = await result.json();
		return jsonData;
	}

	render(){
		const { length } = this.state.items;
		return<div>
			<h1> Enter organization name : </h1>
			<p> press submit to re-query </p>
			{this.searchBar()}
			{length > 0? this.inputFields():null}
			{length > 0? this.mapItems():null}
			<input type = 'button' value = 'contributors' onClick = {this.getContributors} />
		</div>
	}
}

export default GithubApp;
