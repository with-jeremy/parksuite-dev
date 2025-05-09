"use client";

import React, { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FeaturedToggleProps = {
  id: string;
  isFeatured: boolean;
  onToggle: (id: string, isFeatured: boolean) => Promise<void>;
};

export default function FeaturedToggle({ id, isFeatured, onToggle }: FeaturedToggleProps) {
  const [open, setOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(isFeatured);
  const [isPending, setIsPending] = useState(false);
  
  const handleToggleRequest = () => {
    setOpen(true);
  };
  
  const handleConfirmToggle = async () => {
    setIsPending(true);
    await onToggle(id, !isChecked);
    setIsChecked(!isChecked);
    setOpen(false);
    setIsPending(false);
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <Checkbox.Root 
          checked={isChecked}
          onCheckedChange={handleToggleRequest}
          className={`h-5 w-5 rounded border ${isChecked ? 'bg-primary border-primary' : 'bg-background border-input'} flex items-center justify-center`}
        >
          {isChecked && (
            <Checkbox.Indicator>
              <Check className="h-4 w-4 text-white" />
            </Checkbox.Indicator>
          )}
        </Checkbox.Root>
      </div>
      
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {open && (
            <AlertDialog.Portal forceMount>
              <AlertDialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/50"
                />
              </AlertDialog.Overlay>
              <AlertDialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-6 shadow-lg"
                >
                  <AlertDialog.Title className="text-lg font-semibold">
                    {isChecked ? 'Remove from featured listings?' : 'Add to featured listings?'}
                  </AlertDialog.Title>
                  <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
                    {isChecked 
                      ? 'This parking spot will no longer appear in the featured section on the homepage.' 
                      : 'This parking spot will be displayed in the featured section on the homepage.'}
                  </AlertDialog.Description>
                  <div className="mt-6 flex justify-end gap-2">
                    <AlertDialog.Cancel asChild>
                      <button className="rounded px-4 py-2 text-sm font-medium">
                        Cancel
                      </button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <button 
                        onClick={handleConfirmToggle} 
                        className="rounded bg-primary px-4 py-2 text-sm font-medium text-white"
                        disabled={isPending}
                      >
                        {isPending ? 'Updating...' : 'Confirm'}
                      </button>
                    </AlertDialog.Action>
                  </div>
                </motion.div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          )}
        </AnimatePresence>
      </AlertDialog.Root>
    </>
  );
}