import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfile } from "firebase/auth";
import { useAuth } from "../context/AuthProvider";
import { RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

// Sample avatar options
const beeAvatars = [
  "/avatars/bee1.png",
  "/avatars/bee2.png",
  "/avatars/bee3.png",
  "/avatars/bee4.png",
  "/avatars/bee5.png",
];

// Zod schema
const settingsSchema = z.object({
  photoURL: z.string(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      photoURL: beeAvatars[0],
    },
  });

  const photoURL = watch("photoURL");

  useEffect(() => {
    if (user) {
      reset({
        photoURL: user.photoURL ?? beeAvatars[0],
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: SettingsFormValues) => {
    if (!user) return;
    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        photoURL: data.photoURL,
      });

      // Update Firestore user's document
      const userDocRef = doc(firestore, "users", user.uid);
      await updateDoc(userDocRef, {
        photoURL: data.photoURL,
      });

      // Update to 'userProfiles' collection for public lookup
      await updateDoc(doc(firestore, "userProfiles", user.uid), {
        photoURL: data.photoURL,
      });

      navigate("/app");
    } catch (error) {
      console.error("Error updating profile or Firestore:", error);
    }
  };

  if (!user) return <p className="text-center mt-10">Loading user info...</p>;

  return (
    <div className="bg-background text-foreground px-4 sm:px-6 py-10 flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl bg-card rounded-2xl shadow border border-border p-6 space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">Settings</h1>

        {/* Bee Icon Picker */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Choose Your Bee Icon
          </label>
          <RadioGroup
            value={photoURL}
            onChange={(val) => setValue("photoURL", val)}
          >
            <div className="grid grid-cols-5 gap-4">
              {beeAvatars.map((url) => (
                <RadioGroup.Option key={url} value={url}>
                  {({ checked }) => (
                    <div
                      className={clsx(
                        "w-16 h-16 rounded-full border-2 p-1 cursor-pointer transition",
                        checked
                          ? "border-primary ring-2 ring-primary"
                          : "border-border"
                      )}
                    >
                      <img
                        src={url}
                        alt="Bee Avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
          {errors.photoURL && (
            <p className="text-sm text-red-500 mt-1">
              {errors.photoURL.message}
            </p>
          )}
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Display Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground opacity-70 cursor-not-allowed"
            value={user.displayName ?? ""}
            readOnly
          />
        </div>

        {/* Email (Read-only) */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground opacity-70 cursor-not-allowed"
            value={user.email ?? ""}
            readOnly
          />
        </div>

        {/* Save Button */}
        <div className="text-right">
          <button
            disabled={isSubmitting}
            type="submit"
            className={cn(
              "cosmic-button w-full flex items-center justify-center gap-2",
              isSubmitting ? "cursor-not-allowed opacity-70" : ""
            )}
          >
            {isSubmitting && (
              <svg
                className="w-5 h-5 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};
