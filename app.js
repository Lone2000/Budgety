// Modules are made to keep blocks of code in their own respected unit
// Each Modules will have private varibles, to keep other modules & Functions from overwriting these variables

// Data encapsulation  is the meaning of seperating private and public varibles, otherwise, known as API's for public view.


// Modules Pattern Js 

var budgetController = (function (){
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum = cur.value + sum;
        });
        data.totals[type] = sum;
    };  

    // Data Structure of the Budget

    var data = {
        allItems: {
            exp : [],
            inc : []
        },
        totals: {
            exp : 0,
            inc : 0
        },
        budget: 0,
        percentage : -1
    };

    return {
        addItem: function(type, des, val){
            var newItem, ID;

            
            // Create New ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }


            // Create New Item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // Push it into our data Structure
            data.allItems[type].push(newItem);

            //Return the new Element
            return newItem;
        },

        calculateBudget: function(){

            // Calculate Total income and Expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            // Calculate the Budget: income - expenses

            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of Income that has been spent

            if (data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else {
                data.percentage = -1;
            }

        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            }
        },

        testing: function(){
            console.log(data);
        }
    };


})();



// UI CONTROLLER
var uiController = (function(){
    
    var DomStrings = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputButton : '.add__btn',
        incomeContainer : '.income__list',
        expensesContainer : '.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel : '.budget__income--value',
        expensesLabel : '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage'
    };

    return {
        getInput: function(){
            return {
                type : document.querySelector(DomStrings.inputType).value, // WIll be either inc or exp
                description : document.querySelector(DomStrings.inputDescription).value,
                value : parseFloat(document.querySelector(DomStrings.inputValue).value) 
            };
        },
        
        addListitem : function(obj, type){
            var html, newHtml, element;

            // Create HTML String with placeholder text
            if (type ==='inc') {

                element = DomStrings.incomeContainer;

                html =  '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                
            } else if (type === 'exp') {

                element = DomStrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            }
            // Replace the Placeholder Text with some actual Data

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            // Insert the HTML into the DOM 
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearfields: function(){
            var fields, fieldsArr;

            fields = document.querySelectorAll(DomStrings.inputDescription +', '+ DomStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);  //This will allow our QuerySelectorAll list to be converted over to an array for usage, by using slice. Slice Method(Array/list/etc) => Array Output.

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";

            });

            fieldsArr[0].focus(); //To Put Focus back to the Description
        },

        displayBudget : function(obj) {
            
            document.querySelector(DomStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DomStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DomStrings.expensesLabel).textContent = obj.totalExp;
            
            
            if (obj.percentage > 0) {
                document.querySelector(DomStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DomStrings.percentageLabel).textContent = '---';
            }

        },

        getDomstrings: function(){
            return DomStrings;
        }



    };



})();





// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, uiCtrl){

    var setupEventListeners = function() {

        var DOM = uiCtrl.getDomstrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                ctrlAddItem();
            }
        });

        // Delete Item
        document.querySelector

    };

    var updateBudget = function(){
        // 1. Calculate the Budget
        
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the Budget on the UI
        uiCtrl.displayBudget(budget);

    };

    var ctrlAddItem = function(){
        var input, newItem;

        // 1. Get the field input data
        input = uiCtrl.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            
            // 3. Add the new item to the UI
            uiCtrl.addListitem(newItem, input.type);
    
            // 4. Clear the Fields
            uiCtrl.clearfields();
    
            // 5. Calculate and Update Budget
            updateBudget();

        }

    };

    return {
        init: function(){
            console.log('Application Started');
            uiCtrl.displayBudget({
                budget: 0,
                totalInc : 0,
                totalExp : 0,
                percentage : -1
            });
            setupEventListeners();
        }
    };

})(budgetController, uiController);       


controller.init(); //Initialization Function