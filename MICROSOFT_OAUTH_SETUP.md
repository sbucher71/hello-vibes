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

## Step 3: Get Your Client ID

1. After registration, you'll see the **Overview** page
2. Copy the **Application (client) ID** (looks like: `12345678-1234-1234-1234-123456789abc`)
3. Open `App.tsx` and replace:
   ```typescript
   clientId: 'YOUR_AZURE_AD_CLIENT_ID',
   ```
   with:
   ```typescript
   clientId: '12345678-1234-1234-1234-123456789abc',
   ```

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

Make sure this matches exactly in Azure AD under **Authentication** > **Platform configurations** > **Mobile and desktop applications**

## Step 7: Test the Integration

1. Build and run your app
2. Tap the "Sign in with Microsoft" button
3. You'll be redirected to Microsoft login
4. Sign in with your Microsoft account
5. Grant permissions
6. You'll be redirected back to the app with your profile info

## Tenant Configuration

The default configuration uses `common` tenant:
```typescript
tenantId: 'common', // Supports all Microsoft accounts
```

You can change this to:
- `'organizations'` - Only work/school accounts
- `'consumers'` - Only personal Microsoft accounts  
- `'your-tenant-id'` - Specific Azure AD tenant only

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
