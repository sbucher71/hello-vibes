# Microsoft OAuth Setup Instructions

## Step 1: Register App in Azure AD

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**

## Step 2: Configure App Registration

### Basic Information
- **Name**: Hello Vibes
- **Supported account types**: Choose one:
  - **Accounts in any organizational directory and personal Microsoft accounts** (for widest access)
  - Or select based on your needs

### Redirect URI
Add a **Public client/native (mobile & desktop)** redirect URI:
```
hellovibes://auth
```

## Step 3: Get Your Client ID and Tenant ID

1. After registration, you'll see the **Overview** page
2. Copy the **Application (client) ID** (looks like: `12345678-1234-1234-1234-123456789abc`)
3. Copy the **Directory (tenant) ID** (also on the Overview page, looks like: `87654321-4321-4321-4321-cba987654321`)
4. Open `App.tsx` and replace both values:
   ```typescript
   const MICROSOFT_CONFIG = {
     clientId: '12345678-1234-1234-1234-123456789abc', // Your Application (client) ID
     tenantId: '87654321-4321-4321-4321-cba987654321', // Your Directory (tenant) ID
     scopes: ['openid', 'profile', 'email', 'User.Read'],
   };
   ```

### Understanding Tenant Configuration

Since you want **only users in your organization** to sign in:
- ✅ **Use your specific tenant ID** (the GUID from Azure AD Overview)
- ❌ **Don't use** `'common'` (allows any Microsoft account)
- ❌ **Don't use** `'organizations'` (allows any work/school account)
- ❌ **Don't use** `'consumers'` (allows personal Microsoft accounts)

**Your specific tenant ID ensures only users in your Azure AD tenant can authenticate.**

## Step 4: Configure API Permissions

1. Go to **API permissions** in your app registration
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Choose **Delegated permissions**
5. Add these permissions:
   - `openid`
   - `profile`
   - `email`
   - `User.Read`
6. Click **Add permissions**
7. (Optional) Click **Grant admin consent** if you have admin rights

## Step 5: Configure Authentication Settings

1. Go to **Authentication** in your app registration
2. Under **Advanced settings**:
   - **Allow public client flows**: Set to **Yes**
3. Click **Save**

## Step 6: Update Your App

Your redirect URI in the app is:
```
hellovibes://auth
```

### Detailed Configuration Steps:

1. **In Azure Portal**, go back to your App registration
2. Click **Authentication** in the left menu
3. Under **Platform configurations**, you should see **Mobile and desktop applications**
4. Click **Add a platform** if you haven't added it yet, or click **Configure** to edit
5. In the **Custom redirect URIs** section, add:
   ```
   hellovibes://auth
   ```
6. **Important**: Make sure this redirect URI is added under the **Mobile and desktop applications** platform, NOT under Web
7. Click **Save**

### Verify Your Configuration:

Go back to **Authentication** and confirm:
- ✅ Platform: **Mobile and desktop applications** exists
- ✅ Redirect URI: `hellovibes://auth` is listed
- ✅ **Allow public client flows**: Toggle is set to **Yes** (scroll down to Advanced settings)

### Understanding the Redirect URI:

The redirect URI format is: `[scheme]://[path]`
- **Scheme**: `hellovibes` (defined in your app.json)
- **Path**: `auth` (defined in the makeRedirectUri call)

When the OAuth flow completes, Microsoft will redirect to this URI, which will open your app and pass the authorization code.

### Common Mistakes to Avoid:

❌ **Don't** add it as a Web redirect URI  
✅ **Do** add it as a Mobile and desktop applications redirect URI

❌ **Don't** use `http://` or `https://` for mobile apps  
✅ **Do** use your custom scheme: `hellovibes://`

❌ **Don't** forget the path: `hellovibes://` alone won't work  
✅ **Do** include the full path: `hellovibes://auth`

### For Different Environments:

If you're testing in development vs production, you might need multiple redirect URIs:

**Development (Expo Go)**:
```
exp://192.168.1.xxx:8081/--/auth
```
(IP will vary based on your network)

**Production (Standalone app)**:
```
hellovibes://auth
```

You can add both in Azure AD - it will accept whichever one matches your current environment.

## Step 7: Test the Integration

1. Build and run your app
2. Tap the "Sign in with Microsoft" button
3. You'll be redirected to Microsoft login
4. Sign in with your Microsoft account
5. Grant permissions
6. You'll be redirected back to the app with your profile info

## Tenant Configuration (Already Configured for Your Organization)

Your app is now configured to use your specific tenant ID, which means:
- ✅ Only users in **your organization** can sign in
- ✅ Personal Microsoft accounts are blocked
- ✅ Other organizations' accounts are blocked

If you want to change this later:
- `'your-tenant-id'` - Only your specific Azure AD tenant (current configuration)
- `'organizations'` - Any work/school account from any organization
- `'consumers'` - Only personal Microsoft accounts
- `'common'` - All Microsoft accounts (requires multi-tenant app configuration)

## Troubleshooting

### "Invalid redirect URI" error
- Ensure redirect URI in Azure matches exactly: `hellovibes://auth`
- Check that it's configured as a **Public client/native** platform

### "AADSTS50011" error
- The redirect URI doesn't match what's registered
- Rebuild the app after making changes to app.json

### "Consent required" error
- Make sure API permissions are added in Azure AD
- Try granting admin consent

### App doesn't redirect back
- Verify the scheme in app.json: `"scheme": "hellovibes"`
- Rebuild the app with EAS build after any config changes

## Security Notes

- Never commit your Client ID to public repositories if it's a confidential client
- For public/native apps (like this mobile app), the Client ID can be in the code
- Don't use Client Secrets in mobile apps - use PKCE instead (already configured)
- Consider implementing token refresh for better UX
- Store tokens securely using expo-secure-store for production apps

## Additional Resources

- [Microsoft Identity Platform Docs](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [Expo Auth Session Docs](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/overview)
