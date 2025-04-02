import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const UserAvatar = ({ getUserInitials, className }) => {
  return (
    <Button
      variant="ghost"
      className={`relative h-24 w-24 rounded-full ${className || ""}`}
      size="icon"
    >
      <Avatar className="h-24 w-24">
        <AvatarFallback className="bg-fidel-100 text-fidel-700 dark:bg-fidel-900 dark:text-fidel-300 text-4xl font-bold">
          {getUserInitials()}
        </AvatarFallback>
      </Avatar>
    </Button>
  );
};

export default UserAvatar;
