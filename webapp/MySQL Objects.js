Restaurants [
	{
		id: restId (int)
		filters: [Lunch, Dinner] (array to string)
		rating: 2 (int)
		tip: "blah blah" (str)
		activated: 0 (bit)
		changed: 0 (bit)
	}
]

Categories [
	{
		id: autoInc (int)
		rest_id: restId (int) <= linked to Restaurant.id
		name: "Entrees" (str)
		tip: "blah blah" (str)
	}
]

Items [
	{
		id: itemId (int)
		cat_id: (int) <= linked to Categories.id
		rating: 2 (int)
		options: [optionId, optionId] (array to string)
		activated: 0 (bit)
	}
]

Calls Needed
options [
		dressingType  {
			Ranch
		}
]

katz: "[19026423: [32911722], 32911739: [32911743, 32911748], 19035436: [19035437, 19035438], 19035440: [19035441, 19035442, 19035443]]"




options: [choiceId1, choiceId2, ...]


optionCatID []
	0: choiceID
	1: choiceID
}


category -> item -> option Category -> choice