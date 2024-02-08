import { useState, useRef } from "react";
import { BeatLoader } from "react-spinners";

type Props = {};

export default function App({}: Props) {
  const [formData, setFormData] = useState({language: "Hindi", message: ""})
  const [error, setError] = useState("")
  const [showNotification, setShowNotification] = useState(false)
  const [translation, setTranslation] = useState("")
  const [isLoading, setISLoading] = useState(false)
  
  const [expand, setExpand] = useState(false);
  const translatorWrapperRef = useRef(null);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value})
    console.log(formData)
    setError("")
  }

  const translate = async () => {
    const { language, message } = formData;

    try {
      const response = await fetch('http://localhost:3001/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language, message }),
      });

      const result = await response.json();
      const translatedText = result.choices[0].message.content
      setISLoading(false)
      setTranslation(translatedText)
      // console.log(result.choices[0].message.content);
    } catch (error) {
      console.error('Error translating:', error);
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault()
    if (!formData.message) {
      setError("Please enter the message you want translated")
      return;
    }
    setISLoading(true)
    translate()
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(translation)
    .then(() => displayNotification())
    .catch((err) => console.error("Failed to copy: ", err))
  }

  const displayNotification = () => {
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
    }, 3000);
  }

  const expandHeight = () => {
    setExpand(true);
  };

  const collapseHeight = () => {
    setExpand(false);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (
      !translatorWrapperRef.current ||
      !translatorWrapperRef.current.contains(event.relatedTarget as Node)
    ) {
      collapseHeight();
    }
  };

  return (
    <div className="container">
      <h1>TransX ~ ultra</h1>
      <div
        className="translator-wrapper"
        onBlur={handleBlur}
        ref={translatorWrapperRef}
        tabIndex={0} // Add tabIndex to make the div focusable
      >
        <div
          onClick={expandHeight}
          style={{ height: `${expand ? "100%" : ""}` }}
          className="translator-inputbox"
        >
          <div className="header">
            <p>What to translate?</p>
            <h3>🤔</h3>
          </div>
          <textarea name="message" placeholder="Type..." onChange={handleInputChange} ></textarea>
          <form onSubmit={handleOnSubmit}>
            <div className="choices">
              <input type="radio" id="hindi" name="language" value="Hindi" defaultChecked={formData.language} onChange={handleInputChange} />
              <label htmlFor="hindi">Hindi</label>
              <input type="radio" id="spanish" name="language" value="Spanish" onChange={handleInputChange}  />
              <label htmlFor="spanish">Spanish</label>
              <input type="radio" id="japanese" name="language" value="Japanese" onChange={handleInputChange}  />
              <label htmlFor="japanese">Japanese</label>

            </div>
              {error && <div className="error">{error}</div>}
            <div className="translate-btn">
            <button type="submit">Translate</button>
            </div>
          </form>
        </div>
        <div className="translation">
          <div className="copy-btn" onClick={handleCopy}>
            <p>copy</p>
          </div>
          <p>Translation</p>
          <p className="translated-text">{isLoading ? <BeatLoader size={12} color="#f4ff9b" /> : translation}</p>
        </div>

        <div className={`notification ${showNotification ? "active" : ""}`}>
          Copied to clipboard!
        </div>
      </div>
    </div>
  );
}
