'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-09-12T14:11:59.604Z',
    '2021-09-13T17:01:17.194Z',
    '2021-09-14T23:36:17.929Z',
    '2021-09-15T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// const dates = accounts.date();
// console.log(accounts.date);

const formatMovementsDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(`Days has passed ${daysPassed}`);
  if (daysPassed == 0) return 'Today';
  if (daysPassed == 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const dd = `${date.getDate()}`.padStart(2, 0);
  // const mm = `${date.getMonth() + 1}`.padStart(2, 0);
  // const yyyy = date.getFullYear();
  // return `${dd}/${mm}/${yyyy}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

// FORMAT CURRENCIES
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// DISPLAY ALL MOVEMENTS / TRANSACTIONS
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type} </div>
    <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

// DISPLAY BALANCE
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};
// calcDisplayBalance(account1.movements);

// DISPLAY SUMMARY OF ALL BALANCES
const calcDisplaySummary = function (acc) {
  // DISPLAY INCOME
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  // DISPLAY EXPENSES
  const expenses = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(expenses, acc.locale, acc.currency);

  // DISPLAY INTEREST
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    // deposit > 100 ? (deposit * 1.2) / 100 : (deposit * 1) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};
// calcDisplaySummary(account1.movements);

// CREATE USERNAME
const createUsernames = function (accs) {
  // THIS IS A SIDE AFFECT
  // NOT CREATING A NEW VALUE TO RETURN
  // SIMPLY LOOPED OVER THE ACCOUNTS ARRAY
  // VIDEO 149
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts); // stw

const updateUI = function (acc) {
  //DISPLAY MOVEMENTS
  displayMovements(acc);
  // DISPLAY BALANCE
  calcDisplayBalance(acc);
  // DISPLAY SUMMARY
  calcDisplaySummary(acc);
};

const startLogoutTimer = function () {
  const tick = function () {
    // Call timer every second
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    // When reach 0 second, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      // HIDES CONTENT
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    // Decrease 1 second
    time--;
  };
  // Set time to 5mins
  let time = 120;
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

//=============================
//
//      EVENT HANDLERS
//
//=============================
let currentAccount, timer;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (event) {
  // PREVENT FORM FROM SUBMITTING
  event.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  // OPTIONAL CHAINING
  if (currentAccount?.pin === +inputLoginPin.value) {
    // DISPLAY UI and WELCOME MESSAGE
    // unhide
    alert(`Welcome ${currentAccount.owner}, Your are now logged in!`);
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(' ')[0]
    }!`;
    containerApp.style.opacity = 100;

    // CURRENT DATE AND TIME
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // // CREATE CURRENT DATE AND TIME
    // const now = new Date();
    // const dd = `${now.getDate()}`.padStart(2, 0);
    // const mm = `${now.getMonth() + 1}`.padStart(2, 0);
    // const yyyy = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${dd}/${mm}/${yyyy} - ${hour}:${min}`; // Day / Month / Year (dd / mm / yyyy)

    // CLEAR INPUT FIELDS
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    //UPDATE UI
    updateUI(currentAccount);

    // DISPLAY WELCOME MESSAGE
  } else {
    // HIDES CONTENT
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // SORRY MESSAGE
    alert('Sorry, incorrect username or password, please try again!');
  }
});

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // console.log(amount, receiverAcc);

  // CLEAR INPUTS FIELDS
  inputTransferTo.value = inputTransferAmount.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // DOING THE TRANSFER
    // console.log('Transfer valid');
    currentAccount.movements.push(-amount.toFixed(2));
    receiverAcc.movements.push(+amount.toFixed(2));

    // ADD TRANSFER DATE
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //UPDATE UI
    updateUI(currentAccount);

    // RESET THE TIMER
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Math.floor(+inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // ADD TIMER

    // ADD MOVEMENT
    setTimeout(function () {
      currentAccount.movements.push(amount);

      // ADD LOAN DATE
      currentAccount.movementsDates.push(new Date().toISOString());
      // UPDATE UI
      updateUI(currentAccount);
    }, 5000);
  }
  inputLoanAmount.value = '';
  // RESET THE TIMER
  clearInterval(timer);
  timer = startLogoutTimer();
});

btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);

    //DELETE
    accounts.splice(index, 1);

    // HIDE UI
    containerApp.style.opacity = 0;
  }
  // CLEAR INPUT FIELDS
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// //================================================
// //================================================
// //        ------------------------------
// //
// //        NUMBERS, DATES, INTL, TIMERS
// //
// //        ------------------------------
// //================================================
// //
// //
// //================================================
// //        ------------------------------
// //        Converting and Checking Numbers
// //        ------------------------------
// //================================================

// console.log(23 === 23.0);

