# SharePoint Profiles

The SharePoint Profile service automatically syncs predefined properties from Active Directory. You can access this information with SPScript

## Current User

### Get Profile

```javascript
let ctx = SPScript.createContext();
```

### Update Property

```javascript
let ctx = SPScript.createContext();
await ctx.profiles.setProperty("AboutMe", "I was updated by SPScript");
```

## Get Profile by Email
