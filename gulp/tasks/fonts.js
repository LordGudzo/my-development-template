import fs from 'fs';
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';

export const otfToTtf = () =>
// Looking for font files .otf
	 app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`, {})
    .pipe(app.plugins.plumber(
      app.plugins.notify.onError({
        title: 'FONTS',
        message: 'Error: <%= error.message %>',
      }),
    ))
  // Converting to .ttf
    .pipe(fonter({
      formats: ['ttf'],
    }))
  // Upload to the src folder
    .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`));

export const ttfToWoff = () =>
// Looking for font files .ttf
	 app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {})
    .pipe(app.plugins.plumber(
      app.plugins.notify.onError({
        title: 'FONTS',
        message: 'Error: <%= error.message %>',
      }),
    ))
  // Converting to .woff
    .pipe(fonter({
      formats: ['woff'],
    }))
  // Upload to the dest folder
    .pipe(app.gulp.dest(`${app.path.build.fonts}`))
  // Looking for font files .ttf
    .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
  // Converting to .woff2
    .pipe(ttf2woff2())
  // Upload to the dest folder
    .pipe(app.gulp.dest(`${app.path.build.fonts}`));

export const fontsStyle = () => {
  // Font Connection Styles File
  const fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;
  // Проверяем существуют ли файлы шрифтов
  fs.readdir(app.path.build.fonts, (err, fontsFiles) => {
    if (fontsFiles) {
      //Checking if font files exist
      if (!fs.existsSync(fontsFile)) {
        // If the file does not exist, create it
        fs.writeFile(fontsFile, '', cb);
        let newFileOnly;
        for (let i = 0; i < fontsFiles.length; i++) {
          // Writing font connections to a stylesheet
          const fontFileName = fontsFiles[i].split('.')[0];
          if (newFileOnly !== fontFileName) {
            const fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
            let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
            if (fontWeight.toLowerCase() === 'thin') {
              fontWeight = 100;
            } else if (fontWeight.toLowerCase() === 'extralight') {
              fontWeight = 200;
            } else if (fontWeight.toLowerCase() === 'light') {
              fontWeight = 300;
            } else if (fontWeight.toLowerCase() === 'medium') {
              fontWeight = 500;
            } else if (fontWeight.toLowerCase() === 'semibold') {
              fontWeight = 600;
            } else if (fontWeight.toLowerCase() === 'bold') {
              fontWeight = 700;
            } else if (fontWeight.toLowerCase() === 'extrabold' || fontWeight.toLowerCase() === 'heavy') {
              fontWeight = 800;
            } else if (fontWeight.toLowerCase() === 'black') {
              fontWeight = 900;
            } else {
              fontWeight = 400;
            }
            fs.appendFile(fontsFile, `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`, cb);
            newFileOnly = fontFileName;
          }
        }
      } else {
        // If the file exists, display the message
        console.log('Файл scss/fonts.scss already exists. To update the file, you need to delete it!');
      }
    }
  });

  return app.gulp.src(`${app.path.srcFolder}`);
  function cb() { }
};
