"use client";

import { useState, useEffect } from "react";
import Header from "@/app/(customer)/Header";
import { useAuth } from "@/hooks/auth";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        password: "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(user.id, formData);
      setSuccessMessage("Profil berhasil diperbarui.");
      setErrorMessage("");
    } catch (error) {
      console.error("Gagal update profil:", error);
      setErrorMessage("Terjadi kesalahan saat memperbarui profil.");
      setSuccessMessage("");
    }
  };

  return (
    <>
      <Header title="Profil Saya" />
      <div className="py-12">
        <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded shadow">
            {successMessage && (
              <p className="text-green-600 mb-4">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-red-600 mb-4">{errorMessage}</p>
            )}

            <form onSubmit={handleSubmit}>
              <label className="block mb-4">
                Nama
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1"
                  required
                />
              </label>

              <label className="block mb-4">
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1"
                  required
                />
              </label>

              <label className="block mb-4">
                Telepon
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1"
                />
              </label>

              <label className="block mb-4">
                Alamat
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1"
                />
              </label>

              <label className="block mb-4">
                Password Baru
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1"
                />
                <small className="text-gray-500">
                  *Kosongkan jika tidak ingin mengubah password
                </small>
              </label>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
