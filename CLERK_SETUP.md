# Clerk Authentication Setup Guide

This guide will help you set up Clerk authentication for your Motel booking platform.

## 🚀 Quick Setup

### 1. Create a Clerk Account
1. Go to [clerk.com](https://clerk.com) and sign up
2. Create a new application
3. Choose your preferred authentication methods (Email, Google, Facebook, etc.)

### 2. Get Your API Keys
1. In your Clerk dashboard, go to **API Keys**
2. Copy your **Publishable Key** and **Secret Key**

### 3. Environment Variables
Create a `.env.local` file in your project root:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Clerk URLs (already configured)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 4. Install Dependencies
```bash
npm install @clerk/nextjs @clerk/themes
```

## 🎨 Features Implemented

### ✅ Authentication Pages
- **Sign In**: `/auth/sign-in/[[...sign-in]]`
- **Sign Up**: `/auth/sign-up/[[...sign-up]]`
- Custom styling with your black/white/red theme

### ✅ Protected Routes
- **Account Dashboard**: `/account/*` (requires authentication)
- **Admin Panel**: `/admin/*` (requires admin role)
- **Partner Panel**: `/partner/*` (requires partner role)

### ✅ Role-Based Access Control
- **User Role**: Default for all users
- **Partner Role**: Access to partner dashboard
- **Admin Role**: Access to admin panel

### ✅ UI Components
- **Navbar**: Shows sign in/up buttons or user profile
- **UserButton**: Profile dropdown with sign out
- **Protected Pages**: Automatic redirects for unauthorized access

## 🔧 Role Management

### Setting User Roles
In your Clerk dashboard:

1. Go to **Users**
2. Select a user
3. Click **Metadata** tab
4. Add to **Public Metadata**:
```json
{
  "role": "admin"
}
```

### Available Roles
- `user` - Default role (access to account pages)
- `partner` - Partner role (access to partner dashboard)
- `admin` - Admin role (access to admin panel)

## 🎨 Custom Styling

The Clerk components are styled to match your black/white/red theme:

- **Dark theme** with red accents
- **Custom variables** for colors
- **Consistent styling** with your design system

## 🛡️ Security Features

### Middleware Protection
- Routes are protected automatically
- Public routes defined in `middleware.ts`
- Redirects unauthorized users to sign-in

### Route Protection
```typescript
// Public routes (no auth required)
publicRoutes: [
  "/",
  "/search",
  "/hotel/(.*)",
  "/partner/register",
  // ...
]

// Protected routes (auth required)
protectedRoutes: [
  "/account(.*)",
  "/partner(.*)",
  "/admin(.*)",
]
```

## 📱 User Experience

### Navigation
- **Signed Out**: Shows "Sign In" and "Sign Up" buttons
- **Signed In**: Shows user avatar and "My Bookings" link
- **Role-Based**: Admin/Partner links appear based on user role

### Profile Management
- Users can update their profile information
- Profile images are handled by Clerk
- Email verification is automatic

## 🚀 Next Steps

1. **Set up your Clerk account** and get API keys
2. **Add environment variables** to `.env.local`
3. **Test authentication** by signing up/in
4. **Assign roles** to test users in Clerk dashboard
5. **Customize further** if needed

## 🔗 Useful Links

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Integration](https://clerk.com/docs/nextjs/overview)
- [Customization Guide](https://clerk.com/docs/customization/overview)
- [Role-Based Access Control](https://clerk.com/docs/guides/basic-rbac)

## 🆘 Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Make sure `.env.local` is in project root
   - Restart your development server

2. **Styling issues**
   - Check if Clerk themes are imported correctly
   - Verify CSS variables in `globals.css`

3. **Role-based access not working**
   - Ensure roles are set in Clerk dashboard
   - Check `publicMetadata` structure

### Support
- Check Clerk documentation
- Join Clerk Discord community
- Contact Clerk support

---

Your Motel platform now has enterprise-grade authentication with Clerk! 🎉
