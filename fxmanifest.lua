fx_version 'cerulean'
game 'gta5'

author 'IO'
description 'una bella interfaccia'
version '0.9.9'

lua54 'yes'

server_scripts{
    'server.lua',
	'hash.lua',
	'@oxmysql/lib/MySQL.lua',
} 

client_scripts{
	'client.lua',
	'hash.lua',
} 

ui_page 'html/guestPage.html'

files {
	
	'html/*',
	'html/Menu/*',
	'html/Ordina/*',
	'html/Prenota/*',
	'html/Main/*',
	'html/Dashboard/*',
	'html/Dashboard/Dipendenti/*',
	'html/Dashboard/Prenotazioni/*',
	'html/Dashboard/Ordini/*',
	'html/Dashboard/Profilo/*',
	'html/img/*',
	'html/flame-font/*',
	
}