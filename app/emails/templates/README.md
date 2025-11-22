# Dracarys Email Templates

Professional HTML email templates designed for the Dracarys trading psychology platform. These templates align with the app's branding and focus on psychology-driven trading development.

## 📧 Available Templates

| Template | File | Use Case | Variables Used |
|----------|------|----------|----------------|
| **Signup Confirmation** | `confirm_signup.html` | Welcome new users | `{{ .ConfirmationURL }}` |
| **User Invitation** | `invite_user.html` | Invite new team members | `{{ .ConfirmationURL }}`, `{{ .SiteURL }}` |
| **Magic Link Login** | `magic_link.html` | Passwordless login | `{{ .ConfirmationURL }}` |
| **Email Change Confirmation** | `confirm_email_change.html` | Verify email updates | `{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .NewEmail }}` |
| **Password Reset** | `reset_password.html` | Secure password reset | `{{ .ConfirmationURL }}` |
| **Reauthentication** | `confirm_reauthentication.html` | 2FA/security verification | `{{ .Token }}` |

## 🚀 How to Use

1. **Copy the template content** from the HTML files above
2. **Go to Supabase Dashboard** → Authentication → Email Templates
3. **Paste into the appropriate template editor** for each email type
4. **Templates will automatically use the correct variables**

## 🎨 Design Features

### Branding & Styling
- **Dracarys orange/red gradients** for buttons and accents
- **Professional typography** with system fonts
- **Psychology-focused messaging** that emphasizes mental game development
- **Mobile-responsive design** that works on all devices

### Security & UX
- **Clear call-to-actions** with prominent buttons
- **Security notices** and expiration warnings where relevant
- **Helpful instructions** for users to complete actions
- **Trading psychology context** in messaging and copy

## 📝 Template Variables

### Common Variables:
- `{{ .ConfirmationURL }}` - The action link (confirmation, reset, magic link, etc.)
- `{{ .SiteURL }}` - Your app's base URL

### Email Change Variables:
- `{{ .Email }}` - Current email address
- `{{ .NewEmail }}` - New email address

### Reauthentication Variable:
- `{{ .Token }}` - Numeric code for 2FA/verification

## 🔧 Customization

### Colors
- **Primary**: Orange gradients (#f97316, #ea580c, etc.)
- **Secondary**: Gray tones for text (#6b7280, #374151)
- **Accent**: Based on email type (green for invites, red for security, etc.)

### Content
- **Trading psychology focus** - All copy emphasizes mental game development
- **Motivational tone** - Encourages discipline and growth mindset
- **Security-conscious** - Clear warnings and verification steps

## 📱 Email Client Compatibility

- ✅ **Gmail** (Android & Web)
- ✅ **Apple Mail** (iOS & macOS)
- ✅ **Outlook** (Web & Desktop)
- ✅ **Yahoo Mail**
- ✅ **Responsive design** for mobile devices

## 🛡️ Security Features

- **Link expiration warnings** (1 hour for magic links, 10 minutes for codes)
- **Security notices** for sensitive actions
- **Clear instructions** for verification steps
- **Psychology tie-ins** for security importance

## 💡 Usage Tips

1. **Test on multiple email clients** before production use
2. **Customize sender name** to "Dracarys Team" or "Dracarys Support"
3. **Update taglines** to match your current messaging
4. **Consider A/B testing** different subject lines for higher open rates
5. **Monitor deliverability** and adjust spam scores as needed

## 🔗 Integration

Templates work seamlessly with:
- **Supabase Auth** email system
- **Custom SMTP providers** (Gmail, SendGrid, Resend, etc.)
- **Email testing tools** (MailHog, Ethereal, etc.)

---

*Built for traders who want to master their psychology and achieve consistent results.* 🚀📈
