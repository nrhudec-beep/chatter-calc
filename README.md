# Stickout Chatter Calculator: offline Android app

These files make the calculator an installable app that works with no signal.

## One-time setup (about 10 minutes, easiest on a computer)

1. **Unzip** this package. Inside you'll see `index.html`, `sw.js`, `manifest.webmanifest`, `README.md` and an `icons` folder.
2. **Create a free GitHub account** at github.com if you don't have one.
3. **Make a repository.** Click **+ → New repository**. Name it `chatter-calc`, set it to **Public**, and click **Create repository**.
   (Free hosting needs a public repository. Only someone who knows or finds the address would see it, and there's no personal data in it.)
4. **Upload the files.** On the new repository page, click **uploading an existing file**. Drag in everything from the unzipped folder, including the `icons` folder itself, then click **Commit changes**.
5. **Turn on hosting.** Go to **Settings → Pages**. Under "Build and deployment", set Source to **Deploy from a branch**, Branch to **main** and folder to **/ (root)**, then **Save**.
6. **Wait a minute or two.** Refresh the Pages screen until it shows your address, which looks like
   `https://YOUR-USERNAME.github.io/chatter-calc/`

## Install it on your Android phone

1. Open that address in **Chrome** on the phone while you have a connection.
2. Let the page load fully and scroll down to the 3D stability map once, so the plot library is saved.
3. Tap **⋮ → Add to home screen → Install** (some phones say **Install app**).
4. To test it, turn on airplane mode and open **Chatter Calc** from the home screen.

Your inputs, theme and collapsed sections are saved on the phone between uses.

## Updating it later

If the calculator is changed, replace `index.html` in the repository. Then open `sw.js` and change `chatter-v1` to `chatter-v2` (v3 and so on next time). The phone picks up the new version the next time you open the app with a connection.
