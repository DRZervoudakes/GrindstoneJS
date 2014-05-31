/* MouseableEl
 *
 * Converts the assigned element to a new "Mouseable" object
 * 
 * Hovering will add the class "over" to these elements
 * Clicking/holding will add the class "down" to these elements
 *
 * Parameters:
 * -element (single selector, not an array)
 *
 * Requires:
 * -Core.js
 * -Classes.js
 */
	
	MouseableEl = function(element){
		if (testParam(element)){
			if (typeof element === "string"){
				var convertEl = El.getDOM(element); // Supports single selectors only: if applying to multiple elements, suggest adding each item to an array and running through a for loop
				El.addClass(convertEl,"mouseable");
				if (El.hasClass(convertEl,"mouseable")){
					convertEl.onmouseover = function(){
						El.addClass(this,"over");
					};
					convertEl.onmouseout = function(){
						El.removeClass(this,"down"); // Tricky: must include this here or things can get buggy...
						El.removeClass(this,"over");
					};
					convertEl.onmousedown = function(){
						El.addClass(this,"down");
					};
					convertEl.onmouseup = function(){
						El.removeClass(this,"down");
					};
					if ("createTouch" in document){
						convertEl.ontouchstart = function(){
							El.addClass(this,"over");
							El.addClass(this,"down");
						};
						convertEl.ontouchend = function(){
							El.removeClass(this,"over");
							El.removeClass(this,"down");
						};
					}
				}
				return convertEl;
			} else {
				throw new Error("Type of selector must be a string for MouseableEl.");
			}
		} else {
			throw new Error("Cannot convert undefined to MouseableEl.");
		}
	};
	
	// Ignore class "over" on touch-enabled devices to remove "sticky" hover state bugs
 
	/*if ("createTouch" in document){
		try {
			var pattern = /.over\b/,
			sheet, rule, selectors, newSelector,
			selectorAdded, newRule, i, j, k;
			for (i = 0; i < document.styleSheets.length; i++){
				sheet = document.styleSheets[i];
				for (j = sheet.cssRules.length - 1; j >= 0; j--){
					rule = sheet.cssRules[j];
					if (rule.type !== CSSRule.STYLE_RULE || !pattern.test(rule.selectorText)){
						continue;
					}
					selectors = rule.selectorText.split(",");
					newSelector = "";
					selectorAdded = false;
					// Iterate over the selectors and test them against the pattern
					for (k = 0; k < selectors.length; k++){
						// Add string to the new selector if it didn't match
						if (pattern.test(selectors[k])){
							continue;
						}
						if (!selectorAdded){
							newSelector += selectors[k];
							selectorAdded = true;
						} else {
							newSelector += ", " + selectors[k];
						}
					}
					// Remove the rule, and add the new one if we've got something added to the new selector
					if (selectorAdded){
						newRule = rule.cssText.replace(/([^{]*)?/, newSelector + " ");
						sheet.deleteRule(j);
						sheet.insertRule(newRule,j);
					} else {
						sheet.deleteRule(j);
					}
				}
			}
		} catch(e){}
	}*/