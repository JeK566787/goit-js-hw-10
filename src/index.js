import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';
import templatesCountries from './templates/markupCountries.hbs';
import templatesOneCountry from './templates/markupOneCountry.hbs';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(searchCountriesInfo, DEBOUNCE_DELAY));

function searchCountriesInfo(event) {
  const nameOfCountry = event.target.value.trim();

  if (!nameOfCountry) {
    onClearPage();
    return;
  }

  fetchCountries(nameOfCountry)
    .then(countries => {
      if (countries.length === 1) {
        onCountryInfoMarkup(countries);
      } else if (countries.length > 10) {
        Notiflix.Notify.info(
          `Too many matches found. Please enter a more specific name.`
        );
        onClearPage();
      } else {
        onCountryListMarkup(countries);
      }
    })
    .catch(err => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      onClearPage();
    });
}

function onCountryInfoMarkup(arrOfCountries) {
  const oneCountry = arrOfCountries[0];
  oneCountry.languages = Object.values(oneCountry.languages).join(', ');
  oneCountry.capital = oneCountry.capital.join(', ');
  const countryInfoMarkup = templatesOneCountry(oneCountry);

  countryList.innerHTML = '';
  countryInfo.innerHTML = countryInfoMarkup;
}

function onCountryListMarkup(arrOfCountries) {
  console.log(arrOfCountries);
  const countryListMarkup = arrOfCountries
    .map(el => {
      return templatesCountries(el);
    })
    .join('');

  countryInfo.innerHTML = '';
  countryList.innerHTML = countryListMarkup;
}

function onClearPage() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}

// VANTA.WAVES({
//   el: '#waves',
//   mouseControls: true,
//   touchControls: true,
//   gyroControls: false,
//   minHeight: 200.0,
//   minWidth: 200.0,
//   scale: 1.0,
//   scaleMobile: 1.0,
//   waveHeight: 11.0,
//   zoom: 0.7,
//   color: 0x344d,
// });
