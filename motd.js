"use strict";

var fs = require('fs');
var ftpClient = require('ftp');
var client = new ftpClient();

var root = "garrysmod/sound";


client.on('ready', ()=>{
	function listContentsAsHTML(e,i,a){
		let element = {
			name: e.name,
			type: e.type,
			path: `${e.path}/${e.name}`,
			ready: false
		};
		if(element.type === "d"){
			element.children = [];
			client.list(element.path, (err,list)=>{
				if(err){
					client.destroy();
					throw err;
				}
				element.children = list.map(e=>{e.path=element.path; return e;}).map(listContentsAsHTML);
			});
		}
		else if(e.type === "-"){
			element.ready = true;
		}
		return element;
	}

	console.log("ready");
	client.list(root,(err,list)=>{
		if(err){
			client.destroy();
			throw err;
		}
		var a = list.map(e=>{e.path=root; return e;}).map(listContentsAsHTML);
		client.end();
		function recursivePrintout(e){
			if(e.children){
				console.log(`\nname:${e.name},\n type:${e.type},\n path:${e.path},`);
				console.log("children:");
				e.children.forEach(recursivePrintout);
			}
			else{
				console.log(e)
			}
		}
		setTimeout(()=>{
			a.forEach(recursivePrintout)
			//var html = a.map(HTMLify).join('');
			
		}, 20000);
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


function HTMLify(e){
	if(e.type === 'd'){
		return `<li class='dir'>${e.name}/<ul>\n${e.map(HTMLify).join('')}</ul></li>\n`
	}
	return `<li class='file'>${e.name}</li>\n`;
}
