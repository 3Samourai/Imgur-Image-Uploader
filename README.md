# Imgur Image Uploader

A simple, privacy-friendly web app to upload images (and videos) to Imgur and instantly get a shareable link.

## Features

- **Drag & Drop** or **Click to Upload**: Effortlessly add your image or video.
- **Instant Preview**: See your image before uploading.
- **Clipboard Support**: Paste images directly from your clipboard.
- **Shareable Links**: Get a direct Imgur link after upload.
- **Copy Buttons**: Quickly copy the link (and, for videos, MP4/GIFV links).
- **No Data Collection**: This app does not store or track your uploads.

## How to Use

1. **Open `index.html`** in your browser.
2. **Upload your file**:
   - Drag and drop an image or video onto the upload area, **or**
   - Click "Upload a file" and select an image/video, **or**
   - Paste an image from your clipboard.
3. **Preview** your file.
4. Click **Upload**.
5. After upload, copy the Imgur link (and MP4/GIFV links for videos) to share.

## Supported Formats

- Images: PNG, JPG, GIF
- Videos: Most common formats supported by Imgur
- **Max file size:** 10MB

## Privacy & Disclaimer

- **No personal data is collected or stored** by this app.
- **Uploads go directly to Imgur**. Imgur may collect data as per their [Privacy Policy](https://imgur.com/privacy).
- **Disclaimer:** The author is not responsible for misuse. Please use responsibly.

## Requirements

- Modern web browser (Chrome, Firefox, Edge, Safari, etc.)
- Internet connection (uploads go to Imgur)

## Customization

- To use your own Imgur API credentials, edit the `postImage` function in `index.html` and replace the `Client-ID` values.

## Credit
Made by [Samourai](https://github.com/3Samourai)
Inspired by [Tools](https://github.com/vincentdoerig/tools) from Vincent Dörig

## License
MIT License

Copyright (c) 2025 Samourai

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
