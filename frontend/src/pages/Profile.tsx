import { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import { getProfile, updateProfile } from "../api/authApi";
import Loader from "../components/ui/Loader";
import Alert from "../components/ui/Alert";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import Form from "../components/ui/Form";
import Input from "../components/ui/Input";
import "../styles/ProfilePage.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Estado para el formulario de edición, la contraseña es opcional
  const [editData, setEditData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setEditData({ name: data.name, email: data.email, password: "" });
      } catch (err) {
        setError("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!editData.name || !editData.email) {
      setError("El nombre y el email son obligatorios");
      return;
    }

    try {
      const updatedFields = { name: editData.name, email: editData.email };
      if (editData.password) updatedFields.password = editData.password;

      const updatedProfile = await updateProfile(updatedFields);
      if (updatedProfile) {
        setProfile(updatedProfile);
        setIsEditModalOpen(false);
      } else {
        setError("Error al actualizar el perfil");
      }
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      setError("Error al actualizar el perfil");
    }
  };

  if (loading) return <Loader />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="profile-container">
      <ProfileHeader />
      <div className="profile-info">
        <p>
          <strong>Nombre:</strong> {profile.name}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Rol:</strong> {profile.role}
        </p>
      </div>
      <Button onClick={() => setIsEditModalOpen(true)} className="edit-button">
        Editar Perfil
      </Button>
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Perfil"
      >
        <Form onSubmit={handleEditSubmit}>
          <Input
            type="text"
            placeholder="Nombre"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />
          <Input
            type="email"
            placeholder="Email"
            value={editData.email}
            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Nueva contraseña (opcional)"
            value={editData.password}
            onChange={(e) => setEditData({ ...editData, password: e.target.value })}
          />
          <Button type="submit" className="w-full mt-4">
            Guardar Cambios
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
