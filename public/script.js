// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fetchDataBtn').addEventListener('click', fetchData);
});

const dataContainer = document.getElementById('dataContainer');

async function fetchData() {
    dataContainer.innerHTML = '<p class="loading">Uploading data...</p>';
    
    try {
        // Request for Node.js 
        const response = await fetch('/api/data');
        const data = await response.json();

        if (response.ok) {
            renderData(data);
        } else {
            dataContainer.innerHTML = `<p class="error">Server error: ${data.error || 'Unknown error on the server.'}</p>`;
        }

    } catch (error) {
        dataContainer.innerHTML = `<p class="error">Network or server error: ${error.message}</p>`;
    }
}

function renderData(data) {
    const user = data.user;
    const country = data.country;
    const rates = data.rates;
    const news = data.news;

    // Generation HTML for user data
    const userHTML = `
        <section class="user-card card">
            <h2>🧑 ${user.firstName} ${user.lastName}</h2>
            <div class="user-details">
                <img src="${user.picture}" alt="${user.firstName} ${user.lastName}" class="profile-picture">
                <div class="user-text">
                    <p><strong>Gender:</strong> ${user.gender}</p>
                    <p><strong>Age:</strong> ${user.age} (DB: ${user.dateOfBirth})</p>
                    <p><strong>Country:</strong> ${user.country}</p>
                    <p><strong>Adress:</strong> ${user.fullAddress}, ${user.city}</p>
                </div>
            </div>
        </section>
    `;

    // Generation HTML for country and exchange rates
    const countryAndRatesHTML = `
        <div class="info-group">
            <section class="country-info card">
                <h2>🗺️ Information about country</h2>
                ${country.flagUrl ? `<img src="${country.flagUrl}" alt="Flag ${country.name}" class="country-flag">` : ''}
                <p><strong>Country:</strong> ${country.name}</p>
                <p><strong>Capital:</strong> ${country.capital}</p>
                <p><strong>Languages:</strong> ${country.languages}</p>
                <p><strong>Exchange Rate:</strong> ${country.currencyName} (${country.currencyCode})</p>
            </section>
            
            <section class="exchange-rates card">
                <h2>💱 Exchange Rate (${rates.base})</h2>
                <p>${rates.toUSD}</p>
                <p>${rates.toKZT}</p>
            </section>
        </div>
    `;

    // Generation HTML for news
    const newsHTML = `
        <section class="news-headlines">
            <h2>📰 TOP - 5 news (${country.name})</h2>
            <div class="news-grid">
                ${news.map(article => `
                    <div class="news-item card">
                        ${article.imageUrl ? `<img src="${article.imageUrl}" alt="Image of the News" class="news-image">` : ''}
                        <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
                        <p>${article.description || 'There is no description.'}</p>
                        <p class="source">Source: ${article.source}</p>
                    </div>
                `).join('')}
            </div>
        </section>
    `;

    dataContainer.innerHTML = userHTML + countryAndRatesHTML + newsHTML;
}