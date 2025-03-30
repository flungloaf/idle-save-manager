import { cva } from 'class-variance-authority'

const button = cva(
  'px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'shadow hover:bg-gray-200',
        toggled: 'bg-gray-400 text-white shadow-inner scale-[0.98]',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

export default button
