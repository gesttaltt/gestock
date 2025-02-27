import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/authApi";
import Alert from "../components/ui/Alert";
import Loader from "../components/ui/Loader";
import Form from "../components/ui/Form";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import "../styles/AuthPage.css"; // Importa los estilos específicos para AuthPage

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState(""); // Solo para registro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Eliminar espacios extras en email y nombre
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (isLogin) {
      // Proceso de inicio de sesión
      const result = await loginUser({ email: trimmedEmail, password });
      if (result && result.token) {
        localStorage.setItem("token", result.token);
        setSuccess("Inicio de sesión exitoso. Redirigiendo...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setError("Error al iniciar sesión. Verifica tus credenciales.");
      }
    } else {
      // Proceso de registro
      if (!trimmedName) {
        setError("El nombre es obligatorio para registrarse.");
        setLoading(false);
        return;
      }
      const result = await registerUser({ name: trimmedName, email: trimmedEmail, password });
      if (result && result.message === "Usuario registrado correctamente") {
        setSuccess("Registro exitoso. Ahora inicia sesión.");
        setIsLogin(true);
        // Limpia los campos de registro
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
      <h2 className="session-header">
        {isLogin ? "Iniciar Sesión" : "Registro"}
      </h2>
      {error && <Alert message={error} type="error" />}
      {success && <Alert message={success} type="success" />}
      {loading && <Loader />}
      <Form onSubmit={handleSubmit}>
        {!isLogin && (
          <Input
            type="text"
            placeholder="Nombre"
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
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {isLogin ? "Ingresar" : "Registrarse"}
        </Button>
      </Form>
      <div className="session-toggle">
        {isLogin ? (
          <p>
            ¿No tienes cuenta?{" "}
            <button
              className="toggle-button"
              onClick={() => {
                setIsLogin(false);
                setError(null);
                setSuccess(null);
              }}
            >
              Registrarse
            </button>
          </p>
        ) : (
          <p>
            ¿Ya tienes cuenta?{" "}
            <button
              className="toggle-button"
              onClick={() => {
                setIsLogin(true);
                setError(null);
                setSuccess(null);
              }}
            >
              Inicia sesión
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
