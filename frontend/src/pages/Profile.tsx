/*
 Profile.tsx
*/
import React, { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import { getProfile, updateProfile } from "../api/authApi";
import Loader from "../components/ui/Loader";
import Alert from "../components/ui/Alert";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import Form from "../components/ui/Form";
import Input from "../components/ui/Input";
import "../styles/ProfilePage.css";

// Define Profile Interface
interface ProfileData {
  name: string;
  email: string;
  role: string;
}

// Define Editable Data Interface
interface EditProfileData {
  name: string;
  email: string;
  password?: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<EditProfileData>({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        if (data) {
          setProfile(data);
          // Ensure name and email are never undefined by providing fallback empty strings.
          setEditData({ name: data.name || "", email: data.email || "", password: "" });
        } else {
          throw new Error("No se pudo cargar el perfil");
        }
      } catch (err: any) {
        setError("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!editData.name.trim() || !editData.email.trim()) {
      setError("El nombre y el email son obligatorios");
      return;
    }

    try {
      const updatedFields: EditProfileData = {
        name: editData.name.trim(),
        email: editData.email.trim(),
      };
      if (editData.password?.trim()) {
        updatedFields.password = editData.password.trim();
      }

      const updatedProfile = await updateProfile(updatedFields);
      if (updatedProfile) {
        setProfile(updatedProfile);
        setIsEditModalOpen(false);
      } else {
        setError("Error al actualizar el perfil");
      }
    } catch (err: any) {
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
          <strong>Nombre:</strong> {profile?.name}
        </p>
        <p>
          <strong>Email:</strong> {profile?.email}
        </p>
        <p>
          <strong>Rol:</strong> {profile?.role}
        </p>
      </div>
      <Button onClick={() => setIsEditModalOpen(true)} className="edit-button">
        Editar Perfil
      </Button>

      {/* Modal for Editing Profile */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Perfil"
      >
        <Form onSubmit={handleEditSubmit}>
          <Input
            type="text"
            name="name"
            placeholder="Nombre"
            value={editData.name}
            onChange={(e) =>
              setEditData({ ...editData, name: e.target.value })
            }
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={editData.email}
            onChange={(e) =>
              setEditData({ ...editData, email: e.target.value })
            }
          />
          <Input
            type="password"
            name="password"
            placeholder="Nueva contraseña (opcional)"
            value={editData.password || ""}
            onChange={(e) =>
              setEditData({ ...editData, password: e.target.value })
            }
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