import Head from "next/head";
import {useState} from "react";
import styles from "./index.module.css";

export default function Home() {
    const [textInput, setTextInput] = useState("");
    const [buttonValue, setButtonValue] = useState("");
    const [result, setResult] = useState();

    async function onSubmit(event) {
        event.preventDefault();
        try {
            const apiPath = "/api/" + buttonValue;
            const response = await fetch(apiPath, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({text: textInput}),
            });

            const data = await response.json();
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }

            setResult(data.result);
            // setTextInput("");
        } catch (error) {
            // Consider implementing your own error handling logic here
            console.error(error);
            alert(error.message);
        }
    }


    return (
        <div>
            <Head>
                <title>English Assistant</title>
                <link rel="icon" href="/dog.png"/>
            </Head>

            <main className={styles.main}>
                <img src="/dog.png" className={styles.icon}/>
                <h3>Assist you in improving your English</h3>
                <form onSubmit={onSubmit}>
                    <textarea
                        type="text"
                        name="textInput"
                        placeholder="Enter a sentence"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                    />
                    <div>
                        <input type="submit" value="Polish" onClick={(e) => setButtonValue("polish")}/>
                        <input type="submit" value="Translate" onClick={(e) => setButtonValue("translate")}/>
                        <input type="submit" value="Simplify" onClick={(e) => setButtonValue("simplify")}/>
                        <input type="submit" value="Professionalize" onClick={(e) => setButtonValue("professionalize")}/>
                    </div>
                </form>
                <div className={styles.result}>{result}</div>
            </main>
        </div>
    );
}
