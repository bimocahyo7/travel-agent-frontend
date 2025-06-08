"use client";

import {
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";
import { useAuth } from "@/hooks/auth"; // Add this import
import { usePaymentsub } from "@/hooks/paymentsub";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import ProfileModal from "@/components/auth/ProfileModal";
import Modal from "@/components/ui/Modal";
import { useEffect, useState } from "react";

export function NavUser() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [hiddenIds, setHiddenIds] = useState([]);
  const [imgModal, setImgModal] = useState(null);
  const [search, setSearch] = useState("");
  const { isMobile } = useSidebar();
  const { user, logout } = useAuth({ middleware: "auth" });
  const { notifications, deleteNotification, fetchNotifications, loading, error } =
    usePaymentsub();
  const router = useRouter();

  // Hitung jumlah notifikasi yang belum di-hide
  const visibleNotifications = notifications.filter(
    (n) => !hiddenIds.includes(n.id)
  );
  const notifCount = visibleNotifications.length;

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Saat komponen mount, ambil hiddenIds dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("hiddenNotifIds");
    if (saved) setHiddenIds(JSON.parse(saved));
  }, []);

  // Setiap kali hiddenIds berubah, simpan ke localStorage
  useEffect(() => {
    localStorage.setItem("hiddenNotifIds", JSON.stringify(hiddenIds));
  }, [hiddenIds]);

  if (!user) return null;

  // Filter notifikasi berdasarkan pencarian
  const filteredNotifications = visibleNotifications.filter((n) => {
    const searchLower = search.toLowerCase();
    return (
      n.institution?.toLowerCase().includes(searchLower) ||
      n.applicant?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <div className="relative"></div>
              {notifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
                  {notifCount}
                </span>
              )}
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>
                <IconUserCircle className="mr-2" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setNotifOpen(true);
                  fetchNotifications();
                }}
              >
                <IconNotification className="mr-2" />
                Notifications
                {notifCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
                    {notifCount}
                  </span>
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} variant="destructive">
              <IconLogout className="mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      {notifOpen && (
        <Modal onClose={() => setNotifOpen(false)}>
          <h2 className="font-bold mb-2">Bukti Pembayaran Terbaru</h2>
          <input
            type="text"
            placeholder="Cari instansi/pemohon..."
            className="mb-3 w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}
          <ul
            className="space-y-3 max-h-[400px] overflow-y-auto pr-2"
            style={{ minWidth: 320 }}
          >
            {filteredNotifications.length === 0 && (
              <li className="text-gray-400 text-center">Tidak ada notifikasi.</li>
            )}
            {filteredNotifications.map((n) => (
              <li
                key={n.id}
                className="relative flex bg-white rounded-xl shadow-lg p-4 items-start border cursor-pointer hover:bg-gray-100 transition"
                onClick={() => router.push("/admin/pengajuan")}
              >
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {n.institution?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{n.institution}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(n.uploaded_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">{n.applicant}</div>
                  {n.bukti_url && (
                    <img
                      src={n.bukti_url}
                      alt="Bukti"
                      className="mt-2 rounded border max-w-[180px] shadow cursor-zoom-in"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImgModal(n.bukti_url);
                      }}
                    />
                  )}
                </div>
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl"
                  title="Hapus notifikasi ini"
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      await deleteNotification(n.id);
                      toast.success("Notifikasi berhasil dihapus!");
                    } catch (err) {
                      toast.error("Gagal menghapus notifikasi!");
                    }
                  }}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </Modal>
      )}
      {/* Modal gambar full */}
      {imgModal && (
        <Modal onClose={() => setImgModal(null)}>
          <img
            src={imgModal}
            alt="Bukti Full"
            className="max-w-full max-h-[80vh] mx-auto rounded"
          />
        </Modal>
      )}
    </SidebarMenu>
  );
}
