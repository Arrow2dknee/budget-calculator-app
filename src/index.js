import uuidv4 from "uuid/v4";
// Implementing module pattern
// We incorporate module pattern and MVC-like architecture
// the explain of which is followed within the specific modules

/**
 * The budget controller module is a mockup of the model component of the MVC architecture
 * This module can also be called as the data module
 */
let budgetController = (function() {
  /**
   * Tasks of budgetController
   * 1. a data structure to hold income & expense information
   * 2. a data structure to hold total income & expense information
   * 3. create public methods to use income and expense data structure
   * 4.
   * 5.
   * 6. take care of percentage values (amount is how much % of the total budget)
   */

  let userData = {
    userExpenseAndIncome: {
      exp: [], // array of expense objects
      inc: [] // array of income objects
    },
    userTotalExpenseAndIncome: {
      totalExpenses: 0,
      totalIncome: 0
    },
    budget: 0,
    percentage: -1
  };

  const calculateTotalIncome = function() {
    let sum = 0;
    userData.userExpenseAndIncome.inc.forEach(function(incomeItem, index) {
      sum += incomeItem.amount;
    });
    userData.userTotalExpenseAndIncome.totalIncome = sum;
    return sum;
  };

  const calculateTotalExpenses = function() {
    let sum = 0;
    userData.userExpenseAndIncome.exp.forEach(function(expenseItem, index) {
      sum += expenseItem.amount;
    });
    userData.userTotalExpenseAndIncome.totalExpenses = sum;
  };

  class Expense {
    constructor(id, description, value) {
      this.ID = id;
      this.description = description;
      this.amount = value;
      this.percentage = -1;
    }
    calculatePercentage(totalIncome) {
      if (totalIncome > 0) {
        this.percentage = Math.round((this.amount / totalIncome) * 100);
      } else {
        this.percentage = -1;
      }
    }
    getPercentage() {
      return this.percentage;
    }
  }
  class Income {
    constructor(id, description, value) {
      this.ID = id;
      this.description = description;
      this.amount = value;
    }
  }

  return {
    // how do we expose the expense and income classes as public
    // we create individual methods for expense and income because, both
    // income and expense classes can have methods unique for their respective class

    publicAddExpense: function(id, desc, val) {
      const expenseObject = new Expense(id, desc, val);
      userData.userExpenseAndIncome.exp.push(expenseObject);
      return expenseObject;
    },
    publicAddIncome: function(id, desc, val) {
      const incomeObject = new Income(id, desc, val);
      userData.userExpenseAndIncome.inc.push(incomeObject);
      return incomeObject;
    },
    publicTotalIncome: function() {
      calculateTotalIncome();
      return userData.userTotalExpenseAndIncome.totalIncome;
    },
    publicTotalExpense: function() {
      calculateTotalExpenses();
      return userData.userTotalExpenseAndIncome.totalExpenses;
    },
    getBudget: function() {
      userData.budget =
        userData.userTotalExpenseAndIncome.totalIncome -
        userData.userTotalExpenseAndIncome.totalExpenses;
      return userData.budget;
    },
    getPercentage: function() {
      // method for calculating the % of total expense incurred against the budget
      if (userData.userTotalExpenseAndIncome.totalIncome > 0) {
        userData.percentage = Math.round(
          (userData.userTotalExpenseAndIncome.totalExpenses /
            userData.userTotalExpenseAndIncome.totalIncome) *
            100
        );
        return userData.percentage;
      } else {
        userData.percentage = -1;
      }
    },
    findRecord: function(type, id) {
      //findRecord('inc', '234-25-25');
      // this method is used for finding an income/expense object with the help of id provided
      // and returns the index found;
      let index = -1;

      if (type.includes("inc")) {
        index = userData.userExpenseAndIncome.inc.findIndex(
          (incItem, indx) => incItem.ID == id
        );
      } else if (type.includes("exp")) {
        index = userData.userExpenseAndIncome.exp.findIndex(
          (expItem, indx) => expItem.ID == id
        );
      }
      return index;
    },
    deleteRecord: function(type, indx) {
      // using index position of an element, we remove it from either income/expense array of objects
      if (type.includes("inc")) {
        userData.userExpenseAndIncome.inc.splice(indx, 1);
      } else if (type.includes("exp")) {
        userData.userExpenseAndIncome.exp.splice(indx, 1);
      }
    },
    getAllPercentages: function() {
      let totalIncome = calculateTotalIncome();
      userData.userExpenseAndIncome.exp.forEach(function(expItem) {
        expItem.calculatePercentage(totalIncome);
      });
      return userData.userExpenseAndIncome.exp.map(function(expItem) {
        return expItem.getPercentage();
      });
    }
  };
})();

