'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };
// const account5 = {
//   owner: 'Worms Sama',
//   movements: [430000, 1000000, 700000, 500000, -900000],
//   interestRate: 1,
//   pin: 1111,
// };

// const accounts = [account1, account2, account3, account4, account5];
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
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

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

let login;
let balance;
const calcDate = param => {
  if (param === undefined) {
    param = new Date();
  } else {
    param = new Date(param);
  }
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  };
  const locale = navigator.language;
  const makeDate = new Intl.DateTimeFormat(locale, options).format(param);
  return makeDate;
};
const today = calcDate(undefined);
labelDate.textContent = today;
const displayMovenemts = function (movement, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? movement.movements.slice().sort((a, b) => a - b)
    : movement.movements;
  movement.movements = movs;
  movement.movements.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : 'withdrawal';
    let dat = calcDate(movement.movementsDates[i]);
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${dat}</div>
          <div class="movements__value">$${Math.abs(mov).toFixed(2)}</div>
        </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const generateUserNames = function (accounts) {
  accounts.map((account, index) => {
    let un = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => {
        return name[0];
      })
      .join();
    let totalun = '';
    for (let i = 0; i < un.length; i++) {
      if (un[i] != ',') {
        totalun += un[i];
      }
    }
    account.username = totalun;
  });
};
generateUserNames(accounts);
const calcBalance = function (money) {
  const bal = money.reduce((acc, val, i, arr) => {
    return acc + val;
  }, 0);
  return bal;
};
const amountsSummary = movements => {
  const withdrawedMoney = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const depositedMoney = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const interests = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + (mov * 1.2) / 100, 0);
  return [
    withdrawedMoney.toFixed(2),
    Math.abs(depositedMoney).toFixed(2),
    interests.toFixed(2),
  ];
};


let currentAccount;
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  let pinNumber = Number(inputLoginPin.value);
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin == pinNumber) {
    let userName = currentAccount.owner;
    if(login){
      clearInterval(login)
    }
    login=countDownTimer();
    inputLoginUsername.value = '';
    inputLoginUsername.blur();
    inputLoginPin.value = '';
    inputLoginPin.blur();
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome ${userName} Sama`;
    updateUI(currentAccount);
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  let transferToPerson = inputTransferTo.value;
  let amountTotransfer = Number(inputTransferAmount.value);
  let checkIfUserExists = accounts.find(
    acc => acc.username == transferToPerson
  );
  if (
    checkIfUserExists &&
    checkIfUserExists.username !== currentAccount.username
  ) {
    if (balance - amountTotransfer >= 0 && amountTotransfer > 0) {
      let transferAmount = balance - amountTotransfer;
      balance -= transferAmount;
      currentAccount.movements.push(amountTotransfer * -1);
      checkIfUserExists.movements.push(amountTotransfer);
      updateUI(currentAccount);
    }
  }
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  let closeAccountOfUser = inputCloseUsername.value;
  let closeAccountOfUsersPin = Number(inputClosePin.value);
  if (
    closeAccountOfUser === currentAccount.username &&
    closeAccountOfUsersPin === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === closeAccountOfUser
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = '';
    inputClosePin.value = '';
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  let amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      balance += amount;
      updateUI(currentAccount);
    }, 5000);
    inputLoanAmount.value = '';
  }
});
const updateUI = account => {
  displayMovenemts(account);
  balance = calcBalance(account.movements);
  labelBalance.textContent = `$ ${balance.toString()}`;
  let [withdrawed, deposited, interests] = amountsSummary(account.movements);
  labelSumIn.textContent = `$${withdrawed}`;
  labelSumOut.textContent = `$${deposited}`;
  labelSumInterest.textContent = `$${interests}`;
  inputLoanAmount.value = '';
};
let sorter = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovenemts(currentAccount, sorter);
  sorter = !sorter;
});

const countDownTimer = () => {
  let time = 15 ;
  setInterval(() => {
    let sec = time % 60;
    let min = Math.floor(time / 60);
    labelTimer.textContent = `${min.toString().padStart(2, '0')} : ${sec
      .toString()
      .padStart(2, '0')}`;
    if (time <= 0) {
      clearInterval(countDownTimer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Login to continue';
      login=false;
    }
    time--;
  }, 1000);
};
