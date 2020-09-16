'use strict';
//выбор валюты
const chooseMoneyType = () => {
  const chooseMoneyWrap = document.querySelector('.choose-money-wrap'),
        rubLabel = document.querySelector('.rub-label'),
        usdLabel = document.querySelector('.usd-label');

  chooseMoneyWrap.addEventListener('change', (e) => {
    let target = e.target;
    if (target.matches('input[type="radio"]')){
      resetInputs();
      let currentMoney = target.value;
      localStorage.setItem('currentMoney', currentMoney);
      if(currentMoney === 'USD'){
        rubLabel.textContent = 'Доллар США (USD)';
        usdLabel.textContent = 'Российский рубль (RUB)';
      } else {
        rubLabel.textContent = 'Российский рубль (RUB)';
        usdLabel.textContent = 'Доллар США (USD)';
      }
    }
  });
};
chooseMoneyType();

//getCourseMoney
const getCourseMoney = (currentMoney) => {
  let url = 'https://api.exchangeratesapi.io/latest?base=' + currentMoney; 
  return fetch(url); 
};

//send exchangeMoney
const exchangeMoney = () => {
  const formExchange = document.getElementById('form-exchange');
  const inCountMoney = document.getElementById('in-count-money');
  const outCountMoney = document.getElementById('out-count-money');

  formExchange.addEventListener('submit', (e) => {
    e.preventDefault();
    let target = e.target;
    if (inCountMoney.value) {
      let currentMoney = localStorage.getItem('currentMoney');
      getCourseMoney(currentMoney)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error('status network not 200');
          }
          
          return response.json();
        })
        .then((data) => {
          let finalValue = (data.base === 'RUB') ? inCountMoney.value * data.rates.USD : inCountMoney.value * data.rates.RUB;
          outCountMoney.value = Math.floor(finalValue * 100) / 100;
        })
        .catch((error) => {
          console.error(error);
        });
    }
  })
};
exchangeMoney();

//validate inputs
const validateCalcInputs = () => {
  const validateInputs = document.querySelector('.out-wrap');
  validateInputs.addEventListener('input', (event) => {
    let target = event.target;
    if (target.tagName === 'INPUT') {
      target.value = target.value.replace(/\D/g, '');
    }
  });
};
validateCalcInputs();

//resetInputs
const resetInputs = () => {
  const outCountMoney = document.getElementById('out-count-money').value = '';
  const inCountMoney = document.getElementById('in-count-money').value = '';
};
