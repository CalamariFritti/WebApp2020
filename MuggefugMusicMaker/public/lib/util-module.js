/**
 * @fileOverview  Defines a library of utility procedures/functions in the form of a modules
 * @author Gerd Wagner
 */
/**
 * Serialize a Date object as an ISO date string
 * @return  YYYY-MM-DD
 */
export function createIsoDateString( d) {
  return d.toISOString().substring(0,10);
}
// *************** D O M - Related ****************************************
/**
 * Create a Push Button
 * @param {string} txt [optional]
 * @return {object}
 */
function createPushButton( txt) {
  var pB = document.createElement("button");
  pB.type = "button";
  if (txt) pB.textContent = txt;
  return pB;
};
/**
 * Create a DOM option element
 *
 * @param {string} val
 * @param {string} txt
 * @param {string} classValues [optional]
 *
 * @return {object}
 */
function createOption( val, txt, classValues) {
  const el = document.createElement("option");
  el.value = val;
  el.text = txt;
  if (classValues) el.className = classValues;
  return el;
}
/**
 * Create a time element from a Date object
 *
 * @param {object} d
 * @return {object}
 */
export function createTimeElem( d) {
  const tmEl = document.createElement("time");
  tmEl.textContent = d.toLocaleDateString();
  tmEl.datetime = d.toISOString();
  return tmEl;
}
/**
 * Create a list element from an map of objects
 *
 * @param {object} et  An entity table
 * @param {string} displayProp  The object property to be displayed in the list
 * @return {object}
 */
export function createListFromMap( et, displayProp) {
  const listEl = document.createElement("ul");
  fillListFromMap( listEl, et, displayProp);
  return listEl;
}
/**
 * Fill a list element with items from an entity table
 *
 * @param {object} listEl  A list element
 * @param {object} et  An entity table
 * @param {string} displayProp  The object property to be displayed in the list
 */
function fillListFromMap( listEl, et, displayProp) {
  // delete old contents
  listEl.innerHTML = "";
  // create list items from object property values
  for (let key of Object.keys( et)) {
    let listItemEl = document.createElement("li");
    listItemEl.textContent = et[key][displayProp];
    listEl.appendChild( listItemEl);
  }
}
/**
 * Fill a select element with option elements created from a
 * map of objects
 *
 * @param {object} selectEl  A select(ion list) element
 * @param {object} selectionRange  A map of objects
 * @param {string} keyProp  The standard identifier property
 * @param {object} optPar [optional]  A record of optional parameter slots
 *                 including optPar.displayProp and optPar.selection
 */
export function fillSelectWithOptions( selectEl, selectionRange, keyProp, optPar) {
  // delete old contents
  selectEl.innerHTML = "";
  // create "no selection yet" entry
  if (!selectEl.multiple) {
    selectEl.add( createOption(""," --- "));
  }
  // create option elements from object property values
  for (let key of Object.keys( selectionRange)) {
    let obj = selectionRange[key];
    let displayProp = (optPar && optPar.displayProp) ? optPar.displayProp : keyProp;
    let optionEl = createOption( obj[keyProp], obj[displayProp]);
    // if invoked with a selection argument, flag the selected options
    if (selectEl.multiple && optPar && optPar.selection &&
        optPar.selection[keyProp]) {
      // flag the option element with this value as selected
      optionEl.selected = true;
    }
    selectEl.add( optionEl);
  }
}
// *************** Multiple Choice Widget ****************************************
/**
 * Create the contents of an Multiple Choice widget, which is a div containing
 * 1) a choice list (a list of chosen items), where each item has a delete button,
 * 2) a div containing a select element and an add button allowing to add a selected item
 *    to the association list
 *
 * @param {object} widgetContainerEl  The widget's container div
 * @param {object} selectionRange  An map of objects, which is used to
 *                 create the options of the select element
 * @param {object} selection  An map of objects, which is used to
 *                 fill the selection list
 * @param {string} keyProp  The standard identifier property of the range object type
 * @param {string} optPar [optional]  An optional record of optional parameter slots,
 *                 including "displayProp"
 */
