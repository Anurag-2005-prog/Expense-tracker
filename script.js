// Redirect if not logged in
if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "login.html";
}

// Welcome User
document.getElementById("welcomeUser").innerText =
  "Welcome, " + localStorage.getItem("userName");

// Logout
document.getElementById("logoutBtn").addEventListener("click", function () {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
});

let expenseForm = document.getElementById("expenseForm");
let expenseList = document.getElementById("expenseList");
let totalExpenseDisplay = document.getElementById("totalExpense");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Chart variables
let categoryChart;
let monthlyChart;

// Display Expenses
function displayExpenses() {
  expenseList.innerHTML = "";
  let total = 0;

  expenses.forEach((expense, index) => {
    total += expense.amount;

    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${expense.title}</td>
      <td>₹${expense.amount}</td>
      <td>${expense.category}</td>
      <td>${expense.date}</td>
      <td><button class="deleteBtn" onclick="deleteExpense(${index})">Delete</button></td>
    `;

    expenseList.appendChild(row);
  });

  totalExpenseDisplay.innerText = total;

  updateCharts();
}

// Add Expense
expenseForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let title = document.getElementById("expenseTitle").value;
  let amount = parseFloat(document.getElementById("expenseAmount").value);
  let category = document.getElementById("expenseCategory").value;
  let date = document.getElementById("expenseDate").value;

  let expenseObj = { title, amount, category, date };

  expenses.push(expenseObj);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  expenseForm.reset();
  displayExpenses();
});

// Delete Expense
function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  displayExpenses();
}

// Monthly Report
document.getElementById("generateReportBtn").addEventListener("click", function () {
  let selectedMonth = document.getElementById("monthSelect").value;
  let reportList = document.getElementById("monthlyReportList");
  let monthlyTotalDisplay = document.getElementById("monthlyTotal");

  reportList.innerHTML = "";
  let monthlyTotal = 0;

  expenses.forEach(expense => {
    let expenseMonth = expense.date.split("-")[1];

    if (expenseMonth === selectedMonth) {
      monthlyTotal += expense.amount;

      let row = document.createElement("tr");
      row.innerHTML = `
        <td>${expense.title}</td>
        <td>₹${expense.amount}</td>
        <td>${expense.category}</td>
        <td>${expense.date}</td>
      `;

      reportList.appendChild(row);
    }
  });

  monthlyTotalDisplay.innerText = monthlyTotal;
});

// Update Charts
function updateCharts() {
  // Category Data
  let categories = ["Food", "Travel", "Shopping", "Bills", "Others"];
  let categoryTotals = [0, 0, 0, 0, 0];

  expenses.forEach(expense => {
    let index = categories.indexOf(expense.category);
    if (index !== -1) categoryTotals[index] += expense.amount;
  });

  // Monthly Data
  let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let monthlyTotals = new Array(12).fill(0);

  expenses.forEach(expense => {
    let monthIndex = parseInt(expense.date.split("-")[1]) - 1;
    monthlyTotals[monthIndex] += expense.amount;
  });

  // Destroy previous charts before re-creating
  if (categoryChart) categoryChart.destroy();
  if (monthlyChart) monthlyChart.destroy();

  // Pie Chart
  categoryChart = new Chart(document.getElementById("categoryChart"), {
    type: "pie",
    data: {
      labels: categories,
      datasets: [{
        data: categoryTotals
      }]
    }
  });

  // Bar Chart
  monthlyChart = new Chart(document.getElementById("monthlyChart"), {
    type: "bar",
    data: {
      labels: months,
      datasets: [{
        label: "Monthly Expense",
        data: monthlyTotals
      }]
    }
  });
}

// Initial Load
displayExpenses();
