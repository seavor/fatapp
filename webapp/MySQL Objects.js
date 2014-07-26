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
		name: "Entress" (str)
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