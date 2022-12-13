'use strict';

const config = {

    "home": "", // IGNORAR
	"auto_update": false, // AINDA NÃO TESTADO | SE O CLIENTE DEVERÁ SER ATUALIZADO AUTOMATICAMENTE OU NÃO
 
	"modos": {
		"youtuber": false, // ABRE EM TELA CHEIA E ADICIONA ZOOMS PERSONALIZADOS (❤ NOODLES PICANTE 🧡💗)
		"dev": false // HABILITA FERRAMENTA WEB DE DESENVOLVEDOR
	},

	"zoom": {
		"mais": 1.3, // ZOOM + (padrão: 1.3 = 130%)
		"menos": 0.7 // ZOOM - (padrão: 0.7 = 70%)
	},

	"CPPSs": [
		{
			"nome": "CPPS 1",
			"url": "https://cpps-url.tld"
		},
		{
			"nome": "CPPS 2",
			"url": "https://cpps-url.tld"
		},
		{
			"nome": "CPPS 3",
			"url": "https://cpps-url.tld"
		},
		{
			"nome": "CPPS 4",
			"url": "https://cpps-url.tld"
		},
		{
			"nome": "CPPS 5",
			"url": "https://cpps-url.tld"
		},
		{
			"nome": "CPPS 6",
			"url": "https://cpps-url.tld"
		},
		{
			"nome": "CPPS 7",
			"url": "https://cpps-url.tld"
		},
		{
			"nome": "CPPS 8",
			"url": "https://cpps-url.tld"
		}
/* VOCÊ PODE ADICIONAR MAIS CPPS'S COPIANDO O ANTERIOR E INSERINDO UMA "," AO FINAL DO ANTERIOR
EXEMPLO:
		{
			"nome": "CPPS 8",
			"url": "https://cpps-url.tld"
		},
		{
			"nome": "CPPS 9",
			"url": "https://cpps-url.tld"
		}
		*/
	]

}

module.exports = config;