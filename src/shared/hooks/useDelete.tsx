import { useState } from "react";
import { toast } from "sonner";
import { userApi } from "../api/user.api";
import { removeAllCookies } from "../api";
import { useRouter } from "next/navigation";
import { AppRoutes } from "../constants/navigation";

export interface UseAccountDeletionReturn {
  deleting: boolean;
  deleteAccount: (
    userId: string,
    data?: { password: string; reason?: string }
  ) => Promise<boolean>;
}

export const useAccountDeletion = (): UseAccountDeletionReturn => {
  const [deleting, setDeleting] = useState(false);

  const deleteAccount = async (
    userId: string,
    data?: { password: string; reason?: string }
  ): Promise<boolean> => {
    try {
      setDeleting(true);

      toast.loading("Deleting account...", {
        id: "delete-account",
        description: "This may take a few moments.",
      });

      await userApi.deleteUser(userId);

      removeAllCookies();
      sessionStorage.clear();

      return true;
    } catch (err: any) {
      console.error("Account deletion failed:", err);

      let errorMessage = "Failed to delete account";
      let errorDescription = "Please try again later.";

      if (err?.response) {
        const status = err.response.status;
        const responseData = err.response.data;

        switch (status) {
          case 401:
            errorMessage = "Invalid password";
            errorDescription =
              "The password you entered is incorrect. Please try again.";
            break;
          case 403:
            errorMessage = "Access denied";
            errorDescription =
              "You do not have permission to delete this account.";
            break;
          case 404:
            errorMessage = "Account not found";
            errorDescription = "The account may have already been deleted.";
            break;
          case 429:
            errorMessage = "Too many attempts";
            errorDescription = "Please wait a few minutes before trying again.";
            break;
          case 500:
            errorMessage = "Server error";
            errorDescription =
              "A server error occurred. Please try again later or contact support.";
            break;
          default:
            if (responseData?.message) {
              errorMessage = responseData.message;
            }
            break;
        }
      } else if (
        err?.code === "NETWORK_ERROR" ||
        err?.message?.includes("Network")
      ) {
        errorMessage = "Network error";
        errorDescription =
          "Please check your internet connection and try again.";
      } else if (err?.message) {
        errorMessage = err.message;
      }

      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleting,
    deleteAccount,
  };
};

export const useAccountDeletionWithRetry = (): UseAccountDeletionReturn & {
  retryCount: number;
} => {
  const [deleting, setDeleting] = useState(false);
  const { push } = useRouter();
  const [retryCount, setRetryCount] = useState(0);

  const deleteAccount = async (
    userId: string,
    data?: { password: string; reason?: string }
  ): Promise<boolean> => {
    const maxRetries = 3;

    const attemptDeletion = async (attempt: number): Promise<boolean> => {
      try {
        setDeleting(true);
        setRetryCount(attempt);

        if (attempt > 1) {
          toast.loading(
            `Deleting account... (Attempt ${attempt}/${maxRetries})`,
            {
              id: "delete-account",
            }
          );
        } else {
          toast.loading("Deleting account...", {
            id: "delete-account",
          });
        }

        await userApi.deleteUser(userId);

        toast.success("Account deleted successfully", {
          id: "delete-account",
          description: "Redirecting...",
        });

        localStorage.clear();
        sessionStorage.clear();

        setTimeout(() => {
          push(AppRoutes.AUTH);
        }, 2000);

        return true;
      } catch (err: any) {
        console.error(`Deletion attempt ${attempt} failed:`, err);

        if (attempt < maxRetries && isRetryableError(err)) {
          toast.loading(`Retrying deletion... (${attempt + 1}/${maxRetries})`, {
            id: "delete-account",
          });

          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));

          return attemptDeletion(attempt + 1);
        }

        throw err;
      } finally {
        if (attempt === maxRetries) setDeleting(false);
      }
    };

    try {
      return await attemptDeletion(1);
    } catch (err) {
      setDeleting(false);
      return false;
    }
  };

  const isRetryableError = (err: any): boolean => {
    const status = err?.response?.status;
    return status >= 500 || err?.code === "NETWORK_ERROR" || !status;
  };

  return {
    deleting,
    deleteAccount,
    retryCount,
  };
};
