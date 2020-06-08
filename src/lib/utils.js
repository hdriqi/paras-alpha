import Compressor from 'compressorjs'

export function parseJSON(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

export const readFileAsUrl = (file) => {
  const temporaryFileReader = new FileReader()

  return new Promise((resolve, reject) => {
    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result)
    }
    temporaryFileReader.readAsDataURL(file)
  })
}

export const readFileAsBuffer = (file) => {
  const temporaryFileReader = new FileReader()

  return new Promise((resolve, reject) => {
    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result)
    }
    temporaryFileReader.readAsArrayBuffer(file)
  })
}

export const dataURItoBlob = (dataURI) => {
  var byteString = atob(dataURI.split(',')[1])
  var ab = new ArrayBuffer(byteString.length)
  var ia = new Uint8Array(ab)
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: 'image/png' })
}

export const svgToPng = (file) => {
  return new Promise(async (resolve) => {
    var image = new Image();
    image.src = await readFileAsUrl(file)
    let url = '';
    image.onload = function() {
      var canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      var context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      url = canvas.toDataURL('image/' + 'png');
      const blob = dataURItoBlob(url)
      resolve(blob)
    };
  })
}

export const compressImg = (file, quality) => {
  return new Promise(async (resolve, reject) => {
    let _file = file
    if(file.type === 'image/svg+xml') {
      const newFile = await svgToPng(file)
      _file = newFile
    }
    new Compressor(_file, {
      quality: quality || 0.6,
      maxWidth: 1920,
      maxHeight: 1920,
      convertSize: 1000000,
      success: resolve,
      error: reject,
    })
  })
}

export const mergeDeep = (...objects) => {
  const isObject = obj => obj && typeof obj === 'object';
  
  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];
      
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      }
      else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      }
      else {
        prev[key] = oVal;
      }
    });
    
    return prev;
  }, {});
}