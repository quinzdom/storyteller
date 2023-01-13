import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const {genre, hobbies } = req.body;
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: generatePrompt(genre, hobbies),
    temperature: 0.6,
    max_tokens: 2048,
  });
  res.status(200).json({ result: completion.data.choices[0].text });
}
// function generatePrompt(genre, hobbies) {
//   return `In under 200 words tell a ${genre} story involving ${hobbies}. `;
// }

function generatePrompt(genre, hobbies) {
  return `Phasellus a massa a magna pharetra consequat. Maecenas cursus metus felis, vitae pretium purus rutrum nec. Proin sollicitudin, turpis at tempor tincidunt, nibh ante vehicula urna, eget efficitur nunc massa pellentesque ipsum. Etiam id rhoncus dolor. Suspendisse varius lorem nisi, nec scelerisque libero gravida quis. Aenean et fermentum sem. Aenean ultrices eros justo, quis aliquet justo fringilla ac. Morbi tincidunt bibendum turpis, ac viverra odio maximus volutpat. Vestibulum ultrices sodales est, ut pulvinar ligula imperdiet bibendum. Vivamus ac ullamcorper nisl. Interdum et malesuada fames ac ante ipsum primis in faucibus. Proin semper tellus at dui mollis sollicitudin. In sit amet felis nibh. Aliquam metus ante, varius in volutpat non, suscipit eu mi.

  `;
}