# EXIFChart.com 

EXIFChart is a client-side website where you can analyze your shooting styles via images' EXIF data.
No data is sent over to a server. As such, this website is available offline and as a PWA (Progressive Web App).

## Hosting your own website

Ensure you have Node, NPM and the Git CLI installed.
```
git clone git@github.com:HollaG/exifchart.git
npm install
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Building the website

Run `npm run build`.
Upload the `build` folder to a hosting service of your choice.

## Libaries used
React
- [react-router-dom]
- [react-select]
- [react-table]
- [react-checkbox-tree]
- [react-device-detect]
- [react-redux]

Parsing EXIF
- [exifr]

Chart
- [react-chartjs-2]
- [chartjs-plugin-zoom]

Others
- [idb-keyval]
- [file-saver]
- [fortawesome]

## Contributing
Pull requests are welcome!
