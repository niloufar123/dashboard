

import localFont from 'next/font/local'
import {Inter, Lusitana} from 'next/font/google'

export const inter = Inter({ subsets: ['latin'] })



  export const myFont = localFont({
  src: [
    { path: "./PelakFA-Medium.ttf", weight: "400" },
    { path: "./PelakFA-Bold.ttf", weight: "500" },
    { path: "./credit_card_number.ttf", weight: "700" },
  ],
  variable: "--font-myfont",
  display: "swap",
})

export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
});