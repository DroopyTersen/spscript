"use strict";

//USAGE
// //Create the overall visibility manager
// var visibilityManager = new VisibilityManager();
// //create a checkbox toggle
// var checkboxToggle = visibilityManager.createCheckboxToggle("YesNoTest", ["Poster", "Backdrop"]);

// //The radio and dropdown toggle both take in a 'choices' array
// var choices = [
// 	{ value: "Enter Choice #1", childFields: ["ChoiceTestMultiple", "ChoiceTestSingle"] },
// 	{ value: "Enter Choice #2", childFields: ["LookupSingle", "LookupMultiple"] },
// 	{ value: "Enter Choice #3", childFields: ["PersonTest"] }
// ];
// var radioToggle = visibilityManager.createRadioToggle("ChoiceTestRadio", choices);
// var dropdownToggle = visibilityManager.createDropdownToggle("ChoiceTestSingle", choices);
(function (global) {
	//Constructor
	var VisibilityManager = function VisibilityManager() {
		this.columnLabels = document.querySelectorAll(".ms-standardheader");
	};

	VisibilityManager.prototype.findRow = function (fieldName) {
		for (var i = 0; i < this.columnLabels.length; i++) {
			var innerText = this.columnLabels[i].innerText || this.columnLabels[i].textContent;
			innerText = innerText.replace("*", "").trim();
			if (innerText === fieldName) {
				return this.columnLabels[i].parentNode.parentNode;
			}
		}
	};

	VisibilityManager.prototype.hideField = function (fieldName) {
		this.findRow(fieldName).style.display = "none";
	};

	VisibilityManager.prototype.toggleVisiblity = function (fields, shouldShow) {
		for (var i = 0; i < fields.length; i++) {
			this.findRow(fields[i]).style.display = shouldShow ? "table-row" : "none";
		}
	};

	VisibilityManager.prototype.createCheckboxToggle = function (checkboxName, childFields) {
		var self = this;
		var checkbox = self.findRow(checkboxName).querySelector("input[type='checkbox'");
		checkbox.onclick = function () {
			self.toggleVisiblity(childFields, checkbox.checked);
		};
		self.toggleVisiblity(childFields, checkbox.checked);
		return checkbox;
	};

	VisibilityManager.prototype.createDropdownToggle = function (dropdownName, choices) {
		var self = this;
		var dropdown = self.findRow(dropdownName).querySelector("select");
		var update = function update() {
			var value = dropdown.value;
			for (var i = 0; i < choices.length; i++) {
				self.toggleVisiblity(choices[i].childFields, value == choices[i].value);
			}
		};
		dropdown.onchange = update;
		update();
		return dropdown;
	};

	VisibilityManager.prototype.createRadioToggle = function (radio, choices) {
		var self = this;
		var radios = self.findRow(radio).querySelectorAll("input[type='radio']");
		var update = function update() {
			var value = "";
			for (var i = 0; i < radios.length; i++) {
				if (radios[i].checked) {
					value = radios[i].value;
				}
			}
			for (i = 0; i < choices.length; i++) {
				self.toggleVisiblity(choices[i].childFields, value == choices[i].value);
			}
		};
		for (var i = 0; i < radios.length; i++) {
			radios[i].onclick = update;
		}

		update();
		return radios;
	};

	//Manually implement String.trim() for IE8 (we'll need it to trim the label because IE likes to toss whitespace in there)
	if (!String.prototype.trim) {
		String.prototype.trim = function () {
			return this.replace(/^\s+|\s+$/gm, '');
		};
	}

	global.VisibilityManager = VisibilityManager;
})(window);
//# sourceMappingURL=index.js.map