# Island Lingua Lite

A small personal English shadowing demo.

## Run on Mac

```bash
npm install
npm run dev
```

Open the local address shown in Terminal.

## Preview on Phone

Make sure the Mac and phone are on the same Wi-Fi.

```bash
ipconfig getifaddr en0
```

Use the IP shown by that command:

```bash
npm run dev -- --host YOUR_IP
```

Then open this on the phone:

```text
http://YOUR_IP:5173/
```

## Build

```bash
npm run build
```