// // BASE 10 = 0 to 9. 1/10 = 0.1. 3/10 = 3.3333333
// // BASE 2 (BINARY) = 1s and 0s
// console.log(0.1 + 0.2); // 0.3000000000004
// console.log(0.1 + 0.2 === 0.3); //  FALSE

// // CONVERSION
// console.log(Number('23'));
// console.log(+'23');

// // PARSING
// console.log(Number.parseInt('30px', 10)); // 30 (Int)
// console.log(Number.parseInt('e23', 10)); // NaN
// // PARSING - TO READ VALUE FROM CSS
// console.log(Number.parseInt('   2.5rem   ')); // 2
// console.log(Number.parseFloat('   2.5rem    ')); // 2.5

// // CHECK IF VALUE IS NOT A NUMBER (NaN)
// console.log(Number.isNaN(25)); // false
// console.log(Number.isNaN('25')); // false
// console.log(Number.isNaN(+'25X')); // true
// console.log(Number.isNaN(23 / 0)); // false

// // CHECKING IF A VALUE IS A NUMBER - NOT A STRING IMPORTANT
// console.log(Number.isFinite(23)); // true
// console.log(Number.isFinite('23')); // false
// console.log(Number.isFinite(+'20X')); // false
// console.log(Number.isFinite(23 / 0)); // false

// console.log(Number.isInteger(23)); // true
// console.log(Number.isInteger(23.0)); // true
// console.log(Number.isInteger(23 / 0)); // false

// //================================================
// //        ------------------------------
// //              MATH and ROUNDING
// //        ------------------------------
// //================================================

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// console.log(Math.max(5, 12, 23, 11, 2)); //23
// console.log(Math.max(5, 12, '23', 11, 2)); // 23
// console.log(Math.max(5, 12, '23px', 11, 2)); // NaN

// console.log(Math.min(5, 8, 23, 11, 2)); // 2

// ////////////////////////////////
// // CALCULATE AREA OF CIRCLE
// ////////////////////////////////
// console.log(Math.PI * Number.parseFloat('10px') ** 2); // 314.1592653589793

// console.log(Math.trunc(Math.random() * 6) + 1); // RANDOM NUM 1-6

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;
// // 0...1 -> 0...(max - min) -> min...max
// console.log(randomInt(10, 20)); // RANDOM NUM 11-20

// ////////////////////////////////
// // ROUNDING INTEGERS
// ////////////////////////////////
// console.log('------ROUND - ROUND TO CLOSEST NUMBER 0.4 <= 0 / 0.5 >= 1------');
// console.log(Math.round(23.3));
// console.log(Math.round(23.6));

// console.log('------CEIL - ROUND UP------');
// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.6));

// console.log('------FLOOR - ROUND DOWN------');
// console.log(Math.floor(23.3));
// console.log(Math.floor(23.6));

// console.log('------TRUNC------');
// console.log(Math.trunc(23.3));

// console.log('------TRUNC vs FLOOR------');
// console.log(Math.trunc(-23.3));
// console.log(Math.floor(-23.3)); // BETTER TO USE FLOOR IN ALL SITUATIONS

// ////////////////////////////////////////////////
// // ROUNDING DECIMALS (FLOATING POINT NUMBERS) \\
// ////////////////////////////////////////////////
// console.log((2.7).toFixed(0)); // 3 -> toFixed WILL ALWAYS RETURN A STRING A NOT A NUMBER
// console.log((2.7).toFixed(1)); // 2.7 -> Adds 1 Decimal
// console.log((2.701).toFixed(2)); // 2.70 -> Adds 2 Decimals
// console.log((2.701).toFixed(3)); // 2.701 -> Adds 3 Decimals
// console.log(+(2.701).toFixed(3)); // 2.701 -> ...and CONVERTED TO NUMBER WITH +

// ////////////////////////////////
// //   REMAINDER OPERATOR
// ////////////////////////////////

// console.log(5 / 2); // 5 = 2 * 2 + 1

// console.log(5 % 2); // 5 divided by 2 = 2...then...2 * 2 = 4 and the remainder is 1
// /*

// __2_______
// 2|  5
// -4
// ____
// 1 = REMAINDER
// ====
// */
// console.log(8 / 3); // 2.666666666665
// console.log(8 % 3); // 2

// console.log(6 % 2); // 0
// console.log(6 / 2); // 3

// console.log(7 % 2); // 1
// console.log(7 / 2); // 3.5

// const isEven = num => num % 2 == 0;
// console.log(isEven(8)); // true
// console.log(isEven(23)); // false
// console.log(isEven(514)); // true

// //////////////////////////////////////////
// // EVENT HANDLER - ADD COLOURS TO ROW
// /////////////////////////////////////////
// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     if (i % 2 === 0) row.style.backgroundColor = 'orangered'; // 0, 2, 4, 6, 8
//     if (i % 3 === 0) row.style.backgroundColor = 'lightblue'; // 0, 3, 6, 9, 12
//   });
// });

