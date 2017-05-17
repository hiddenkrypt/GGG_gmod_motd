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
			var html = a.map(HTMLify).join('');
			console.log("writing to file");
			fs.writeFile("motd.html", HTMLMain+html, (err)=>{ 
				if(err){ throw err; }
				console.log("write complete");
			});
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
		return `<li class='dir'><span class='dirExpand'>${e.name}</span>/<ul>\n${e.children.map(HTMLify).join('')}</ul></li>\n`
	}
	return `<li class='file'>${e.name}</li>\n`;
}


var HTMLMain = `<html>
	<head>
		<script>
			var soundtoggle = false;
			window.onload= function(){
				document.getElementById("soundListToggle").onclick = function(){
					if(soundtoggle){
						document.getElementById("soundListToggle").value = "Show Sound List";
						document.getElementById("soundList").style.display = "none";
					} else{
						document.getElementById("soundListToggle").value = "Hide Sound List";
						document.getElementById("soundList").style.display = "block";
					}
					soundtoggle = !soundtoggle;
				}
				document.getElementById("howToToggle").onclick = function(){
					if(soundtoggle){
						document.getElementById("howToToggle").value = "Show How To Sounds";
						document.getElementById("howTo").style.display = "none";
					} else{
						document.getElementById("howToToggle").value = "Hide How To Sounds";
						document.getElementById("howTo").style.display = "block";
					}
					soundtoggle = !soundtoggle;
				}
			}
			window.onload = ()=>{
				var dirs = document.getElementsByClassName("dir");
				[].forEach.call(dirs, dir=>{
					var e = dir.getElementsByClassName("dirCollapse")[0];
					e.addEventListener("click", ()=>{
						console.log("CLICKED!");
						if(e.classList.contains('dirCollapse')){
							e.classList.remove('dirCollapse');
							e.classList.add('dirExpand');
							dir.getElementsByTagName('ul')[0].style.display = "none";
						}
						else if(e.classList.contains('dirExpand')){
							e.classList.remove('dirExpand');
							e.classList.add('dirCollapse');
							dir.getElementsByTagName('ul')[0].style.display = "block";
						}
					});
				});
			};
		</script>
		<style>
			pre{ color:a10000; font-weight:bold;}
			h2{text-align:center;}
			h3{text-align:center;}
			a{color:#005682;}a:visited{color:#000056;}
			body{
				text-align: center;
				background-color:rgba(32,32,32,.5);
				color:#000000;
				font-size: 14px;
				font-family: Tahoma;
			}
			.announce{
				color:#de0020;
				font-weight:bold;
				font-size:1.3em;
			}
			.brett{
				color:#416600;
				font-family:courier;
				font-weight:bold;
				font-size:1.2em;
			}
			.ravt{
				color:#008141;
				font-family:courier;
				font-weight:bold;
				font-size:1.2em;
			}
			#howTo{
				width:75%;
				margin-left:auto;
				margin-right:auto;
				display:none
			}
			
			#rules{
				margin-left:20%;
			}
			#admins{
				text-align:center;
			}
			#ggg{
				font-size: 3em;
				font-family: impact;
				width: 100%;
				color:#696969;
			}
			#motdContainer{
				display: inline-block;
				text-align: left;
				border-width: 1em;
				border-style: solid;
				border-color: #c9d6e4;
				background-color: #ededed;
				padding: 2em;
				margin-top: 1em;
			}
			#soundList{
				margin-left:1em;
				text-align:left;
				/*display:none;*/
				list-style: none;
			}
			.new{
				background-color:#aaffaa;
				border:1px solid black;
			}
			.dirExpand::before{
				content:"+ ";
				cursor:pointer;
			}
			.dirCollapse::before{
				content:"- ";
				
			}
			.dirCollapse{cursor: pointer;}
			.dirExpand{cursor: pointer;}
		</style>
	</head>
	<body>
		<div id="motdContainer">
			<div id="ggg">
				Gentlemen's Gaming Group
			</div>
			<div>
				This Server uses the following gamemodes:<br>
				Trouble in Terrorist Town, Murder, Prop Hunt, Stop It Slender, Cops & Runners, Suicide Barrels and Cinema.<br>
			</div>
			<div>
				<h2>-Rules-</h2>
				<ol id="rules">
					<li>NO FUN ALLOWED</li>
					<li>NO SHENANIGANS</li>
					<li>I WILL PISTOL WHIP THE NEXT GUY WHO SAYS SHENANIGANS</li>
				</ol>
			</div>
			<div>
				<h2>- The Admins -</h2>
				<div id="admins">
					<span class='mike'>Roboto</span>,
					<span class='mek'>Mekkanos</span>,
					<span class="brett">Xenguin</span>,
					<span class='ken'>Choseken</span>,
					<span class="marc">Twintail Fox</span>,
					<span class="ravt">Rav-T(HiddenKrypt)</span>
				</div>
				<span class="announce">HEY ADMINS! get your name styled the way you want it! Just tell Rav-T!</span>
			</div>
			<div>
				<h2>- Links -</h2>
				<h3>
					<a href="http://tinyurl.com/gentsdonate">Paypal Donation Link</a><br>
				</h3>
			</div>
			<div>
			<h2>- Protips -</h2>
				<ul id="hints">
					<li>Say "!Mapvote" to bring up a mapvote menu! </li>
					<li>Say "!motd" to bring this motd back!</li>
					<li>Say "!menu" to check out the ulx menu options!</li>
					<li>Press 'f3' for custom skins, props, toys, and other things!</li>
					<li>Shoot the traitors to make them dead!</li>
				</ul>
			</div>
			<div>
				<h2>- Sounds -</h2>
				Click these buttons for more information:<br>
				<input type="button" value="How to Sounds" id="howToToggle">
				<input type="button" value="Show Sound List" id="soundListToggle"><br>
				<div id="howTo">
					<h3>Playing</h3>
					In order to into sounds, you need to be able to use the Dev console. it may need to be enabled:
					<br><img src="">
					<br>When in game, press tilde (this key: '~') to bring up the console.
					<br>The command to play a sound is 
					<pre>ulx playsound [filename]</pre>
					where [filename] is the sound you want to play. For example, 
					<pre>ulx playsound simpsons/obey.mp3</pre>
					will play the simpsons obey file. Once you have typed in the folder name and the slash,<br>
					the console should help you by giving you a list of files in that folder. Use the arrow <br>
					keys to select one quickly. The Tab key will immediately select the top listed item. When <br>
					you type, the list will automatically reduce to only files that start with what you have <br>
					typed. So, to play the file "oney/virginia.mp3", one can type the following: 
					<pre>ulx p[TAB] oney/v[TAB]</pre>
					and the command will be autocompleted for you to the full "ulx playsound oney/virginia.mp3" 
					<h3>Binding</h3>
					Binding allows you to set an input that runs a command in the console.<br>
					It works like so:
					<pre>bind [input] [command]</pre>
					Where [input] is the key or mouse button you wish to bind to<br>
					and [command] is the desired command. Note, the command may<br>
					need to be put in quotes if it's more than one word.<br>
					<a href="https://developer.valvesoftware.com/wiki/Bind">Valve sample list of keys</a>
					<h4>Sample Binds</h4>
					<pre>bind k kill</pre> 
					Makes the 'k' key a suicide button.
					<pre>bind p stopsound</pre>
					When 'p' is pressed, stop all playing sounds.
					<pre>bind kp_0 "ulx playsound weapons/pingu/nootnoot2.wav"</pre> 
					Pressing zero on the keypad plays the pengu gun sound effect. 
				</div>
<ul id="soundList">`;