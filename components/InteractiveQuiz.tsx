import React, { useState } from 'react';
import { Callout } from 'nextra/components';

interface Question {
  id: number;
  text: string;
  options: { id: string; text: string }[];
  correctAnswerId: string;
  chapter: string;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    chapter: "Chapter 1: Introduction",
    text: "What is Langfuse primarily designed for?",
    options: [
      { id: "A", text: "General software debugging" },
      { id: "B", text: "LLM Engineering: debugging, analysis, and iteration on LLM applications" },
      { id: "C", text: "Database management" },
      { id: "D", text: "Frontend UI development" },
    ],
    correctAnswerId: "B",
  },
  {
    id: 2,
    chapter: "Chapter 1: Introduction",
    text: "Which of these is NOT a core pillar of the Langfuse platform?",
    options: [
      { id: "A", text: "Tracing" },
      { id: "B", text: "Real-time user collaboration tools (like Google Docs)" },
      { id: "C", text: "Evaluation / Scoring" },
      { id: "D", text: "Prompt Management" },
    ],
    correctAnswerId: "B",
  },
  {
    id: 3,
    chapter: "Chapter 2: Application Architectures",
    text: "What does RAG stand for in the context of LLM applications?",
    options: [
      { id: "A", text: "Really Awesome Graphics" },
      { id: "B", text: "Retrieval Augmented Generation" },
      { id: "C", text: "Runtime Analysis Gateway" },
      { id: "D", text: "Recursive Agent Grouping" },
    ],
    correctAnswerId: "B",
  },
  {
    id: 4,
    chapter: "Chapter 2: Application Architectures",
    text: "Why is versioning important for prompts and model configurations in LLM applications?",
    options: [
      { id: "A", text: "It's a legal requirement." },
      { id: "B", text: "To track changes, reproduce results, and facilitate A/B testing." },
      { id: "C", text: "To make the application run faster." },
      { id: "D", text: "It's only important for small projects." },
    ],
    correctAnswerId: "B",
  },
  {
    id: 5,
    chapter: "Chapter 3: Tracing",
    text: "What is a 'trace' in Langfuse?",
    options: [
      { id: "A", text: "A user's click path on a website." },
      { id: "B", text: "A log of server errors." },
      { id: "C", text: "An end-to-end record of a single execution/call in an LLM application, including inputs, outputs, and intermediate steps." },
      { id: "D", text: "A type of chart for visualizing data." },
    ],
    correctAnswerId: "C",
  },
  {
    id: 6,
    chapter: "Chapter 3: Tracing",
    text: "True or False: Langfuse traces can only capture text data.",
    options: [
      { id: "A", text: "True" },
      { id: "B", text: "False" },
    ],
    correctAnswerId: "B",
  },
  {
    id: 7,
    chapter: "Chapter 4: Evaluation",
    text: "What is the primary purpose of 'scores' in Langfuse?",
    options: [
      { id: "A", text: "To bill users for API usage." },
      { id: "B", text: "To quantify the quality or performance of LLM generations and application outputs." },
      { id: "C", text: "To rank users on a leaderboard." },
      { id: "D", text: "To measure website loading speed." },
    ],
    correctAnswerId: "B",
  },
  {
    id: 8,
    chapter: "Chapter 4: Evaluation",
    text: "Which of the following is a common approach to LLM evaluation?",
    options: [
      { id: "A", text: "Only manual human review." },
      { id: "B", text: "Only automated metrics like BLEU score." },
      { id: "C", text: "A combination of human feedback, model-based evaluations, and custom metrics." },
      { id: "D", text: "Guessing based on intuition." },
    ],
    correctAnswerId: "C",
  },
  {
    id: 9,
    chapter: "Chapter 5: Prompt Management",
    text: "What is a key benefit of using Langfuse for prompt management?",
    options: [
      { id: "A", text: "It automatically writes perfect prompts for you." },
      { id: "B", text: "It allows versioning, A/B testing, and deploying prompts with associated configurations." },
      { id: "C", text: "It translates prompts into different languages." },
      { id: "D", text: "It guarantees your LLM will always provide factual answers." },
    ],
    correctAnswerId: "B",
  },
  {
    id: 10,
    chapter: "Chapter 5: Prompt Management",
    text: "When managing prompts, what does 'linking a prompt to a trace' help with?",
    options: [
      { id: "A", text: "It makes the trace run faster." },
      { id: "B", text: "It helps understand which prompt version was used to generate a specific output, aiding in debugging and analysis." },
      { id: "C", text: "It automatically improves the prompt." },
      { id: "D", text: "It's primarily for billing purposes." },
    ],
    correctAnswerId: "B",
  },
];

const passingScore = 8;

