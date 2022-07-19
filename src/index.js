import './css/styles.css';
import Debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/countries-api';
// import countryCardTemplate from './templates/country-card.hbs';
// import countriesCardTemplate from './templates/countries-card.hbs';

const DEBOUNCE_DELAY = 300;

const inputData = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputData.addEventListener('input', Debounce(onInputSerch, DEBOUNCE_DELAY));

function onInputSerch(event) {
  const inputValue = event.target.value;
  const name = inputValue.trim();
  if (name.length === 0) {
    return Notiflix.Notify.info('This field should be not empty');
  }
  clearContent();

  fetchCountries(name)
    .then(renderContent)
    .catch(() =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function renderContent(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  if (countries.length > 2) {
    renderCountryList(countries);
    return;
  }
  renderCountry(countries[0]);
}

// function renderCountryList(countries) {
//   const murkup = countriesCardTemplate(countries);
//   countryList.innerHTML = murkup;
// }
function renderCountryList(countries) {
  const markup = countries
    .map(({ name, flags: { svg } } = {}) => {
      return `<li class="country">

            <img src = "${svg}" height="200" width="200"/>

          <p><b>Country</b>: ${name}</p>
        </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

// function renderCountry(countries) {
//   countries.languages = Object.values(countries.languages).join(', ');
//   const country = countryCardTemplate(countries);
//   countryInfo.innerHTML = country;
// }
function renderCountry({
  name,
  capital,
  population,
  flags: { svg },
  languages: [{ name: lang }],
} = {}) {
  const countryContent = `<div class="country style">
  <img src='${svg}' height='40' width='60' class='flag_country' />
  <p class='name'>${name}</p>
</div>
<p><b>Capital</b>: ${capital}</p>
<p><b>Population</b>: ${population}</p>
<p><b>Languages</b>: ${lang}`;

  countryInfo.innerHTML = countryContent;
}

function clearContent() {
  if (countryList.children.length > 0) {
    countryList.innerHTML = '';
  }

  if (countryInfo.children.length > 0) {
    countryInfo.innerHTML = '';
  }
}
