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
    chapter: "Module 1",
    text: "Which statement BEST captures the primary objective of LLMOps?",
    options: [
      { id: "A", text: "To design new language models from scratch" },
      { id: "B", text: "To provide the operational practices that turn LLM prototypes into reliable, production-grade applications" },
      { id: "C", text: "To compress training datasets for faster pre-training" },
      { id: "D", text: "To fine-tune models purely for academic benchmarks" },
    ],
    correctAnswerId: "B",
  },
  {
    id: 2,
    chapter: "Module 1",
    text: "Which of the following challenges is NOT typically addressed by LLMOps?",
    options: [
      { id: "A", text: "Cost & latency monitoring" },
      { id: "B", text: "Prompt version management" },
      { id: "C", text: "Real-time GPU over-clocking" },
      { id: "D", text: "Evaluation & benchmarking" },
    ],
    correctAnswerId: "C",
  },
  {
    id: 3,
    chapter: "Module 2",
    text: "An LLM decomposes an open-ended goal into sub-tasks, delegates them to worker agents, and re-evaluates if needed. Which architectural pattern does this describe?",
    options: [
      { id: "A", text: "Tool Use (Function Calling)" },
      { id: "B", text: "Reflection (Evaluator-Optimiser)" },
      { id: "C", text: "Planning (Orchestrator-Workers)" },
      { id: "D", text: "Prompt Chaining" },
    ],
    correctAnswerId: "C",
  },
  {
    id: 4,
    chapter: "Module 2",
    text: "As you move from deterministic workflows toward multi-agent collaboration, which attribute increases the MOST while predictability generally decreases?",
    options: [
      { id: "A", text: "Deterministic execution" },
      { id: "B", text: "System agency / autonomy" },
      { id: "C", text: "Control over latency" },
      { id: "D", text: "Ease of unit testing" },
    ],
    correctAnswerId: "B",
  },
  {
    id: 5,
    chapter: "Module 3",
    text: "Within a trace, which observation type extends span semantics with model-specific attributes such as prompt, completion, and token usage?",
    options: [
      { id: "A", text: "Event" },
      { id: "B", text: "Span" },
      { id: "C", text: "Generation" },
      { id: "D", text: "Metric" },
    ],
    correctAnswerId: "C",
  },
  {
    id: 6,
    chapter: "Module 3",
    text: "Recording the p99 latency at the LLM layer primarily helps answer which of the following questions?",
    options: [
      { id: "A", text: "Which sessions hit the cost guard-rail?" },
      { id: "B", text: "Do we observe long-tail latency spikes in a particular region or release?" },
      { id: "C", text: "Which prompt version produced this output?" },
      { id: "D", text: "Did the router misclassify the user intent?" },
    ],
    correctAnswerId: "B",
  },
  {
    id: 7,
    chapter: "Module 4",
    text: "In the continuous evaluation loop, what is the step that follows the creation or curation of test datasets?",
    options: [
      { id: "A", text: "Deploy changes directly to production" },
      { id: "B", text: "Run experiments, then evaluate the results" },
      { id: "C", text: "Collect implicit user feedback" },
      { id: "D", text: "Red-team the application" },
    ],
    correctAnswerId: "B",
  },
  {
    id: 8,
    chapter: "Module 4",
    text: "Which of the following is an example of implicit user feedback that can be used for online evaluation?",
    options: [
      { id: "A", text: "Thumbs-up / thumbs-down rating" },
      { id: "B", text: "User dwell-time on the generated answer" },
      { id: "C", text: "Manual expert annotation" },
      { id: "D", text: "Model-based toxicity score" },
    ],
    correctAnswerId: "B",
  },
  {
    id: 9,
    chapter: "Module 5",
    text: "Which prompting strategy intentionally includes 1-5 example interactions to guide the model's style or structure?",
    options: [
      { id: "A", text: "Zero-shot" },
      { id: "B", text: "Few-shot / In-context" },
      { id: "C", text: "Chain-of-thought" },
      { id: "D", text: "Retrieval-Augmented Generation" },
    ],
    correctAnswerId: "B",
  },
  {
    id: 10,
    chapter: "Module 5",
    text: "What is the PRIMARY reason for versioning prompts in production environments?",
    options: [
      { id: "A", text: "To reduce token usage through compression" },
      { id: "B", text: "To enable instant rollback and traceability when quality or compliance issues arise" },
      { id: "C", text: "To automatically fine-tune a new base model" },
      { id: "D", text: "To avoid adjusting temperature settings" },
    ],
    correctAnswerId: "B",
  },
  {
    id: 11,
    chapter: "Module 4",
    text: "Why must automated evaluators powered by smaller LLMs be periodically calibrated against human-annotated samples?",
    options: [
      { id: "A", text: "They are deterministic and never change" },
      { id: "B", text: "They can drift or inherit biases, leading to mis-aligned scoring" },
      { id: "C", text: "Human annotations are required by law" },
      { id: "D", text: "Calibration lowers computational cost" },
    ],
    correctAnswerId: "B",
  },
  {
    id: 12,
    chapter: "Module 3",
    text: "In a multi-step LLM pipeline, which layer is MOST likely to dominate end-to-end latency if not instrumented properly?",
    options: [
      { id: "A", text: "LLM token generation" },
      { id: "B", text: "External tool calls such as database or vector store look-ups" },
      { id: "C", text: "Logging of user feedback" },
      { id: "D", text: "Version control operations" },
    ],
    correctAnswerId: "B",
  },
];

