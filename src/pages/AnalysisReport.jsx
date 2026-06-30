import { useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  AlertTriangle,
  FileText,
  CheckCircle,
  Brain,
  ArrowLeft,
} from "lucide-react";

export default function AnalysisReport() {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state;

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-white">
        <h2 className="text-2xl font-bold">No Analysis Found</h2>

        <button
          onClick={() => navigate("/upload")}
          className="mt-6 bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-500"
        >
          Upload Document
        </button>
      </div>
    );
  }

  const riskColor =
    result.risk_level === "Low"
      ? "text-green-400"
      : result.risk_level === "Medium"
        ? "text-yellow-400"
        : "text-red-400";

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-8 text-zinc-400 hover:text-white"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Brain className="text-blue-500" size={36} />
          <div>
            <h1 className="text-4xl font-bold">AI Document Analysis</h1>

            <p className="text-zinc-400 mt-2">Generated using Gemini AI</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 rounded-xl p-6">
            <ShieldCheck className="text-green-400 mb-4" size={32} />

            <h3 className="text-zinc-400 text-sm">Authenticity</h3>

            <p className="text-2xl font-bold mt-2">{result.prediction}</p>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6">
            <CheckCircle className="text-blue-400 mb-4" size={32} />

            <h3 className="text-zinc-400 text-sm">Confidence</h3>

            <p className="text-2xl font-bold mt-2">{result.confidence}%</p>

            <div className="w-full bg-zinc-700 rounded-full h-3 mt-4">
              <div
                className="bg-blue-500 h-3 rounded-full"
                style={{
                  width: `${result.confidence}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6">
            <AlertTriangle className="text-orange-400 mb-4" size={32} />

            <h3 className="text-zinc-400 text-sm">Risk Level</h3>

            <p className={`text-2xl font-bold mt-2 ${riskColor}`}>
              {result.risk_level}
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl p-8 mt-8">
          <div className="flex items-center gap-3 mb-5">
            <FileText className="text-blue-400" />
            <h2 className="text-2xl font-bold">Summary</h2>
          </div>

          <p className="text-zinc-300 leading-8">{result.summary}</p>
        </div>

        <div className="bg-zinc-900 rounded-xl p-8 mt-8">
          <h2 className="text-2xl font-bold mb-5">Reasons</h2>

          <ul className="space-y-4">
            {result.reasons.map((reason, index) => (
              <li key={index} className="flex gap-3 items-start">
                <CheckCircle className="text-green-400 mt-1" size={18} />

                <span className="text-zinc-300">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="bg-zinc-900 rounded-xl p-8">
            <h2 className="text-xl font-bold mb-5">Recommendation</h2>

            <p className="text-zinc-300">{result.recommendation}</p>
          </div>

          <div className="bg-zinc-900 rounded-xl p-8">
            <h2 className="text-xl font-bold mb-5">Document Type</h2>

            <span className="bg-blue-600 px-4 py-2 rounded-lg">
              {result.detected_document_type}
            </span>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">Key Entities</h2>

          <div className="flex flex-wrap gap-4">
            {result.key_entities.map((entity, index) => (
              <span key={index} className="bg-zinc-800 px-4 py-2 rounded-full">
                {entity}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
