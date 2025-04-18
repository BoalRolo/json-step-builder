import React, { useState } from "react";
import { Link } from "react-router-dom";

interface FormState {
  ean: string;
  preco: string;
  motivo: string;
  validadeDias: string;
}

const initialState: FormState = {
  ean: "",
  preco: "",
  motivo: "",
  validadeDias: "",
};

const CodigoDepreciado = () => {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [codigo, setCodigo] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const calcularDigitoVerificacao = (digitos: string[]) => {
    const soma = digitos.reduce((acc, digito, index) => {
      const peso = index % 2 === 0 ? 3 : 1;
      return acc + parseInt(digito) * peso;
    }, 0);
    const mod = soma % 10;
    return mod === 0 ? "0" : (10 - mod).toString();
  };

  const calcularCodigo = () => {
    const eanDigits = [...formState.ean.padStart(13, "0")];
    const precoDigits = [...formState.preco.padStart(6, "0")];
    const motivoDigits = [...formState.motivo.padStart(2, "0")];
    const validadeDigits = [...formState.validadeDias.padStart(3, "0")];

    const base = [
      ...eanDigits,
      ...precoDigits,
      ...motivoDigits,
      ...validadeDigits,
    ];
    const penultimoDigito = "0";
    const digitoVerificacao = calcularDigitoVerificacao([
      ...base,
      penultimoDigito,
    ]);
    const sufixoDigits = [penultimoDigito, digitoVerificacao];

    const codigoFinal = [...base, ...sufixoDigits].join("");
    setCodigo(codigoFinal);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const inputFields = [
    {
      id: "ean",
      label: "EAN",
      placeholder: "13 dígitos",
      value: formState.ean,
      maxLength: 13,
    },
    {
      id: "preco",
      label: "Novo preço",
      placeholder: "Em cêntimos, ex: 4590",
      value: formState.preco,
      maxLength: 6,
    },
    {
      id: "motivo",
      label: "Motivo",
      placeholder: "Ex: 01",
      value: formState.motivo,
      maxLength: 2,
    },
    {
      id: "validadeDias",
      label: "Validade",
      placeholder: "Nº de dias, ex: 200",
      value: formState.validadeDias,
      maxLength: 3,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Voltar à Home
        </Link>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                <span className="mr-2">✏️</span> Gerador de Código Depreciado
              </h1>
              <p className="mt-2 text-gray-600">
                Gere códigos de depreciação para produtos
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              {/* Input Fields */}
              <div className="space-y-4">
                {inputFields.map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {field.label}
                    </label>
                    <input
                      type="text"
                      id={field.id}
                      value={field.value}
                      onChange={(e) =>
                        handleChange(
                          field.id as keyof FormState,
                          e.target.value
                        )
                      }
                      maxLength={field.maxLength}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                    />
                  </div>
                ))}
              </div>

              {/* Generate Button */}
              <button
                onClick={calcularCodigo}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-lg font-medium"
              >
                Calcular Código
              </button>

              {/* Result */}
              {codigo && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Código Depreciado
                      </p>
                      <p className="mt-1 text-2xl font-bold text-gray-900 font-mono">
                        {codigo}
                      </p>
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="ml-4 p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      title="Copiar para a área de transferência"
                    >
                      {copied ? (
                        <svg
                          className="w-6 h-6 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodigoDepreciado;
