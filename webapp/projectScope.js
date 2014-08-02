/////////////////////////////////////////////////////////////////////
* PreDesign *
/////////////////////////////////////////////////////////////////////

	- Form Validation
		- EnterAddress
		- Options(checkbox, radio)
		- Checkout
		- Error variable settings
		$ Show "Send Me Food!" button once all fields are valid

	$ Restaurant Is delivering
		- (error if closed when they view review screen)

	$ Jays Choices
		- Preselect Check Buttons even if Modals never opened
		- Run Modal Selections based on storage object

	$ Set Filter Logic 
		- if Filter removes all Restaurants
		- if No Restaurants delivering to that address

	$ Show mini loaderwheel with an error P tag
		- if selected address returns out of range

	- Make sure everything displays absractly
		- (loads/parses from storage/persistent data)



/////////////////////////////////////////////////////////////////////
* PostDesign *
/////////////////////////////////////////////////////////////////////

	-  Error display system
		- form validation
		- bad returns from API calls

	- Accordion Menu Animation

	$ Item is Available
		- (!breakfast items at dinner)

	- Page Redirection Animation

	$ Filter Warning Messages






/////////////////////////////////////////////////////////////////////
* WAT Stage *
/////////////////////////////////////////////////////////////////////

	- Online Status

	- API Authentication




/////////////////////////////////////////////////////////////////////
* Version 2 *
/////////////////////////////////////////////////////////////////////

	- Users & Login











