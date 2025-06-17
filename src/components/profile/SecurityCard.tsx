"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppRoutes } from "../../shared/constants/navigation";
import { DeleteAccountButton } from "../../shared/widgets/DeleteAccountForm";
import { User } from "../../shared/stores/context/AuthContext";

interface SecurityCardProps {
  user: User;
  title: string;
  description: string;
  buttons: {
    changePassword: string;
    twoFactor: string;
    deleteAccount: string;
    logout: string;
  };
  logout: () => void;
}

export function SecurityCard({
  user,
  title,
  description,
  buttons,
  logout,
}: SecurityCardProps) {
  const { push } = useRouter();
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-800">
          <Shield className="h-5 w-5 mr-2 text-blue-500" />
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="ghost"
          className="w-full justify-start border-gray-200 text-gray-700 hover:text-blue-600 border-blue-200"
        >
          {buttons.changePassword}
        </Button>
        <Separator className="bg-gray-200" />
        <Button
          variant="default"
          className="text-white w-full"
          onClick={() => {
            push(AppRoutes.AUTH);
            logout();
          }}
        >
          {buttons.logout}
        </Button>
        <DeleteAccountButton userId={user.id} />
      </CardContent>
    </Card>
  );
}
