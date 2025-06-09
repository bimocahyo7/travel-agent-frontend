import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";

export default function HeaderPersonal({ user }) {
    return (
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 md:gap-0 md:flex-row md:items-center md:justify-between border border-gray-200">
            <div className="flex items-center gap-4">
                <Avatar className="size-14">
                    {user?.avatar ? (
                        <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                        <AvatarFallback>{user?.name?.[0] || <UserIcon />}</AvatarFallback>
                    )}
                </Avatar>
                <div>
                    <div className="text-2xl font-bold text-black">Hallo, {user?.name || "User"}!!</div>
                    <div className="text-gray-500 text-base mt-1">Ready for your next adventure? Check your trips below or make a new booking.</div>
                </div>
            </div>
        </div>
    );
} 