/**
 * The UI controller module is a mockup of the view component of the MVC architecture
 * This module can also be called as the UI module
 */
let UIController = (function() {
  /**
   * Tasks of UIController
   * 1. fetch user input from input fields, select options etc
   * 2. add the fetched data to DOM
   * 3. clear the input fields once data is retrieved
   */

  // defining private variables
  let DOMStrings = {
    optionType: ".add__type",
    description: ".add__description",
    amount: ".add__value",
    incomeList: ".income__list",
    expensesList: ".expenses__list",
    budgetValue: ".budget__value",
    incomeValue: ".budget__income--value",
    expenseValue: ".budget__expenses--value",
    percent: ".budget__expenses--percentage",
    deleteBtn: ".item__delete--btn",
    expPercentage: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  const formatNumber = function(numbr) {
    // income, expense and budget values would be using this method.
    /*
        Example:
        2000 -> + 2,000.00
        2342.7897 -> - 2,342.79
        */
    if (typeof numbr == "number") {
      let split, negativeNum;
      let int, dec;
      let temp = numbr;
      // adding two decimal places
      numbr = numbr.toFixed(2);

      // the formatting of number must be taken care of
      // especially in the case when budget becomes negative
      // then formatting needs to be treated a little bit differently.
      if (numbr < 0) {
        negativeNum = numbr.toString().split("-");
        // negativeNum[0] = '-'
        // negativeNum[1] = 'number'
        split = negativeNum[1].split(".");
        int = split[0];
        dec = split[1];
      } else if (numbr >= 0) {
        split = numbr.toString().split(".");
        int = split[0];
        dec = split[1];
      }
      // separating 1000th place using comma's
      if (int.length > 3) {
        let start = int.length % 3 === 0 ? 3 : int.length % 3;
        while (start < int.length) {
          int = int.substr(0, start) + "," + int.substr(start);
          start += 4;
        }
      }

      if (temp < 0) {
        // i.e the actual number was a negative number when it entered this function
        numbr = "-" + int + "." + dec;
      } else if (temp > 0) {
        numbr = int + "." + dec;
      }
    }

    return numbr;
  };
  const addSign = function(formattedNumber, optionType) {
    // income and expense amounts would be using the method
    // adding + or - before the number
    if (optionType === "inc") {
      formattedNumber = `+${formattedNumber}`;
    } else if (optionType === "exp") {
      formattedNumber = `-${formattedNumber}`;
    }
    return formattedNumber;
  };

  return {
    // defining a public method
    getUserInput: function() {
      return {
        // we needed a way to return 3 values somehow, hence we return an object
        optionType: document.querySelector(DOMStrings.optionType).value, // value could be 'inc' or 'exp'
        description: document.querySelector(DOMStrings.description).value,
        amount: parseFloat(document.querySelector(DOMStrings.amount).value)
      };
    },
    addListItem: function(object, type) {
      // the object can be either income or expense object

      let html; // HTML for adding income and expense data to the DOM is assigned to this variable
      let element; // we need to select the HTML element to which we can append
      // ...the income or expenses html
      let uniqueNumber = formatNumber(object.amount);
      // format the number first and then add the sign
      // this is to allow us to treat budget numbers differently
      // this was required since budget values can tend to fall into negative category
      if (type == "inc") {
        element = DOMStrings.incomeList;
        html = `<div class="item clearfix" id="income-${object.ID}">
                <div class="item__description">${object.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${addSign(
                      uniqueNumber,
                      type
                    )}</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
            </div>`;
      } else if (type == "exp") {
        element = DOMStrings.expensesList;
        html = `<div class="item clearfix" id="expense-${object.ID}">
                <div class="item__description">${object.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${addSign(
                      uniqueNumber,
                      type
                    )}</div>
                    <div class="item__percentage">21%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
            </div>`;
      }
      document.querySelector(element).insertAdjacentHTML("beforeend", html);
      // insertAdjacentHTML() parses the input as html or xml. this is significantly different
      // from using textContent or innerHTML. This method inserts the resulting nodes in DOM tree
      // at the specified position
    },
    removeListItem: function(deleteThisID) {
      document.getElementById(deleteThisID).remove();
    },
    clearFields: function() {
      /**
       * Method to clear the input fields on our page as soon as addListItem() function is called
       */
      document.querySelector(DOMStrings.description).value = "";
      document.querySelector(DOMStrings.amount).value = "";
      document.querySelector(DOMStrings.description).focus();
    },
    updateValues: function(budget, inc, exp, percent) {
      let formattedIncome = formatNumber(inc);
      let formattedExpense = formatNumber(exp);
      // format the number first and then add the sign later on
      if (budget > 0) {
        document.querySelector(
          DOMStrings.budgetValue
        ).textContent = formatNumber(budget);
      } else if (budget <= 0) {
        document.querySelector(
          DOMStrings.budgetValue
        ).textContent = formatNumber(budget);
      }

      document.querySelector(DOMStrings.incomeValue).textContent = addSign(
        formattedIncome,
        "inc"
      );
      document.querySelector(DOMStrings.expenseValue).textContent = addSign(
        formattedExpense,
        "exp"
      );
      document.querySelector(DOMStrings.percent).textContent =
        percent > 0 ? percent + "%" : "---";
    },
    displayPercentages: function(percentages) {
      document
        .querySelectorAll(DOMStrings.expPercentage)
        .forEach(function(expItem, index) {
          // NOTE: this selection returns a nodeList
          // we do have access to forEach() method for nodelist
          // however confirm whether all browsers would support the same
          if (percentages[index] > 0) {
            expItem.textContent = percentages[index] + "%";
          } else {
            // when percentage value is -1
            expItem.textContent = "---";
          }
        });
    },
    displayMonth: function() {
      // let presentDay = new Date();
      // const allMonths = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
      // let currentMonth = allMonths[presentDay.getMonth()];
      // let currentYear = presentDay.getFullYear();
      // let date = new Intl.DateTimeFormat("en", { year: "numeric", month: "long" }).format();

      document.querySelector(
        DOMStrings.dateLabel
      ).textContent = new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      });
      // `${currentMonth} ${currentYear}`;
    },
    changeType: function() {
      let selector = `${DOMStrings.optionType}, ${DOMStrings.description}, ${
        DOMStrings.amount
      }`;
      let fields = document.querySelectorAll(selector);

      fields.forEach(function(item, indx) {
        item.classList.toggle("red-focus");
      });
      document.querySelector(".add__btn").classList.toggle("red");
    },
    getAllDOMStrings: function() {
      return DOMStrings;
    }
  };
})();

