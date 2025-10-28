// Temporarily disabled Clerk
// import { SignUp } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function SignUpPage() {
  // Temporarily bypassing authentication - redirect to home
  redirect('/');
  
  return null;
}