const passingScore = 8;

// Define props for CertificateDisplay
interface CertificateDisplayProps {
  certificateName: string;
  setCertificateName: (name: string) => void;
}

// Moved CertificateDisplay outside of InteractiveQuiz
const CertificateDisplay: React.FC<CertificateDisplayProps> = ({ certificateName, setCertificateName }) => (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      border: '5px solid #7F00FF', // Langfuse purple
      padding: '40px', 
      marginTop: '30px',
      backgroundColor: '#ffffff', 
      borderRadius: '15px', 
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
      textAlign: 'center',
      maxWidth: '700px', 
      margin: '30px auto' 
    }}>
      {/* Langfuse Logo Image */}
      <img 
        src="/langfuse_logo.png" 
        alt="Langfuse Logo"
        style={{
          width: '200px', // Adjust width as needed
          height: 'auto', // Maintain aspect ratio
          display: 'block',
          marginBottom: '30px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      />

      <h1 style={{ 
        color: '#333333', 
        marginBottom: '20px', 
        fontSize: '2.4em',
        fontWeight: 600 
      }}>
        🏆 Certificate of Completion 🏆
      </h1>
      <p style={{ 
        fontSize: '1.2em', 
        marginBottom: '20px',
        color: '#555555' 
      }}>
        This is to certify that:
      </p>
      
      <input 
        type="text"
        value={certificateName}
        onChange={(e) => setCertificateName(e.target.value)}
        placeholder="Type Your Name Here"
        aria-label="Enter your name for the certificate"
        style={{
          width: '80%',
          maxWidth: '450px',
          padding: '15px 20px',
          marginBottom: '30px', 
          fontSize: '1.8em', 
          fontWeight: 'bold',
          textAlign: 'center',
          border: `2px solid #7F00FF`, 
          borderRadius: '8px',
          color: '#7F00FF', 
          boxSizing: 'border-box',
          backgroundColor: '#f8f9fa' 
        }}
      />

      <p style={{ 
        fontSize: '1.15em', 
        marginBottom: '25px', 
        color: '#555555',
        lineHeight: 1.6 
      }}>
        Has successfully completed the Langfuse Academy, demonstrating foundational knowledge in LLM Observability and Engineering, including:
      </p>
      <ul style={{ 
        listStyleType: 'none', 
        paddingLeft: '0',
        margin: '25px auto', 
        maxWidth: '500px', 
        textAlign: 'left', 
        fontSize: '1.1em', 
        color: '#444444' 
      }}>
        {[
          "Introduction to Langfuse & Core Concepts",
          "Understanding LLM Application Architectures",
          "Effective Tracing with Langfuse",
          "Comprehensive Evaluation and Scoring",
          "Advanced Prompt Management Techniques"
        ].map(item => (
          <li key={item} style={{ 
            marginBottom: '12px', 
            paddingLeft: '1.5em', 
            position: 'relative' 
          }}>
            <span style={{ 
              position: 'absolute',
              left: '0',
              top: '0.1em', 
              color: '#7F00FF', 
              fontWeight: 'bold',
              fontSize: '1.2em' 
            }}>
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>
      <p style={{ 
        fontSize: '1.1em', 
        marginTop: '30px', 
        marginBottom: '25px',
        color: '#555555'
      }}>
        {`Date of Completion: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
      </p>
      <hr style={{ 
        margin: '35px auto', 
        borderColor: '#e0cffc', 
        borderTop: '2px solid #e0cffc', 
        width: '85%' 
      }} />
      <p style={{ 
        fontWeight: 600, 
        fontSize: '1.15em', 
        color: '#7F00FF', 
        marginTop: '25px' 
      }}>
        Share Your Achievement!
      </p>
      <p style={{ 
        fontSize: '0.95em', 
        marginBottom: '20px', 
        color: '#6c757d' 
      }}>
        (We recommend taking a screenshot of this certificate to share on LinkedIn or other platforms.)
      </p>
    </div>
  );

export const InteractiveQuiz: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [certificateName, setCertificateName] = useState("");

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
        
        {score >= passingScore && <CertificateDisplay certificateName={certificateName} setCertificateName={setCertificateName} />}

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