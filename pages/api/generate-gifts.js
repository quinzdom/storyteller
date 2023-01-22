import { Configuration, OpenAIApi } from 'openai';
import Typewriter from "typewriter-effect"

let dummy_text = "One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. The bedding was hardly able to cover it and seemed ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked.\n\n\“What’s happened to me?\” he thought. It wasn’t a dream. His room, a proper human room although a little too small, lay peacefully between its four familiar walls. A collection of textile samples lay spread out on the table—Samsa was a travelling salesman—and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame. It showed a lady fitted out with a fur hat and fur boa who sat upright, raising a heavy fur muff that covered the whole of her lower arm towards the viewer.\n\nGregor then turned to look out the window at the dull weather. Drops of rain could be heard hitting the pane, which made him feel quite sad. “How about if I sleep a little bit longer and forget all this nonsense”, he thought, but that was something he was unable to do because he was used to sleeping on his right, and in his present state couldn’t get into that position. However hard he threw himself onto his right, he always rolled back to where he was. He must have tried it a hundred times, shut his eyes so that he wouldn’t have to look at the floundering legs, and only stopped when he began to feel a mild, dull pain there that he had never felt before."

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve,ms));
}

export default async function (req, res) {
  if (false) {
    const { genre, place, characters, paragraphs } = req.body;
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: generatePrompt(genre, place, characters, paragraphs),
      temperature: 0.6,
      max_tokens: 2048,
  });
  res.status(200).json({ story: completion.data.choices[0].text });
}
  else {
    await sleep(1000)
    res.status(200).json({story:dummy_text})
    }
  }

function generatePrompt(genre, place, characters, paragraphs) {
  if (genre === 'Comedy') {
    genre = 'very funny'
  }
  return `Tell a ${genre} story that is set in ${place} and involves ${characters}. Use only ${paragraphs} paragraphs.`;
}



