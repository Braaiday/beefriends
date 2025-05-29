import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "../context/AuthProvider";
import { updateDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { useChatApp } from "../context/ChatAppProvider";
import { Avatar } from "./Avatar"; // Adjust the import path as needed

export const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { invitations, invitationCount } = useChatApp();

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  const handleUpdateStatus = async (
    id: string,
    status: "accepted" | "declined"
  ) => {
    await updateDoc(doc(firestore, "friendships", id), { status });
  };

  const filteredInvitations = invitations.filter(
    (inv) => inv.initiatedBy !== user?.uid
  );

  return (
    <>
      {/* Notification Button */}
      <button
        onClick={openDrawer}
        className="cursor-pointer p-2 rounded-full hover:bg-primary/10 transition relative"
        title="Notifications"
      >
        <Icon
          icon="solar:bell-bing-bold-duotone"
          className="w-6 h-6 text-foreground/60 hover:text-primary"
        />
        {invitationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-400 text-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
            {invitationCount}
          </span>
        )}
      </button>

      {/* Notifications Drawer */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeDrawer}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-background/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="w-screen max-w-sm bg-card border-l border-border shadow-xl p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-foreground">
                        Notifications
                      </h2>
                      <button onClick={closeDrawer} aria-label="Close">
                        <Icon
                          icon="solar:close-circle-bold-duotone"
                          className="w-6 h-6 text-muted-foreground hover:text-primary"
                        />
                      </button>
                    </div>

                    {filteredInvitations.length === 0 ? (
                      <div className="p-3 bg-muted rounded-md text-center text-sm text-muted-foreground">
                        No pending invitations.
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {filteredInvitations.map((invitation) => {
                          const senderUid = invitation.initiatedBy;
                          const senderName =
                            invitation.friendlyNames?.[senderUid] ?? "Unknown";

                          return (
                            <li
                              key={invitation.id}
                              className="p-3 bg-muted rounded-md flex items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar
                                  url={invitation.photoURLs[senderUid]}
                                  displayName={senderName}
                                 
                                />
                                <div className="text-sm text-foreground">
                                  <div>
                                    <strong>{senderName}</strong>
                                  </div>
                                  <div className="text-muted-foreground text-xs">
                                    sent you a friend request
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(
                                      invitation.id,
                                      "accepted"
                                    )
                                  }
                                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                                  title="Accept"
                                >
                                  <Icon
                                    icon="mdi:check-bold"
                                    className="w-4 h-4"
                                  />
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(
                                      invitation.id,
                                      "declined"
                                    )
                                  }
                                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                                  title="Decline"
                                >
                                  <Icon
                                    icon="mdi:close-thick"
                                    className="w-4 h-4"
                                  />
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
