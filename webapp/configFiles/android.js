{
	"homeURL": "http://jay.craftinc.co/cardiello/",
	"navigation": {
		"hideOnPageBackButton": true,
		"hideBackButtonOnMatch": [
			"{baseURL}/Json#livetiles"
		],
		"pageLoadingPartial": "/template/partials/page-loading.html"
	},
	"errors": {
	    "showAlertOnError": false,
		"alertMessage": "Sorry, but there was an error. It has been logged. Please contact us if the issue continues.",
		"redirectToErrorPage": false,
		"errorPageURL": "error-example.html"
	},
	"logging": {
		"enabled": true,
		"level": "log",
		"disableWithoutDebugger": false,
		"hideTagDisplay": true,
		"ignoreTags": [
			"winjs"
		],
		"logErrorsForIgnoredTags": true,
		"overrideConsoleMethods": true,
		"disableConsoleLog": false,
		"fileLog": {
			"enabled": true,
			"level": "info",
			"filename": "logs\\wat-docs_%D.log",
			"format": "%L on Line %l of %f\r\n%D %T: %M (%t)",
			"maxLogFiles": 7
		}
	},
	"share": {
		"enabled": true,
		"title": "WAT Documentation",
		"url": "{currentURL}",
		"screenshot": true,
		"message": "Check out the Web Application Template for Windows Store apps {url}, and get the app {appUrl}"
	},	
	"offline": {
		"enabled": true,
		"message": "It looks like you are offline. Please reconnect to use this application.",
		"useSuperCache": false,
		"addIndexedDBSupport": false,
		"imagesGuardBand": true
	},
	"customScript": {
		"scriptFiles": [
			"injection-script-example.js"
		]
	},
	"appBar": {
		"enabled": true,
		"makeSticky": false,
		"buttons": [
			{
				"label": "Settings",
				"icon": "edit",
				"action": "settings"
			}
		]
	},
	"navBar": {
		"enabled": true,
		"maxRows": 2,
		"makeSticky": false,
		"buttons": [
			{
				"label": "Back",
				"icon": "back",
				"action": "back"
			},
			{
				"label": "home",
				"icon": "home",
				"action": "home"
			},
			{
				"label": "JSON Reference",
				"icon": "library",
				"action": "nested",
				"children": [
					{
						"label": "navbar",
						"icon": "link",
						"action": "http://wat-docs.azurewebsites.net/Json#navigationbar"
					},
					{
						"label": "appbar",
						"icon": "link",
						"action": "http://wat-docs.azurewebsites.net/Json#applicationbar"
					},
					{
						"label": "share",
						"icon": "link",
						"action": "http://wat-docs.azurewebsites.net/Json#share"
					}
				]
			},
			{
				"label": "About WAT",
				"icon": "gotostart",
				"action": "http://wat-docs.azurewebsites.net/About"
			},
			{
				"label": "Getting Started",
				"icon": "play",
				"action": "http://wat-docs.azurewebsites.net/GetStarted"
			},
			{
				"label": "Support",
				"icon": "people",
				"action": "http://wat-docs.azurewebsites.net/Support"
			},
			{
				"label": "Log Message",
				"icon": "edit",
				"action": "eval",
				"data": "console.log('this was fired from within the webview:', window.location.href);"
			}
		]
	},
	"livetile": {
		"enabled": true,
		"periodicUpdate": 1,
		"enableQueue": true,
		"tilePollFeed": "http://wat-docs.azurewebsites.net/feed"
	},
	"notifications": {
		"enabled": false,
		"azureNotificationHub": {
			"enabled": true,
			"endpoint": "https://wat-demo.servicebus.windows.net/",
			"secret": "bPQTTVcagkyDfsz3M+OIhwJNxP+Jy2pXDfmUomSUVa4=",
			"path": "wat-demo",
			"tags": [
				"Live Tiles", "Tag 1", "Tag 2", "Tag 3"
			]
		}
	},
	"redirects": {
		"enabled": true,
		"enableCaptureWindowOpen": true,
		"refreshOnModalClose": true,
		"rules": [
			{
				"pattern": "http://getbootstrap.com?",
				"action": "showMessage",
				"message": "Sorry, but you can't access this feature in the native app, please visit us online at http://wat-docs.azurewebsites.net"
			},
			{
				"pattern": "*.microsoft.com*",
				"action": "showMessage",
				"message": "Redirecting you to the Microsoft website..."
			},
			{
				"pattern": "http://msdn.microsoft.com/*",
				"action": "popout"
			},
			{
				"pattern": "{baseURL}/Json#search",
				"action": "redirect",
				"url": "http://bing.com"
			},
			{
				"pattern": "*/drive_api/calculator/login",
				"action": "modal",
				"hideCloseButton": true,
				"closeOnMatch": "*/drive_api/calculator/complete_login"
			}
		]
	},
	"settings": {
		"enabled": true,
		"privacyUrl": "http://wat-docs.azurewebsites.net/Privacy",
		"items": [
			{
				"title": "Support",
				"page": "http://wat-docs.azurewebsites.net/Support",
				"loadInApp": true
			},
			{
				"title": "Codeplex Site",
				"page": "http://www.codeplex.com"
			}
		]
	},
	"styles": {
		"setViewport": true,
		"targetWidth": "",
		"targetHeight": "800px",
		"suppressTouchAction": false,
		"extendedSplashScreenBackground": "#464646",
		"hiddenElements":[
			"header", ".bs-header"
		],
		"backButton": {
			"borderColor": "#FFFFFF",
			"color": "#FFFFFF"
		},
		"wrapperCssFile": "/css/wrapper-styles.css",
		"customCssFile": "/css/injected-styles.css",
		"customCssString": "body {padding:0;font-size: 14pt;} .container{margin-left:120px; margin-right:0px;} .bs-header{height: 140px;padding-left:0px;} .bs-header h1{margin:0;margin-top:10px;} .bs-header h1{margin-right:0;} .bs-header p{display:none;}"
	},
	"header": {
			"enabled": true,
			"backgroundColor": "#7fba00",
			"logo": "/images/widelogo.scale-100.png",
			"title": {
				"enabled": true,
				"displayOnHomePage": true
			}
	},
	"search": {
		"enabled": true,
		"searchURL": "http://wat-docs.azurewebsites.net/search/?query={searchTerm}",
		"useOnScreenSearchBox": true,
		"onScreenSearchOptions": {
			"chooseSuggestionOnEnter": false,
	        "focusOnKeyboardInput": false,
	        "placeholderText": "What are you looking for?",
	        "searchHistoryDisabled": false
		}
	},
	"secondaryPin": {
        "enabled": true,
		"buttonText": "Pin It!",
		"squareImage": "/images/logo.scale-100.png",
		"wideImage": "/images/widelogo.scale-100.png"
	},
	"styleTheme": "dark"
}