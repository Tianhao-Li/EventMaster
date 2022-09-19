/* step1: ()() closure */
(function() {
	/* step2: variables for writng the js code*/
	var user_id = '1111';
	var user_fullname = 'Tianhao Li';
	var lng = -122.08;
	var lat = 37.38;
	
	/* step3: main function(entrance) */
	init();
	
	/* step4: define init function */
	function init() {
		// Register event listeners
		$('login­btn').addEventListener('click', login);
		$('nearby-btn').addEventListener('click', loadNearbyItems); // (event, function(i.e. the operation to do))
		$('fav-btn').addEventListener('click', loadFavoriteItems);
		$('recommend-btn').addEventListener('click', loadRecommendedItems);
		
		var welcomeMsg = $('welcome-msg');
        welcomeMsg.innerHTML = 'Welcome, ' + user_fullname;
        
        validateSession();
        
        // step 7
        initGeoLocation();
	}
	
	/* step5: create $ function */
	/**
	 * A helper function that creates a DOM element <tag options...>
	 */
	function $(tag, options) {
		// If we give options, then we will create the element
		if (!options) {
			return document.getElementById(tag);
		}
		var element = document.createElement(tag);

		for (var option in options) {
			if (options.hasOwnProperty(option)) {
				element[option] = options[option];
			}
		}
		return element;
	}
	
	/**
	* Session 
	*/
	function validateSession() {
		// The request parameters
		var url = './login';
		var req = JSON.stringify({});
		
		// display loading message 
		showLoadingMessage('Validating session...');
		
		// make AJAX call 
		ajax('GET', url, req,
		// session is still valid 
		function(res) {
			var result = JSON.parse(res);
			
			if (result.status === 'OK') { 
				onSessionValid(result);
			} 
		});
	}
	
	function onSessionValid(result) { 
		user_id = result.user_id;
		user_fullname = result.name;

		var loginForm = $('login­form'); 
		var itemNav = $('item­nav');
		var itemList = $('item­list');
		var avatar = $('avatar');
		var welcomeMsg = $('welcome­msg'); var logoutBtn = $('logout­link');

		welcomeMsg.innerHTML = 'Welcome, ' + user_fullname;

		showElement(itemNav); 
		showElement(itemList); 
		showElement(avatar); 
		showElement(welcomeMsg); 
		showElement(logoutBtn, 'inline­block'); 
		hideElement(loginForm);

		initGeoLocation();
	}
	
	function onSessionInvalid() {
		var loginForm = $('login­form');
		var itemNav = $('item­nav');
		var itemList = $('item­list');
		var avatar = $('avatar');
		var welcomeMsg = $('welcome­msg'); 
		var logoutBtn = $('logout­link');
		
		hideElement(itemNav); 
		hideElement(itemList); 
		hideElement(avatar); 
		hideElement(logoutBtn); 
		hideElement(welcomeMsg);

		showElement(loginForm);
	}
	
	/* step6: create AJAX helper function */
	/**
	 * @param method - GET|POST|PUT|DELETE
	 * @param url - API end point
	 * @param callback - This the successful callback
	 * @param errorHandler - This is the failed callback
	 */
	function ajax(method, url, data, callback, errorHandler) { // The last 2 para are callbacks
		// Create an AJAX call object
		var xhr = new XMLHttpRequest();
		
		// Use "open" method
		xhr.open(method, url, true); // "true" for asynchronous
		
		// Below, the "onload" and "onerror" are just defining actions to do when triggered
		// Error detection for response
		xhr.onload = function() {
			if (xhr.status === 200) { // check status code: normal
				callback(xhr.responseText);
			} else if (xhr.status === 403) {
				onSessionInvalid();
			} else { // There's error
				errorHandler();
			}
		};
		
		// Error detection for request
		xhr.onerror = function() {
			console.error("The request couldn't be completed.");
			errorHandler();
		};
		
		// Process the data to send
		if (data === null) {
			xhr.send();
		} else {
			// If there's data in request, add header and specify the type of data as JSON
			xhr.setRequestHeader("Content-Type",
					"application/json;charset=utf-8");
			xhr.send(data);
		}
	}
	
	/** step 7: initGeoLocation function **/
	function initGeoLocation() {
		if (navigator.geolocation) { // browser navigator's geolocation attribute
			// step 8
			navigator.geolocation.getCurrentPosition(onPositionUpdated, // update location (if success)
					onLoadPositionFailed, {
						maximumAge : 60000
					});
			// Above is callback, we'll see the below message first
			showLoadingMessage('Retrieving your location...');
		} else {
			// step 9
			onLoadPositionFailed();
		}
	}
	
	/** step 8: onPositionUpdated function **/
	function onPositionUpdated(position) {
		lat = position.coords.latitude;
		lng = position.coords.longitude;

		// step 11: load nearby items info
		loadNearbyItems();
	}
	
	/** step 9: onLoadPositionFailed function **/
	function onLoadPositionFailed() {
		console.warn('navigator.geolocation is not available');
		
		//step 10: can't get info from navigator, switch to get info from IP
		getLocationFromIP();
	}
	
	/** step 10: getLocationFromIP function **/
	function getLocationFromIP() {
		// Get location from http://ipinfo.io/json
		var url = 'http://ipinfo.io/json'
		var req = null;
		ajax('GET', url, req, function(res) {
			var result = JSON.parse(res);
			if ('loc' in result) {
				var loc = result.loc.split(',');
				lat = loc[0];
				lng = loc[1];
			} else {
				console.warn('Getting location by IP failed.');
			}
			// step 11
			loadNearbyItems();
		});
	}

	/** step 11: loadNearbyItems function **/
	/**
	 * API #1 Load the nearby items API end point: [GET]
	 * /Jupiter/search?user_id=1111&lat=37.38&lon=-122.08
	 */
	function loadNearbyItems() { // just getting data, has not displayed yet
		console.log('loadNearbyItems');
		// step 12
		activeBtn('nearby-btn');

		// The request parameters
		var url = './search';
		var params = 'user_id=' + user_id + '&lat=' + lat + '&lon=' + lng;
		var req = JSON.stringify({}); // turn into object

		// step 13   
		// display loading message
		showLoadingMessage('Loading nearby items...');

		// make AJAX call
		ajax('GET', url + '?' + params, req,
		// successful callback
		function(res) {
			var items = JSON.parse(res);
			if (!items || items.length === 0) {
				// step 14
				showWarningMessage('No nearby item.');
			} else {
				// step 16
				listItems(items);
			}
		},
		// failed callback
		function() {
			// step 15
			showErrorMessage('Cannot load nearby items.');
		});
	}
	
	// ­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­----------
	// Login
	// ­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­----------
	function login() {
		var username = $('username').value;
		var password = $('password').value;
		password = md5(username + md5(password));
		
		// The request parameters 
		var url = './login';
		var req = JSON.stringify({
			user_id : username, 
			password : password,
		});
		
		ajax('POST', url, req, 
		// successful callback 
		function(res) {
			var result = JSON.parse(res);

			// successfully logged in
			if (result.status === 'OK') {
				onSessionValid(result);
			}
		},
		// error callback
		function() {
			showLoginError();
		});
	}
	
	function showLoginError() {
		$('login­error').innerHTML = 'Invalid username or password';
	}
	
	function clearLoginError() {
		$('login­error').innerHTML = '';
	}
	
	
	/** step 12: activeBtn function **/
	/**
	 * A helper function that makes a navigation button active
	 * 
	 * @param btnId - The id of the navigation button
	 */
	function activeBtn(btnId) {
		var btns = document.getElementsByClassName('main-nav-btn');

		// deactivate all navigation buttons
		for (var i = 0; i < btns.length; i++) { // we will get all the buttons, so we need a loop
			btns[i].className = btns[i].className.replace(/\bactive\b/, '');
		}

		// active the one that has id = btnId
		var btn = $(btnId);
		btn.className += ' active'; // modifying class name to mark active
	}
	
	/** step 13: showLoadingMessage function **/
	function showLoadingMessage(msg) {
		var itemList = $('item-list');
		itemList.innerHTML = '<p class="notice"><i class="fa fa-spinner fa-spin"></i> '
				+ msg + '</p>';
	}
	
	/** step 14: showWarningMessage function **/
	function showWarningMessage(msg) {
		var itemList = $('item-list');
		itemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-triangle"></i> '
				+ msg + '</p>';
	}
	
	/** step15: showErrorMessage function **/
	function showErrorMessage(msg) {
		var itemList = $('item-list');
		itemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-circle"></i> '
				+ msg + '</p>';
	}
	
	/** step16: listItems function **/
	/**
	 * @param items - An array of item JSON objects
	 */
	function listItems(items) {
		var itemList = $('item-list');
		itemList.innerHTML = ''; // Clear the current results
		
		// For each item, add to this itemList variable
		for (var i = 0; i < items.length; i++) {
			// step 17
			addItem(itemList, items[i]);
		}
	}
	
	/** step17: addItem function **/
	/**
	 * Add item to the list
	 * @param itemList - The <ul id="item-list"> tag
	 * @param item - The item data (JSON object)
	 */
	function addItem(itemList, item) {
		var item_id = item.item_id;

		// create the <li> tag and specify the id and class attributes
		var li = $('li', {
			id : 'item-' + item_id,
			className : 'item'
		});

		// set the data attribute
		li.dataset.item_id = item_id;
		li.dataset.favorite = item.favorite;

		// item image
		if (item.image_url) { // if we have img
			li.appendChild($('img', {
				src : item.image_url
			}));
		} else { // default img
			li.appendChild($('img', {
				src : 'https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png'
			}))
		}
		// section
		var section = $('div', {});

		// title
		var title = $('a', {
			href : item.url,
			target : '_blank',
			className : 'item-name'
		});
		title.innerHTML = item.name;
		section.appendChild(title);

		// category
		var category = $('p', {
			className : 'item-category'
		});
		category.innerHTML = 'Category: ' + item.categories.join(', ');
		section.appendChild(category);
		
		// rating
		var stars = $('div', {
			className : 'stars'
		});
		// add each rating star
		for (var i = 0; i < item.rating; i++) {
			var star = $('i', {
				className : 'fa fa-star'
			});
			stars.appendChild(star);
		}

		if (('' + item.rating).match(/\.5$/)) {
			stars.appendChild($('i', {
				className : 'fa fa-star-half-o'
			}));
		}

		section.appendChild(stars);

		li.appendChild(section);

		// address
		var address = $('p', {
			className : 'item-address'
		});

		address.innerHTML = item.address.replace(/,/g, '<br/>').replace(/\"/g,
				'');
		li.appendChild(address);

		// favorite link
		var favLink = $('p', {
			// function options
			className : 'fav-link'
		});

		favLink.onclick = function() {
			changeFavoriteItem(item_id);
		};

		favLink.appendChild($('i', {
			id : 'fav-icon-' + item_id,
			className : item.favorite ? 'fa fa-heart' : 'fa fa-heart-o'
		}));

		li.appendChild(favLink);

		itemList.appendChild(li);
	}
	
	/**
     * API #2 Load favorite (or visited) items API end point: [GET]
     * /Jupiter/history?user_id=1111
     */
    function loadFavoriteItems() {
        activeBtn('fav-btn');

        // The request parameters
        var url = './history';
        var params = 'user_id=' + user_id;
        var req = JSON.stringify({});

        // display loading message
        showLoadingMessage('Loading favorite items...');

        // make AJAX call
        ajax('GET', url + '?' + params, req, function(res) {
            var items = JSON.parse(res);
            if (!items || items.length === 0) {
                showWarningMessage('No favorite item.');
            } else {
                listItems(items);
            }
        }, function() {
            showErrorMessage('Cannot load favorite items.');
        });
    }

    /**
     * API #3 Load recommended items API end point: [GET]
     * /Dashi/recommendation?user_id=1111
     */
    function loadRecommendedItems() {
        activeBtn('recommend-btn');

        // The request parameters
        var url = './recommendation';
        var params = 'user_id=' + user_id + '&lat=' + lat + '&lon=' + lng;

        var req = JSON.stringify({});

        // display loading message
        showLoadingMessage('Loading recommended items...');

        // make AJAX call
        ajax(
            'GET',
            url + '?' + params,
            req,
            // successful callback
            function(res) {
                var items = JSON.parse(res);
                if (!items || items.length === 0) {
                    showWarningMessage('No recommended item. Make sure you have favorites.');
                } else {
                    listItems(items);
                }
            },
            // failed callback
            function() {
                showErrorMessage('Cannot load recommended items.');
            });
    }

    /**
     * API #4 Toggle favorite (or visited) items
     * 
     * @param item_id -
     *            The item business id
     * 
     * API end point: [POST]/[DELETE] /Jupiter/history request json data: {
     * user_id: 1111, visited: [a_list_of_business_ids] }
     */
    function changeFavoriteItem(item_id) {
        // Check whether this item has been visited or not
        var li = $('item-' + item_id);
        var favIcon = $('fav-icon-' + item_id);
        var favorite = li.dataset.favorite !== 'true';

        // The request parameters
        var url = './history';
        var req = JSON.stringify({
            user_id: user_id,
            favorite: [item_id]
        });
        var method = favorite ? 'POST' : 'DELETE';

        ajax(method, url, req,
            // successful callback
            function(res) {
                var result = JSON.parse(res);
                if (result.result === 'SUCCESS') {
                    li.dataset.favorite = favorite;
                    favIcon.className = favorite ? 'fa fa-heart' : 'fa fa-heart-o';
                }
            });
    }
	
}) ()