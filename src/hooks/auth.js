import useSWR from "swr";
import axios from "@/lib/axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter();

  const {
    data: user,
    error,
    mutate,
  } = useSWR("/api/user", () =>
    axios
      .get("/api/user")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response?.status !== 409) {
          throw error;
        }
      }),
  );

  useEffect(() => {
    // Handle auth middleware
    if (middleware === "auth") {
      if (error) {
        router.push("/login");
        return;
      }

      if (user && !user.email_verified_at) {
        router.push("/verify-email");
        return;
      }
    }

    // Handle guest middleware
    if (middleware === "guest" && user) {
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "customer") {
        router.push("/dashboard");
      }
    }
  }, [user, error, middleware]);

  // Mendapatkan token CSRF dari Laravel Sanctum
  const csrf = () => axios.get("/sanctum/csrf-cookie");

  // Fungsi untuk registrasi user baru
  const register = async ({ setErrors, ...props }) => {
    await csrf();
    setErrors([]);

    axios
      .post("/register", props)
      .then(() => {
        mutate().then((user) => {
          if (!user.email_verified_at) {
            router.push("/verify-email");
          } else {
            // Redirect berdasar role jika sudah verif
            if (user.role === "admin") {
              router.push("/admin/dashboard");
            } else {
              router.push("/dashboard");
            }
          }
        });
      })
      .catch((error) => {
        if (error.response.status !== 422) throw error;
        setErrors(error.response.data.errors); // Set error validasi
      });
  };

  // Fungsi untuk login user
  const login = async ({ setErrors, setStatus, ...props }) => {
    await csrf();
    setErrors([]);
    setStatus(null);

    axios
      .post("/login", props)
      .then(() => {
        mutate().then((user) => {
          if (!user.email_verified_at) {
            router.push("/verify-email");
          } else {
            // Redirect berdasar role
            if (user.role === "admin") {
              router.push("/admin/dashboard");
            } else {
              router.push("/dashboard");
            }
          }
        });
      })
      .catch((error) => {
        if (error.response.status !== 422) throw error;
        setErrors(error.response.data.errors);
      });
  };

  // Fungsi untuk permintaan reset password (mengirim email)
  const forgotPassword = async ({ setErrors, setStatus, email }) => {
    await csrf();
    setErrors([]);
    setStatus(null);

    axios
      .post("/forgot-password", { email })
      .then((response) => setStatus(response.data.status))
      .catch((error) => {
        if (error.response.status !== 422) throw error;
        setErrors(error.response.data.errors);
      });
  };

  // Fungsi untuk mengatur ulang password dengan token yang ada di URL
  const resetPassword = async ({ setErrors, setStatus, ...props }) => {
    await csrf();
    setErrors([]);
    setStatus(null);

    axios
      .post("/reset-password", { token: params.token, ...props })
      .then(
        (response) => router.push("/login?reset=" + btoa(response.data.status)), // Encode status
      )
      .catch((error) => {
        if (error.response.status !== 422) throw error;
        setErrors(error.response.data.errors);
      });
  };

  // Kirim ulang email verifikasi
  const resendEmailVerification = ({ setStatus }) => {
    axios
      .post("/email/verification-notification")
      .then((response) => setStatus(response.data.status));
  };

  // Logout user dan hapus data user dari SWR
  const logout = async () => {
    if (!error) {
      await axios.post("/logout").then(() => mutate());
    }

    window.location.pathname = "/login";
  };

  // Ambil semua data user dari /api/users
  const getUsers = async () => {
    const response = await axios.get("/api/users");
    return response.data;
  };

  // Tambah user baru
  const createUser = async (user) => {
    await axios.post("/api/users", user);
  };

  // Update user berdasarkan ID
  const updateUser = async (id, user) => {
    await axios.put(`/api/users/${id}`, user);
  };

  // Hapus user berdasarkan ID
  const deleteUser = async (id) => {
    await axios.delete(`/api/users/${id}`);
  };

  return {
    user,
    error,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};