export function createMultipleChoiceWidget( widgetContainerEl, selection, selectionRange,
    keyProp, displayProp, minCard) {
  const assocListEl = document.createElement("ul"),  // shows associated objects
      selectEl = document.createElement("select");
  var el=null;
  if (minCard === undefined) minCard = 0;  // default
  // delete old contents
  widgetContainerEl.innerHTML = "";
  // create association list items from property values of associated objects
  if (!displayProp) displayProp = keyProp;
  fillChoiceSet( assocListEl, selection, keyProp, displayProp);
  // event handler for removing an associated item from the association list
  assocListEl.addEventListener( 'click', function (e) {
    var listItemEl=null, listEl=null;
    if (e.target.tagName === "BUTTON") {  // delete/undo button
      listItemEl = e.target.parentNode;
      listEl = listItemEl.parentNode;
      if (listEl.children.length <= minCard) {
        alert("A book must have at least one author!");
        return;
      }
      if (listItemEl.classList.contains("removed")) {
        // undoing a previous removal
        listItemEl.classList.remove("removed");
        // change button text
        e.target.textContent = "✕";
      } else if (listItemEl.classList.contains("added")) {
        // removing an added item means moving it back to the selection range
        listItemEl.parentNode.removeChild( listItemEl);
        optionEl = createOption( listItemEl.getAttribute("data-value"),
            listItemEl.firstElementChild.textContent);
        selectEl.add( optionEl);
      } else {
        // removing an ordinary item
        listItemEl.classList.add("removed");
        // change button text
        e.target.textContent = "undo";
      }
    }
  });
  widgetContainerEl.appendChild( assocListEl);
  el = document.createElement("div");
  el.appendChild( selectEl);
  el.appendChild( createPushButton("add"));
  // event handler for adding an item from the selection list to the association list
  selectEl.parentNode.addEventListener( 'click', function (e) {
    const assocListEl = e.currentTarget.parentNode.firstElementChild,
        selectEl = e.currentTarget.firstElementChild;
    if (e.target.tagName === "BUTTON") {  // the add button
      if (selectEl.value) {
        addItemToChoiceSet( assocListEl, selectEl.value,
            selectEl.options[selectEl.selectedIndex].textContent, "added");
        selectEl.remove( selectEl.selectedIndex);
        selectEl.selectedIndex = 0;
      }
    }
  });
  widgetContainerEl.appendChild( el);
  // create select options from selectionRange minus selection
  fillMultipleChoiceWidgetWithOptions( selectEl, selectionRange, keyProp,
      {"displayProp": displayProp, "selection": selection});
}
/**
 * Fill the select element of an Multiple Choice Widget with option elements created
 * from the selectionRange minus an optional selection set specified in optPar
 *
 * @param {object} aa  An map of objects
 * @param {object} selList  A select(ion list) element
 * @param {string} keyProp  The standard identifier property
 * @param {object} optPar [optional]  An record of optional parameter slots
 *                 including optPar.displayProp and optPar.selection
 */
function fillMultipleChoiceWidgetWithOptions( selectEl, selectionRange, keyProp, optPar) {
  // delete old contents
  selectEl.innerHTML = "";
  // create "no selection yet" entry
  selectEl.add( createOption(""," --- "));
  // create option elements from object property values
  for (let key of Object.keys( selectionRange)) {
    // if invoked with a selection argument, only add options for objects
    // that are not yet selected
    if (!optPar || !optPar.selection || !optPar.selection[key]) {
      let obj = selectionRange[key];
      let displayProp = (optPar && optPar.displayProp) ? optPar.displayProp : keyProp;
      selectEl.add( createOption( obj[keyProp], obj[displayProp]));
    }
  }
}
/**
 * Fill a Choice Set element with items
 *
 * @param {object} listEl  A list element
 * @param {object} selection  An entity table for filling the Choice Set
 * @param {string} keyProp  The standard ID property of the entity table
 * @param {string} displayProp  A text property of the entity table
 */
function fillChoiceSet( listEl, selection, keyProp, displayProp) {
  // delete old contents
  listEl.innerHTML = "";
  // create list items from object property values
  for (let key of Object.keys( selection)) {
    let obj = selection[key];
    addItemToChoiceSet( listEl, obj[keyProp], obj[displayProp]);
  }
}
/**
 * Add an item to a Choice Set element
 *
 * @param {object} listEl  A list element
 * @param {string} stdId  A standard identifier of an object
 * @param {string} humanReadableId  A human-readable ID of the object
 */
function addItemToChoiceSet( listEl, stdId, humanReadableId, classValue) {
  var el=null;
  const listItemEl = document.createElement("li");
  listItemEl.setAttribute("data-value", stdId);
  el = document.createElement("span");
  el.textContent = humanReadableId;
  listItemEl.appendChild( el);
  el = createPushButton("✕");
  listItemEl.appendChild( el);
  if (classValue) listItemEl.classList.add( classValue);
  listEl.appendChild( listItemEl);
}
/**
 * Create a "clone" of an object that is an instance of a model class
 *
 * @param {object} obj
 */
export function cloneObject( obj) {
  const clone = Object.create( Object.getPrototypeOf(obj));
  for (let p of Object.keys( obj)) {
    let val = obj[p];
    if (typeof val === "number" ||
        typeof val === "string" ||
        typeof val === "boolean" ||
        val instanceof Date ||
        // typed object reference
        typeof val === "object" && !!val.constructor ||
        Array.isArray( val) &&  // list of data values
        !val.some( function (el) {
          return typeof el === "object";
        }) ||
        Array.isArray( val) &&  // list of typed object references
        val.every( function (el) {
          return (typeof el === "object" && !!el.constructor);
        })
    ) {
      if (Array.isArray( val)) clone[p] = val.slice(0);
      else clone[p] = val;
    }
    // else clone[p] = cloneObject(val);
  }
  return clone;
};
