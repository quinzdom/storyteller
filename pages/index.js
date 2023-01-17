import Head from 'next/head';
import React from 'react';
import { useState } from 'react';
import styles from './index.module.css';

export default function Home() {
  const [genre, setGenre] = useState('comedy');
  const [characters, setCharacters] = useState('');
  const [paragraphs, setParagraphs] = useState('1')

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
      body: JSON.stringify({genre, characters, paragraphs }),
    });
    const data = await response.json();
    setResult(data.result.replaceAll('\n', '<br />'));
    setLoading(false);
  }

  return (
    <div>
    
      <Head>
        <title>Storyteller</title>
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

          <label>Name a character</label>
          <input
            type="text"
            name="characters"
            placeholder="Name another character"
            value={characters}
            onChange={(e) => setCharacters(e.target.value)}
            />
            
          <label>Paragraphs</label>
          <div className={styles.paragraphs}>
            <button type="button" onClick={() => setParagraphs('1')}>1</button>
            <button type="button"  onClick={() => setParagraphs('3')}>3</button>
            <button type="button"  onClick={() => setParagraphs('6')}>6</button>
          </div>
          

          <input type="submit" value="create story" />
          
        </form>

        <div className={styles.summary}>On {genre} and {characters}: a {paragraphs} paragraph story</div>


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