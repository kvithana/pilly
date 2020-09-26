// eslint-disable-next-line @typescript-eslint/no-var-requires
const workboxBuild = require('workbox-build')
// NOTE: This should be run *AFTER* all your assets are built
const buildSW = () => {
  // This will return a Promise
  workboxBuild
    .injectManifest({
      swSrc: 'src/sw-template.js', // this is your sw template file
      swDest: 'build/service-worker.js', // this will be created in the build step
      maximumFileSizeToCacheInBytes: 5000000,
      globDirectory: 'build',
      globPatterns: ['**/*.{html,js,css,ico,eot,ttf,woff,svg,png}'], // precaching jpg files
    })
    .then(({ count, size, warnings }) => {
      // Optionally, log any warnings and details.
      warnings.forEach(console.warn)
      console.log(`${count} files will be precached, totaling ${Math.round(size / 10e3)} kb.`)
    })
    .catch(console.error)
}
buildSW()