// //================================================
// //        ------------------------------
// //             Working with BigInt
// //        ------------------------------
// //================================================

// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(2 ** 53 + 0);
// console.log(2 ** 53 + 1);
// console.log(2 ** 53 + 2);
// console.log(2 ** 53 + 3);

// // BigInt (<number>n) Operations
// console.log(
//   90071992547409966554165465446546341n * 654616416416463416541654165456n
//   );
//   console.log(BigInt(9007199254));
//   // console.log(Math.sqrt(16n)); // DOES NOT WORK

//   const huge = 654654654321335464644564565464n;
//   const num = 23;
//   console.log(huge * BigInt(num));

//   // EXCEPTIONS
//   console.log(25n > 5); // true
//   // Cannot Mix
//   console.log(20n === 20); // false
//   console.log(typeof 25n); // BigInt
//   console.log(25n == 25); // true
//   console.log(25n == 25); // true
//   console.log(25n == '25'); // true

//   console.log(huge + ' is REALLY Big!! 🏢');

//   // DIVISIONS
//   console.log(10n / 3n);
//   console.log(11n / 3n);
//   console.log(11 / 3);
//   console.log(10 / 3);

// //================================================
// //        ------------------------------
// //             Creating Dates
// //        ------------------------------
// //================================================

// Create a date (4 Ways)
/*
const now = new Date();
console.log(now);

console.log(new Date('Sep 15 2021 08:38:11'));
console.log(new Date('December 25 2015 14:00'));

console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 10, 19, 15, 23, 5)); // November
console.log(new Date(2037, 10, 31)); // 01 December

console.log(new Date(0)); // Unix Time
console.log(new Date(3 * 24 * 60 * 60 * 1000)); // Unix Time + 3 Days after

// Working with Dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());
console.log(account1.movementsDates[0]);
console.log(future.getTime());

console.log(new Date(2142249780000)); // TIME STAMP

console.log(Date.now()); // TIME STAMP

future.setFullYear(2040);
future.setMonth(7);
future.setDate(5);
console.log(future);
*/

// //================================================
// //        ------------------------------
// //             Operation with Dates
// //        ------------------------------
// //================================================
// const today = new Date();
// const future = new Date(2021, 8, 22, 8, 40);
// console.log(future);
// console.log(Number(future));
// console.log(+future);

// const calcDaysPassed = (date1, date2) =>
//   Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

// console.log(calcDaysPassed(future, today));

// //================================================
// //        ------------------------------
// //        Internationalizing Dates (Intl) - MDN API
// //        ------------------------------
// //================================================

// // CURRENT DATE AND TIME
// const now = new Date();
// const options = {
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   // month: 'numeric',
//   // month: '2-digit',
//   month: 'numeric',
//   // year: '2-digit',
//   year: 'numeric',
//   // weekday: 'short',
//   // weekday: 'narrow',
//   // weekday: 'long',
// };
// // const locale = navigator.language;
// // console.log(locale);

// labelDate.textContent = new Intl.DateTimeFormat(
//   currentAccount.locale,
//   options
// ).format(now);

// //================================================
// //        ------------------------------
// //        Internationalizing Numbers (Intl) - MDN API
// //        ------------------------------
// //================================================
// const num = 3884764.23;

// const options = {
//   style: 'currency',
//   unit: 'celsius',
//   currency: 'eur',
//   // useGrouping: false,
// };

// console.log('-------------US----------------');
// console.log(new Intl.NumberFormat('en-US', options).format(num));
// console.log('-------------GERMANY----------------');
// console.log(new Intl.NumberFormat('de-DE', options).format(num));
// console.log('-------------SYRIA----------------');
// console.log(new Intl.NumberFormat('ar-SY', options).format(num));
// console.log('-------------BROWSER----------------');
// console.log(new Intl.NumberFormat(navigator.language).format(num));
// console.log(new Intl.NumberFormat(navigator.language, options).format(num));

// //================================================
// //        ------------------------------
// //       Timers --> setTimeout and setInterval
// //        ------------------------------
// //================================================

// setTimeOut
const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your Pizza with ${ing1} and ${ing2}`),
  3000,
  ...ingredients
);

console.log('...waiting');

// if (ingredients.includes('spinach')) {
//   clearTimeout(pizzaTimer), console.log('Sorry but your pizza has Spinach on');
// }

// setInterval
// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// }, 1000);

const clock = setInterval(function (time) {
  const today = new Date();
  const hh = today.getHours().toFixed(0);
  const mm = today.getMinutes().toFixed(0);
  const ss = today.getSeconds().toFixed(0);
  const timeClock = `${hh}:${mm}:${ss}`;
  console.log(timeClock);
}, 1000);
