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
- [react-router-dom](https://github.com/remix-run/react-router)
- [react-select](https://github.com/JedWatson/react-select/tree/master/packages/react-select)
- [react-table](https://github.com/tannerlinsley/react-table)
- [react-checkbox-tree](https://github.com/jakezatecky/react-checkbox-tree)
- [react-device-detect](https://github.com/duskload/react-device-detect)
- [react-redux](https://github.com/reduxjs/react-redux)

Parsing EXIF
- [exifr](https://github.com/MikeKovarik/exifr)

Chart
- [react-chartjs-2](https://github.com/reactchartjs/react-chartjs-2)
- [chartjs-plugin-zoom](https://github.com/chartjs/chartjs-plugin-zoom)

Others
- [idb-keyval](https://github.com/jakearchibald/idb-keyval)
- [file-saver](https://github.com/eligrey/FileSaver.js)
- [react-fontawesome](https://github.com/FortAwesome/react-fontawesome)

## Contributing
Pull requests are welcome!

## Author's note
I developed this as a way to get my feet wet in React. I know there is a lot of optimization to be done, but I had fun building this! Hope it at least helps some people out!

