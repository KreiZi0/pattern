// Storage Controller

const StorageCtrl = (function(){
	return {
		storeItem: function(item){
			let items;
			if (localStorage.getItem('items') === null){
				items = [];
				items.push(item);
				localStorage.setItem('items', JSON.stringify(items));

			} else {
				items = JSON.parse(localStorage.getItem('items'));
				items.push(item);
				localStorage.setItem('items', JSON.stringify(items));
			}
		},
		getItemsFromStorage: function(){
			let items;
			if(localStorage.getItem('items') === null){
				items = [];

			} else {
				items = JSON.parse(localStorage.getItem('items'));
			}
			return items;
		} 
	}
})();
// create later

// Item Controller
const ItemCtrl = (function(){
// Item Constructor
const Item = function(id, name, calories){
this.id = id
this.name = name
this.calories = calories
}

// Data Structure
const data = {
items: [
//{id: 0, name: 'Steak Dinner', calories: 1200},
//{id: 1, name: 'Cookie', calories: 400},
//{id: 2, name: 'Eggs', calories: 300}
],
total: 0
}


return {
getItems: function(){
return data.items
},
addItem: function(name,calories){
	let ID;
	if(data.items.length > 0){
		ID=data.items[data.items.length - 1].id + 1
		
	} else {
		ID = 0
	}
	calories = parseInt(calories);
	newItem = new Item(ID, name, calories);
	data.items.push(newItem);
	return newItem
},
getTotalCalories: function(){
	let total = 0;
	data.items.forEach(function(item) {
		total = total + item.calories;
		
	});
	data.total=total;
	console.log(data.total)
	return data.total;
},


logData: function(){
return data
}
}
})();


// UI Controller
const UICtrl = (function(){
	//UI Selector 
	const UISelectors = {
		itemList: '#item-list',
		itemNameInput: '#item-name',
		itemCaloriesInput: '#item-calories',
		addBtn: '.add-btn',
		totalCalories: '.total-calories'
	}
return {
populateItemList: function(items){
// create html content
let html = '';

// parse data and create list items html
items.forEach(function(item){
html += `<li class="collection-item" id="item-${item.id}">
<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
<a href="#" class="secondary-content">
<i class="edit item fa fa-pencil"></i>
</a>
</li>`;
});

// insert list items
document.querySelector("#item-list").innerHTML = html;
},

getSelectors: function(){
	return UISelectors;
},
getItemInput:function(){
	return {
		name:document.querySelector(UISelectors.itemNameInput).value,calories:document.querySelector(UISelectors.itemCaloriesInput).value

	}
},
addListItem: function(item){
	const li = document.createElement('li');
	li.className = 'collection-item';
	li.id = `item-${item.id}`;
	li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em> <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i> </a>`;
	
	document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)

},
clearInput: function(){
	document.querySelector(UISelectors.itemNameInput).value = '';
	document.querySelector(UISelectors.itemCaloriesInput).value = '';
},

showTotalCalories: function(totalCalories){
	document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
}

}
})();


// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
	//load event listeners
	const loadEventListeners = function(){
		//get UI selectors
		const UISelectors = UICtrl.getSelectors()
		// add item event 
		document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
		document.addEventListener('DOMContentLoaded', getItemsFromStorage)
	}
	// itemAddSubmit function
	const itemAddSubmit = function(event){
		const input=UICtrl.getItemInput()
		if(input.name !== '' && input.calories !== ''){
			const NewItem = ItemCtrl.addItem(input.name, input.calories)
			
			UICtrl.addListItem(newItem)

			const totalCalories = ItemCtrl.getTotalCalories();
			UICtrl.showTotalCalories(totalCalories);
			StorageCtrl.storeItem(newItem);
			UICtrl.clearInput();
		}

		event.preventDefault()
	}
	const getItemsFromStorage = function() {
		const items = StorageCtrl.getItemsFromStorage()
		items.forEach(function(item){
			ItemCtrl.addItem(item['name'], item['calories'])
		})
		const totalCalories = ItemCtrl.getTotalCalories();
		UICtrl.showTotalCalories(totalCalories);
		
		UICtrl.populateItemList(items)
	}
return {
init: function(){
console.log('Initializing App')
// fetch items from data structure
const items = ItemCtrl.getItems()
// popilate items list
UICtrl.populateItemList(items)
loadEventListeners()
}
}
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init()