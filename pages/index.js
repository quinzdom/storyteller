import Head from 'next/head';
import React from 'react';
import { useState } from 'react';
import styles from './index.module.css';

export default function Home() {
  const [genre, setGenre] = useState('comedy');
  // const [age, setAge] = useState(30);
  // const [priceMin, setPriceMin] = useState(25);
  // const [priceMax, setPriceMax] = useState(100);
  const [hobbies, setHobbies] = useState('');
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState('');

  async function onSubmit(event) {
    event.preventDefault();
    if (loading) {
      return;
    }
    setLoading(true);
    setResult('');
    const response = await fetch('/api/generate-gifts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({genre, hobbies }),
    });
    const data = await response.json();
    setResult(data.result.replaceAll('\n', '<br />'));
    setLoading(false);
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>Storyteller</h3>
        <form onSubmit={onSubmit}>

          <label>Select the genre</label>
          <select
            name="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="comedy">Comedy</option>
            <option value="tragedy">Tragedy</option>
            <option value="Rags to Riches">Rags to Riches</option>
            <option value="A Great Quest">A Great Quest</option>
            <option value="Coming of Age">Coming of Age</option>
            <option value="Romantic Comedy">Romantic Comedy</option>
          </select>

          {/* <label>Age</label>
          <input
            type="number"
            min={1}
            max={99}
            name="age"
            placeholder="Enter the age"
            value={age}
            onChange={(e) => setAge(Number.parseInt(e.target.value))}
          />

          <label>Price from</label>
          <input
            type="number"
            min={1}
            name="priceMin"
            placeholder="Enter the minimum price"
            value={priceMin}
            onChange={(e) => setPriceMin(Number.parseInt(e.target.value))}
          />

          <label>Price to</label>
          <input
            type="number"
            min={1}
            name="priceMax"
            placeholder="Enter the maximum price"
            value={priceMax}
            onChange={(e) => setPriceMax(Number.parseInt(e.target.value))}
          /> */}

          <label>Name a character</label>
          <input
            type="text"
            name="hobbies"
            placeholder="Name another character"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
            />
            
          <input type="submit" value="create story" />

          
        </form>

        
        <div  className={styles.summary}>
        On {genre} and {hobbies}</div>

        {loading && (
          <div>
            <h3>Creating a story...</h3>
          </div>
        )}
        
        <div
          className={styles.result}
          dangerouslySetInnerHTML={{ __html: result }}
        />
      </main>
    </div>
  );
}