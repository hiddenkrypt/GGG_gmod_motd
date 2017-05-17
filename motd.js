"use strict";

var fs = require('fs');
var ftpClient = require('ftp');
var client = new ftpClient();

var root = "garrysmod/sound/starfox";


client.on('ready', ()=>{
	function listContentsAsHTML(e,i,a){
		let element = {
			name: e.name,
			type: e.type,
			ready: false
		};
		if(e.type === "d"){
			element.children = [];
			//client.list(root+parents+name, )
		}
		else if(e.type === "-"){
			element.ready = true;
		}
		return element;
	}

	console.log("ready");
	client.list(root,(err,list)=>{
		console.log(list);
		if(err){
			client.destroy();
			throw err;
		}
		list.map(listContentsAsHTML).forEach(e=>console.log(e));
		client.end();
	});
	
});

console.log("Connecting");
client.connect({
	host: 		process.env.GGG_FTP_SERVER_IP,
	port: 		21,
	user: 		process.env.GGG_FTP_SERVER_USER,
	password: 	process.env.GGG_FTP_SERVER_PASS
});
console.log("finish");



function HTMLify(list){
	return `<li class='dir'>${e.name}\\<ul>\n${sublist.map(listContentsAsHTML).join('')}</ul></li>\n`
	return `<li class='file'>${e.name}</li>\n`;
}
