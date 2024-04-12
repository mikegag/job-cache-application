import React from "react"
import { useEffect, useState, useRef } from "react"
import quotesData from "../../quotes.json"

export default function Quote() {

    const viewedQuote = useRef(true)
    const [randomQuote, setRandomQuote] = useState(() => {
        // Retrieve the quote from local storage on initial render
        const storedQuote = localStorage.getItem("randomQuote")
        return storedQuote ? JSON.parse(storedQuote) : null
    })

    const getQuote = () => {
        const quotes = quotesData.quotes
        const randomIndex = Math.floor(Math.random() * quotes.length)
        const quote = quotes[randomIndex]
        setRandomQuote(quote)
        localStorage.setItem("randomQuote", JSON.stringify(quote))
        localStorage.setItem("lastQuoteTime", Date.now())
    }

    useEffect(() => {
        const lastQuoteTime = localStorage.getItem('lastQuoteTime')
        const currentTime = Date.now()
        const timeElapsed = currentTime - lastQuoteTime
        const intervalDuration = 1000 * 60 * 60 * 16
    
        if (!viewedQuote.current || timeElapsed >= intervalDuration) {
            getQuote()
            viewedQuote.current = true
        } else {
            const timeRemaining = intervalDuration - timeElapsed;
            const intervalId = setInterval(() => {
                getQuote()
            }, timeRemaining)
    
            return () => clearInterval(intervalId)
        }
    }, [])
    
    return (
        <>
            {randomQuote ? 
                <p>{randomQuote.quote} - {randomQuote.author}</p>
            :
                <p>Check back later for a Motivational Quote!</p>
            }
        </>
    )
}

