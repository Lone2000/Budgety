// Modules are made to keep blocks of code in their own respected unit
// Each Modules will have private varibles, to keep other modules & Functions from overwriting these variables

// Data encapsulation  is the meaning of seperating private and public varibles, otherwise, known as API's for public view.


// Modules Pattern Js 

var budgetController = (function (){
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalincome){
        if(totalincome > 0) {
            this.percentage = Math.round((this.value / totalincome) * 100);
        } else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }

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

        deleteItem : function(type, ID) { 
            var ids, index;

            // Collect the ID of the Income//Expense and return back new Array with ID's
            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            // Use the ID to fetch the INDEX number to delete
            index = ids.indexOf(Number(ID));

            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }
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

        calculatePercentages : function(){
            // a = 10(10%), b = 20(20%)  , c = 50 (50%), income = 100;  
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages : function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;

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
        percentageLabel : '.budget__expenses--percentage',
        container : '.container',
        expencesPercentage : '.item__percentage',
        currentMonthLabel: '.budget__title--month'
    };

    var formatNumber  = function(num,type){
        var numSplit, int, dec;
        // + or - before the number
        // Decimal point to every number
        // Comma sepearting the thousands

        num = Math.abs(num);  // abs removes the sign of the number that comes in
        num = num.toFixed(2); // Puts two decimal number 

        numSplit = num.split('.'); // will be stored in array

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); // We use Sub String method because it doesnt output an array but the string itself, usefull for appending stuff to it.
        } 

        dec = numSplit[1];

        

        return  (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };

    var nodeListForEach =  function(nlist, callback){

        for (var i = 0; i < nlist.length; i++){
            callback(nlist[i], i);
        }

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

                html =  '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                
            } else if (type === 'exp') {

                element = DomStrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            }
            // Replace the Placeholder Text with some actual Data

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value,type));
            // Insert the HTML into the DOM 
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },


        deleteListitem: function(Selectorid){
            var element;
            element = document.getElementById(Selectorid);
            element.parentNode.removeChild(element);

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
            
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DomStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DomStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DomStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            
            if (obj.percentage > 0) {
                document.querySelector(DomStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DomStrings.percentageLabel).textContent = '---';
            }

        },

        displayPercentages : function(percentages){
            var fields = document.querySelectorAll(DomStrings.expencesPercentage);

            


            nodeListForEach(fields, function(current, index){
                if(percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';

                } else{
                    current.textContent = '---';
                }

            });
            

        },

        displayMonth : function()   {
            var now, Months, curYear, curMonth ;

            now = new Date();
            
            curYear = now.getFullYear();

            Months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'Auguest', 'Septemeber', 'October', 'Novemeber', 'Decemeber'];

            curMonth = Months[now.getMonth()];
            
            
            document.querySelector(DomStrings.currentMonthLabel).textContent = curMonth + ' ' + curYear;


        },

        changedType : function(){

            var fields = document.querySelectorAll( DomStrings.inputType + ',' +
            DomStrings.inputDescription + ',' + 
            DomStrings.inputValue);

            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });
            
            document.querySelector(DomStrings.inputButton).classList.toggle('red');
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

        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        });

        // Delete Item
        document.querySelector(DOM.container).addEventListener('click', ctrldeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', uiCtrl.changedType);

    };

    var updateBudget = function(){
        // 1. Calculate the Budget
        
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the Budget on the UI
        uiCtrl.displayBudget(budget);

    };

    var updatepercentages = function(){

        //1. Calculate Percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        //3. Update the UI with the new Percentage
        uiCtrl.displayPercentages(percentages);

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

            // 6. Calculate and Update percentages
            updatepercentages();

        }

    };


    var ctrldeleteItem = function(event) {
        var itemID,splitID,type,ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            // format of ID; inc-1  

            splitID = itemID.split('-');
            type = splitID[0];
            ID = splitID[1];

            // 1. Delete the Item from Data structure 
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete item from UI
            uiCtrl.deleteListitem(itemID);

            // 3. Update and show the new Budget
            updateBudget();

            // 4. Calculate and Update percentages
            updatepercentages();

        }

    };

    return {
        init: function(){
            uiCtrl.displayMonth();
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