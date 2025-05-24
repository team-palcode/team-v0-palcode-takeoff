"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BidFlagSetup } from "./bid-flag-setup"

interface BidFlagSetupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BidFlagSetupDialog({ open, onOpenChange }: BidFlagSetupDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bid Flag Setup</DialogTitle>
        </DialogHeader>
        <BidFlagSetup onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

