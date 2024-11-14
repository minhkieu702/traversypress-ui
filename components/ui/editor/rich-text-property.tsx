import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface RichTextPropertyProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    isActive: boolean | undefined;
}

export const RichTextProperty: React.FC<RichTextPropertyProps> = ({
    icon,
    label,
    onClick,
    isActive = false,
}) => {
    return (
        <Button
            aria-label={label}
            onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>
                e.preventDefault()
            }
            onClick={onClick}
            variant={"ghost"}
            size={"icon"}
            className={cn("h-6 w-6 rounded-full", isActive && "bg-gray-100")}
        >
            {icon}
        </Button>
    );
};
