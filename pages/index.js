import Head from 'next/head';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import styles from '../styles/index.module.css';
import { Analytics } from '@vercel/analytics/react';
import Generate from './image'
import Image from "next/image";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PlaceName = (props) => {
  return (
      <input
        type="text"
        name="place"
        placeholder="Name a place"
        value={props.place}
        onChange={(event) => props.setPlace(event.target.value)}
        />
  )
}
const CharacterName = (props) => {
  return (
      <input
          type="text"
          // name="characters"
          placeholder="Name a character"
          value={props.characters}
          onChange={(event) => props.setCharacters(event.target.value)}
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
  const [place, setPlace] = useState('');
  const [characters, setCharacters] = useState('');
  const [paragraphs, setParagraphs] = useState('')
  
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState('');

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  
  const spelledOutNumbers = {
    1: 'one',
    3: 'three',
    6: 'six'
  }
  let spelledOutParagraphs = spelledOutNumbers[paragraphs]
//story submit
  async function onSubmit(event) {
    event.preventDefault();
    if (loading) {
      return;
    }
    handleSubmit(event);
    setLoading(true);
    setStory('');
    console.log(JSON.stringify({genre, place, characters, paragraphs }));
    const response = await fetch('/api/generate-gifts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({genre, place, characters, paragraphs }),
    });
    const data = await response.json();
   setStory(data.story);
   setLoading(false);
  }
//image submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: characters + place + "Retro comic style artwork, highly detailed James Bond, comic book cover, symmetrical, vibrant"
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({prediction})
      setPrediction(prediction);
    }
  };
//The Page
  return (
    <div className={styles.page}>
      <Head>
        <title>Storyteller</title>
        <link rel="icon" type="image/x-icon" href="/images/icons96.png" />
      </Head>
      
      <main className={styles.main}>
        <h3>Storyteller &nbsp;</h3>

        {/* <form className={styles.main} onSubmit={handleSubmit}>
          <input type="text" 
          name="prompt" 
          placeholder="Enter a prompt" />
          <button type="submit">generate image</button>
        </form> */}

        <form onSubmit={onSubmit}>
          <label>Select the genre</label>
          <GenreSelect genre={genre} setGenre={setGenre}/>

          <label>Name a place</label>
          <PlaceName place = {place} setPlace={setPlace}/>
          
          <label>Name a character</label>
          <CharacterName characters = {characters} setCharacters={setCharacters}/>

          <label>Paragraphs</label>
          <NumberOfParagraphs
            options={['1', '3', '6',]}
            onChange={(selectedOption) => setParagraphs(selectedOption)}
          />
          
          <button type="createStory"
            onClick={handleClick}
            className={`
          ${clicked ? styles.clicked : ''} 
          ${loading ? styles.loadingButton : ''}`}>
            create story{clicked}</button> 
          
        </form>
        
        <div className={styles.summaryTitle}>on {genre}  
        {characters && ` and ${characters}`}</div>
        
        <div className={styles.summaryBody}>
          {spelledOutParagraphs && `a ${spelledOutParagraphs} paragraph story`}</div>
         
        {prediction && (
          <div>
            {prediction.output && (
              <div className={styles.imageWrapper}>
                <Image
                  fill
                  src={prediction.output[prediction.output.length - 1]}
                  alt="output"
                  sizes='100vw'
                />
              </div>
            )}
            <p>status: {prediction.status}</p>
          </div>
        )}
        {loading && (

          <div className={styles.loading}>
            <div className="loading">Creating a Story...</div>

            <div className={styles.load}><link rel="icon" type="image/x-icon" 
            href="/images/icons32.png" /></div>
          </div>
        )}
        
        <div
          className={styles.theStory}
        >
          
           <div className="theStory2">{story}</div>
           {/* <div className="theStory1">Image</div> */}
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