/**
 * The app controller module is a mockup of the controller component of the MVC architecture
 * This module is also called controller module (which links the data and view modules)
 */
let appController = (function(budget, ui) {
  /**
   * Tasks of appController module
   * 1. fetch the input data
   * 2. Add the item to the budget controller
   *      2.1 create unique ID's for each new data
   * 3. Add the item to the UI
   * 4. calculate budget
   * 5. display budget
   * 6. delete item from UI
   * 7. re-calculate the budget
   *
   */
  const controlAddItem = function() {
    // 1) Fetch the input data
    let userInput = ui.getUserInput(); // fetching the input data, as an object, from input fields within html
    let userID = uuidv4(); // generating a new ID for user income or expense data
    let userObject; // this is either an income or expense object

    // 2) Add the item to the budget controller
    if (userInput.description && userInput.amount && userInput.amount > 0) {
      // if it equals 0, then this block is skipped. As 0 is a falsy value

      if (userInput.optionType == "exp") {
        // create and add a new expense object into data structure
        userObject = budget.publicAddExpense(
          userID,
          userInput.description,
          userInput.amount
        );
      } else if (userInput.optionType == "inc") {
        // create and add a new income object into data structure
        userObject = budget.publicAddIncome(
          userID,
          userInput.description,
          userInput.amount
        );
      }

      // 3) Add the item to the UI
      ui.addListItem(userObject, userInput.optionType);

      // 3.a) clear the fields
      ui.clearFields();

      // 4) calculate and update budget
      updateBudget();
      updatePercentages();
    }
  };

  const controlDeleteItem = function(evt) {
    let requiredID = 0;
    let tempString = "";
    let index = -1;
    // 1. get the id of element that was clicked
    let tempID = evt.toElement.parentNode.parentNode.parentNode.parentNode.id;

    // 2. figure out if it was income/expense element
    if (tempID.includes("inc")) {
      tempString = "income";
    } else if (tempID.includes("exp")) {
      tempString = "expense";
    }

    // 3. parse the id to include only id portion
    requiredID = tempID.slice(tempString.length + 1, tempID.length);

    // 4. use this id to compare with the id value among income/expense objects
    index = budget.findRecord(tempString, requiredID);

    // 5. delete this object from array
    if (index > -1) {
      budget.deleteRecord(tempString, index);
    }
    // 5.a delete item from UI
    ui.removeListItem(tempID);
    // 6. re-calculate the budget
    updateBudget();
    updatePercentages();
  };

  const updateBudget = function() {
    let totalInc = 0;
    let totalExp = 0;
    let userBudget = 0;
    let userPercent = -1;
    // 1) Calculate the budget
    totalInc = budget.publicTotalIncome();
    totalExp = budget.publicTotalExpense();
    // 2) Return the budget
    userBudget = budget.getBudget();
    userPercent = budget.getPercentage();
    // 3) Display budget in UI
    ui.updateValues(userBudget, totalInc, totalExp, userPercent);
  };

  const updatePercentages = function() {
    // 1. calculate percentage (includes step 2 as well)
    let expPercentages = budget.getAllPercentages();
    // 2. read percentages from budget controller

    // 3. update UI with the new percentages
    ui.displayPercentages(expPercentages);
  };

  const setupEventListeners = function() {
    let DOMStrings = ui.getAllDOMStrings();
    DOMStrings.addBtn = ".add__btn";
    DOMStrings.incAndExpenseContainer = ".container";

    document
      .querySelector(DOMStrings.addBtn)
      .addEventListener("click", controlAddItem);
    document.addEventListener("keydown", function(evt) {
      if (evt.keyCode == 13) {
        // key code for enter key
        controlAddItem();
      }
    });
    document
      .querySelector(DOMStrings.incAndExpenseContainer)
      .addEventListener("click", controlDeleteItem);
    document
      .querySelector(DOMStrings.optionType)
      .addEventListener("change", ui.changeType);
  };

  return {
    // declaring an initialization function
    init: function() {
      console.log("App has started.");
      ui.displayMonth();
      ui.updateValues(0, 0, 0, -1); // reset the values shown in the UI
      setupEventListeners();
    }
  };
})(budgetController, UIController);
// we are passing the return values of budgetController and UIController into the IIFE, which respectively
// gets stored into budget and ui variable. The return value is an object

appController.init();
