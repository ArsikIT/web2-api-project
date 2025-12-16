const express = require('express');
const axios = require('axios');
require('dotenv').config(); 

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('index2.html', { root: 'public' });
});

app.get('/api/data', async (req, res) => {
    try {
        const fullData = await fetchAllApiData();
        res.json(fullData);
    } catch (error) {
        console.error('Error when receiving API data:', error.message);
        res.status(500).json({ error: error.message || 'Couldnt get data from external APIs.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server launched on http://localhost:${PORT}`);
});


// Logic for sequential API calls

async function fetchAllApiData() {
    // 1.Getting random user data
    const userResponse = await axios.get('https://randomuser.me/api/');
    const userData = parseRandomUser(userResponse.data);
    const countryName = userData.country; 
    
    const countryCode = userResponse.data.results[0].nat; 
    const countryCodeLower = countryCode.toLowerCase(); 

    // 2. Getting country data
    const countryData = await fetchCountryData(countryCode);
    const currencyCode = countryData.currencyCode; 

    // 3. Getting exchange rates
    const exchangeRateData = await fetchExchangeRates(currencyCode);

    // 4. Getting top news of that country
    const newsData = await fetchNewsData(countryCodeLower, countryName);
    
    return {
        user: userData,
        country: countryData,
        rates: exchangeRateData,
        news: newsData,
    };
}


// API 1: Random User Generator API (Parsing function)
function parseRandomUser(data) {
    const user = data.results[0];
    return {
        firstName: user.name.first,
        lastName: user.name.last,
        gender: user.gender,
        picture: user.picture.large,
        age: user.dob.age,
        dateOfBirth: new Date(user.dob.date).toLocaleDateString(),
        city: user.location.city,
        country: user.location.country,
        fullAddress: `${user.location.street.number} ${user.location.street.name}, ${user.location.city}`,
        nat: user.nat,
    };
}


// API 2: Countrylayer API 
async function fetchCountryData(countryCode) {
    const apiKey = process.env.COUNTRY_LAYER_API_KEY;
    if (!apiKey) {
        throw new Error('COUNTRY_LAYER_API_KEY is not installed in .env');
    }
    
    const url = `https://api.countrylayer.com/v2/alpha/${countryCode}?access_key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        
        if (data.status === 404 || data.message) {
             throw new Error(`Countrylayer Error: The country code was not found ${countryCode}`);
        }
        
        const currencyCode = data.currencies?.[0]?.code;
        const currencyName = data.currencies?.[0]?.name;

        // The logic of reserve values for currency
        const finalCurrencyCode = currencyCode || 'USD';
        let finalCurrencyName = currencyName || 'N/A';
        
        if (finalCurrencyName === 'N/A' && finalCurrencyCode === 'USD') {
             finalCurrencyName = 'US Dollar (reserve)';
        }
        
        return {
            name: data.name,
            capital: data.capital,
            // Languages is not always available in free !!!!!!
            languages: data.languages?.map(lang => lang.name).join(', ') || 'N/A (API Restriction)',
            currencyName: finalCurrencyName,
            currencyCode: finalCurrencyCode,
            flagUrl: data.flag, 
        };
    } catch (e) {
        console.error(`Countrylayer API couldn't find the country by code ${countryCode}: ${e.message}`);
        return { name: 'N/A', capital: 'API error', languages: 'API error', currencyName: 'N/A', currencyCode: 'USD', flagUrl: '' };
    }
}


// API 3: ExchangeRate API 
async function fetchExchangeRates(baseCurrency) {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    if (!apiKey) {
        throw new Error('EXCHANGE_RATE_API_KEY is not installed in .env');
    }

    const currency = baseCurrency === 'N/A' ? 'USD' : baseCurrency;
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${currency}`;
    
    try {
        const response = await axios.get(url);
        const rates = response.data.conversion_rates;
        
        return {
            base: currency,
            toUSD: rates['USD'] ? `1 ${currency} = ${rates['USD'].toFixed(4)} USD` : 'The USD exchange rate is unavailable',
            toKZT: rates['KZT'] ? `1 ${currency} = ${rates['KZT'].toFixed(4)} KZT` : 'The KZT exchange rate is unavailable',
        };
    } catch (e) {
        console.error(`The ExchangeRate API could not get the exchange rates for ${currency}: ${e.message}`);
        return { base: currency, toUSD: 'API error', toKZT: 'API error' };
    }
}


// API 4: News API 
async function fetchNewsData(countryCodeLower, countryName) {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
        throw new Error('NEWS_API_KEY is not installed in .env');
    }

    let articles = [];
    
    // Top news by country code 
    try {
        const urlTop = `https://newsapi.org/v2/top-headlines?country=${countryCodeLower}&pageSize=5&apiKey=${apiKey}`;
        const responseTop = await axios.get(urlTop);
        articles = responseTop.data.articles.slice(0, 5);
    } catch (e) {
        console.error(`News API - Top Headlines (Country Code) couldn't get the data: ${e.message}`);
    }


    // Reserve: If nothing was found by the code, we search by the country name (broader search)
    if (articles.length === 0) {
        try {
             console.log(`News API: There is no top news for ${countryCodeLower}. Search by name: ${countryName}`);
             const urlSearch = `https://newsapi.org/v2/everything?q=${countryName}&pageSize=5&sortBy=publishedAt&apiKey=${apiKey}`;
             const responseSearch = await axios.get(urlSearch);
             articles = responseSearch.data.articles.slice(0, 5);

        } catch (e) {
            console.error(`News API - Everything (Query) couldn't get the data: ${e.message}`);
        }
    }


    return articles.map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        imageUrl: article.urlToImage,
        source: article.source.name,
    }));
}