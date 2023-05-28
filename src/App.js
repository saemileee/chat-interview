import React, { useEffect, useState } from 'react';
import { useSpeechRecognition } from 'react-speech-kit';
import './App.css';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

function App() {
  const [question, setQuestion] = useState('');
  // const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [value, setValue] = useState('');
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      // 음성인식 결과가 value 상태값으로 할당됩니다.
      setValue(result);
    },
  });

  useEffect(() => {
    setQuestion('this의 용법을 아는대로 설명해주세요.');
  }, []);

  const handleSubmit = (e) => {
    const chatMessage = `Q:${question} A:${value}`;
    e.preventDefault();
    console.log(chatMessage);
    fetch('http://localhost:3001/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ message: chatMessage }),
    })
      .then((res) => res.json())
      .then((data) => setResponse(data));
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <h1>{question}</h1>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
        ></textarea>
        <div>
          <div>{value}</div>
          <button onMouseDown={listen} onMouseUp={stop}>
            🎤
          </button>
          {listening && <div>음성인식 활성화 중</div>}
        </div>
        <button type="submit">Submit</button>
      </form>
      <div>면접관: {response}</div>
    </div>
  );
}

export default App;
