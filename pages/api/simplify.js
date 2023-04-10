import {ChatGPTAPI} from "chatgpt";
import clipboard from "clipboardy";

const apiKey = process.env.OPENAI_API_KEY;

const chatgpt = new ChatGPTAPI({
    apiKey: apiKey,
    completionParams: {
        temperature: 0.3,
        model: "gpt-3.5-turbo",
    },
    systemMessage: "Simplify the sentence in English, use simplest vocabularies.",
    debug: true,
});

export default async function (req, res) {
    if (!apiKey) {
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured, please follow instructions in README.md",
            }
        });
        return;
    }

    const text = req.body.text || '';
    if (text.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Please enter a valid text",
            }
        });
        return;
    }

    try {
        const response = await chatgpt.sendMessage(text);

        // This clipboard will only function when the application is running on a local machine.
        // It's recommended to use write() if you plan on hosting the application in the cloud.
        clipboard.writeSync(response.text);
        res.status(200).json({result: response.text});
    } catch (error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: 'An error occurred during your request.',
                }
            });
        }
    }
}