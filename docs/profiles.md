# SharePoint Profiles

The SharePoint Profile service automatically syncs predefined properties from Active Directory. You can access this information with SPScript

- `ctx.profiles.get(email?:string)` - Get a profile by email, or the current user if no email given.
- `ctx.profiles.setProperty(key, value)` - Update the current user's profile

## Get Profile

### Current User

If you don't have anything to `profiles.get()` then it will use the current user.

```javascript
let ctx = SPScript.createContext();
let profile = await ctx.profiles.get();
```

### By Email

You can passing an email address to `profiles.get(email)` to retrieve a specific user's profile.

```javascript
let ctx = SPScript.createContext();
let profile = await ctx.profiles.get("andrew@droopy.onmicrosoft.com);
```

## Update Property

```javascript
let ctx = SPScript.createContext();
await ctx.profiles.setProperty("AboutMe", "I was updated by SPScript");
```
