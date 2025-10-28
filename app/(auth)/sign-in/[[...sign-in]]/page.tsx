// Temporarily disabled Clerk
// import { SignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function SiginInPage() {
  // Temporarily bypassing authentication - redirect to home
  redirect('/');
  
  return null;
}
