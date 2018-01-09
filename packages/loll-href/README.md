# @lol/href
Tiny click handler for single page apps.

## Install
```bash
npm i @loll/href --save
```

## Usage
The callback will not fire if the link:
- has an invalid `href`
- points to an external resource
- is a `download` link
- is `target="_blank"`
- is a `mailto:` or `tel:`
```javascript
import href from '@loll/href'

href(anchor => console.log(anchor.href))
```

MIT
