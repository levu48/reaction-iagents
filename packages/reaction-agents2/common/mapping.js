Agents.addMapping(function(str) {
	if (str == 'hi' || str == 'hello' || str == 'chao' || str == 'hi there') 
		return 'greet';
});

Agents.addMapping(function(str) {
	if (str == 'Santa Monica, CA' || str == 'Los Angeles, CA') 
		return 'Los Angeles, CA';
});

Agents.addMapping(function(str) {
	if (str == 'Garden Grove, CA' || str == 'Santa Ana, CA') 
		return 'Orange County, CA';
});

Agents.addMapping(function(str) {
	if (str == 'buy') 
		return 'buy';
});

Agents.addMapping(function(str) {
	if (str == 'sell') 
		return 'sell';
});

Agents.addMapping(function(str) {
	if (str == 'howdy') 
		return 'greet';
});

Agents.addMapping(function(str) {
	if (str == 'clothes' || str == 'shoes' || str == 'hat') 
		return 'fashion';
});

Agents.addMapping(function(str) {
	if (str == 'oil' || str == 'acrylic' || str == 'watercolor' || str == 'sculpture') 
		return 'fine arts';
});