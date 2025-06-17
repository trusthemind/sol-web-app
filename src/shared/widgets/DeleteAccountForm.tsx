import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Separator } from "@/src/components/ui/separator";
import { AlertTriangle, Trash2, X, ShieldAlert } from "lucide-react";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import {
  DeleteAccountFormData,
  deleteAccountSchema,
} from "@/src/utils/validation/profile.schema";
import { toast } from "sonner";
import { useAccountDeletion } from "../hooks/useDelete";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  trigger?: React.ReactNode;
}

export const DeleteAccountModal = ({
  isOpen,
  onClose,
  userId,
  trigger,
}: DeleteAccountModalProps) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const { deleting, deleteAccount } = useAccountDeletion();

  useEffect(() => {
    return () => toast.dismiss("delete-account");
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
    trigger: validateForm,
  } = useForm<DeleteAccountFormData>({
    resolver: yupResolver(deleteAccountSchema),
    mode: "onChange",
  });

  const watchedConfirmation = watch("confirmation");

  const onSubmit: SubmitHandler<DeleteAccountFormData> = async (data) => {
    try {
      // Validate confirmation
      if (data.confirmation !== userId) {
        toast.error("Please type the user ID exactly as shown");
        return;
      }

      // Proceed directly to account deletion
      await handleFinalConfirmation();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleFinalConfirmation = async () => {
    try {
      // Call the deleteAccount function with just userId
      const success = await deleteAccount(userId);

      if (success) {
        toast.success("Account deleted successfully");

        // Reset form and close modal
        reset();
        setShowPassword(false);
        onClose();

        // Optional: Redirect to login or home page
        // window.location.href = '/login';
        // or use your router: router.push('/login');
      } else {
        toast.error("Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Account deletion error:", error);

      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message.includes("network")) {
          toast.error(
            "Network error. Please check your connection and try again."
          );
        } else if (error.message.includes("unauthorized")) {
          toast.error("Session expired. Please log in again.");
        } else {
          toast.error("Failed to delete account. Please try again later.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleClose = () => {
    if (deleting) return;

    setShowPassword(false);
    reset();
    onClose();
  };

  const isFormValid = watchedConfirmation === userId;

  const modalContent = (
    <Dialog open={isOpen} onOpenChange={!deleting ? handleClose : undefined}>
      <DialogContent
        className="sm:max-w-lg max-h-[90vh] bg-white/95 backdrop-blur-sm border border-red-200/50"
        onPointerDownOutside={(e) => deleting && e.preventDefault()}
        onEscapeKeyDown={(e) => deleting && e.preventDefault()}
      >
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center text-xl text-red-600 font-semibold">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {t("profile.deleteAccount")}
            </DialogTitle>
            {!deleting && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-6 w-6 rounded-full hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <DialogDescription className="text-slate-600">
            This action will permanently delete your account and all associated
            data.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Warning and Confirmation */}
            <div className="space-y-6">
              {/* Warning Box */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <ShieldAlert className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-red-700">
                    <p className="font-medium mb-2">
                      Account deletion will result in:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Permanent loss of all your personal data</li>
                      <li>Deletion of your profile and settings</li>
                      <li>Loss of access to all features and services</li>
                      <li>Removal of all associated records</li>
                      <li className="font-medium">
                        This action cannot be undone
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator className="bg-red-100" />

              <div className="space-y-3 mb-4">
                <Label
                  htmlFor="confirmation"
                  className="text-slate-700 font-medium"
                >
                  Type{" "}
                  <code className="bg-red-100 px-1 py-0.5 rounded text-red-700 font-mono text-sm">
                    {userId}
                  </code>{" "}
                  to confirm *
                </Label>
                <Input
                  id="confirmation"
                  {...register("confirmation")}
                  placeholder={userId}
                  className={`border-slate-200 focus:border-red-400 focus:ring-red-200 bg-white/50 backdrop-blur-sm h-12 font-mono text-center ${
                    watchedConfirmation === userId
                      ? "border-green-300 bg-green-50 text-green-700"
                      : ""
                  }`}
                  autoComplete="off"
                  spellCheck={false}
                />
                {errors.confirmation && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmation.message}
                  </p>
                )}
                {watchedConfirmation &&
                  watchedConfirmation !== userId &&
                  watchedConfirmation.length > 0 && (
                    <p className="text-amber-600 text-sm mt-1 flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Please type {userId} exactly as shown
                    </p>
                  )}
              </div>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="gap-3 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={deleting}
            className="flex items-center gap-2"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="destructive"
            onClick={handleSubmit(onSubmit)}
            disabled={deleting || !isFormValid}
            className="relative min-w-[140px]"
          >
            {deleting && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
            )}
            <span className={deleting ? "opacity-0" : "opacity-100"}>
              {deleting ? "Deleting..." : "Delete Account"}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return trigger ? (
    <>
      <div onClick={() => !deleting && onClose()}>{trigger}</div>
      {modalContent}
    </>
  ) : (
    modalContent
  );
};

// Usage component for the settings page
export const DeleteAccountButton = ({ userId }: { userId: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2"
      >
        <Trash2 className="h-4 w-4" />
        {t("profile.deleteAccount")}
      </Button>

      <DeleteAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userId}
      />
    </>
  );
};

// Alternative usage with custom trigger
export const DeleteAccountTrigger = ({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsModalOpen(true)} className="cursor-pointer">
        {children}
      </div>

      <DeleteAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userId}
      />
    </>
  );
};
