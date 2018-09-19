#JSON File Formatting
## Objects
* name
* planets
* {
	* x,y
	* radius
	* radiusSpan  //(0 if you don't want to randomize)
	* name
	* texture
	* isTextureRandom
	* displayWidth
	* displayHeight
* }
* moons
* {
	* orbit //name of the planet
	* name
	* texture
	* isTextureRandom
	* startPos //in radian 0 is straight right and rotate ccwly
	* isCCW
	* isCCWRandom
	* speed
	* isGolden
* }
* exits
* {
	* up
	* {
		* On //true or false; 
		* PlanetTexture
		* PlanetRadius
		* MoonTexture
		* isCCW
	* }
	* down
	* left
	* right
* }
## 