export const InteractiveQuiz: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionChange = (questionId: number, optionId: string) => {
    if (submitted) return; 
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionId,
    });
  };

  const handleSubmit = () => {
    let currentScore = 0;
    quizQuestions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswerId) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setSubmitted(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  // Basic styles - can be expanded
  const quizContainerStyle: React.CSSProperties = {
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  };

  const questionBlockStyle: React.CSSProperties = {
    marginBottom: '25px',
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#ffffff'
  };

  const questionTextStyle: React.CSSProperties = {
    fontWeight: 'bold',
    marginBottom: '15px',
    fontSize: '1.1em'
  };

  const optionLabelStyle: React.CSSProperties = {
    display: 'block',
    padding: '10px',
    margin: '5px 0',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  };
  
  const optionInputStyle: React.CSSProperties = {
    marginRight: '10px'
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    fontSize: '1.1em',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '10px'
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#7F00FF',
    color: 'white'
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    color: 'white',
    marginLeft: '10px'
  };

  const resultLabelStyle = (isSelected: boolean, isCorrect: boolean): React.CSSProperties => {
    let style: React.CSSProperties = { padding: '10px', margin: '5px 0', borderRadius: '5px' };
    if (isSelected && isCorrect) {
      style = { ...style, fontWeight: 'bold', color: 'green', backgroundColor: '#e6ffed' };
    } else if (isSelected && !isCorrect) {
      style = { ...style, fontWeight: 'bold', color: 'red', backgroundColor: '#ffe6e6' };
    } else if (isCorrect) {
      style = { ...style, color: 'green', backgroundColor: '#e6ffed' }; // Indicate correct if not selected
    }
    return style;
  };

  const CertificateDisplay = () => (
    <div style={{
      border: '2px solid #7F00FF',
      padding: '20px',
      marginTop: '30px',
      backgroundColor: '#f3e6ff',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', color: '#5a00b3', marginBottom: '20px' }}>🏆 Certificate of Completion 🏆</h2>
      <p style={{ textAlign: 'center', fontSize: '1.2em' }}>This is to certify that:</p>
      <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.8em', margin: '25px 0', color: '#5a00b3' }}>
        [Your Name Here]
      </p>
      <p style={{ textAlign: 'center', fontSize: '1.1em' }}>
        Has successfully completed the Langfuse Academy, demonstrating understanding of:
      </p>
      <ul style={{ listStyleType: '✔', paddingLeft: '50px', margin: '20px auto', maxWidth: '400px' }}>
        <li style={{ marginBottom: '8px' }}>Introduction to Langfuse</li>
        <li style={{ marginBottom: '8px' }}>LLM Application Architectures</li>
        <li style={{ marginBottom: '8px' }}>Tracing with Langfuse</li>
        <li style={{ marginBottom: '8px' }}>Evaluation and Scoring</li>
        <li>Prompt Management</li>
      </ul>
      <p style={{ textAlign: 'center', fontSize: '1.1em', marginTop: '20px' }}>{`Date: [Date of Completion - e.g., ${new Date().toLocaleDateString()}]`}</p>
      <hr style={{ margin: '30px 0', borderColor: '#c5a3ff' }} />
      <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.1em', color: '#5a00b3'}}>Share your achievement on LinkedIn!</p>
      <p style={{ textAlign: 'center', fontSize: '0.9em'}}>
        (We recommend taking a screenshot of this certificate or creating your own badge to share.)
      </p>
      <div style={{ marginTop: '20px'}}>
        <Callout type="info">
          Consider adding "Langfuse Academy Graduate" to your LinkedIn profile's education or licenses & certifications section.
        </Callout>
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div style={quizContainerStyle}>
        <h3>Quiz Results</h3>
        <p>{`Your score: ${score} / ${quizQuestions.length}`}</p>
        {score >= passingScore ? (
          <Callout type="info">Congratulations! You passed the quiz.</Callout>
        ) : (
          <Callout type="error">
            {`You did not pass the quiz. You need at least ${passingScore} correct answers. Please try again.`}
          </Callout>
        )}

        {quizQuestions.map((q, index) => (
          <div key={q.id} style={questionBlockStyle}>
            <p style={questionTextStyle}>{`${index + 1}. (${q.chapter}) ${q.text}`}</p>
            {q.options.map(opt => (
              <div key={opt.id} style={resultLabelStyle(selectedAnswers[q.id] === opt.id, q.correctAnswerId === opt.id)}>
                {`${opt.id}) ${opt.text}`}
                {selectedAnswers[q.id] === opt.id && q.correctAnswerId === opt.id && ' ✔️ Correct'}
                {selectedAnswers[q.id] === opt.id && q.correctAnswerId !== opt.id && ' ❌ Incorrect'}
                {selectedAnswers[q.id] !== opt.id && q.correctAnswerId === opt.id && ' (Correct Answer)'}
              </div>
            ))}
             {!selectedAnswers[q.id] && <p style={{color: 'orange', marginTop: '10px'}}>Not answered</p>}
          </div>
        ))}
        
        {score >= passingScore && <CertificateDisplay />}

        <button onClick={resetQuiz} style={secondaryButtonStyle}>
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div style={quizContainerStyle}>
      <div style={{ marginBottom: '20px'}}>
        <Callout>
          {`Test your knowledge by answering the questions below. You need to score at least ${passingScore} out of ${quizQuestions.length} to pass.`}
        </Callout>
      </div>
      {quizQuestions.map((q, index) => (
        <div key={q.id} style={questionBlockStyle}>
          <h4 style={questionTextStyle}>{`${index + 1}. (${q.chapter}) ${q.text}`}</h4>
          {q.options.map(opt => (
            <div key={opt.id}>
              <label 
                style={optionLabelStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = selectedAnswers[q.id] === opt.id ? '#d8b2ff' : '#f0f0f0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedAnswers[q.id] === opt.id ? '#e9d5ff' : 'transparent'}
                onClick={() => handleOptionChange(q.id, opt.id)}
              >
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={opt.id}
                  checked={selectedAnswers[q.id] === opt.id}
                  onChange={() => handleOptionChange(q.id, opt.id)}
                  style={optionInputStyle}
                />
                {`${opt.id}) ${opt.text}`}
              </label>
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit} style={primaryButtonStyle}>
        Submit Quiz
      </button>
    </div>
  );
};

export default InteractiveQuiz; 