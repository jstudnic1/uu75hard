import React, { useState } from 'react';
import Sidebar from './Sidebar'; // Import the Sidebar component

const QuotesPage = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(false);  // State to handle loading status

    const fetchQuote = async () => {
        setLoading(true);  // Start loading
        const url = 'https://famous-quotes4.p.rapidapi.com/random?category=all&count=2';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'a99e730266msh8497ae6517b571bp1c7fb1jsncd64123d641d',
                'X-RapidAPI-Host': 'famous-quotes4.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            if (data && data.length > 0) {
                // Assuming the data is an array of quotes
                setQuotes(data);
            } else {
                // Handle any issues where the quotes are not in the expected format
                setQuotes([{ text: 'Failed to load quotes.', author: 'System' }]);
            }
        } catch (error) {
            console.error('Error fetching quotes:', error);
            setQuotes([{ text: 'Failed to load quotes.', author: 'System' }]);
        }
        setLoading(false);  // End loading
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="content flex-1 p-4">
                <h2>Quotes of the Day</h2>
                <div className="grid gap-4">
                    {loading ? (
                        <div className="card bg-base-200 shadow-xl p-4">
                            <p>Loading...</p>
                        </div>
                    ) : (
                        quotes.map((quote, index) => (
                            <div key={index} className="card bg-base-200 shadow-xl p-4">
                                <p>{quote.text || "No quote loaded."}</p>
                                <p className="text-right">- {quote.author || "Unknown"}</p>
                            </div>
                        ))
                    )}
                </div>
                <button className="btn btn-primary mt-4" onClick={fetchQuote} disabled={loading}>
                    {loading ? 'Loading...' : 'Generate Quotes'}
                </button>
            </div>
        </div>
    );
};

export default QuotesPage;
