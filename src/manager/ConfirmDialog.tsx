import { Button, buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { VariantProps } from 'class-variance-authority'
import React from 'react'

interface Props {
  trigger: React.ReactNode
  title: string
  description: string
  confirmButtonVariant?: VariantProps<typeof buttonVariants>['variant']
  onConfirm: () => void
}

const ConfirmDialog: React.FC<Props> = ({
  trigger,
  title,
  description,
  confirmButtonVariant = 'destructive',
  onConfirm,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant={confirmButtonVariant}
              type="submit"
              onClick={onConfirm}
            >
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmDialog
