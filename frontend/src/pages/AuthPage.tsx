// AuthPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import Alert from "../components/ui/Alert";
import Loader from "../components/ui/Loader";
import Form from "../components/ui/Form";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";
import "../styles/authPage.css";

const AuthPage: React.FC = () => {
  const { login, user } = useAuth();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [name, setName] = useState<string>(""); // Only used for registration
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  // If the user is already authenticated, redirect them to the dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Trim email and name
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (isLogin) {
      // Login process using AuthContext's login method
      const result = await login({ email: trimmedEmail, password });
      if (result) {
        setSuccess("Inicio de sesión exitoso. Redirigiendo...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setError("Error al iniciar sesión. Verifica tus credenciales.");
      }
    } else {
      // Registration process
      if (!trimmedName) {
        setError("El nombre es obligatorio para registrarse.");
        setLoading(false);
        return;
      }
      const result = await registerUser({ name: trimmedName, email: trimmedEmail, password });
      if (result && result.message === "Usuario registrado correctamente") {
        setSuccess("Registro exitoso. Ahora inicia sesión.");
        setIsLogin(true);
        // Clear registration fields
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setError("Error al registrarse. Intenta nuevamente.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="session-container">
      <h2 className="session-header">{isLogin ? "Sign In" : "Register"}</h2>
      {error && <Alert message={error} type="error" />}
      {success && <Alert message={success} type="success" />}
      {loading && <Loader />}
      <Form onSubmit={handleSubmit}>
        {!isLogin && (
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {isLogin ? "Login" : "Sign Up"}
        </Button>
      </Form>
      <div className="session-toggle">
        {isLogin ? (
          <p>
            Don't have an account?{" "}
            <button
              className="toggle-button"
              onClick={() => {
                setIsLogin(false);
                setError(null);
                setSuccess(null);
              }}
            >
              Register
            </button>
          </p>
        ) : (
          <p>
            Already registered?{" "}
            <button
              className="toggle-button"
              onClick={() => {
                setIsLogin(true);
                setError(null);
                setSuccess(null);
              }}
            >
              Log In
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
