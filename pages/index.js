import Head from 'next/head';
import React from 'react';
import { useState } from 'react';
import styles from './index.module.css';
import { Analytics } from '@vercel/analytics/react';

const CharacterName = (props) => {
  return (
      <input
          type="text"
          name="characters"
          placeholder="Name a character"
          value={props.characters}
          onChange={(e) => props.setCharacters(e.target.value)}
      />)
}
const GenreSelect = (props) => {
  return (
    <select
      name="genre"
      value={props.genre}
      onChange={(e) => props.setGenre(e.target.value)}
    >
      <option value="Comedy">Comedy</option>
      <option value="Tragedy">Tragedy</option>
      <option value="Rags to Riches">Rags to Riches</option>
      <option value="A Great Quest">A Great Quest</option>
      <option value="Coming of Age">Coming of Age</option>
      <option value="Romantic Comedy">Romantic Comedy</option>
    </select>
  );
}
const NumberOfParagraphs = ({ options, onChange }) => {
  const [selected, setSelected] = useState(options['']);

  return (
    <div className={styles.paragraphs}>
      {options.map((option) => (
        <button 
          key={option} 
          type="button" 
          onClick={() => {
            setSelected(option);
            onChange(option);
          }}
          className={selected === option ? styles.active : ''}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export default function Home() {
  const [clicked, setClicked] = useState(false);
  function handleClick() {
    setClicked(!clicked);
  }
  const [genre, setGenre] = useState('Comedy');
  const [characters, setCharacters] = useState('');
  const [paragraphs, setParagraphs] = useState('0')

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const spelledOutNumbers = {
    1: 'one',
    3: 'three',
    6: 'six'
  }
  let spelledOutParagraphs = spelledOutNumbers[paragraphs]

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
    setResult(data.result);
    setLoading(false);
  }

  return (
    <div className={styles.page}>
    
      <Head>
        <title>Storyteller</title>
        <link rel="icon" type="image/x-icon" href="/images/icons96.png" />
      </Head>
      
      <main className={styles.main}>
        <h3>Storyteller &nbsp;</h3>
        <form onSubmit={onSubmit}>
         
          <label>Select the genre</label>
          <GenreSelect genre={genre} setGenre={setGenre}/>

          
          <label>Name a character</label>
          <CharacterName characters = {characters} setCharacters={setCharacters}/>
            
          <label>Paragraphs</label>
          <NumberOfParagraphs
            options={['1', '3', '6',]}
            onChange={(selectedOption) => setParagraphs(selectedOption)}
          />
          
          <button type="createStory" onClick={handleClick} 
          className={`
          ${clicked ? styles.clicked : ''} 
          ${loading ? styles.loadingButton : ''}`}>
          create story{clicked}</button> 
          
        </form>
        
        <div className={styles.summaryTitle}>on {genre}  
        {characters && ` and ${characters}`}</div>
        
        <div className={styles.summaryBody}>
          
          {spelledOutParagraphs && `a ${spelledOutParagraphs} paragraph story`}</div>


        {loading && (

          <div className={styles.loading}>
            <loading>Creating a Story...</loading>

            <div className={styles.load}><link rel="icon" type="image/x-icon" 
            href="/images/icons32.png" /></div>
          </div>
        )}
        
        <div
          className={styles.result}
        >
          {result}
        </div>
        
        <footer>Made by Yuta<br/>
        <a href="https://github.com/quinzdom/storyteller">Github</a>
        &nbsp;|&nbsp;
        <a href="mailto: yutakato1@gmail.com">Email</a>
        </footer>
        <Analytics />
      </main>
      
    </div>
  );
}