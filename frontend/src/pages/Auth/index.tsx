/// <reference types="vite/client" />
import "./styles.css";
import LogoBranco from "../../assets/logo-white.svg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { Notification } from "../../ui/Notification";
import { api, Session } from "../../api";
import axios from "axios";

interface ValidationError {
  path: string[];
  message: string;
}

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isLoginMode, setIsLoginMode] = useState(
    location.pathname === "/login" || location.pathname === "/"
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<{message: string, type: 'error' | 'success'}>({ message: "", type: "error" });

  // Limpa os campos quando o usuário troca entre Login e Cadastro
  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setFormErrors({});
  }, [isLoginMode]);

  async function submitAction() {
    if (loading) return; // Prevent double submits

    setFormErrors({});
    setNotification({ message: "", type: "error" });
    setLoading(true);

    const endpoint = isLoginMode ? "/auth/login" : "/auth/register";
    const payload = isLoginMode ? { email, password } : { name, email, password };

    try {
      const response = await api.post(endpoint, payload);

      if (isLoginMode) {
        Session.AuthToken = response.data;
        return navigate("/tasks");
      }

      setNotification({ message: "Usuário cadastrado com sucesso", type: "success" });
      setIsLoginMode(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data;

        // Trata Erros de Validação do Zod
        if (data.errors && Array.isArray(data.errors)) {
          const newErrors: Record<string, string> = {};
          data.errors.forEach((err: ValidationError) => {
            if (err.path && err.path.length > 0) {
              newErrors[err.path[0]] = err.message.replace(/\.$/, "");
            }
          });
          setFormErrors(newErrors);
        } else if (data.message) {
          // Trata erros de Unauthorized ou Conflict
          setNotification({ message: data.message.replace(/\.$/, ""), type: "error" });
        } else {
          setNotification({ message: "Ocorreu um erro inesperado", type: "error" });
        }
      } else {
        console.error("Erro desconhecido", error);
        setNotification({ message: "Não foi possível conectar ao servidor", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <Notification 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: "", type: "error" })} 
      />

      <div className="auth-logo">
        <img src={LogoBranco} alt="Solare" />
      </div>

      <div className="auth-box">
        <div className="auth-header">
          <h2>{isLoginMode ? "Bem-vindo" : "Crie sua conta"}</h2>
          <p>{isLoginMode ? "Faça login para continuar" : "Preencha os campos abaixo"}</p>
        </div>

        <form 
          className="auth-form" 
          onSubmit={(e) => {
            e.preventDefault();
            submitAction();
          }}
        >
          {!isLoginMode && (
            <Input
              label="Nome"
              placeholder="Nome"
              value={name}
              onChange={setName}
              inputHeight="38px"
              error={formErrors.name}
            />
          )}
          <Input
            label="Email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            inputHeight="38px"
            error={formErrors.email}
          />
          <Input
            label="Senha"
            placeholder="Senha"
            value={password}
            onChange={setPassword}
            secureTextEntry
            inputHeight="38px"
            error={formErrors.password}
          />

          <Button 
            label={isLoginMode ? "Entrar" : "Criar conta"} 
            onPress={() => {}} 
            loading={loading}
            style={{ width: "100%", height: "38px", fontSize: "14px", padding: "10px" }} 
          />
        </form>

        <div className="auth-footer">
          <p>{isLoginMode ? "Ainda não tem uma conta?" : "Já possui uma conta?"}</p>
          <button 
            type="button" 
            onClick={() => {
              setNotification({ message: "", type: "error" });
              setIsLoginMode(!isLoginMode);
            }} 
            className="auth-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {isLoginMode ? "Criar conta" : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}