import { useEffect, useState } from "react";
import axios from "axios";
import { marked } from "marked";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import "./App.css";

marked.setOptions({
  gfm: true,
  breaks: true,
});

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://ai-code-reviewer-app-7yqo.onrender.com";

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);

  const [review, setReview] = useState("Your code review will appear here.");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.querySelectorAll(".review-output pre code").forEach((block) => {
      hljs.highlightElement(block);
    });
  }, [review]);

  async function reviewCode() {
    try {
      if (!code.trim()) {
        setReview("⚠️ Please write some code first.");
        return;
      }

      setLoading(true);
      setReview("Reviewing code...");

      const response = await axios.post(`${BACKEND_URL}/ai/get-review`, {
        code,
      });

      if (typeof response.data === "string") {
        setReview(response.data);
      } else if (response.data?.review) {
        setReview(response.data.review);
      } else if (response.data?.error) {
        setReview("⚠️ " + response.data.error);
      } else {
        setReview("⚠️ Invalid response from server.");
      }
    } catch (error) {
      console.error("Axios Error:", error);

      if (error.response?.data?.error) {
        setReview("⚠️ " + error.response.data.error);
      } else if (typeof error.response?.data === "string") {
        setReview("⚠️ " + error.response.data);
      } else if (error.request) {
        setReview(
          "⚠️ Backend server is not responding. Check if your backend URL is correct."
        );
      } else {
        setReview("⚠️ Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  const highlightedCode = Prism.highlight(
    code,
    Prism.languages.javascript,
    "javascript"
  );

  return (
    <main>
      <div className="left">
        <div className="code-editor">
          <pre className="code-highlight">
            <code
              dangerouslySetInnerHTML={{
                __html: highlightedCode,
              }}
            />
          </pre>

          <textarea
            className="code-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
          />
        </div>

        <button className="review" onClick={reviewCode} disabled={loading}>
          {loading ? "Reviewing..." : "Review"}
        </button>
      </div>

      <div className="right">
        <div
          className="review-output"
          dangerouslySetInnerHTML={{
            __html: marked.parse(String(review)),
          }}
        />
      </div>
    </main>
  );
}

export default App;