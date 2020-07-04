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

export const prettyBalance = (balance, decimals = 18, len = 8) => {
  const diff = balance.toString().length - (10 ** decimals).toString().length
  const fixedPoint = Math.max(1, Math.min(len, len - diff))
  const finalBalance = (balance / (10 ** decimals)).toFixed(fixedPoint).toLocaleString()
  const [head, tail] = finalBalance.split('.')
  const formattedHead = head.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return `${formattedHead}.${tail}`
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

export const compressImg = (file) => {
  return new Promise(async (resolve, reject) => {
    let _file = file
    if(file.type === 'image/svg+xml') {
      const newFile = await svgToPng(file)
      _file = newFile
    }
    const threshold = Math.min(Math.floor(file.size / 1000000) / 10, 0.4)
    const quality = 0.8 - threshold
    new Compressor(_file, {
      quality: quality,
      maxWidth: 1920,
      maxHeight: 1920,
      convertSize: Infinity,
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