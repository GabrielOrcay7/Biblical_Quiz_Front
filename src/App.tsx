// src/App.tsx
import React, { useState, useEffect } from "react"; //Importamos React e dois hooks: useState (para gerenciar estados) e useEffect (para executar efeitos colaterais, como buscar dados).
import axios from "axios"; //Biblioteca para fazer requisições HTTP.
import './App.css';

type Question = { // Define a estrutura das perguntas do quiz, incluindo a pergunta em si, as opções de resposta, a resposta correta e uma explicação.
  question: string; //Pergunta
  options: string[]; //Alternativas
  answer: string; //Resposta
  explanation: string; //Explicação
};

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]); //Armazena as perguntas carregadas do backend.
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]); //Um array que armazena as respostas selecionadas, inicialmente preenchido com null
  const [score, setScore] = useState(0); //Mantém a pontuação do usuário.
  const [isQuizCompleted, setIsQuizCompleted] = useState(false); //Indica se o quiz foi completado.

  useEffect(() => { //Esse hook (componente) é chamado quando o componente é montado. Ele executa a função fetchQuestions para buscar as perguntas da API.
    const fetchQuestions = async () => { 
      try {
        const response = await axios.get("http://localhost:5000/api/quiz"); //Chamada da API
        console.log("Perguntas carregadas:", response.data); // Log das perguntas carregadas
        setQuestions(response.data);
        setSelectedAnswers(new Array(response.data.length).fill(null)); // Inicializa respostas com null
      } catch (error) {
        console.error("Erro ao carregar as perguntas:", error);
      }
    }; // Função assíncrona que faz uma requisição GET para buscar as perguntas. Se bem-sucedida, atualiza os estados questions e selectedAnswers. Caso ocorra um erro, ele é logado no console.

    fetchQuestions();
  }, []);

  const handleAnswer = (index: number, selectedOption: string) => { //Função que lida com a seleção de uma resposta.
    // Se a resposta já foi escolhida, não faz nada
    if (selectedAnswers[index] === null) {
      // Atualiza a resposta selecionada
      const updatedAnswers = [...selectedAnswers];
      updatedAnswers[index] = selectedOption;
      setSelectedAnswers(updatedAnswers);

      // Adiciona ao score se a resposta estiver correta
      if (selectedOption === questions[index].answer) {
        setScore(score + 1);
      }

      // Se a última pergunta foi respondida, completa o quiz
      if (index === questions.length - 1) {
        setIsQuizCompleted(true);
      }
    }
  };

  if (isQuizCompleted) {
    return (
      <div>
        <h1>Sua pontuação: {score} de {questions.length}</h1>
      </div>
    );
  }

  if (questions.length === 0) {
    return <h1>Carregando perguntas...</h1>;
  } // Se o quiz foi completado, exibe a pontuação. Se as perguntas ainda estão sendo carregadas, exibe uma mensagem de carregamento.

  return (
    <div>
      <h2>Quiz Bíblico</h2>
      {questions.map((question, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <h3>{question.question}</h3>
          {question.options.map(option => {
            const isSelected = selectedAnswers[index] === option;
            const isCorrect = option === question.answer && isSelected;
            const isWrong = option !== question.answer && isSelected;

            return (
              <div key={option}>
                <button
                  style={{
                    backgroundColor: isCorrect ? "green" : isWrong ? "red" : "lightgray",
                    color: "black",
                    padding: "10px",
                    margin: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleAnswer(index, option)} // Chama a função ao clicar
                  disabled={!!selectedAnswers[index]} // Desabilita o botão após seleção
                >
                  {option}
                </button>
                {isSelected && ( // Exibe feedback se a opção foi selecionada
                  <div>
                    <p>
                      {isCorrect ? "Correto!" : "Errado!"} Resposta correta: {question.answer}.
                    </p>
                    <p><strong>Explicação:</strong> {question.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

//Componente que mapeia sobre as questions e renderiza cada pergunta com suas opções
//Para cada opção, um botão é criado. A cor do botão muda conforme a resposta é correta (verde) ou errada (vermelha).
//Se uma opção é selecionada, um feedback aparece, informando se a resposta estava correta ou errada, junto com a resposta correta e uma explicação.

export default App;
