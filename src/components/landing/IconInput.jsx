import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function IconInput({ icon, className, ...props }) {
    return (
        <div className={cn("relative", className)}>
            {icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    {icon}
                </div>
            )}
            <Input
                className={cn("pl-10", props.className)}
                {...props}
            />
        </div>
    )
}
